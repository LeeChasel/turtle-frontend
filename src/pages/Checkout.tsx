import { useSearchParams } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useOrderChecking from "../hooks/useAnonymityOrderChecking";
import { getPaymentDetail } from "../actions/getPaymentDetail";
import { OrderStatus } from "@/types/Order";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [searchParams] = useSearchParams();
  const { tokenCookie } = useUserTokenCookie();
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("userEmail");
  const navigate = useNavigate();
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
    if (orderInfo.orderStatus === OrderStatus.PAYMENT_REQUIRED) {
      return (
        <>
          <div className="mx-5 grid lg:justify-center md:justify-center items-center pt-10 text-xs md:mx-10 md:text-base lg:text-lg lg:mx-[200px]">
            <div className="overflow-x-auto">
              <table className="table table-fixed text-center border-2 border-[#263238] bg-[#F9F9F9]">
                <thead>
                  <tr>
                    <th className="w-[30%]">商品名稱</th>
                    <th className="w-[14%]">樣式</th>
                    <th className="w-[14%]">規格</th>
                    <th className="w-[14%]">單價</th>
                    <th className="w-[14%]">數量</th>
                    <th className="w-[14%]">小計</th>
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
            </div>
            <div className="flex justify-end mt-3 text-right">
              <span>總金額：</span>
              <span className="font-bold text-red-500">
                NT${orderInfo.totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-right">
              <button
                className="btn  btn-outline shadow-lg btn-sm md:btn-md lg:btn-md"
                onClick={payment}
              >
                立即付款
              </button>
            </p>
          </div>
        </>
      );
    } else {
      navigate("*");
    }
  }
}

export default Checkout;
