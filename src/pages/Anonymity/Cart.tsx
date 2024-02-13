import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import CartTable from "../../components/ShoppingCart/CartTable";
import useAnonymousProductStore from "../../store/useAnonymousProductStore";
import useBeOrderedProductsStore from "../../store/useBeOrderedProductsStore";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";
import { z } from "zod";
import { createOrderForAnonymity } from "../../actions/createOrder";
import { TOrderRequestItem } from "../../types/Order";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import login from "../../actions/login";
import { anonymousUser } from "../../utils/anonymity";

function OrderCart() {
  const [isLoading, setIsLoading] = useState(false);
  const { products, removeProduct, removeMultipleProducts } =
    useBeOrderedProductsStore();
  const productId = useAnonymousProductStore((state) => state.productId);
  const { selectedProducts, decreaseMultipleSelectedProducts } =
    useSelectedCartItemStore();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();

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
    modalRef.current?.showModal();
  }

  async function createOrder() {
    // for unexpected situation
    if (!tokenCookie) {
      const jwt = await login(anonymousUser);
      setUserTokenCookie(jwt);
    }

    try {
      // validate email
      const userEmail = z
        .string()
        .email()
        .parse(userEmailRef.current?.value);

      setIsLoading(true);

      const orderItems: TOrderRequestItem[] = [];
      selectedProducts.forEach((product) => {
        orderItems.push({
          productId: product.product.productId!,
          quantity: product.quantity,
          variationName: product.variation.variationName,
          variationSpec: product.variation.variationSpec,
        });
      });

      const orderResponse = await createOrderForAnonymity(
        { items: orderItems },
        userEmail,
        tokenCookie!,
      );

      // clear cart
      removeMultipleProducts(selectedProducts);
      decreaseMultipleSelectedProducts(selectedProducts);
      modalRef.current?.close();

      showToast("success", `訂單編號：「${orderResponse.orderId}」建立成功`, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
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
    <main className="mt-[110px] mx-48">
      <CartTable
        items={products.items}
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
            placeholder="xxxx@gmail.com"
            className="w-full h-8 indent-2 rounded-l-md"
            min={1}
            ref={userEmailRef}
          />
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn">取消</button>
              <button
                className="btn"
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
    </main>
  );
}

export default OrderCart;
