import { useQuery } from "@tanstack/react-query";
import getProductByName from "../actions/getProductByName";

function useProductByName(name: string) {
  return useQuery({
    queryKey: ["product", name],
    queryFn: () => getProductByName(name),
    select: (data) => data[0],
  });
}

export default useProductByName;
