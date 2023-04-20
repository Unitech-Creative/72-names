import { env } from "../../../env/server.mjs";
import { getOrCreateStripeCustomerIdForUser } from "../../stripe/stripe-webhook-handlers";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SK, {});
import { prisma } from "@/server/db/client";
import { v4 as uuidv4 } from "uuid";

export const stripeRouter = router({
  products: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const data = await prisma.product.findMany({
      where: {
        active: true,
        prices: { some: {} },
      },
      include: {
        prices: {
          where: {
            active: true,
          },
        },
      },
    });

    if (!data) {
      throw new Error("Could not find products");
    }

    return data;
  }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { stripe, session, prisma, req } = ctx;

      const customerId = await getOrCreateStripeCustomerIdForUser({
        prisma,
        stripe,
        userId: session.user?.id,
      });

      if (!customerId) {
        throw new Error("Could not create customer");
      }

      const price = await prisma.price.findUnique({
        where: { id: input?.priceId },
      });

      if (!price) {
        throw new Error("Could not find price");
      }

      const baseUrl =
        env.NODE_ENV === "development"
          ? `http://${req.headers.host}`
          : `https://${req.headers.host}`;

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: session.user?.id,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/library?checkoutSuccess=true`,
        cancel_url: `${baseUrl}/library?checkoutCanceled=true`,
        subscription_data: {
          metadata: {
            userId: session.user?.id,
          },
        },
      });

      if (!checkoutSession) {
        throw new Error("Could not create checkout session");
      }

      return { checkoutUrl: checkoutSession.url };
    }),
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const { stripe, session, prisma, req } = ctx;

    const customerId = await getOrCreateStripeCustomerIdForUser({
      prisma,
      stripe,
      userId: session.user?.id,
    });

    if (!customerId) {
      throw new Error("Could not create customer");
    }

    const baseUrl =
      env.NODE_ENV === "development"
        ? `http://${req.headers.host}`
        : `https://${req.headers.host}`;

    const stripeBillingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/dashboard`,
      });

    if (!stripeBillingPortalSession) {
      throw new Error("Could not create billing portal session");
    }

    return { billingPortalUrl: stripeBillingPortalSession.url };
  }),

  syncProducts: protectedProcedure.mutation(async () => {
    // Retrieve the products and prices from Stripe
    const products = await stripe.products.list({ active: true });

    // Loop through each product and update the corresponding records in the database
    for (const product of products.data) {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
      });

      console.log("====================================");
      // console.log("product", product);
      // console.log("====================================");

      // Update or insert the product and its prices
      const result = await prisma.product.upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          description: product.description,
          active: product.active,
          image: product.images?.[0] || "",
          prices: {
            upsert: prices.data.map((price) => ({
              where: { id: price.id },
              update: {
                unitAmount: price.unit_amount,
                currency: price.currency,
                interval: price.recurring?.interval || undefined,
                intervalCount: price.recurring?.interval_count || undefined,
                trialPeriodDays: price.trial_period_days || undefined,
                active: price.active,
                metadata: price.metadata || {},
                type: price.type,
              },
              create: {
                id: price.id,
                unitAmount: price.unit_amount,
                currency: price.currency,
                interval: price.recurring?.interval || "",
                intervalCount: price.recurring?.interval_count || 0,
                trialPeriodDays: price.trial_period_days || undefined,
                active: price.active,
                metadata: price.metadata || {},
                type: price.type,
              },
            })),
          },
        },
        create: {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          image: product.images?.[0] || "",
          prices: {
            create: prices.data.map((price) => ({
              id: price.id,
              unitAmount: price.unit_amount,
              currency: price.currency,
              interval: price.recurring?.interval || "",
              intervalCount: price.recurring?.interval_count || 0,
              trialPeriodDays: price.trial_period_days || undefined,
              active: price.active,
              metadata: price.metadata || {},
              type: price.type,
            })),
          },
          metadata: {},
        },
      });

      console.log(result);
    }

    return { success: true };
  }),

  createSubscription: protectedProcedure
    .input(
      z.object({
        priceIds: z.array(z.string()),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const { priceIds, userId } = input;

      const prices = await prisma.price.findMany({
        where: { id: { in: priceIds } },
      });

      const productIds = prices.map((price) => price.productId);

      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });

      const userSubscriptions = await prisma.subscription.findMany({
        where: {
          userId: userId,
        },
      });

      const existingSubscriptionIds = new Set(
        userSubscriptions.map((sub) => sub.productId)
      );

      // Delete subscriptions that are not in the priceIds array
      const subscriptionsToDelete = userSubscriptions.filter(
        (sub) => !priceIds.includes(sub.priceId)
      );

      await Promise.all(
        subscriptionsToDelete.map((sub) =>
          prisma.subscription.delete({
            where: { id: sub.id },
          })
        )
      );

      // Create subscriptions for prices that don't have an existing subscription
      const subscriptionsToCreate = prices.filter(
        (price) => !existingSubscriptionIds.has(price.productId)
      );

      await Promise.all(
        subscriptionsToCreate.map((price) =>
          prisma.subscription.create({
            data: {
              id: uuidv4(),
              status: "active",
              userId: userId,
              productId: price.productId,
              priceId: price.id,
              metadata: {},
            },
          })
        )
      );

      return { success: true };
    }),
});
