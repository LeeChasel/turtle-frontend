import { useSearchParams } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";
import { useNavigate } from "react-router-dom";

function Checkout() {
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

  function cancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate("/");
  }

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
        <div className="w-screen items-center px-[16.25rem] pt-10 text-base  text-[#263238] ">
          <div className="p-5 overflow-x-auto">
            <table className="table text-center border-2 border-[#263238]">
              <thead>
                <tr>
                  <th className="w-[25%]">商品名稱</th>
                  <th className="w-[20%]">樣式</th>
                  <th className="w-[20%]">規格</th>
                  <th className="w-[20%]">單價</th>
                  <th className="w-[20%]">數量</th>
                  <th className="w-[20%]">小計</th>
                </tr>
              </thead>
              <tbody>
                {orderInfo.items?.map((object) => (
                  <tr key={object.productId}>
                    <td className="break-all text-ellipsis">
                      <span>{object.productName}</span>
                    </td>
                    <td className="break-all text-ellipsis">
                      <span>{object.variationName}</span>
                    </td>
                    <td className="break-all text-ellipsis">
                      {object.variationSpec}
                    </td>
                    <td>{object.currentPrice.toLocaleString()}</td>
                    <td>{object.quantity.toLocaleString()}</td>
                    <td>
                      {(object.currentPrice * object.quantity).toLocaleString()}
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
          <p className="text-right">
            <button className="btn" onClick={cancel}>
              立即付款
            </button>
          </p>
        </div>
      </>
    );
  }
}

export default Checkout;
