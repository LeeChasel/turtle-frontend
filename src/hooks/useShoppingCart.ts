import { useQuery } from "@tanstack/react-query";
import getShoppingCart from "../actions/getShoppingCart";
import useUserTokenCookie from "./useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";

function useShoppingCart() {
  const { tokenCookie } = useUserTokenCookie();
  const isSpecialRole = validateTokenRole(
    tokenCookie,
    "ROLE_ANONYMITY_CUSTOMER",
  );
  return useQuery({
    queryKey: ["shoppingCart", tokenCookie],
    queryFn: () => getShoppingCart(tokenCookie!),
    enabled: !isSpecialRole,
  });
}

export default useShoppingCart;
