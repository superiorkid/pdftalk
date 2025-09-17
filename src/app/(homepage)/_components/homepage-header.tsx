"use client";

import {
  BoltIcon,
  ChevronDownIcon,
  FilterIcon,
  Grid3X3Icon,
  Layers2Icon,
  ListIcon,
  LogOutIcon,
  SearchIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const HomepageHeader = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="border-b py-3.5 sticky top-0 bg-background/85 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between px-5 2xl:px-0">
        <div className="space-y-0.5">
          <h1 className="font-bold text-xl tracking-tight">PDFTalker</h1>
          <p className="text-muted-foreground text-sm tracking-wide">
            Chat your documents using AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pathname === "/" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  className="peer ps-9 pe-9"
                  placeholder="Search PDFs..."
                  type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                  <SearchIcon size={16} />
                </div>
                <button
                  className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Submit search"
                  type="submit"
                >
                  <FilterIcon size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-center gap-1 border rounded-lg overflow-hidden p-[1.2px]">
                <button
                  type="button"
                  className="hover:bg-zinc-300 size-8 flex justify-center items-center hover:cursor-pointer"
                >
                  <Grid3X3Icon size={16} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="hover:bg-zinc-300 size-8 flex justify-center items-center hover:cursor-pointer"
                >
                  <ListIcon size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
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
                <DropdownMenuItem>
                  <BoltIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
