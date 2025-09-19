import type { Session, User } from "@prisma/client";
import type { Context } from "hono";

export type HonoContextWithVariables<T extends Record<string, unknown>> =
  Context<{
    Variables: T;
  }>;

export type AuthVariables = {
  user: User | null;
  session: Session | null;
};

export type HonoContextWithAuth = HonoContextWithVariables<AuthVariables>;
