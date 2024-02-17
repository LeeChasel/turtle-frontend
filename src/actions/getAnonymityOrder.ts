import { orderInfo } from "../types/Order";
const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order/anonymity";

async function getAnonymityOrder(
  token: string,
  orderID: string,
  email: string,
) {
  const res = await fetch(URL + "/" + orderID + "?userEmail=" + email, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("查詢訂單錯誤");
  }

  return res.json() as Promise<orderInfo>;
}

export default getAnonymityOrder;
