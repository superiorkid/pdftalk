import { Hono } from "hono";
import documentRouter from "./modules/document";

const app = new Hono().basePath("/api");
app.route("/documents", documentRouter);

//
// if using trpc
//
// const routes = app.route("/documents", documentRouter);
// export type AppType = typeof routes;
//

export default app;
