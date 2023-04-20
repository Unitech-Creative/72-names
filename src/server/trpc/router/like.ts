import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { LikedLesson } from "@prisma/client";

export const likeRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session } = ctx;
      const { lessonId } = input;
      const userLike = await getUserLike(session.user.id, lessonId);
      return userLike ? true : false;
    }),

  toggle: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx;
      const { lessonId } = input;
      const userId = session.user.id;

      const userLike = await getUserLike(userId, lessonId);

      if (userLike) {
        await prisma.likedLesson.delete({
          where: {
            userId_lessonId: {
              userId: userId,
              lessonId: lessonId,
            },
          },
        });
        return false; // Unliked
      }

      await prisma.likedLesson.create({
        data: {
          lessonId: lessonId,
          userId: userId,
        },
      });

      return true; // Liked
    }),

  all: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const userId = session.user.id;
    return await getUserLikedLessons(userId);
  }),
});

async function getUserLike(userId: string, lessonId: string) {
  const like = await prisma.likedLesson.findUnique({
    where: {
      userId_lessonId: {
        userId: userId,
        lessonId: lessonId,
      },
    },
  });

  return like;
}

async function getUserLikedLessons(userId: string): Promise<LikedLesson[]> {
  const likedLessons = await prisma.likedLesson.findMany({
    where: { userId: userId },
  });

  return likedLessons;
}
