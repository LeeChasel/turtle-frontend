import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail } from "@/types/Order";
import { transformOrderStatus } from "@/utils/transformStatusEnum";
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
  // 陣列最後的元素為最新的物流訂單資訊
  const merchantShippingNo =
    data?.logisticsOrderStatus.length === 0
      ? "未出貨"
      : data?.logisticsOrderStatus[data?.logisticsOrderStatus.length - 1]
          .merchantTradeNo;
  const shippingStatus = transformOrderStatus(data!.orderStatus);
  return (
    <div className="p-2 border border-black rounded bg-stone-50">
      <div>物流訂單編號：</div>
      <div>{merchantShippingNo?.slice(-7)}</div>
      <div>物流狀態：</div>
      <div>{shippingStatus}</div>
    </div>
  );
}
