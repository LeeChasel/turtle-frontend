import { useQuery } from "@tanstack/react-query";
import getProductById from "../actions/getProductById";

function useProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
}

export default useProductById;
