export type AioCheckOutReturn = {
  MerchantID: string;
  /** 金流訂單編號 */
  MerchantTradeNo: string;
  StoreID: string;
  RtnCode: number;
  RtnMsg: string;
  TradeNo: string;
  TradeAmt: number;
  PaymentDate: string;
  PaymentType: string;
  PaymentTypeChargeFee: number;
  TradeDate: string;
  SimulatePaid: number;
  CheckMacValue: string;
  CustomField1: string;
  CustomField2: string;
  CustomField3: string;
  CustomField4: string;
};

export type AioCheckOutPaymentInfo = {
  MerchantID: string;
  MerchantTradeNo: string;
  StoreID: string;
  RtnCode: number;
  RtnMsg: string;
  TradeNo: string;
  TradeAmt: number;
  PaymentType: string;
  TradeDate: string;
  CheckMacValue: string;
  BankCode: string;
  vAccount: string;
  ExpireDate: string;
  PaymentNo: string;
  Barcode1: string;
  Barcode2: string;
  Barcode3: string;
  CustomField1: string;
  CustomField2: string;
  CustomField3: string;
  CustomField4: string;
};
