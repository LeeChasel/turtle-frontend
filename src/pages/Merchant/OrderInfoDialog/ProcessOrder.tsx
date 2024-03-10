import { createLogisticsOrderForMerchant } from "@/actions/createLogisticsOrder";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderDetail } from "@/types/Order";
import { showToast } from "@/utils/toastAlert";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function ProcessOrder() {
  const [isProcessing, setIsProcessing] = useState(false);
  const orderId = useSelectedOrder.use.orderId();
  const setOrderId = useSelectedOrder.use.setOrderId();
  const { tokenCookie } = useUserTokenCookie();
  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<OrderDetail>([
    "order",
    orderId,
    tokenCookie,
  ]);

  // 若有狀態代表已經出貨，不可再建立物流訂單
  const isDisabled = data!.logisticsOrderStatus.length > 0;

  async function onCreateLogisticsOrder() {
    try {
      setIsProcessing(true);
      await createLogisticsOrderForMerchant(tokenCookie!, orderId);
      showToast("success", "物流訂單已建立");
      setOrderId("");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <button
      type="button"
      className="shadow-md btn btn-outline"
      onClick={onCreateLogisticsOrder}
      disabled={isProcessing || isDisabled}
    >
      建立物流訂單
    </button>
  );
}
