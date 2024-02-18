import { useQuery } from "@tanstack/react-query";
import { getOrderForAnonymity } from "../actions/getOrder";

function useAnonymityOrderChecking(
  orderID: string,
  email: string,
  token: string,
) {
  return useQuery({
    queryKey: ["orderInfo", token, orderID, email],
    queryFn: () => getOrderForAnonymity(token, orderID, email),
  });
}

export default useAnonymityOrderChecking;
