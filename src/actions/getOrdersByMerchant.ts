import { OrderInfoForMerchant, OrderStatus } from "@/types/Order";

export async function getOrdersByMerchant(
  token: string,
  orderStatus: OrderStatus,
  page: number,
  startTime: number,
) {
  if (orderStatus === OrderStatus.ALL) {
    const URL =
      import.meta.env.VITE_TURTLE_AUTH_URL +
      "/merchant/orders?orderStatus=" +
      OrderStatus.ALL +
      "&page=" +
      page +
      "&startTime=" +
      startTime;
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
    return res.json() as Promise<OrderInfoForMerchant[]>;
  } else {
    const URL =
      import.meta.env.VITE_TURTLE_AUTH_URL +
      "/merchant/orders?orderStatus=" +
      orderStatus +
      "&page=" +
      page +
      "&startTime=" +
      startTime;

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
    return res.json() as Promise<OrderInfoForMerchant[]>;
  }
}
