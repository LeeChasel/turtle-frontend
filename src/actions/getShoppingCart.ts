import type { TShoppingCartDetail } from "../types/ShoppingCart";

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/cart/@me";

async function getShoppingCart(token: string) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("取得購物車資料失敗");
  }

  return res.json() as Promise<TShoppingCartDetail>;
}

export default getShoppingCart;
