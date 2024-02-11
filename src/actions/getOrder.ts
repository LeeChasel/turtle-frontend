const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order";

export type orderInfo = {
  orderId: string;
  userId: string;
  userEmail: string;
  orderDate: string;
  orderStatus: "SHIPPED"; //確認狀態類別
  totalPrice: number;
  description: string;
  item: [
    {
      productId: string;
      productName: string;
      variationName: string;
      variationSpec: string;
      currentPrice: number;
      quantity: number;
    },
  ];
  cvsMap: {
    MerchantID: string;
    MerchantTradeNo: string;
    LogisticsSubType: string;
    CVSStoreID: string;
    CVSStoreName: string;
    CVSAddress: string;
    CVSTelephone: string;
    CVSOutSide: number;
    ExtraData: string;
  };
  shippingInfo: {
    orderId: string;
    logisticsType: "CVS";
    logisticsSubType: "TCAT";
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
  logisticsOrderStatus: [
    {
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
    },
  ];
  aioCheckOutReturn: {
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
  aioCheckOutPaymentInfo: {
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
  discount: object;
};
async function getOrder(token: string, orderID: string) {
  const res = await fetch(URL + "/" + orderID, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("查詢訂單錯誤");
  }

  return res.json() as Promise<orderInfo>;
}

export default getOrder;
