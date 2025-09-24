import { randomUUID } from "node:crypto";
import type { Message } from "@prisma/client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { messageKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";
import type { MessagesPage } from "@/types/message-page.type";

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
        query: { page: String(pageParam), limit: String(limit) },
      });
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { page, limit, total } = lastPage.pagination;
      const totalPages = Math.ceil(total / limit);
      return page < totalPages ? page + 1 : undefined;
    },
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
    onMutate: async (question, context) => {
      await context.client.cancelQueries({
        queryKey: messageKeys.allByDocumentId(question),
      });

      const previousMessages = context.client.getQueryData(
        messageKeys.allByDocumentId(question),
      );

      const userMessage: Message = {
        documentId,
        id: "temp-user",
        sender: "USER",
        content: question,
        createdAt: new Date(),
        metadata: {},
      };

      const AIPlaceholder: Message = {
        id: "temp-ai",
        sender: "AI",
        content: "…",
        createdAt: new Date(),
        metadata: { isLoading: true },
        documentId,
      };

      context.client.setQueryData<{
        pages: MessagesPage[];
        pageParams: number[];
      }>(messageKeys.allByDocumentId(documentId), (old) => {
        if (!old) {
          return {
            pages: [
              {
                data: [userMessage, AIPlaceholder],
                pagination: { page: 1, limit: 10, total: 2, hasNextPage: true },
              },
            ],
            pageParams: [],
          };
        }

        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? {
                  ...page,
                  data: [...page.data, userMessage, AIPlaceholder],
                }
              : page,
          ),
        };
      });

      return {
        previousMessages,
      };
    },
    onError: (error, _variables, onMutateResult, context) => {
      console.error(error);
      toast.error("Failed to send message", {
        description: "Failed to send message",
      });
      if (onMutateResult?.previousMessages) {
        context.client.setQueryData(
          messageKeys.allByDocumentId(documentId),
          onMutateResult.previousMessages,
        );
      }
    },
    onSuccess: (_data, _variables, _onMutateResult, context) => {
      context.client.invalidateQueries({
        queryKey: messageKeys.allByDocumentId(documentId),
      });
      toast.success("Send message successfully", {
        description: "Message sent",
      });
      onSuccess?.();
    },
  });
}
