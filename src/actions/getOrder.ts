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

export async function getMerchantOrderByOrderId(
  token: string,
  orderId: string,
) {
  const URL = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/merchant/order/${orderId}`;
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (res.status === 401) {
    throw new Error("請重新登入");
  } else if (res.status === 404) {
    throw new Error(`訂單${orderId}不存在`);
  } else if (!res.ok) {
    throw new Error("賣家訂單查詢失敗");
  }

  return res.json() as Promise<OrderDetail>;
}
