import { getMerchantOrderByOrderId } from "@/actions/getOrder";
import { useQuery } from "@tanstack/react-query";

function useOrderForMerchant(token: string, orderId: string) {
  return useQuery({
    queryKey: ["order", orderId, token],
    queryFn: () => getMerchantOrderByOrderId(token, orderId),
    enabled: !!orderId,
    retry: 0,
  });
}

export default useOrderForMerchant;
