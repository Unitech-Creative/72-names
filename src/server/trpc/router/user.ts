import { router, protectedProcedure, publicProcedure } from "../trpc";
import { activeSubscriptions, subscriptionStatus } from "@/server/db/queries";
import { z } from "zod";

export const userRouter = router({
  activeSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session?.user?.id) {
      return [];
    }

    return await activeSubscriptions(session.user?.id);
  }),

  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user?.id) {
      throw new Error("Not authenticated");
    }

    return await subscriptionStatus(session.user?.id);
  }),

  hasCourseAccess: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const { courseId } = input;
      return await getHasCourseAccess(session.user?.id, courseId);
    }),
});

// this is a temporary workaround. This mapping should be connected to the DB.
async function getHasCourseAccess(
  userId: string,
  courseId: string
): Promise<boolean> {
  const subscriptions = await activeSubscriptions(userId);

  const courseSubscriptionsMap = [
    {
      courseId: "5803ebf5-9204-4b9b-97a3-c0f5717a4da0",
      subscriptionName: "Self Intimacy",
    },
  ];

  // Check if there is any subscription with a matching name in the courseSubscriptionsMap
  return subscriptions.some((subscription) => {
    return courseSubscriptionsMap.some(
      (courseSubscription) =>
        courseSubscription.subscriptionName === subscription.product.name
    );
  });
}
