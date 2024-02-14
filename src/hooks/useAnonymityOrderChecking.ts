import { useQuery } from "@tanstack/react-query";
import getAnonymityOrder from "../actions/getAnonymityOrder";
//import useUserTokenCookie from "./useUserTokenCookie";

function useAnonymityOrderChecking(
  orderID: string,
  email: string,
  token: string,
) {
  //const { tokenCookie } = useUserTokenCookie();

  return useQuery({
    queryKey: ["orderInfo", token],
    queryFn: () => getAnonymityOrder(token, orderID, email),
  });
}

export default useAnonymityOrderChecking;
