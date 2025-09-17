import type { Session, User } from "@prisma/client";
import { type Context, Hono } from "hono";
import privateRoutesMiddleware from "@/server/middleware";

const documentController = new Hono<{
  Variables: { user: User | null; session: Session | null };
}>();

documentController.use(privateRoutesMiddleware);
documentController
  .get("/", (ctx: Context) => {
    return ctx.json({ message: "get all documents" });
  })
  .post("/", (ctx: Context) => {
    return ctx.json({ message: "create documents" });
  })
  .get("/:id", (ctx: Context) => {
    return ctx.json({ message: "detail document" });
  });

export default documentController;
