import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "@/lib/query-client";
import { documentKeys } from "@/lib/query-keys";
import { getServerClient } from "@/lib/rpc-server";
import DocumentList from "./_components/document-list";

interface HomeProps {
  searchParams: Promise<{ q: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q = "" } = await searchParams;
  const queryClient = getQueryClient();
  const apiClient = await getServerClient();

  await queryClient.prefetchQuery({
    queryKey: documentKeys.allWithKeyword(q),
    queryFn: async () => {
      const response = await apiClient.api.documents.$get({
        query: { q },
      });
      return response.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <DocumentList />
      </Suspense>
    </HydrationBoundary>
  );
}
