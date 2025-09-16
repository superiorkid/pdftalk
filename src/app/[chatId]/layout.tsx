import { CalendarIcon, DownloadIcon, FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PdfChatLayoutProps {
  children: React.ReactNode;
}

const PdfChatLayout = ({ children }: PdfChatLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-[338px] flex flex-col justify-between fixed left-0 top-0 h-screen">
        <div className="space-y-4 pb-2.5 pt-5 px-5 flex-1 overflow-y-auto">
          <div className="h-[363px] border rounded-lg flex justify-center items-center shadow relative overflow-hidden">
            <Image
              fill
              src="https://images.unsplash.com/photo-1706271948813-4d2c904af4d8?q=80&w=741&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="document cover"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight leading-tight">
            Machine Learning Fundamentals
          </h1>
          <p className="line-clamp-3 leading-relaxed font-medium text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta ex
            alias cupiditate? Numquam sit ut qui a ratione magnam doloribus eum,
            iusto eos dignissimos sint beatae dolorem! Aliquid praesentium,
            quasi asperiores veniam porro minus ducimus repellat molestias
            deserunt dolorum maxime numquam harum quidem? Odit ex aut minus
            cupiditate possimus porro.
          </p>
        </div>
        <div className="px-5 py-2.5 space-y-8 max-h-fit">
          <div className="space-y-4">
            <h2 className="font-semibold">Document Details</h2>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2">
                <DownloadIcon size={18} strokeWidth={2} />
                <span className="text-sm">File Size</span>
                <Badge variant="secondary" className="ml-auto">
                  2.4 MB
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <FileIcon size={18} strokeWidth={2} />
                <span className="text-sm">Pages</span>
                <Badge variant="secondary" className="ml-auto">
                  24
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon size={18} strokeWidth={2} />
                <span className="text-sm">Uploaded</span>
                <Badge variant="secondary" className="ml-auto">
                  2 hours ago
                </Badge>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className={cn(buttonVariants({ className: "w-full" }))}
          >
            Back to Library
          </Link>
        </div>
      </div>
      <div className="flex-1 border-l ml-[344px]">{children}</div>
    </div>
  );
};

export default PdfChatLayout;
