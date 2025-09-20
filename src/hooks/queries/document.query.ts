import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { TUploadDocumentSchema } from "@/app/(homepage)/upload/upload-document-schema";
import { documentKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";

export function useDocuments() {
  const documents = useQuery({
    queryKey: documentKeys.all,
    queryFn: async () => {
      const res = await client.api.documents.$get();
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
        description: "lorem lorem lorem lorem",
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
