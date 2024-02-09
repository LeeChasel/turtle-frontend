import { useNavigate } from "react-router-dom";
import CartTable from "../../components/ShoppingCart/CartTable";
import useAnonymousProductStore from "../../store/useAnonymousProductStore";
import useBeOrderedProductsStore from "../../store/useBeOrderedProductsStore";

function OrderCart() {
  const items = useBeOrderedProductsStore((state) => state.products);
  const removeProduct = useBeOrderedProductsStore(
    (state) => state.removeProduct,
  );
  const productId = useAnonymousProductStore((state) => state.productId);
  const navigate = useNavigate();

  function exitCart() {
    navigate(`/special/product/${productId}`);
  }

  return (
    <main className="mt-[110px] mx-48">
      <CartTable
        items={items.items}
        exitFn={exitCart}
        removeItemFn={removeProduct}
      />
    </main>
  );
}

export default OrderCart;
