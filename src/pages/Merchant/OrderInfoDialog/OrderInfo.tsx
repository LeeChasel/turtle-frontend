import { OrderDetail } from "@/types/Order";
import formatCellphone from "@/utils/formatCellphone";
import {
  transformLogisticsSubType,
  transformOrderStatus,
} from "@/utils/transformStatusEnum";

export default function OrderInfo({ data }: { data: OrderDetail }) {
  const cellphone = formatCellphone(data.shippingInfo.receiverCellPhone ?? "");
  const address =
    data.shippingInfo.receiverAddress ?? data.cvsMap?.CVSStoreName;
  const orderStatus = transformOrderStatus(data.orderStatus);
  const logisticsSubType = transformLogisticsSubType(
    data.shippingInfo.logisticsSubType!,
  );

  return (
    <div className="grid items-center grid-cols-2 p-2 border border-black rounded justify-items-center grow bg-stone-50">
      <span>訂單編號</span>
      <span className="font-bold text-red-600">{data.orderId}</span>
      <span>購買日期</span>
      <span>{data.orderDate}</span>
      <span>收件人姓名</span>
      <span>{data.shippingInfo.receiverName}</span>
      <span>收件人電話</span>
      <span>{cellphone}</span>
      <span>收件人電子信箱</span>
      <span>{data.shippingInfo.receiverEmail}</span>
      <span>寄送方式</span>
      <span>{logisticsSubType}</span>
      <span>收件地址</span>
      <span>{address}</span>
      <span>訂單狀態</span>
      <span>{orderStatus}</span>
    </div>
  );
}
