import useSelectedOrder from "@/store/useSelectedOrder";
import { OrderInfoForMerchant } from "@/types/Order";
import React, { forwardRef } from "react";

type OrderInfoRefProps = {
  info: OrderInfoForMerchant;
};

const OrderInfoRef = forwardRef<HTMLDivElement, OrderInfoRefProps>(
  ({ info }, ref) => {
    const setSelectedOrderId = useSelectedOrder.use.setOrderId();
    const content = ref ? (
      <div ref={ref}>
        <button
          onClick={() => setSelectedOrderId(info.orderId)}
          key={info.orderId}
          className="w-full"
        >
          <table
            className="w-fit table text-center border border-[#263238] bg-[#F9F9F9] my-2"
            key={info.orderId}
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
                  <span>{info.orderId}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.orderDate}</span>
                </td>
                <td className="break-all text-ellipsis">{info.orderStatus}</td>
                <td>{info.orderFinishTimestamp}</td>
                <td>{info.merchantCheckoutTimestamp}</td>
                <td>NT${info.totalPrice.toLocaleString()}</td>
                <td>
                  {info.merchantCheckoutTotalPrice !== null && (
                    <p>
                      NT$ {info.merchantCheckoutTotalPrice.toLocaleString()}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </button>
      </div>
    ) : (
      <div>
        <button
          onClick={() => setSelectedOrderId(info.orderId)}
          key={info.orderId}
          className="w-full"
        >
          <table
            className="w-fit table text-center border border-[#263238] bg-[#F9F9F9] my-2"
            key={info.orderId}
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
                  <span>{info.orderId}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.orderDate}</span>
                </td>
                <td className="break-all text-ellipsis">{info.orderStatus}</td>
                <td>{info.orderFinishTimestamp}</td>
                <td>{info.merchantCheckoutTimestamp}</td>
                <td>NT${info.totalPrice.toLocaleString()}</td>
                <td>
                  {info.merchantCheckoutTotalPrice !== null && (
                    <p>
                      NT$ {info.merchantCheckoutTotalPrice.toLocaleString()}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </button>
      </div>
    );

    return content;
  },
);

// React.memo to prevent re-render this component when add new product to original product array
export default React.memo(OrderInfoRef);
