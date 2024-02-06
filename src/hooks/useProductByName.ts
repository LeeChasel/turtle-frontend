import { useQuery } from "@tanstack/react-query";
import getProductByName from "../actions/getProductByName";

function useProductByName(name: string | undefined) {
  return useQuery({
    queryKey: ["product", "name", name],
    queryFn: async () => {
      const products = await getProductByName(name!);
      if (products.length === 0) {
        throw new Error(`找不到商品${name}`);
      }
      return products;
    },
    select: (data) => data[0],
    enabled: !!name,
    retry: 0,
  });
}

export default useProductByName;
