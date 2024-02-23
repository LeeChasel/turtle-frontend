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
  }*/

  //const orderstatus = orderStatus(orderInfo!.orderStatus);

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
        <div className="justify-center items-center px-[260px]  pt-10">
          <div className="bg-gray-50 bg-center">
            訂單資訊
            <div className="border-2 border-black"></div>
            <div>訂單編號:{orderInfo.orderId}</div>
            <div>訂購日期:{orderInfo.orderDate}</div>
            <div>收件人姓名:{orderInfo.shippingInfo.receiverName}</div>
            <div>收件人電話:{orderInfo.shippingInfo.receiverCellPhone}</div>
            <div>訂單狀態:{}</div>
            <div>貨態查詢:{}</div>
            購買明細
            <div className="border-2 border-black"></div>
            <table>
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th>樣式</th>
                  <th>規格</th>
                  <th>單價</th>
                  <th>數量</th>
                  <th>小計</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}

export default CheckOrder;
