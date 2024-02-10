// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useShoppingCart from "../hooks/useShoppingCart";
import CartTable from "../components/ShoppingCart/CartTable";
import { TShoppingCartBrief, TShoppingCartDetail } from "../types/ShoppingCart";
import { TOrderItem } from "../types/Order";
import updateShoppingCart from "../actions/updateShoppingCart";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import { useQueryClient } from "@tanstack/react-query";

// import { TOrderItem } from "../types/Order";

function ShoppingCart() {
  // const [selectedItems, setSelectedItems] = useState<TOrderItem[]>([]);
  const navigate = useNavigate();
  const { tokenCookie } = useUserTokenCookie();
  const queryClient = useQueryClient();

  const { data: items, error, status } = useShoppingCart();
  if (status === "pending") {
    return <p>Loading...</p>;
  } else if (status === "error") {
    return <p>Error happened: {error.message}</p>;
  }

  function exitCart() {
    navigate("/");
  }

  async function removeProduct(item: TShoppingCartDetail | TOrderItem) {
    const removedItem: TShoppingCartBrief = {
      productId: item.product.productId!,
      variationName: item.variation.variationName,
      variationSpec: item.variation.variationSpec,
      quantity: item.quantity * -1,
      addedTime: new Date().toISOString(),
    };
    await updateShoppingCart([removedItem], tokenCookie!);
    await queryClient.invalidateQueries({
      queryKey: ["shoppingCart", tokenCookie],
    });
  }

  function createOrderFn() {
    alert("create order");
  }

  return (
    <main className="mt-[110px] mx-48">
      <CartTable
        items={items}
        exitFn={exitCart}
        removeItemFn={removeProduct}
        createOrderFn={createOrderFn}
      />
    </main>
  );
}

export default ShoppingCart;
