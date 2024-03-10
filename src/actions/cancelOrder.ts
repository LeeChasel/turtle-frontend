import { OrderDetail } from "@/types/Order";

export default async function cancelOrderById(token: string, orderId: string) {
  const url = `${import.meta.env.VITE_TURTLE_AUTH_URL}/order/${orderId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("請重新登入");
  } else if (res.status === 404) {
    throw new Error(`找不到訂單${orderId}`);
  } else if (!res.ok) {
    throw new Error(`取消訂單${orderId}失敗`);
  }

  const json = (await res.json()) as OrderDetail;
  return json;
}
