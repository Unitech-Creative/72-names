import { serve } from "inngest/next";
import { identifyUser } from "@/lib/novu";
import { prisma } from "@/server/db/client";
import inngest from "@/lib/inngest";

import commentJobs from "@/jobs/comments";

// Create a client to send and receive events

const novuIdentifyUser = inngest.createFunction(
  { name: "Novu identify user" },
  { event: "novu/identify.user" },
  async ({ event, step }) => {
    const user = await prisma.user.findUnique({
      where: { id: event.data.userId },
    });

    const result = await identifyUser(user);
    return { event, body: result };
  }
);

const novuIdentifyAllUsers = inngest.createFunction(
  { name: "Novu identify all users" },
  { event: "novu/identify.all.users" },
  async ({ event, step }) => {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    // for each user
    for (const user of users) {
      await inngest.send({
        name: "novu/identify.user",
        data: {
          userId: user.id,
        },
      });
    }
  }
);

export default serve(
  inngest,
  [...commentJobs, novuIdentifyAllUsers, novuIdentifyUser] // A list of functions to expose.  This can be empty to start.
);
