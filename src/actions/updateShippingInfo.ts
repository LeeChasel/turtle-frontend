import { OrderDetail } from "@/types/Order";
import { LogisticsSubType, LogisticsType } from "@/types/Shipping";

export type UpdateShippingInfoDTO = {
  orderId: string;
  logisticsType?: LogisticsType;
  logisticsSubType?: LogisticsSubType;
  senderName?: string;
  senderCellPhone?: string;
  senderZipCode?: string;
  senderAddress?: string;

  receiverName?: string;
  /** pattern: ^09\d{8}$ */
  receiverCellPhone?: string;
  receiverZipCode?: string;
  receiverAddress?: string;
  receiverEmail?: string;
  goodsWeight?: number;
  payOnDelivery?: boolean;
};

export default async function updateShippingInfo(
  token: string,
  data: UpdateShippingInfoDTO,
) {
  const url = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/ecpay/logistics/merchant/setshippinginfo`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("登入逾期，請重新登入");
  } else if (res.status === 404) {
    throw new Error(`找不到訂單資訊`);
  } else if (!res.ok) {
    throw new Error("設定物流資訊失敗");
  }

  const json = (await res.json()) as OrderDetail;
  return json;
}
