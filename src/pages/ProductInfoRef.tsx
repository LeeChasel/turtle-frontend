import useSelectedOrder from "@/store/useSelectedOrder";
import { TProduct } from "@/types/Product";
import React, { forwardRef } from "react";

type ProductInfoRefProps = {
  info: TProduct;
};

const ProductInfoRef = forwardRef<HTMLDivElement, ProductInfoRefProps>(
  ({ info }, ref) => {
    const setSelectedOrderId = useSelectedOrder.use.setOrderId();
    const content = ref ? (
      <div ref={ref}>
        <button
          onClick={() => setSelectedOrderId(info.productId!)}
          key={info.productId}
          className="w-full"
        >
          <table
            className="w-full table text-center border border-[#263238] my-2"
            key={info.productId}
          >
            <thead>
              <tr>
                <th className="w-[25%]">商品名稱</th>
                <th className="w-[25%]">價錢</th>
                <th className="w-[25%]">商品數量</th>
                <th className="w-[25%]">已售出數量</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="break-all text-ellipsis">
                  <span>{info.productName}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.currentPrice}</span>
                </td>
                <td className="break-all text-ellipsis">{info.stock}</td>
                <td>{info.sold}</td>
              </tr>
            </tbody>
          </table>
        </button>
      </div>
    ) : (
      <div>
        <button
          onClick={() => setSelectedOrderId(info.productId!)}
          key={info.productId}
          className="w-full"
        >
          <table
            className="w-full table text-center border border-[#263238] bg-[#F9F9F9] my-2"
            key={info.productId}
          >
            <thead>
              <tr>
                <th className="w-[25%]">商品名稱</th>
                <th className="w-[25%]">價錢</th>
                <th className="w-[25%]">商品數量</th>
                <th className="w-[25%]">已售出數量</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="break-all text-ellipsis">
                  <span>{info.productName}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.currentPrice}</span>
                </td>
                <td className="break-all text-ellipsis">{info.stock}</td>
                <td>{info.sold}</td>
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
export default React.memo(ProductInfoRef);
