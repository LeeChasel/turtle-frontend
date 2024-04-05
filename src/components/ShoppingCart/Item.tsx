import { BsFillTrash3Fill } from "react-icons/bs";
import type { TShoppingCartDetail } from "../../types/ShoppingCart";
import type { CartItem } from "../../types/Order";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { isEmpty } from "lodash";

type ShoppingCartItemProps = {
  product: TShoppingCartDetail | CartItem;
  removeItemFn: (
    product: TShoppingCartDetail | CartItem,
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
            className="checkbox checkbox-sm md:checkbox-md"
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
          <div className="tooltip" data-tip={product.product.productName}>
            <span className="line-clamp-2 font-bold">
              {product.product.productName}
            </span>
          </div>
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip={product.variation.variationName}>
          <span className="line-clamp-2">
            {product.variation.variationName}
          </span>
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip={product.variation.variationSpec}>
          <span className="line-clamp-2">
            {product.variation.variationSpec}
          </span>
        </div>
      </td>
      <td>
        <div
          className="tooltip"
          data-tip={`NT$ ${currentPrice.toLocaleString()}`}
        >
          NT$ {currentPrice.toLocaleString()}
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip={quantity.toLocaleString()}>
          {quantity.toLocaleString()}
        </div>
      </td>
      <td>
        <div className="tooltip" data-tip={`NT$ ${subtotal.toLocaleString()}`}>
          NT$ {subtotal.toLocaleString()}
        </div>
      </td>
      <td>
        <button type="button" onClick={removeItem}>
          <BsFillTrash3Fill />
        </button>
      </td>
    </tr>
  );
}

export default ShoppingCartItem;
