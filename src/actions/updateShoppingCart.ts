import { TShoppingCartBrief } from "../types/ShoppingCart";

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/cart/@me";

async function updateShoppingCart(items: TShoppingCartBrief[], token: string) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(items),
  });

  if (!res.ok) {
    throw new Error("更新購物車錯誤");
  }
}

export default updateShoppingCart;
