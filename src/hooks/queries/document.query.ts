import { useQuery } from "@tanstack/react-query";
import { documentKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";

export function useDocuments() {
  const documents = useQuery({
    queryKey: documentKeys.all,
    queryFn: async () => {
      const res = await client.api.documents.$get();
      return res.json();
    },
  });

  return documents;
}
