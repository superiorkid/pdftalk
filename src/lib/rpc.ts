import { hc } from "hono/client";
import type { AppType } from "@/server";

const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

const client = hc<AppType>(baseURL, {
  init: { credentials: "include" },
});

export default client;
