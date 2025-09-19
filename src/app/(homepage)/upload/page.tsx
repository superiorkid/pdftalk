import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { categoryKeys } from "@/lib/query-keys";
import { getServerClient } from "@/lib/rpc-server";
import Helper from "./_components/helper";

const UploadDocumentPage = async () => {
  const queryClient = getQueryClient();
  const apiClient = await getServerClient();

  await queryClient.prefetchQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await apiClient.api.categories.$get();
      return res.json();
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-[100px] flex items-center">
        <h1 className="text-xl font-bold tracking-tight">
          Upload New Document
        </h1>
      </div>

      <Helper />
    </HydrationBoundary>
  );
};

export default UploadDocumentPage;
