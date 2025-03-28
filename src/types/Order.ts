import { AioCheckOutPaymentInfo, AioCheckOutReturn } from "./AllInOne";
import { CustomizationBrief } from "./Customization/CustomizationBase";
import { CvsMap } from "./Cvs";
import { LogisticsOrderStatus, ShippingInfo } from "./Shipping";
import { TShoppingCartDetail } from "./ShoppingCart";

export type CartItem = Omit<TShoppingCartDetail, "addedTime"> & {
  customizations: CustomizationBrief[];
};

export type OrderDetail = {
  orderId: string;
  merchantId: string;
  userId: string;
  userEmail: string;
  orderDate: string;
  orderStatus: OrderStatus;
  lastOperationTimestamp: number;
  totalPrice: number;
  description: string;
  items: OrderDetailItem[];
  cvsMap?: CvsMap;
  shippingInfo: ShippingInfo;
  logisticsOrderStatus: LogisticsOrderStatus[];
  aioCheckOutReturn?: AioCheckOutReturn;
  aioCheckOutPaymentInfo?: AioCheckOutPaymentInfo;
  orderFinishTimestamp?: number;
  merchantCheckoutTotalPrice?: number;
  discount?: object;
};

export type OrderDetailItem = {
  productId: string;
  productName: string;
  variationName: string;
  variationSpec: string;
  currentPrice: number;
  quantity: number;
  customizations: CustomizationBrief[];
};

export enum OrderStatus {
  SHIPPED = "SHIPPED",
  PAIED = "PAIED",
  PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
  COMPLETE_REQUIRED = "COMPLETE_REQUIRED",

  /** 流程結束已關閉訂單 */
  CANCEL = "CANCEL",

  /** 賣家已收款 */
  WITHDRAWN = "WITHDRAWN",

  /** 賣家可收款 */
  CLOSED = "CLOSED",

  /** 買家已收貨 */
  RECEIVED = "RECEIVED",
  ALL = "SHIPPED,PAIED,PAYMENT_REQUIRED,COMPLETE_REQUIRED,CANCEL,WITHDRAWN,CLOSED,RECEIVED",
}

export type OrderInfoForMerchant = {
  orderId: string;
  orderDate: string;
  orderStatus: OrderStatus;
  lastOperationTimestamp: number;
  orderFinishTimestamp: number;
  merchantCheckoutTimestamp: number;
  totalPrice: number;
  merchantCheckoutTotalPrice: number;
};
