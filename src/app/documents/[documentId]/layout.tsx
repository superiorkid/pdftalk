import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import type React from "react";
import { ConversationPaginationContextProvider } from "@/context/conversation-pagination-context";
import { getQueryClient } from "@/lib/query-client";
import { documentKeys } from "@/lib/query-keys";
import { getServerClient } from "@/lib/rpc-server";
import DocumentDetailHeader from "./_components/document-detail-header";
import DocumentDetailSidebar from "./_components/document-detail-sidebar";

interface PdfChatLayoutProps {
  children: React.ReactNode;
  params: Promise<{ documentId: string }>;
}

const PdfChatLayout = async ({ children, params }: PdfChatLayoutProps) => {
  const { documentId } = await params;
  const queryClient = getQueryClient();
  const apiClient = await getServerClient();

  const res = await apiClient.api.documents[":id"].$get({
    param: {
      id: documentId,
    },
  });

  if (!res.ok) notFound();

  const data = await res.json();
  await queryClient.setQueryData(documentKeys.findById(documentId), data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConversationPaginationContextProvider>
        <div className="flex min-h-screen">
          <DocumentDetailSidebar documentId={documentId} />
          <div className="flex-1 border-l ml-[344px] grid min-h-[100dvh] grid-rows-[auto_1fr_auto]">
            <DocumentDetailHeader documentId={documentId} />
            {children}
          </div>
        </div>
      </ConversationPaginationContextProvider>
    </HydrationBoundary>
  );
};

export default PdfChatLayout;
