import { LogisticsSubType } from "./Shipping";

export type CvsMap = {
  MerchantID: string;
  MerchantTradeNo: string;
  LogisticsSubType: LogisticsSubType;
  CVSStoreID: string;
  CVSStoreName: string;
  CVSAddress: string;
  CVSTelephone: string;
  CVSOutSide: number;
};

export type CvsMapReturn = Omit<CvsMap, "CVSTelephone" | "CVSOutSide"> &
  Partial<Pick<CvsMap, "CVSTelephone" | "CVSOutSide">> & { ExtraData: string };

export type CvsMapCallback = Omit<CvsMapReturn, "ExtraData">;
