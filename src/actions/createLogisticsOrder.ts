import { OrderDetail } from "@/types/Order";

export async function createLogisticsOrderForMerchant(
  token: string,
  orderId: string,
) {
  const url = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/ecpay/logistics/merchant/create-logistics-order/${orderId}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("請重新登入");
  } else if (res.status === 403) {
    throw new Error("權限不足");
  } else if (res.status === 404) {
    throw new Error("訂單不存在");
  } else if (res.status === 400) {
    throw new Error("訂單狀態錯誤");
  }

  const json = (await res.json()) as OrderDetail;
  return json;
}
