"use client";

import {
  BoltIcon,
  ChevronDownIcon,
  Layers2Icon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import KeywordFilterInput from "./keyword-filter-input";

const HomepageHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  };

  return (
    <header className="border-b py-3.5 sticky top-0 bg-background/85 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between px-5 2xl:px-0">
        <Link href="/">
          <div className="space-y-0.5">
            <h1 className="font-bold text-xl tracking-tight">PDFTalker</h1>
            <p className="text-muted-foreground text-sm tracking-wide">
              Chat your documents using AI
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {pathname === "/" && (
            <Suspense>
              <KeywordFilterInput />
            </Suspense>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent"
              >
                <Avatar className="size-9 hover:ring hover:ring-offset-primary hover:ring-offset-1 hover:cursor-pointer">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Profile image"
                  />
                  <AvatarFallback>KK</AvatarFallback>
                </Avatar>
                <ChevronDownIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-w-64" align="end">
              <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-sm font-medium">
                  Keith Kennedy
                </span>
                <span className="text-muted-foreground truncate text-xs font-normal">
                  k.kennedy@originui.com
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => router.push("/account/settings")}
                >
                  <BoltIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/account/security")}
                >
                  <Layers2Icon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default HomepageHeader;
