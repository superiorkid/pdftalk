import { useQuery } from "@tanstack/react-query";
import { categoryKeys } from "@/lib/query-keys";
import client from "@/lib/rpc";

export function useCategories() {
  const categories = useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await client.api.categories.$get();
      return res.json();
    },
  });

  return categories;
}
