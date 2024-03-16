import { TOrderItem } from "../../types/Order";
import { TShoppingCartDetail } from "../../types/ShoppingCart";
import ShoppingCartItem from "./Item";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { useEffect } from "react";

type CartTableProps = {
  items: TShoppingCartDetail[] | TOrderItem[];
  exitFn: () => void;
  removeItemFn: (
    item: TShoppingCartDetail | TOrderItem,
  ) => Promise<void> | void;
  createOrderFn: () => void;
  isLoading?: boolean;
};

function CartTable({
  items,
  exitFn,
  removeItemFn,
  createOrderFn,
  isLoading,
}: CartTableProps) {
  const selectedProducts = useSelectedCartItemStore.use.selectedProducts();
  const decreaseMultipleSelectedProducts =
    useSelectedCartItemStore.use.decreaseMultipleSelectedProducts();
  const setMerchantId = useSelectedCartItemStore.use.setMerchantId();

  useEffect(() => {
    // clear selected products when exit the page
    return () => {
      decreaseMultipleSelectedProducts(items);
      setMerchantId("");
    };
  }, [decreaseMultipleSelectedProducts, items, setMerchantId]);

  const totalPrice = selectedProducts.reduce(
    (acc, item) => acc + item.variation.currentPrice! * item.quantity,
    0,
  );
  return (
    <div className="p-1 overflow-x-auto border-2 border-gray-800 md:p-5 bg-stone-50">
      <table className="table-xs md:table lg:table-lg">
        <thead>
          <tr>
            <th></th>
            <th className="w-[30%]">商品名稱</th>
            <th className="w-[15%]">樣式</th>
            <th className="w-[15%]">規格</th>
            <th className="w-[12%]">單價</th>
            <th className="w-[7%]">數量</th>
            <th className="w-[20%]">小計</th>
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
        <button type="button" className="btn btn-xs md:btn-md" onClick={exitFn}>
          繼續購物
        </button>
        <button
          type="button"
          className="btn btn-xs md:btn-md"
          onClick={createOrderFn}
          disabled={isLoading}
        >
          去結帳
        </button>
      </div>
    </div>
  );
}

export default CartTable;
