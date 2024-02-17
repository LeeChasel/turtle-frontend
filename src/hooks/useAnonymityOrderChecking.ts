import { useQuery } from "@tanstack/react-query";
import getAnonymityOrder from "../actions/getAnonymityOrder";

function useAnonymityOrderChecking(
  orderID: string,
  email: string,
  token: string,
) {
  return useQuery({
    queryKey: ["orderInfo", token, orderID, email],
    queryFn: () => getAnonymityOrder(token, orderID, email),
  });
}

export default useAnonymityOrderChecking;
