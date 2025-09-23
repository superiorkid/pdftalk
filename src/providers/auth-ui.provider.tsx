"use client";

import { AuthUIProvider as BetterAuthUIProvider } from "@daveyplate/better-auth-ui";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthUIProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <BetterAuthUIProvider
      authClient={authClient}
      navigate={(href) => router.push(href as Route<string>)}
      replace={(href) => router.replace(href as Route<string>)}
      onSessionChange={() => {
        router.refresh();
      }}
      Link={({ href, className, children }) => (
        <Link href={href as Route<string>} className={className}>
          {children}
        </Link>
      )}
    >
      {children}
    </BetterAuthUIProvider>
  );
}
