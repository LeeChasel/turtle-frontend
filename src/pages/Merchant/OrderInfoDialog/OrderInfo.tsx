import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail } from "@/types/Order";
import formatCellphone from "@/utils/formatCellphone";
import { transformOrderStatus } from "@/utils/transformStatusEnum";
import { useQueryClient } from "@tanstack/react-query";

export default function OrderInfo() {
  const queryClient = useQueryClient();
  const orderId = useSelectedOrder.use.orderId();
  const { tokenCookie } = useUserTokenCookie();

  const data = queryClient.getQueryData<OrderDetail>([
    "order",
    orderId,
    tokenCookie,
  ]);

  const cellphone = formatCellphone(data?.shippingInfo.receiverCellPhone ?? "");
  const address = data?.shippingInfo.receiverAddress ?? "-";
  const orderStatus = transformOrderStatus(data!.orderStatus);

  return (
    <div className="grid items-center grid-cols-2 p-2 border border-black rounded justify-items-center grow bg-stone-50">
      <span>訂單編號</span>
      <span className="font-bold text-red-600">{data?.orderId}</span>
      <span>購買日期</span>
      <span>{data?.orderDate}</span>
      <span>收件人姓名</span>
      <span>{data?.shippingInfo.receiverName}</span>
      <span>收件人電話</span>
      <span>{cellphone}</span>
      <span>訂單狀態</span>
      <span>{orderStatus}</span>
      <span>收件地址</span>
      <span>{address}</span>
    </div>
  );
}
