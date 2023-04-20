import { env } from "../../../env/server.mjs";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { string, z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/server/db/client";
import { Novu } from "@novu/node";
import { User, Comment } from "@prisma/client";
import inngest from "@/lib/inngest";
import * as Sentry from "@sentry/nextjs";

export const commentsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        lessonTitle: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, req, res } = ctx;
      const { lessonId, lessonTitle, comment } = input;
      const { name, image: imageUrl, id: userId } = session.user;

      try {
        // If it's not a reply, create a new top-level comment
        const newComment = await prisma.comment.create({
          data: {
            userId: userId,
            commentText: comment,
            commentableId: lessonId,
            commentableType: "Lesson",
            // user: { connect: { id: userId } },
          },
        });

        try {
          await inngest.send({
            name: "jobs/comments/rootComment.notification",
            data: {
              lessonId: lessonId,
              lessonTitle: lessonTitle,
              userId: session.user.id,
              commentId: newComment.id,
            },
          });
        } catch (error) {
          // Capture error with Sentry
          Sentry.captureException(error);
        }

        return {};
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: `Couldn't submit comment`, err });
      }
    }),
  createReply: protectedProcedure
    .input(
      z.object({
        parentCommentId: z.number(),
        lessonTitle: z.string(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, req, res } = ctx;
      const { parentCommentId, lessonTitle, comment } = input;
      const { name, image: imageUrl, id: userId } = session.user;

      try {
        // If it's a reply, create a new child comment
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentCommentId },
          include: { childComments: true },
        });
        if (!parentComment) {
          return res.status(404).json({ message: "Parent comment not found" });
        }

        const childComment = await prisma.comment.create({
          data: {
            userId: userId,
            commentText: comment,
            parentCommentId: parentCommentId,
          },
        });

        const _comments = await comments(String(parentComment.commentableId));

        notifyThread(
          parentComment.commentableId, // lessonId
          lessonTitle,
          session.user,
          _comments,
          parentComment,
          childComment
        );

        return {};
      } catch (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: `Couldn't submit comment`, err });
      }
    }),
  all: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session, req, res } = ctx;
      const { lessonId } = input;
      return await comments(lessonId);
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, req, res } = ctx;
      const { id } = input;

      if (!session.user.isAdmin) {
        throw new Error("Not authorized");
      }

      try {
        const comment = await prisma.comment.findUnique({
          where: { id: id },
        });

        if (!comment) {
          return res.status(404).json({ message: "Comment not found" });
        }

        await prisma.comment.delete({
          where: { id: id },
        });

        return { message: "Comment successfully deleted" };
      } catch (err) {
        return res
          .status(500)
          .json({ error: `Couldn't delete the comment xxx`, err });
      }
    }),
});

const comments = async function (lessonId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { commentableId: lessonId, commentableType: "Lesson" },
      include: {
        user: { select: { id: true, name: true, image: true } },
        childComments: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    return comments;
  } catch (error) {
    // Capture error with Sentry
    Sentry.captureException(error);
    return [];
  }
};

const notifyThread = async (
  lessonId: string,
  lessonTitle: string,
  user: { id: string } & {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  },
  comments: Comment[],
  parentComment: Comment,
  comment: Comment
) => {
  // collect the users in the thread
  const userIds: String[] = [];
  const recipientIds: String[] = [];

  comments.forEach((comment) => {
    if (comment.childComments.length > 0) {
      comment.childComments.forEach((c: Comment) => userIds.push(c.userId));
    }
    userIds.push(comment.userId);
  });

  userIds.forEach((userId) => {
    if (!recipientIds.find((uniqueUser) => uniqueUser === userId)) {
      recipientIds.push(userId);
    }
  });

  try {
    await inngest.send({
      name: "jobs/comments/threadComment.notification",
      data: {
        lessonId: lessonId,
        lessonTitle: lessonTitle,
        userId: user.id,
        parentCommentId: parentComment.id,
        commentId: comment.id,
        recipientIds,
      },
    });
  } catch (error) {
    // Capture error with Sentry
    Sentry.captureException(error);
  }
};
