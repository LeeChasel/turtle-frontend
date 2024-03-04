import { useSearchParams } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";
import { getPaymentDetail } from "../actions/getPaymentDetail";

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

  async function payment(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const form = document.createElement("form");
    const paymentDetails = await getPaymentDetail(orderId!);
    const key = [
      "MerchantID",
      "MerchantTradeNo",
      "MerchantTradeDate",
      "PaymentType",
      "TotalAmount",
      "TradeDesc",
      "ItemName",
      "ReturnURL",
      "ChoosePayment",
      "CheckMacValue",
      "EncryptType",
      "PaymentInfoURL",
    ];
    const value = [
      paymentDetails.MerchantID,
      paymentDetails.MerchantTradeNo,
      paymentDetails.MerchantTradeDate,
      paymentDetails.PaymentType,
      paymentDetails.TotalAmount,
      paymentDetails.TradeDesc,
      paymentDetails.ItemName,
      paymentDetails.ReturnURL,
      paymentDetails.ChoosePayment,
      paymentDetails.CheckMacValue,
      paymentDetails.EncryptType,
      paymentDetails.PaymentInfoURL,
    ];
    form.setAttribute("method", "post");
    form.setAttribute(
      "action",
      "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
    );

    for (let i = 0; i < key.length; i++) {
      const input = document.createElement("input");
      input.setAttribute("name", key[i]);
      input.setAttribute("value", value[i] + "");
      form.appendChild(input);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
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
        <div className="w-fit px-[11.5rem] lg:px-[16.25rem] items-center pt-10 text-base text-[#263238]">
          <div className="md:p-5 lg:p-5 overflow-x-auto">
            <table className="w-fit table text-center border-2 border-[#263238]">
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
          </div>
          <div className="flex justify-end mt-3 text-right">
            <span>總金額：</span>
            <span className="font-bold text-red-500">
              NT${orderInfo.totalPrice}
            </span>
          </div>
          <p className="text-right">
            <button className="btn  btn-outline shadow-lg" onClick={payment}>
              立即付款
            </button>
          </p>
        </div>
      </>
    );
  }
}

export default Checkout;
