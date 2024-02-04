import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useVariationContext } from "../../Provider/VariationProvider";
import { useProductContext } from "../../Provider/ProductProvider";
import { showToast } from "../../utils/toastAlert";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import { TShoppingCartBrief } from "../../types/ShoppingCart";
import updateShoppingCart from "../../actions/updateShoppingCart";
import useBeOrderedProductsStore from "../../store/useBeOrderedProductsStore";

export default function PurchaseInfo() {
  const increaseProduct = useBeOrderedProductsStore(
    (state) => state.increaseProduct,
  );
  const isSpecial = useLocation().pathname.startsWith("/special");
  const [itemNumber, setItemNumber] = useState(1);
  const [buttonTriggered, setButtonTriggered] = useState(false);
  const { variation } = useVariationContext();
  const { product } = useProductContext();
  const { tokenCookie } = useUserTokenCookie();

  function modifyNumber(action: "add" | "subtract") {
    if (itemNumber === 1 && action === "subtract") return;
    if (action === "add") {
      setItemNumber((prev) => prev + 1);
    } else {
      setItemNumber((prev) => prev - 1);
    }
  }

  function handleDirectPurchase() {
    try {
      setButtonTriggered(true);
      if (!isSpecial && !tokenCookie) {
        throw new Error("身分驗證錯誤，請登入！");
      }
      increaseProduct({
        productId: product.productId!,
        variationName: variation.variationName,
        variationSpec: variation.variationSpec,
        quantity: itemNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setButtonTriggered(false);
    }
    showToast("success", "直接購買，導向創造訂單頁面");
  }

  async function handleAddToShoppingCart() {
    try {
      setButtonTriggered(true);
      if (!tokenCookie) {
        throw new Error("身分驗證錯誤，請登入！");
      }
      const newItem: TShoppingCartBrief = {
        productId: product.productId!,
        variationName: variation.variationName,
        variationSpec: variation.variationSpec,
        quantity: itemNumber,
        addedTime: new Date().toISOString(),
      };
      await updateShoppingCart([newItem], tokenCookie);
      showToast("success", `成功新增商品「${product.productName}」到購物車！`);
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setButtonTriggered(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="items-center join">
        <button
          onClick={() => modifyNumber("subtract")}
          className="join-item btn"
        >
          <GrFormSubtract className="w-7 h-7" />
        </button>
        <div className="text-xl pointer-events-none join-item btn">
          {itemNumber}
        </div>
        <button onClick={() => modifyNumber("add")} className="join-item btn">
          <GrFormAdd className="w-7 h-7" />
        </button>
      </div>

      {isSpecial ? (
        <button
          onClick={handleDirectPurchase}
          className="btn btn-lg"
          disabled={buttonTriggered}
        >
          加入訂單
        </button>
      ) : (
        <div>
          <button
            onClick={handleDirectPurchase}
            className="mr-3 btn btn-lg"
            disabled={buttonTriggered}
          >
            直接購買
          </button>
          <button
            onClick={handleAddToShoppingCart}
            className="btn btn-lg"
            disabled={buttonTriggered}
          >
            加入購物車
          </button>
        </div>
      )}
    </div>
  );
}
