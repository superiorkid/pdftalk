import { Hono } from "hono";
import auth from "@/server/lib/auth";

const authController = new Hono();

authController.on(["POST", "GET"], "/**", (c) => {
  return auth.handler(c.req.raw);
});

export default authController;
