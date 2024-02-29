import { LogisticsSubType, LogisticsType } from "@/types/Shipping";

type ParamToChangeCvs = {
  MerchantID: string;
  MerchantTradeNo: string;
  LogisticsType: LogisticsType | null;
  LogisticsSubType: LogisticsSubType | null;
  IsCollection: "Y" | "N";
  ServerReplyURL: string;
  ExtraData: string;
};

export async function getParamToChangeCvsForAnonymity(
  token: string,
  orderId: string,
  userEmail: string,
): Promise<ParamToChangeCvs> {
  const url = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/ecpay/logistics/customer/anonymity/cvsmap/${orderId}?userEmail=${userEmail}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("登入逾期，請重新登入");
  } else if (res.status === 404) {
    throw new Error(`找不到訂單編號「${orderId}」的物流資訊`);
  } else if (!res.ok) {
    throw new Error("取得參數以變更物流CVS商店失敗");
  }

  return res.json() as Promise<ParamToChangeCvs>;
}
