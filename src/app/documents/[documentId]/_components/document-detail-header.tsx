"use client";

import { useDocumentById } from "@/hooks/queries/document.query";

interface DocumentDetailHeaderProps {
  documentId: string;
}

const DocumentDetailHeader = ({ documentId }: DocumentDetailHeaderProps) => {
  const { data: document, isPending } = useDocumentById(documentId);

  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <header className="py-5 ps-7 border-b sticky top-0 bg-background">
      <h1 className="2xl:text-xl text-lg font-black tracking-tight capitalize">
        {document?.data.title}
      </h1>
      <p className="text-muted-foreground text-sm 2xl:text-base">
        Ask questions about your PDF content
      </p>
    </header>
  );
};

export default DocumentDetailHeader;
