import { useQuery } from "@tanstack/react-query";
import getProductByAdmin from "@/actions/getProductByAdmin";

function useProductByAdmin(id: string | undefined, token: string | undefined) {
  return useQuery({
    queryKey: ["product", "id", id],
    queryFn: () => getProductByAdmin(id!, token!),
    enabled: !!id,
    retry: 0,
  });
}

export default useProductByAdmin;
