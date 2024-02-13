import { TShoppingCartDetail, TShoppingCartBrief } from "./ShoppingCart";

export type TOrder = {
  items: TOrderItem[];
};

export type TOrderItem = Omit<TShoppingCartDetail, "addedTime">;

export type TOrderRequestItem = Omit<TShoppingCartBrief, "addedTime">;

export type TOrderRequest = {
  items: TOrderRequestItem[];
};

export type OrderResponse = {
  orderId: string;
  userId: string;
  userEmail: string;
  orderDate: string;
  orderStatus: OrderStatus;
  totalPrice: number;
  description: string;
  item: OrderResponseItem[];
  cvsMap?: CvsMap;
  shippingInfo: ShippingInfo;
  logisticsOrderStatus: LogisticsOrderStatus[];
  aioCheckOutReturn: AioCheckOutReturn;
  aioCheckOutPaymentInfo: AioCheckOutPaymentInfo;
  discount: object;
};

export type OrderResponseItem = {
  productId: string;
  productName: string;
  variationName: string;
  variationSpec: string;
  currentPrice: number;
  quantity: number;
};

enum OrderStatus {
  SHIPPED = "SHIPPED",
  PAIED = "PAIED",
  PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
  COMPLETE_REQUIRED = "COMPLETE_REQUIRED",
  CANCEL = "CANCEL",
}

export type CvsMap = {
  MerchantID: string;
  MerchantTradeNo: string;
  LogisticsSubType: string;
  CVSStoreID: string;
  CVSStoreName: string;
  CVSAddress: string;
  CVSTelephone: string;
  CVSOutSide: number;
};

export type ShippingInfo = {
  orderId: string;
  logisticsType: LogisticsType;
  logisticsSubType: LogisticsSubType;
  senderName: string;
  senderCellPhone: string;
  senderZipCode: string;
  senderAddress: string;
  receiverName: string;
  receiverCellPhone: string;
  receiverZipCode: string;
  receiverAddress: string;
  goodsWeight: number;
  receiverEmail: string;
  payOnDelivery: boolean;
};

export type LogisticsOrderStatus = {
  merchantID: string;
  merchantTradeNo: string;
  rtnCode: number;
  rtnMsg: string;
  allPayLogisticsID: string;
  logisticsType: string;
  logisticsSubType: string;
  goodsAmount: number;
  updateStatusDate: string;
  receiverName: string;
  receiverPhone: string;
  receiverCellPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  bookingNote: string;
  cvspaymentNo: string;
  cvsvalidationNo: string;
};

type AioCheckOutReturn = {
  MerchantID: string;
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

type AioCheckOutPaymentInfo = {
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

enum LogisticsType {
  CVS = "CVS",
  HOME = "HOME",
}

enum LogisticsSubType {
  TCAT = "TCAT",
  POST = "POST",
  FAMIC2C = "FAMIC2C",
  UNIMARTC2C = "UNIMARTC2C",
}
