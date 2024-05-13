import React, { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

type productData = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sold: number;
};

type ProductInfoRefProps = {
  info: productData;
};

const ProductModifiedInfoRef = forwardRef<HTMLDivElement, ProductInfoRefProps>(
  ({ info }, ref) => {
    const navigate = useNavigate();
    const content = ref ? (
      <div ref={ref}>
        <button
          onClick={() =>
            navigate("/user/modifyProductInfo?productID=" + info.id)
          }
          key={info.id}
          className="w-full"
        >
          <table
            className="w-full table text-center border border-[#263238] my-2"
            key={info.id}
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
                  <span>{info.name}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.price}</span>
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
          onClick={() =>
            navigate("/user/modifyProductInfo?productID=" + info.id)
          }
          key={info.id}
          className="w-full"
        >
          <table
            className="w-full table text-center border border-[#263238] bg-[#F9F9F9] my-2"
            key={info.id}
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
                  <span>{info.name}</span>
                </td>
                <td className="break-all text-ellipsis">
                  <span>{info.price}</span>
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
export default React.memo(ProductModifiedInfoRef);
