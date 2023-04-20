import { router, protectedProcedure } from "../trpc";
import { prisma } from "@/server/db/client";
import { formatPrice, nFormatter } from "@/lib/utils";
import { adminEmails } from "@/lib/security";

export const adminRouter = router({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user.isAdmin) {
      throw new Error("Not authorized");
    }

    const users = await prisma.user.count();
    const customers = await prisma.user.count({
      where: {
        subscriptions: {
          some: {},
        },
      },
    });

    const totalSales = await getTotalSales();

    const customersTarget = 200_000;
    const salesTarget = 2_000_000;
    const categories = [
      {
        title: "Users",
        metric: users,
        percentageValue: (users / customersTarget) * 100,
        target: nFormatter(customersTarget),
      },
      {
        title: "Customers",
        metric: customers,
        percentageValue: (customers / users) * 100,
        target: "100%",
      },
      {
        title: "Sales",
        metric: `$ ${totalSales}`,
        percentageValue: (totalSales / 2_000_000) * 100,
        target: formatPrice(salesTarget, 0),
      },
    ];
    return categories;
  }),

  users: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user.isAdmin) {
      throw new Error("Not authorized");
    }

    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          include: {
            product: true,
          },
        },
      },
    });
    const updatedUsers = users.map((user) => ({
      ...user,
      isAdmin: adminEmails.includes(user.email),
    }));
    return updatedUsers;
  }),

  products: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const products = await prisma.product.findMany({
      include: {
        prices: true,
      },
    });

    return products;
  }),
});

async function getTotalSales() {
  let totalSales = 0.0;

  const subscriptions = await prisma.subscription.findMany({
    include: {
      price: {
        select: { unitAmount: true },
      },
    },
    distinct: ["priceId"],
  });

  for (const row of subscriptions) {
    const numberOfSubscriptions = await prisma.subscription.count({
      where: {
        priceId: row.priceId,
      },
    });
    totalSales += (Number(row.price.unitAmount) / 100) * numberOfSubscriptions;
  }

  return totalSales;
}

