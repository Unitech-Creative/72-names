import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { subscriptionStatus } from "@/server/db/queries";
import prisma from "@/lib/prisma";

export async function ProtectRoute(context, flash = null) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: `/?flash=${flash || "notLoggedIn"}`,
        permanent: false,
      },
    };
  }

  return session;
}

export async function AdminRoute(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (
    !session ||
    (!!isAdmin(session.user.email) === false &&
      !!session.user.isAdmin === false)
  ) {
    return {
      redirect: {
        destination: "/?flash=notAdmin",
        permanent: false,
      },
    };
  }

  return session;
}

export async function ProtectedApi(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return redirectProps();
  }

  return session;
}

function redirectProps() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

export function getUser(email) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      likedLessons: true,
      accounts: true,
    },
  });
}

export async function SubscriptionRequired(userId) {
  const status = await subscriptionStatus(userId);
  if (status.active === true) return {};

  console.log("You are being redirect, a subscription is required!");
  return {
    redirect: {
      destination: "/?flash=subscriptionRequired",
      permanent: false,
    },
  };
}

export const adminEmails = [];

export function isAdmin(email) {
  const result = adminEmails.includes(email);
  return result;
}