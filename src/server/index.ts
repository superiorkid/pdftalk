import { Hono } from "hono";
import authController from "./modules/auth";
import documentController from "./modules/document";

const app = new Hono().basePath("/api");
app.route("/auth", authController).route("/documents", documentController);

//
// if using trpc
//
// const routes = app.route("/documents", documentController);
// export type AppType = typeof routes;
//

export default app;
