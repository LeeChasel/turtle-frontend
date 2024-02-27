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
  TCAT = "TCAT",
  POST = "POST",
  FAMIC2C = "FAMIC2C",
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
