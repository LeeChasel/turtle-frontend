export type ShippingInfo = {
  orderId?: string;
  logisticsType?: LogisticsType;
  logisticsSubType?: LogisticsSubType;
  senderName?: string;
  /** pattern: ^09\d{8}$ */
  senderCellPhone?: string;
  senderZipCode?: string;
  senderAddress?: string;
  receiverName?: string;
  /** pattern: ^09\d{8}$ */
  receiverCellPhone?: string;
  receiverZipCode?: string;
  receiverAddress?: string;
  goodsWeight?: number;
  receiverEmail?: string;
  payOnDelivery?: boolean;
};

export enum LogisticsType {
  CVS = "CVS",
  HOME = "HOME",
}

export enum LogisticsSubType {
  /** 黑貓宅配 */
  TCAT = "TCAT",
  /** 郵局宅配 */
  POST = "POST",
  /** 全家店到店 */
  FAMIC2C = "FAMIC2C",
  /** 7-11店到店 */
  UNIMARTC2C = "UNIMARTC2C",
}

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
