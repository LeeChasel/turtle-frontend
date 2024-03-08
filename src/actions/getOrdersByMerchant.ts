import { OrderInfoForMerchant } from "@/types/Order";

export async function getOrdersByMerchant(
  token: string,
  orderStatus: string,
  page: number,
) {
  const URL =
    import.meta.env.VITE_TURTLE_AUTH_URL +
    "/merchant/orders?orderStatus=" +
    orderStatus +
    "&page=" +
    page +
    "&perPageSize=10";
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

  return res.json() as Promise<OrderInfoForMerchant>;
}
