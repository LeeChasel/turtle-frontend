import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail } from "@/types/Order";
import { LogisticsSubType, LogisticsType } from "@/types/Shipping";
import { useQueryClient } from "@tanstack/react-query";

export default function ShippingInfo() {
  const queryClient = useQueryClient();
  const orderId = useSelectedOrder.use.orderId();
  const { tokenCookie } = useUserTokenCookie();

  const data = queryClient.getQueryData<OrderDetail>([
    "order",
    orderId,
    tokenCookie,
  ]);

  const hasLogisticsOrder = data?.logisticsOrderStatus.length !== 0;
  if (!hasLogisticsOrder) {
    return (
      <div className="p-2 border border-black rounded bg-stone-50">
        尚未出貨
      </div>
    );
  }

  // 陣列最後的元素為最新的物流訂單資訊
  const lastestLogisticsOrderStatus =
    data!.logisticsOrderStatus[data!.logisticsOrderStatus.length - 1];

  const shippingType = data!.shippingInfo.logisticsType!;
  let shippingCode = "";
  if (shippingType === LogisticsType.CVS) {
    shippingCode = lastestLogisticsOrderStatus.cvspaymentNo;
    if (data?.shippingInfo.logisticsSubType === LogisticsSubType.UNIMARTC2C) {
      shippingCode += `${lastestLogisticsOrderStatus.cvsvalidationNo}`;
    }
  } else if (shippingType === LogisticsType.HOME) {
    shippingCode = lastestLogisticsOrderStatus.bookingNote;
  }

  return (
    <div className="p-2 border border-black rounded bg-stone-50">
      <div>物流代碼/編號：</div>
      <div>{shippingCode}</div>
      <div>物流狀態：</div>
      <div>{lastestLogisticsOrderStatus.rtnMsg}</div>
    </div>
  );
}
