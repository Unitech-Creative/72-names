import { prisma } from "@/server/db/client";

type StripeSubscriptionStatus = "active" | "trialing" | "past_due" | "unpaid";
export const activeStripeSubscribtionStatuses: StripeSubscriptionStatus[] = [
  "active",
  "trialing",
  "past_due",
  "unpaid",
];

export async function activeSubscriptions(userId: string) {
  if (!!userId === false) return [];

  return await prisma.subscription.findMany({
    where: {
      userId: userId,
      status: {
        in: activeStripeSubscribtionStatuses,
      },
    },
    include: {
      product: true,
    },
  });
}

export async function subscriptionStatus(userId: string) {
  if (!!userId === false) return {};

  const data = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: {
        in: activeStripeSubscribtionStatuses,
      },
    },
  });

  if (!data || !data.status) return {};

  return {
    active: data.status === "active",
    status: data.status,
  };
}
