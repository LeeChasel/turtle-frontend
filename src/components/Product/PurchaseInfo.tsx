import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const hasCustomization = product.customizations.length > 0;
  const hasRequiredCustomization = product.customizations.some(
    (item) => item.required,
  );

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
        product: product as TBanner,
        quantity: itemNumber,
        variation: variation,
        customizations: [],
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

  const customizationLink = `${isSpecial ? "/special" : ""}/customization`;
  const customizationState = useMemo(
    () => ({
      product: product as TBanner,
      variation: variation,
      quantity: itemNumber,
      customization: product.customizations,
    }),
    [product, variation, itemNumber],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="items-center join">
        <button
          onClick={() => modifyNumber("subtract")}
          className="bg-[#263238]  text-white join-item btn btn-sm md:btn-md lg:btn-lg"
        >
          <GrFormSubtract className="md:w-7 md:h-7" />
        </button>
        <div className="bg-[#263238]  text-white pointer-events-none md:text-xl lg:text-2xl join-item btn btn-sm md:btn-md lg:btn-lg">
          {itemNumber}
        </div>
        <button
          onClick={() => modifyNumber("add")}
          className="bg-[#263238]  text-white join-item btn btn-sm md:btn-md lg:btn-lg"
        >
          <GrFormAdd className="md:w-7 md:h-7" />
        </button>
      </div>

      {/* disable for prod env */}
      {import.meta.env.MODE !== "production" && (
        <div className="flex flex-col gap-2 md:gap-3 md:flex-row">
          {!hasRequiredCustomization && (
            <>
              {isSpecial ? (
                <button
                  onClick={handleAnonymousAddToCart}
                  className="btn bg-[#263238] text-white btn-sm md:btn-md lg:btn-lg"
                  disabled={buttonTriggered}
                >
                  加入訂單
                </button>
              ) : (
                <>
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
                </>
              )}
            </>
          )}
          {hasCustomization && (
            <Link
              className="btn bg-[#263238] text-white btn-sm md:btn-md lg:btn-lg"
              to={customizationLink}
              state={customizationState}
            >
              前往客製化
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
