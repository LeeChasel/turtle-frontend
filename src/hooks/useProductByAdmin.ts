import { useQuery } from "@tanstack/react-query";
import getProductByAdmin from "@/actions/getProductByAdmin";

function useProductByAdmin(id: string, token: string) {
  return useQuery({
    queryKey: ["product", id, token],
    queryFn: () => getProductByAdmin(id, token),
    enabled: !!id,
    retry: 0,
  });
}

export default useProductByAdmin;
