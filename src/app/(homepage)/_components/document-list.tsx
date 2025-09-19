"use client";

import { AlertCircleIcon, Loader2Icon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { useDocuments } from "@/hooks/queries/document.query";
import DocumentCard from "./document-card";

const DocumentList = () => {
  const { data: documents, isPending, isError } = useDocuments();

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2Icon size={40} strokeWidth={2} className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] space-y-2 text-center px-4">
        <AlertCircleIcon className="text-red-400" size={40} strokeWidth={2} />
        <h2 className="text-xl font-semibold text-red-600">
          Oops! Something went wrong.
        </h2>
        <p className="text-sm text-red-400 max-w-xs">
          We couldn't load your documents. Please try refreshing the page or
          come back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-5">
      <Link
        href="/upload"
        className="group border-2 h-[475px] border-dashed rounded-xl flex flex-col items-center justify-center text-center p-6 transition-all hover:border-primary hover:bg-accent/30 hover:shadow-lg"
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
            <UploadIcon size={28} strokeWidth={2} />
          </div>
          <h1 className="text-base font-semibold">Upload PDF</h1>
          <p className="text-sm text-muted-foreground font-medium tracking-tight">
            Drop your PDF here or click to browse
          </p>
        </div>
      </Link>

      {(documents.data || []).map((document) => (
        // @ts-expect-error
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};

export default DocumentList;
