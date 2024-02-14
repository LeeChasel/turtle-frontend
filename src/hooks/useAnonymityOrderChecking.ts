import { useQuery } from "@tanstack/react-query";
import getAnonymityOrder from "../actions/getAnonymityOrder";
import useUserTokenCookie from "./useUserTokenCookie";

function useAnonymityOrderChecking(orderID: string, email: string) {
  const { tokenCookie } = useUserTokenCookie();

  return useQuery({
    queryKey: ["orderInfo", tokenCookie],
    queryFn: () => getAnonymityOrder(tokenCookie!, orderID, email),
  });
}

export default useAnonymityOrderChecking;
