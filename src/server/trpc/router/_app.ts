import { router } from "../trpc";
import { stripeRouter } from "./stripe";
import { userRouter } from "./user";
import { commentsRouter } from "./comments";
import { adminRouter } from "./admin";
import { likeRouter } from "./like";

export const appRouter = router({
  stripe: stripeRouter,
  user: userRouter,
  comments: commentsRouter,
  admin: adminRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
