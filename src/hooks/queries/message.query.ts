import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { messageKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";

export function useMessages(params: {
  documentId: string;
  page: number;
  limit: number;
}) {
  const { documentId, limit, page } = params;
  return useQuery({
    queryKey: messageKeys.allByDocumentId(documentId),
    queryFn: async () => {
      const res = await client.api.messages[":documentId"].$get({
        param: { documentId },
        query: { limit: String(limit), page: String(page) },
      });
      return res.json();
    },
    enabled: !!documentId,
  });
}

export function useInfiniteMessages(params: {
  documentId: string;
  limit: number;
}) {
  const { documentId, limit } = params;
  return useInfiniteQuery({
    queryKey: messageKeys.allByDocumentId(documentId),
    queryFn: async ({ pageParam = 1 }) => {
      const res = await client.api.messages[":documentId"].$get({
        param: { documentId },
        query: { page: pageParam.toString(), limit: limit.toString() },
      });
      return res.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

export function useSendMessage(props: {
  documentId: string;
  onSuccess?: () => void;
}) {
  const { documentId, onSuccess } = props;
  return useMutation({
    mutationFn: async (question: string) => {
      const res = await client.api.messages[":documentId"].$post({
        param: {
          documentId,
        },
        json: {
          question,
        },
      });
      return res.json();
    },
    onError: () => {
      toast.error("Failed to send message", {
        description: "Failed to send message",
      });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({
        queryKey: messageKeys.allByDocumentId(documentId),
      });
      toast.success("send message successfully", {
        description: "send message successfully",
      });
      onSuccess?.();
    },
  });
}
