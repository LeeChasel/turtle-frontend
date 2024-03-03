import type { PaymentDetail } from "../types/Payment";

export async function getPaymentDetail(orderId: string) {
  const URL =
    import.meta.env.VITE_TURTLE_PUBLIC_URL +
    "/ecpay/payment/customer/" +
    orderId;
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("交易查詢失敗");
  }

  return res.json() as Promise<PaymentDetail>;
}
