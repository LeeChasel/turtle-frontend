import { getOrdersByMerchant } from "@/actions/getOrdersByMerchant";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderInfoForMerchant, OrderStatus } from "@/types/Order";
import { showToast } from "@/utils/toastAlert";
import { useState } from "react";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date-3";
import OrderInfoDialog from "./OrderInfoDialog/Index";

function OrderProcessing() {
  const setSelectedOrderId = useSelectedOrder.use.setOrderId();
  const { tokenCookie } = useUserTokenCookie();
  const defaultDate = new Date();
  const [year, setYear] = useState(defaultDate.getFullYear());
  const [month, setMonth] = useState(defaultDate.getMonth());
  const [day, setDay] = useState(defaultDate.getDate());
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.ALL);

  const [orders, setOrders] = useState<OrderInfoForMerchant[]>();

  function onChangeYear(value: number) {
    setYear(value);
  }

  function onChangeMonth(value: number) {
    setMonth(value);
  }

  function onChangeDay(value: number) {
    setDay(value);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const date = new Date(year, month, day);
    try {
      setOrders(
        await getOrdersByMerchant(
          tokenCookie!,
          orderStatus,
          1,
          date.getTime() / 1000,
        ),
      );
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  return (
    <>
      <form
        className="bg-[#F9F9F9] border border-black grid grid-cols-7 gap-4 pl-12 grow h-20 text-center"
        onSubmit={submit}
      >
        <div className="m-auto">訂單狀態：</div>
        <div className="m-auto">
          <select
            className="border-2 border-black"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
          >
            <option value="ALL">全部</option>
            <option value="WITHDRAWN">已收款</option>
            <option value="CLOSED">可收款</option>
            <option value="RECEIVED">買家已收到貨</option>
            <option value="SHIPPED">運送中</option>
            <option value="PAIED">已付款</option>
            <option value="PAYMENT_REQUIRED">待付款</option>
            <option value="COMPLETE_REQUIRED">待填寫訂單資訊</option>
            <option value="CANCEL">取消訂單</option>
          </select>
        </div>
        <div className="m-auto">結帳日期：</div>
        <div className="m-auto">
          <YearPicker
            defaultValue={""}
            start={2010} // default is 1900
            reverse // default is ASCENDING
            required={true} // default is false
            value={year} // mandatory
            onChange={onChangeYear}
          />
        </div>
        <div className="m-auto ">
          <MonthPicker
            defaultValue={""}
            numeric // to get months as numbers
            short // default is full name
            caps // default is Titlecase
            endYearGiven // mandatory if end={} is given in YearPicker
            year={year} // mandatory
            required={true} // default is false
            value={month} // mandatory
            onChange={onChangeMonth}
          />
        </div>
        <div className="m-auto">
          <DayPicker
            defaultValue={""}
            year={year} // mandatory
            month={month} // mandatory
            endYearGiven // mandatory if end={} is given in YearPicker
            required={true} // default is false
            value={day} // mandatory
            onChange={onChangeDay}
          />
        </div>
        <div className="m-auto">
          <button className="btn">查詢</button>
        </div>
      </form>
      {orders?.length === 0 ? (
        <div>無資料</div>
      ) : (
        orders?.map((object) => (
          <button
            onClick={() => setSelectedOrderId(object.orderId)}
            key={object.orderId}
            className="w-full"
          >
            <table
              className="w-fit table text-center border border-[#263238] bg-[#F9F9F9] my-2"
              key={object.orderId}
            >
              <thead>
                <tr>
                  <th className="w-[25%]">訂單編號</th>
                  <th className="w-[20%]">下單日期</th>
                  <th className="w-[20%]">訂單狀態</th>
                  <th className="w-[20%]">訂單完成日期</th>
                  <th className="w-[20%]">結帳日期</th>
                  <th className="w-[20%]">訂單總金額</th>
                  <th className="w-[20%]">可領取金額</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-red-500 break-all text-ellipsis">
                    <span>{object.orderId}</span>
                  </td>
                  <td className="break-all text-ellipsis">
                    <span>{object.orderDate}</span>
                  </td>
                  <td className="break-all text-ellipsis">
                    {object.orderStatus}
                  </td>
                  <td>{object.orderFinishTimestamp}</td>
                  <td>{object.merchantCheckoutTimestamp}</td>
                  <td>NT${object.totalPrice.toLocaleString()}</td>
                  <td>
                    {object.merchantCheckoutTotalPrice !== null && (
                      <p>
                        NT$ {object.merchantCheckoutTotalPrice.toLocaleString()}
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </button>
        ))
      )}

      <OrderInfoDialog />
    </>
  );
}

export default OrderProcessing;
