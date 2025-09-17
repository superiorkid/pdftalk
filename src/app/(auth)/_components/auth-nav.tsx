"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AuthNav = () => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/sign-in";
  const href = isLoginPage ? "/sign-up" : "/sign-in";

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          className: "absolute top-8 right-8",
          size: "sm",
          variant: "secondary",
        }),
      )}
    >
      Go to {isLoginPage ? "Register" : "Login"}
    </Link>
  );
};

export default AuthNav;
