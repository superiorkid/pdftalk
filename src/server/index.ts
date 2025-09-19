import { Hono } from "hono";
import authController from "./modules/auth";
import categoryController from "./modules/category";
import documentController from "./modules/document";

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", authController)
  .route("/documents", documentController)
  .route("/categories", categoryController);

export type AppType = typeof routes;
export default app;
