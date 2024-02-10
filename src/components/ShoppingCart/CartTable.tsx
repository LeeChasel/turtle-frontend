import { TOrderItem } from "../../types/Order";
import { TShoppingCartDetail } from "../../types/ShoppingCart";
import ShoppingCartItem from "./Item";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { isEqual } from "lodash";

type CartTableProps = {
  items: TShoppingCartDetail[] | TOrderItem[];
  exitFn: () => void;
  removeItemFn: (
    item: TShoppingCartDetail | TOrderItem,
  ) => Promise<void> | void;
  createOrderFn: () => void;
};

function CartTable({
  items,
  exitFn,
  removeItemFn,
  createOrderFn,
}: CartTableProps) {
  const totalPrice = items.reduce(
    (acc, item) => acc + item.variation.currentPrice! * item.quantity,
    0,
  );

  const { selectedProducts, increaseMultipleSelectedProducts } =
    useSelectedCartItemStore();
  const isChecked =
    isEqual(items, selectedProducts) && selectedProducts.length > 0;

  function toggleCheckAll(e: React.ChangeEvent<HTMLInputElement>) {
    const checkboxState = e.target.checked;
    if (checkboxState) {
      increaseMultipleSelectedProducts(items);
    } else {
      increaseMultipleSelectedProducts([]);
    }
  }
  return (
    <div className="p-5 overflow-x-auto border-2 border-gray-800 bg-stone-50">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={isChecked}
                  onChange={toggleCheckAll}
                />
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
          {items.map((item) => (
            <ShoppingCartItem
              key={
                item.variation.variationName +
                "-" +
                item.variation.variationSpec
              }
              product={item}
              removeItemFn={removeItemFn}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-end mt-3">
        <span>總金額：</span>
        <span className="font-bold text-red-500">
          NT$ {totalPrice.toLocaleString()}
        </span>
      </div>
      <div className="flex justify-end gap-3 mt-3">
        <button type="button" className="btn" onClick={exitFn}>
          繼續購物
        </button>
        <button type="button" className="btn" onClick={createOrderFn}>
          去結帳
        </button>
      </div>
    </div>
  );
}

export default CartTable;
