import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail } from "@/types/Order";
import { useQueryClient } from "@tanstack/react-query";
import Item from "./Item";

export default function ItemList() {
  const queryClient = useQueryClient();
  const orderId = useSelectedOrder.use.orderId();
  const { tokenCookie } = useUserTokenCookie();

  const data = queryClient.getQueryData<OrderDetail>([
    "order",
    orderId,
    tokenCookie,
  ]);
  return (
    <div className="my-5 space-y-5">
      {data?.items.map((item, index) => <Item key={index} itemData={item} />)}
    </div>
  );
}
