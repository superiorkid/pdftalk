import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import Link from "next/link";
import { getQueryClient } from "@/lib/query-client";
import { documentKeys } from "@/lib/query-keys";
import { getServerClient } from "@/lib/rpc-server";
import DocumentList from "./_components/document-list";

export default async function Home() {
  const queryClient = getQueryClient();
  const apiClient = await getServerClient();

  await queryClient.prefetchQuery({
    queryKey: documentKeys.all,
    queryFn: async () => {
      const response = await apiClient.api.documents.$get();
      return response.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DocumentList />
    </HydrationBoundary>
  );
}
