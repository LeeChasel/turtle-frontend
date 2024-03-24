import cancelOrderById from "@/actions/cancelOrder";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail, OrderStatus } from "@/types/Order";
import { showToast } from "@/utils/toastAlert";

export default function CancelOrder({ data }: { data: OrderDetail }) {
  const { tokenCookie } = useUserTokenCookie();
  const setOrderId = useSelectedOrder.use.setOrderId();
  const isDisabled = data?.orderStatus === OrderStatus.CANCEL;

  async function onCancelOrder() {
    const randomString = Math.random().toString(36).substring(2, 10);
    const input = prompt(`請輸入隨機字串以取消訂單\n隨機字串：${randomString}`);

    try {
      if (!input) {
        return;
      } else if (input !== randomString) {
        throw new Error("隨機字串錯誤");
      }

      await cancelOrderById(tokenCookie!, data.orderId);
      showToast("success", `取消訂單${data.orderId}成功`);
      setOrderId("");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  return (
    <button
      type="button"
      className="w-1/4 text-red-600 btn btn-outline hover:bg-red-600"
      onClick={onCancelOrder}
      disabled={isDisabled}
    >
      取消訂單
    </button>
  );
}
