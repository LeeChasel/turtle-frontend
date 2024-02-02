import { useQuery } from "@tanstack/react-query";
import getShoppingCart from "../actions/getShoppingCart";
import useUserTokenCookie from "./useUserTokenCookie";

function useShoppingCart() {
  const { tokenCookie } = useUserTokenCookie();
  return useQuery({
    queryKey: ["shoppingCart", tokenCookie],
    queryFn: () => getShoppingCart(tokenCookie!),
  });
}

export default useShoppingCart;
