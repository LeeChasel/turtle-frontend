import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";
function Checkout() {
  const { tokenCookie } = useUserTokenCookie();
  const {
    data: orderInfo,
    status,
    error,
  } = useOrderChecking(orderId!, email!, tokenCookie!);
  if (!validateTokenRole(tokenCookie, "ROLE_ANONYMITY_CUSTOMER")) {
    return <>無資料</>;
  } else {
    return (
      <>
        <table className="table text-center">
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
                <td>NT$ {object.currentPrice.toLocaleString()}</td>
                <td>{object.quantity.toLocaleString()}</td>
                <td>
                  NT$ {(object.currentPrice * object.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <span>總金額：</span>
          <span className="font-bold text-red-500">{orderInfo.totalPrice}</span>
        </div>
      </>
    );
  }
}
export default Checkout();
