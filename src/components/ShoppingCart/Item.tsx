import { BsFillTrash3Fill } from "react-icons/bs";
import type { TShoppingCartDetail } from "../../types/ShoppingCart";
import type { TOrderItem } from "../../types/Order";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { isEmpty } from "lodash";

type ShoppingCartItemProps = {
  product: TShoppingCartDetail | TOrderItem;
  removeItemFn: (
    product: TShoppingCartDetail | TOrderItem,
  ) => Promise<void> | void;
};

function ShoppingCartItem({ product, removeItemFn }: ShoppingCartItemProps) {
  const {
    selectedProducts,
    increaseSelectedProducts,
    decreaseSelectedProducts,
    merchantId,
    setMerchantId,
  } = useSelectedCartItemStore();
  const imageSrc =
    import.meta.env.VITE_TURTLE_PRODUCT_IMAGE_URL +
    "/" +
    product.product.productId +
    "/" +
    product.variation.bannerImage?.imageId;

  const currentPrice = product.variation.currentPrice!;
  const quantity = product.quantity;
  const subtotal = currentPrice * quantity;
  const shouldDisabled =
    !isEmpty(merchantId) && merchantId !== product.product.merchantId;

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
      setMerchantId(product.product.merchantId);
      increaseSelectedProducts(product);
    } else {
      decreaseSelectedProducts(product);
      if (selectedProducts.length === 0) {
        setMerchantId("");
      }
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
            disabled={shouldDisabled}
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
                loading="lazy"
              />
            </div>
          </div>
          <div
            className="font-bold line-clamp-2"
            title={product.product.productName}
          >
            {product.product.productName}
          </div>
        </div>
      </td>
      <td>
        <span className="line-clamp-2" title={product.variation.variationName}>
          {product.variation.variationName}
        </span>
      </td>
      <td>
        <span className="line-clamp-2" title={product.variation.variationSpec}>
          {product.variation.variationSpec}
        </span>
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
