import { useQuery } from "@tanstack/react-query";
import getProductByName from "../actions/getProductByName";

function useProductByName(name: string) {
  return useQuery({
    queryKey: ["product", name],
    queryFn: () => getProductByName(name),
  });
}

export default useProductByName;
