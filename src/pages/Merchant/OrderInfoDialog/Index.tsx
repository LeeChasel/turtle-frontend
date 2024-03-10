import useSelectedOrder from "@/store/useSelectedOrder";
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import OrderInfo from "./OrderInfo";
import ShippingInfo from "./ShippingInfo";
import ProcessOrder from "./ProcessOrder";
import ItemList from "./ItemList";
import useOrderForMerchant from "@/hooks/useOrderForMerchant";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { lazy } from "react";
import validateTokenRole from "@/utils/validateTokenRole";
import UpdateSenderInfo from "./updateSenderInfo";

const CancelOrder = lazy(() => import("./CancelOrder"));

export default function OrderInfoDialog() {
  const orderId = useSelectedOrder.use.orderId();
  const setOrderId = useSelectedOrder.use.setOrderId();
  const isOpen = orderId !== "";
  const { tokenCookie } = useUserTokenCookie();
  const isAdmin = validateTokenRole(tokenCookie, "ROLE_ADMIN");

  const { status, error } = useOrderForMerchant(tokenCookie!, orderId);
  if (status === "error") return <div>Error: {error.message}</div>;
  if (status === "pending") return;

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOrderId("")}
      className="relative z-50 w-full"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center w-full px-10">
        <Dialog.Panel className="relative w-3/4 max-h-[90%] p-2 bg-white rounded-lg flex flex-col gap-2">
          <button
            type="button"
            className="items-center self-end justify-center bg-red-500 hover:bg-red-600 btn-xs btn-circle"
            onClick={() => setOrderId("")}
          >
            <IoMdClose className="w-full h-full" />
          </button>
          <div className="pr-5 mr-1 overflow-y-auto grow">
            <div className="flex gap-2">
              <OrderInfo />
              <ShippingInfo />
              <div className="flex flex-col gap-2">
                <ProcessOrder />
                <UpdateSenderInfo />
              </div>
            </div>
            <ItemList />
            {isAdmin && <CancelOrder />}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
