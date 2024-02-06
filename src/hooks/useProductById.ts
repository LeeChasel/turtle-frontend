import { useQuery } from "@tanstack/react-query";
import getProductById from "../actions/getProductById";

function useProductById(id: string | undefined) {
  return useQuery({
    queryKey: ["product", "id", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
    retry: 0,
  });
}

export default useProductById;
