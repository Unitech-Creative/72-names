import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { adminEmails } from "@/lib/security";
import inngest from "@/lib/inngest";

import { prisma } from "@/server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.isAdmin = adminEmails.includes(session.user.email)
          ? true
          : undefined;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  events: {
    // signIn: async ({ user, account, profile }) => {
    createUser: async ({ user, account, profile }) => {
      await inngest.send({
        name: "novu/identify.user",
        data: {
          userId: user.id,
        },
      });
    },
  },
};

export default NextAuth(authOptions);

