import inngest from "@/lib/inngest";
import { prisma } from "@/server/db/client";
import { Novu } from "@novu/node";

const notificationRootComment = inngest.createFunction(
  { name: "Notification for a Root Comment" },
  { event: "jobs/comments/rootComment.notification" },
  async ({ event, step }) => {
    const novu = new Novu(process.env.NOVU_API_KEY || "");
    const { lessonId, lessonTitle, userId, commentId } = event.data;
    const teacher = await prisma.user.findUnique({
      where: { email: process.env.TEACHER_EMAIL },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    const result = novu.trigger("new-comment-on-your-lesson", {
      to: {
        subscriberId: teacher.id,
      },
      actor: {
        subscriberId: user.id,
      },
      payload: {
        actor: {
          name: user.name,
        },
        lesson: {
          id: lessonId,
          title: lessonTitle,
        },
        url: `${process.env.NEXT_PUBLIC_DOMAIN}/lesson/${lessonId}#comment-${comment.id}`,
        message: comment.commentText,
      },
    });

    return { event, body: result };
  }
);

const notificationThreadComment = inngest.createFunction(
  { name: "Notification for a Thread Comment" },
  { event: "jobs/comments/threadComment.notification" },
  async ({ event, step }) => {
    const novu = new Novu(process.env.NOVU_API_KEY || "");
    const {
      lessonId,
      lessonTitle,
      userId, //the user who made the comment
      commentId,
      parentCommentId,
      recipientIds,
    } = event.data;

    const teacher = await prisma.user.findUnique({
      where: { email: process.env.TEACHER_EMAIL },
    });
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    // const parentComment = await prisma.comment.findUnique({
    //   where: { id: parentCommentId },
    // });
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    //if the userId is in the recipientIds, remove it from the array
    const index = recipientIds.indexOf(userId);
    if (index > -1) {
      recipientIds.splice(index, 1);
    }

    const recipients = await prisma.user.findMany({
      where: {
        id: {
          in: recipientIds,
        },
      },
    });

    if (!recipientIds.includes(teacher.id) && teacher.id !== userId) {
      recipients.push(teacher);
    }

    const results = await Promise.all(
      recipients.map(async (recipient) => {
        const res = await novu.trigger(
          "new-reply-in-a-conversation-you-part-of",
          {
            to: {
              subscriberId: recipient.id,
            },
            actor: {
              subscriberId: user.id,
            },
            payload: {
              actor: {
                name: user.name,
              },
              lesson: {
                id: lessonId,
                title: lessonTitle,
              },
              url: `${process.env.NEXT_PUBLIC_DOMAIN}/lesson/${lessonId}#comment-${comment.id}`,
              message: comment.commentText,
            },
          }
        );

        return {
          recipientId: recipient.id,
          status: res.status,
          statusText: res.statusText,
        };
      })
    );

    return { event, body: results };
  }
);

const fns = [notificationRootComment, notificationThreadComment];
export default fns;
