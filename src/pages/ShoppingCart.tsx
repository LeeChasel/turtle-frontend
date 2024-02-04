// import { useState } from "react";
import useShoppingCart from "../hooks/useShoppingCart";
import ShoppingCartItem from "../components/ShoppingCart/Item";
// import { TOrderItem } from "../types/Order";

function ShoppingCart() {
  // const [selectedItems, setSelectedItems] = useState<TOrderItem[]>([]);
  const { data: items, error, status } = useShoppingCart();
  if (status === "pending") {
    return <p>Loading...</p>;
  } else if (status === "error") {
    return <p>Error happened: {error.message}</p>;
  }

  return (
    <main className="mt-[110px] mx-48 overflow-x-auto bg-stone-50 border-2 border-gray-800 p-5">
      <section>
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th className="w-[25%]">商品名稱</th>
              <th className="w-[15%]">樣式</th>
              <th className="w-[15%]">規格</th>
              <th className="w-[12%]">單價</th>
              <th className="w-[20%]">數量</th>
              <th className="w-[12%]">小計</th>
              {/* For delete button */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <ShoppingCartItem
                key={
                  item.variation.variationName +
                  "-" +
                  item.variation.variationSpec
                }
                product={item}
              />
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-3">
          <span>總金額：</span>
          <span className="font-bold text-red-500">NT$ 200</span>
        </div>
      </section>
      <div className="flex justify-end gap-3 mt-3">
        <button type="button" className="btn" onClick={() => alert("繼續購物")}>
          繼續購物
        </button>
        <button type="button" className="btn" onClick={() => alert("結帳畫面")}>
          去結帳
        </button>
      </div>
    </main>
  );
}

export default ShoppingCart;
