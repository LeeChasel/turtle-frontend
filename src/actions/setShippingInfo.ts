import { OrderDetail } from "@/types/Order";
import { LogisticsSubType, LogisticsType } from "@/types/Shipping";

type setShippingInfoDTO = {
  orderId: string;
  logisticsType: LogisticsType;
  logisticsSubType: LogisticsSubType;
  receiverName: string;
  /** pattern: ^09\d{8}$ */
  receiverCellPhone: string;
  receiverZipCode: string;
  receiverAddress: string;
  receiverEmail: string;
  payOnDelivery: boolean;
};

export async function setShippingInfoForAnonymity(
  token: string,
  userEmail: string,
  data: setShippingInfoDTO,
) {
  const url = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/ecpay/logistics/customer/anonymity/setshippinginfo?userEmail=${userEmail}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    throw new Error("登入逾期，請重新登入");
  } else if (res.status === 404) {
    throw new Error(`找不到訂單資訊`);
  } else if (!res.ok) {
    throw new Error("設定物流資訊失敗");
  }

  return res.json() as Promise<OrderDetail>;
}
