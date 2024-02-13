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
  /**
   * pattern: ^09\d{8}$
   */
  senderCellPhone: string;
  senderZipCode: string;
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
