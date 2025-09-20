"use client";

import { formatDistance } from "date-fns";
import { CalendarIcon, DownloadIcon, FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useDocumentById } from "@/hooks/queries/document.query";
import { cn } from "@/lib/utils";

interface DocumentDetailSidebarProps {
  documentId: string;
}

const DocumentDetailSidebar = ({ documentId }: DocumentDetailSidebarProps) => {
  const { data: document, isPending, isError } = useDocumentById(documentId);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="w-[338px] flex flex-col justify-between fixed left-0 top-0 h-screen">
      <div className="space-y-4 pb-2.5 pt-5 px-5 flex-1 overflow-y-auto">
        <div className="h-[363px] border rounded-lg flex justify-center items-center shadow relative overflow-hidden">
          <Image
            fill
            src={`/api/documents/${document.data.id}/cover`}
            alt={`${document.data.title} cover`}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight leading-tight capitalize">
          {document.data.title}
        </h1>
        <p className="line-clamp-3 leading-relaxed font-medium text-muted-foreground">
          {document.data.descrption}
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
                {new Intl.NumberFormat("en", {
                  style: "unit",
                  unit: "megabyte",
                  unitDisplay: "short",
                  maximumFractionDigits: 2,
                }).format(document.data.fileSize / (1024 * 1024))}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <FileIcon size={18} strokeWidth={2} />
              <span className="text-sm">Pages</span>
              <Badge variant="secondary" className="ml-auto">
                {document.data.pageCount} Page
                {document.data.pageCount > 1 && "s"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon size={18} strokeWidth={2} />
              <span className="text-sm">Uploaded</span>
              <Badge variant="secondary" className="ml-auto">
                {formatDistance(new Date(document.data.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </Badge>
            </div>
          </div>
        </div>
        <Link href="/" className={cn(buttonVariants({ className: "w-full" }))}>
          Back to Library
        </Link>
      </div>
    </div>
  );
};

export default DocumentDetailSidebar;
