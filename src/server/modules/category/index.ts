import type { Session, User } from "better-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { prisma } from "@/server/lib/prisma";
import privateRoutesMiddleware from "@/server/middleware/private-route.middleware";

const categoryController = new Hono<{
  Variables: { user: User | null; session: Session | null };
}>()
  .use(privateRoutesMiddleware)
  .get("/", async (ctx) => {
    const userId = ctx.get("user")?.id;
    try {
      const categories = await prisma.category.findMany({ where: { userId } });
      return ctx.json(
        {
          success: true,
          message: "Categories fetched successfully",
          data: categories,
        },
        200,
      );
    } catch (error) {
      console.error(JSON.stringify(error));
      throw new HTTPException(500, { message: "Failed to fetch categories" });
    }
  });

export default categoryController;
