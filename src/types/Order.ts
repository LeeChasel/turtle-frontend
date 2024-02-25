import { AioCheckOutPaymentInfo, AioCheckOutReturn } from "./AllInOne";
import { CvsMap } from "./Cvs";
import { LogisticsOrderStatus, ShippingInfo } from "./Shipping";
import { TShoppingCartDetail, TShoppingCartBrief } from "./ShoppingCart";

export type TOrder = {
  items: TOrderItem[];
};

export type TOrderItem = Omit<TShoppingCartDetail, "addedTime">;

export type TOrderRequestItem = Omit<TShoppingCartBrief, "addedTime">;

export type TOrderRequest = {
  items: TOrderRequestItem[];
};

export type OrderDetail = {
  orderId: string;
  userId: string;
  userEmail: string;
  orderDate: string;
  orderStatus: OrderStatus;
  totalPrice: number;
  description: string;
  items: OrderDetailItem[];
  cvsMap?: CvsMap;
  shippingInfo: ShippingInfo;
  logisticsOrderStatus: LogisticsOrderStatus[];
  aioCheckOutReturn?: AioCheckOutReturn;
  aioCheckOutPaymentInfo?: AioCheckOutPaymentInfo;
  discount?: object;
};

export type OrderDetailItem = {
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
