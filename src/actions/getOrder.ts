import { OrderDetail } from "../types/Order";

export async function getOrder(token: string, orderId: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order" + orderId;
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("訂單查詢失敗");
  }

  return res.json() as Promise<OrderDetail>;
}

export async function getOrderForAnonymity(
  token: string,
  orderId: string,
  userEmail: string,
) {
  const URL =
    import.meta.env.VITE_TURTLE_AUTH_URL +
    "/order/anonymity/" +
    orderId +
    "?userEmail=" +
    userEmail;
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("訂單查詢失敗");
  }

  return res.json() as Promise<OrderDetail>;
}
