import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { messageKeys } from "@/lib/query-keys";
import { getServerClient } from "@/lib/rpc-server";
import PromptPage from "./_components/prompt-page";

interface PdfChatPageProps {
  params: Promise<{ documentId: string }>;
}

const PdfChatPage = async ({ params }: PdfChatPageProps) => {
  const { documentId } = await params;

  const queryClient = getQueryClient();
  const apiClient = await getServerClient();

  const queryParams = { page: "1", limit: "10" } as const;

  const res = await apiClient.api.messages[":documentId"].$get({
    param: { documentId },
    query: queryParams,
  });

  if (!res.ok) notFound();

  const data = await res.json();
  await queryClient.setQueryData(messageKeys.allByDocumentId(documentId), data);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptPage documentId={documentId} />
    </HydrationBoundary>
  );
};

export default PdfChatPage;
