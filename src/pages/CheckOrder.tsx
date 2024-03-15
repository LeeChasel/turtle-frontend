import { useSearchParams } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";
import { useNavigate } from "react-router-dom";
import { transformOrderStatus } from "@/utils/transformStatusEnum";

function CheckOrder() {
  const [searchParams] = useSearchParams();
  const { tokenCookie } = useUserTokenCookie();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("userEmail");
  const {
    data: orderInfo,
    status,
    error,
  } = useOrderChecking(orderId!, email!, tokenCookie!);
  const navigate = useNavigate();

  /*function orderStatus(status: string) {
    if (status === "SHIPPED") {
      return "運送中";
    } else if (status === "PAIED") {
      return "已付款";
    } else if (status === "PAYMENT_REQUIRED") {
      return "待付款";
    } else if (status === "COMPLETE_REQUIRED") {
      return "待填寫訂單資訊";
    } else {
      return "取消訂單";
    }
  }

  const orderstatus = orderStatus(orderInfo!.orderStatus);*/

  const orderStatus = transformOrderStatus(orderInfo!.orderStatus);

  function trace() {
    const last = orderInfo?.logisticsOrderStatus.length;
    if (last == 0) {
      return "-";
    } else if (
      orderInfo?.logisticsOrderStatus[last! - 1].bookingNote.length != 0
    ) {
      return orderInfo?.logisticsOrderStatus[last! - 1].bookingNote;
    } else {
      return (
        "CVSPaymentNo:" +
        orderInfo?.logisticsOrderStatus[last! - 1].cvspaymentNo +
        ",CVSValidationNo:" +
        orderInfo?.logisticsOrderStatus[last! - 1].cvsvalidationNo
      );
    }
  }

  function cancel() {
    navigate(-1);
  }

  const orderTrace = trace();

  if (status === "pending") {
    return <></>;
  } else if (status === "error") {
    return <div>Error happened: {error.message}</div>;
  }

  if (!validateTokenRole(tokenCookie, "ROLE_ANONYMITY_CUSTOMER")) {
    return <>無資料</>;
  } else {
    return (
      <>
        <div className="mx-[20px] grid justify-center md:justify-center items-center pt-10 text-xs md:mx-10 md:text-base lg:text-lg lg:mx-[200px] gap-3">
          <div className="bg-[#F9F9F9] bg-center text-[#263238] w-[280px] md:w-fit lg:w-fit ">
            <div className="mx-8">訂單資訊</div>
            <div className="border mx-6 border-black w-[90%]"></div>
            <div> </div>
            <div className="grid grid-flow-col grid-rows-6 my-2 text-center">
              <div>訂單編號:</div>
              <div>訂購日期:</div>
              <div>收件人姓名:</div>
              <div>收件人電話:</div>
              <div>訂單狀態:</div>
              <div>貨態查詢:</div>
              <div className="font-bold text-red-500">{orderInfo.orderId}</div>
              <div>{orderInfo.orderDate}</div>
              <div>{orderInfo.shippingInfo.receiverName}</div>
              <div>{orderInfo.shippingInfo.receiverCellPhone}</div>
              <div>{orderStatus}</div>
              <div>{orderTrace}</div>
            </div>

            <div className="mx-8">購買明細</div>
            <div className="border mx-6 border-black w-[90%]"></div>
            <div className="px-1 overflow-x-auto">
              <table className="table text-center table-fixed">
                <thead>
                  <tr>
                    <th className="w-[27%]">商品名稱</th>
                    <th className="w-[17%]">樣式</th>
                    <th className="w-[17%]">規格</th>
                    <th className="w-[17%]">單價</th>
                    <th className="w-[10%]">數量</th>
                    <th className="w-[17%]">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {orderInfo.items?.map((object) => (
                    <tr
                      key={object.productId}
                      className="text-xs md:text-base lg:text-lg"
                    >
                      <td className="break-all text-ellipsis">
                        <span>{object.productName}</span>
                      </td>
                      <td className="break-all text-ellipsis">
                        <span>{object.variationName}</span>
                      </td>
                      <td className="break-all text-ellipsis">
                        {object.variationSpec}
                      </td>
                      <td className="text-ellipsis">
                        {object.currentPrice.toLocaleString()}
                      </td>
                      <td className="text-ellipsis">
                        {object.quantity.toLocaleString()}
                      </td>
                      <td className="text-ellipsis">
                        {(
                          object.currentPrice * object.quantity
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end mt-3">
                <span>總金額：</span>
                <span className="font-bold text-red-500">
                  NT${orderInfo.totalPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-right">
            <button
              className="btn btn-outline btn-sm md:btn-md lg:btn-md"
              onClick={cancel}
            >
              上一頁
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default CheckOrder;
