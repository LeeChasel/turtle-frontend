import { OrderStatus } from "@/types/Order";
import { LogisticsSubType } from "@/types/Shipping";

export function transformOrderStatus(enumKey: OrderStatus) {
  switch (enumKey) {
    case OrderStatus.SHIPPED:
      return "已寄出運送中";
    case OrderStatus.PAIED:
      return "已付款";
    case OrderStatus.PAYMENT_REQUIRED:
      return "等待付款";
    case OrderStatus.COMPLETE_REQUIRED:
      return "等待填寫物流資訊";
    case OrderStatus.CANCEL:
      return "已取消";
    case OrderStatus.WITHDRAWN:
      return "賣家已收款";
    case OrderStatus.CLOSED:
      return "已完成並關閉";
    case OrderStatus.RECEIVED:
      return "買家已收貨";
    default:
      return "未知狀態";
  }
}

export function transformLogisticsSubType(enumKey: LogisticsSubType) {
  switch (enumKey) {
    case LogisticsSubType.TCAT:
      return "黑貓宅配";
    case LogisticsSubType.POST:
      return "郵局宅配";
    case LogisticsSubType.FAMIC2C:
      return "全家店到店";
    case LogisticsSubType.UNIMARTC2C:
      return "7-11店到店";
    default:
      return "未知物流";
  }
}
