import { useSearchParams } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";

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

  function orderStatus(status: string) {
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

  const orderstatus = orderStatus(orderInfo!.orderStatus);

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
        <div className="items-center px-[260px]  pt-10">
          <div className="bg-gray-50 bg-center ">
            <div className="mx-10">訂單資訊</div>
            <div className="border mx-9 border-black w-[90%]"></div>
            <div> </div>
            <div className="grid grid-rows-6 grid-flow-col my-2">
              <div className="text-center">訂單編號:</div>
              <div className="text-center">訂購日期:</div>
              <div className="text-center">收件人姓名:</div>
              <div className="text-center">收件人電話:</div>
              <div className="text-center">訂單狀態:</div>
              <div className="text-center">貨態查詢:</div>
              <div className="font-bold text-red-500">{orderInfo.orderId}</div>
              <div>{orderInfo.orderDate}</div>
              <div>{orderInfo.shippingInfo.receiverName}</div>
              <div>{orderInfo.shippingInfo.receiverCellPhone}</div>
              <div>{orderstatus}</div>
              <div>{}</div>
            </div>

            <div className="mx-10">購買明細</div>
            <div className="border mx-9 border-black w-[90%]"></div>
            <div className="p-5 overflow-x-auto">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th className="w-[25%]">商品名稱</th>
                    <th className="w-[15%]">樣式</th>
                    <th className="w-[15%]">規格</th>
                    <th className="w-[12%]">單價</th>
                    <th className="w-[20%]">數量</th>
                    <th className="w-[12%]">小計</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
              <div className="flex justify-end mt-3">
                <span>總金額：</span>
                <span className="font-bold text-red-500">100</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default CheckOrder;
