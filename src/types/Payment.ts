export type PaymentDetail = {
  MerchantID: string;
  MerchantTradeNo: string;
  MerchantTradeDate: string;
  PaymentType: string;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: string;
  CheckMacValue: string;
  EncryptType: number;
  ClientBackURL: string;
  PaymentInfoURL: string;
};
