import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TUploadDocumentSchema } from "@/app/(homepage)/upload/upload-document-schema";
import { documentKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";

export function useDocuments(keyword?: string) {
  const documents = useQuery({
    queryKey: documentKeys.allWithKeyword(keyword || ""),
    queryFn: async () => {
      const res = await client.api.documents.$get({
        query: {
          q: keyword,
        },
      });
      return res.json();
    },
    refetchInterval: (query) => {
      const hasProcessing = query.state.data?.data.some(
        (doc) => doc.status !== "READY",
      );
      return hasProcessing ? 3000 : false;
    },
  });

  return documents;
}

export function useNewDocument(props?: { onSuccess?: () => void }) {
  const { onSuccess } = props || {};
  return useMutation({
    mutationFn: async (value: TUploadDocumentSchema) => {
      const res = await client.api.documents.$post({
        form: value,
      });
      return res.json();
    },
    onError: () => {
      toast.error("Failed to upload document", {
        description: "Failed to upload document",
      });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: documentKeys.all });
      toast.success("add document successfully", {
        description: "asdmasdm",
      });
      onSuccess?.();
    },
  });
}

export function useDocumentById(documentId: string) {
  return useQuery({
    queryKey: documentKeys.findById(documentId),
    queryFn: async () => {
      const res = await client.api.documents[":id"].$get({
        param: {
          id: documentId,
        },
      });
      return res.json();
    },
    enabled: !!documentId,
  });
}

export function useDeleteDocumentById(props?: { onSuccess?: () => void }) {
  const { onSuccess } = props || {};
  return useMutation({
    mutationFn: async (documentId: string) => {
      const res = await client.api.documents[":id"].$delete({
        param: { id: documentId },
      });
      return res.json();
    },
    onError: (error) => {
      toast.error("Delete Failed", {
        description:
          error.message || "Failed to delete document. Please try again.",
      });
    },
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.invalidateQueries({ queryKey: documentKeys.all });
      toast.success("Document Deleted", {
        description: "The document has been successfully deleted.",
      });
      onSuccess?.();
    },
  });
}
