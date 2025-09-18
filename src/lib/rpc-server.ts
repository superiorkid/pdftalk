import { hc } from "hono/client";
import { cookies, headers } from "next/headers";
import type { AppType } from "@/server";

const baseURL = process.env.NEXT_PUBLIC_API_URL as string;

export async function getServerClient() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  return hc<AppType>(baseURL, {
    init: {
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
        "x-forwarded-for": headerStore.get("x-forwarded-for") || "",
        "user-agent": headerStore.get("user-agent") || "",
      },
    },
  });
}
