import { TOrderRequest } from "../types/Order";

export async function createOrder(order: TOrderRequest, token: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order";
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("建立訂單失敗");
  }

  // TODO: set type for response
  return res.json();
}

export async function createOrderForAnonymity(
  order: TOrderRequest,
  userEmail: string,
  token: string,
) {
  const URL =
    import.meta.env.VITE_TURTLE_AUTH_URL +
    `/order/anonymity?userEmail=${userEmail}`;

  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("建立匿名訂單失敗");
  }

  // TODO: set type for response
  return res.json();
}
