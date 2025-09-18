import { zValidator } from "@hono/zod-validator";
import type { Session, User } from "@prisma/client";
import { Hono } from "hono";
import z from "zod";
import privateRoutesMiddleware from "@/server/middleware/private-route.middleware";

const documentController = new Hono<{
  Variables: { user: User | null; session: Session | null };
}>()
  .use(privateRoutesMiddleware)
  .get("/", (ctx) => {
    return ctx.json(
      { message: "get all documents", user: ctx.get("user") },
      200,
    );
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({ title: z.string(), description: z.string() }),
    ),
    (ctx) => {
      return ctx.json({ message: "create documents" }, 201);
    },
  )
  .get("/:id", (ctx) => {
    return ctx.json({ message: "detail document" });
  });

export default documentController;
