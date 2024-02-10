import { BsFillTrash3Fill } from "react-icons/bs";
import type { TShoppingCartDetail } from "../../types/ShoppingCart";
import type { TOrderItem } from "../../types/Order";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";

type ShoppingCartItemProps = {
  product: TShoppingCartDetail | TOrderItem;
  removeItemFn: (
    product: TShoppingCartDetail | TOrderItem,
  ) => Promise<void> | void;
};

function ShoppingCartItem({ product, removeItemFn }: ShoppingCartItemProps) {
  const imageSrc =
    import.meta.env.VITE_TURTLE_BACKEND_IMAGE_URL +
    "/" +
    product.variation.bannerImage?.imageId;

  const currentPrice = product.variation.currentPrice!;
  const quantity = product.quantity;
  const subtotal = currentPrice * quantity;

  const {
    selectedProducts,
    increaseSelectedProducts,
    decreaseSelectedProducts,
  } = useSelectedCartItemStore();
  const isChecked = !!selectedProducts.find(
    (selectedProduct) =>
      product.product.productId === selectedProduct.product.productId &&
      product.variation.variationName ===
        selectedProduct.variation.variationName &&
      product.variation.variationSpec ===
        selectedProduct.variation.variationSpec,
  );

  function toggleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const checkboxState = e.target.checked;
    if (checkboxState) {
      increaseSelectedProducts(product);
    } else {
      decreaseSelectedProducts(product);
    }
  }

  async function removeItem() {
    await removeItemFn(product);
    decreaseSelectedProducts(product);
    showToast("success", `刪除「${product.product.productName}」成功`);
  }

  return (
    <tr>
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked}
            onChange={toggleCheckbox}
          />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 mask">
              <img
                src={imageSrc}
                alt={product.variation.bannerImage?.imageId}
              />
            </div>
          </div>
          <div className="font-bold">{product.product.productName}</div>
        </div>
      </td>
      <td className="break-all text-ellipsis">
        <span>{product.variation.variationName}</span>
      </td>
      <td className="break-all text-ellipsis">
        {product.variation.variationSpec}
      </td>
      <td>NT$ {currentPrice.toLocaleString()}</td>
      <td>{quantity.toLocaleString()}</td>
      <td>NT$ {subtotal.toLocaleString()}</td>
      <td>
        <button type="button" onClick={removeItem}>
          <BsFillTrash3Fill />
        </button>
      </td>
    </tr>
  );
}

export default ShoppingCartItem;
