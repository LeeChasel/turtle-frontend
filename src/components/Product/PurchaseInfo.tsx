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
import { TBanner } from "../../types/Product";
import login from "../../actions/login";
import { anonymousUser } from "../../utils/anonymity";

export default function PurchaseInfo() {
  const increaseProduct = useBeOrderedProductsStore(
    (state) => state.increaseProduct,
  );
  const isSpecial = useLocation().pathname.startsWith("/special");
  const [itemNumber, setItemNumber] = useState(1);
  const [buttonTriggered, setButtonTriggered] = useState(false);
  const { variation } = useVariationContext();
  const { product } = useProductContext();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();

  function modifyNumber(action: "add" | "subtract") {
    if (itemNumber === 1 && action === "subtract") return;
    if (action === "add") {
      setItemNumber((prev) => prev + 1);
    } else {
      setItemNumber((prev) => prev - 1);
    }
  }

  async function handleAnonymousAddToCart() {
    try {
      setButtonTriggered(true);
      if (!tokenCookie) {
        const jwt = await login(anonymousUser, "匿名登入帳密錯誤");
        setUserTokenCookie(jwt);
      }
      increaseProduct({
        // TProduct type has all the properties of TBanner
        product: product as TBanner,
        variation: variation,
        quantity: itemNumber,
      });
      showToast("success", "加入購物車成功");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setButtonTriggered(false);
    }
  }

  function handleDirectPurchase() {
    try {
      setButtonTriggered(true);
      if (!tokenCookie) {
        throw new Error("身分驗證錯誤，請登入！");
      }
      showToast("success", "直接購買，導向創造訂單頁面");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setButtonTriggered(false);
    }
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
          className="join-item btn btn-sm md:btn-md lg:btn-lg"
        >
          <GrFormSubtract className="md:w-7 md:h-7" />
        </button>
        <div className="pointer-events-none md:text-xl lg:text-2xl join-item btn btn-sm md:btn-md lg:btn-lg">
          {itemNumber}
        </div>
        <button
          onClick={() => modifyNumber("add")}
          className="join-item btn btn-sm md:btn-md lg:btn-lg"
        >
          <GrFormAdd className="md:w-7 md:h-7" />
        </button>
      </div>

      {isSpecial ? (
        <button
          onClick={handleAnonymousAddToCart}
          className="w-1/2 btn bg-[#263238] text-white btn-sm md:btn-md lg:btn-lg"
          disabled={buttonTriggered}
        >
          加入訂單
        </button>
      ) : (
        <div className="flex flex-col gap-2 md:gap-3 md:flex-row">
          <button
            onClick={handleDirectPurchase}
            className="btn bg-[#263238] text-white btn-sm md:btn-md lg:btn-lg"
            disabled={buttonTriggered}
          >
            直接購買
          </button>
          <button
            onClick={handleAddToShoppingCart}
            className="btn bg-[#263238] text-white btn-sm md:btn-md lg:btn-lg"
            disabled={buttonTriggered}
          >
            加入購物車
          </button>
        </div>
      )}
    </div>
  );
}
