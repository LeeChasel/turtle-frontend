import { useSearchParams } from "react-router-dom";
//import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";

function CheckOrder() {
  const [searchParams] = useSearchParams();
  const tokenCookie =
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2NWIzODgyMzk5MDc3ODRmYTlmOTVjN2UiLCJyb2xlIjpbIlJPTEVfQU5PTllNSVRZX0NVU1RPTUVSIl0sImlzcyI6ImFub255bWl0eUB0dXJ0bGVsYXp5LmNvbSIsImlhdCI6MTcwNzkyOTA4NSwianRpIjoiMmNkYjM3ZWEtN2NkMy00NTc4LTgxYTQtMjc4M2MxMzQ3MmQxIiwiZXhwIjoxNzA3OTU3ODg1fQ.SG5oXPG4KeusKP9LFgavjnN6rjV_t4Jm1FhOXoD4qTE5gKwIhgp5R5paXQuI5yHdwVXBtKt3owO9hRqrX86aqg";
  const orderID = searchParams.get("orderID");
  const email = searchParams.get("email");
  const {
    data: orderInfo,
    status,
    error,
  } = useOrderChecking(orderID!, email!, tokenCookie);

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
