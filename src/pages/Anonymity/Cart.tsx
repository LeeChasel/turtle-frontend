import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import CartTable from "../../components/ShoppingCart/CartTable";
import useAnonymousProductStore from "../../store/useAnonymousProductStore";
import useBeOrderedProductsStore from "../../store/useBeOrderedProductsStore";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { z } from "zod";
import { createOrderForAnonymity } from "../../actions/createOrder";
import { CartItem } from "@/types/Order";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import login from "../../actions/login";
import { anonymousUser } from "../../utils/anonymity";
import { TShoppingCartDetail } from "@/types/ShoppingCart";

function OrderCart() {
  const [isLoading, setIsLoading] = useState(false);
  const products = useBeOrderedProductsStore.use.products();
  const removeProducts = useBeOrderedProductsStore.use.removeProducts();
  const productId = useAnonymousProductStore((state) => state.productId);
  const { selectedProducts, decreaseMultipleSelectedProducts } =
    useSelectedCartItemStore();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();
  const defaultUserEmail = useAnonymousProductStore((state) => state.userEmail);
  const updateUserEmail = useAnonymousProductStore(
    (state) => state.updateUserEmail,
  );

  function exitCart() {
    navigate(`/special/product/${productId}`);
  }

  const modalRef = useRef<HTMLDialogElement>(null);
  const userEmailRef = useRef<HTMLInputElement>(null);

  function openDialog() {
    if (selectedProducts.length === 0) {
      showToast("info", "請選擇商品");
      return;
    }
    userEmailRef.current!.value = defaultUserEmail;
    modalRef.current?.showModal();
  }

  function removeProduct(item: TShoppingCartDetail | CartItem) {
    removeProducts({
      product: item.product,
      variation: item.variation,
      quantity: item.quantity,
      customizations: "customizations" in item ? item.customizations : [],
    });
  }

  async function createOrder() {
    // for unexpected situation
    if (!tokenCookie) {
      const jwt = await login(anonymousUser);
      setUserTokenCookie(jwt);
    }

    try {
      // validate email
      const userEmail = z.string().email().parse(userEmailRef.current?.value);

      setIsLoading(true);
      updateUserEmail(userEmail);

      const orderItems: CartItem[] = [];
      selectedProducts.forEach((product) => {
        orderItems.push({
          product: product.product,
          quantity: product.quantity,
          variation: product.variation,
          customizations:
            "customizations" in product ? product.customizations : [],
        });
      });

      const orderResponse = await createOrderForAnonymity(
        {
          items: orderItems.map((orderItem) => ({
            productId: orderItem.product.productId!,
            quantity: orderItem.quantity,
            variationName: orderItem.variation.variationName,
            variationSpec: orderItem.variation.variationSpec,
            customizations: orderItem.customizations,
          })),
        },
        userEmail,
        tokenCookie!,
      );

      // clear cart
      removeProducts(
        selectedProducts.map((selectedProduct) => ({
          product: selectedProduct.product,
          variation: selectedProduct.variation,
          quantity: selectedProduct.quantity,
          customizations:
            "customizations" in selectedProduct
              ? selectedProduct.customizations
              : [],
        })),
      );
      decreaseMultipleSelectedProducts(selectedProducts);
      modalRef.current?.close();

      showToast("success", `訂單編號：「${orderResponse.orderId}」建立成功`);

      const searchParams = new URLSearchParams();
      searchParams.append("orderId", orderResponse.orderId);
      searchParams.append("userEmail", userEmail);
      navigate(`/special/fillInOrder?${searchParams.toString()}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast("error", "請輸入正確的電子郵件");
      } else if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-[110px] w-[90%] lg:w-4/5 mx-auto">
      <CartTable
        items={products}
        exitFn={exitCart}
        removeItemFn={removeProduct}
        createOrderFn={openDialog}
      />

      {/* for anonymity */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">成立訂單</h3>
          <p className="py-4">請輸入您的電子郵件，以便建立訂單與後續聯絡</p>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full h-8 indent-2 rounded-l-md"
            min={1}
            ref={userEmailRef}
          />
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn btn-xs md:btn-md">取消</button>
              <button
                className="btn btn-xs md:btn-md"
                type="button"
                onClick={createOrder}
                disabled={isLoading}
              >
                送出訂單
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default OrderCart;
