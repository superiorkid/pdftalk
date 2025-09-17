import { type Context, Hono } from "hono";

const documentRoutes = new Hono();

documentRoutes
  .get("/", (ctx: Context) => {
    return ctx.json({ message: "get all documents" });
  })
  .post("/", (ctx: Context) => {
    return ctx.json({ message: "create documents" });
  })
  .get("/:id", (ctx: Context) => {
    return ctx.json({ message: "detail document" });
  });

export default documentRoutes;
