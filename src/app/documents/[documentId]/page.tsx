import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
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
  const limit = 10;

  await queryClient.prefetchInfiniteQuery({
    queryKey: messageKeys.allByDocumentId(documentId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.api.messages[":documentId"].$get({
        param: { documentId },
        query: { page: pageParam.toString(), limit: limit.toString() },
      });
      return res.json();
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PromptPage documentId={documentId} limit={limit} />
    </HydrationBoundary>
  );
};

export default PdfChatPage;
