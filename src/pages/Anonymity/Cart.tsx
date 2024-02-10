import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import CartTable from "../../components/ShoppingCart/CartTable";
import useAnonymousProductStore from "../../store/useAnonymousProductStore";
import useBeOrderedProductsStore from "../../store/useBeOrderedProductsStore";
import { showToast } from "../../utils/toastAlert";
import useSelectedCartItemStore from "../../store/useSelectedCartItemStore";

function OrderCart() {
  const items = useBeOrderedProductsStore((state) => state.products);
  const removeProduct = useBeOrderedProductsStore(
    (state) => state.removeProduct,
  );
  const productId = useAnonymousProductStore((state) => state.productId);
  const selectedProducts = useSelectedCartItemStore(
    (state) => state.selectedProducts,
  );
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

  function createOrder() {
    const userEmail = userEmailRef.current?.value;

    // TODO: add validate logic, maybe RHF
    if (!userEmail) {
      showToast("error", "請輸入電子郵件");
      return;
    }

    // create a object can use as the first params of createOrderForAnonymity

    const orderItems = selectedProducts.map((product) => {
      return {
        productId: product.product.productId!,
        quantity: product.quantity,
        variationName: product.variation.variationName,
        variationSpec: product.variation.variationSpec,
      };
    });

    // TODO: send orderItems to backend
  }

  return (
    <main className="mt-[110px] mx-48">
      <CartTable
        items={items.items}
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
            ref={userEmailRef}
          />
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">取消</button>
              <button className="btn" type="button" onClick={createOrder}>
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
