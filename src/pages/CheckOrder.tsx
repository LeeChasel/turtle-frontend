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

  if (status === "pending") {
    return <></>;
  } else if (status === "error") {
    return <div>Error happened: {error.message}</div>;
  }

  if (!validateTokenRole(tokenCookie!, "ROLE_ANONYMITY_CUSTOMER")) {
    return <>無資料</>;
  } else {
    return (
      <>
        <div>
          訂購人資訊:
          <div>訂購人:{orderInfo?.userId}</div>
          <div>電子郵件:{orderInfo?.userEmail}</div>
          <div>訂購日期:{orderInfo?.orderDate}</div>
          <div>訂單狀態:{orderInfo?.orderStatus}</div>
          <div>訂購商品:</div>
          <table>
            <thead>
              <tr>
                <th>商品名稱</th>
                <th>價格</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>$</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default CheckOrder;
