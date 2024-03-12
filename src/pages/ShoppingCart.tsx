import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useShoppingCart from "../hooks/useShoppingCart";
import CartTable from "../components/ShoppingCart/CartTable";
import { TShoppingCartBrief, TShoppingCartDetail } from "../types/ShoppingCart";
import { TOrderItem, TOrderRequestItem } from "../types/Order";
import updateShoppingCart from "../actions/updateShoppingCart";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import { useQueryClient } from "@tanstack/react-query";
import useSelectedCartItemStore from "../store/useSelectedCartItemStore";
import { showToast } from "../utils/toastAlert";
import { createOrder } from "../actions/createOrder";

function ShoppingCart() {
  const navigate = useNavigate();
  const { tokenCookie } = useUserTokenCookie();
  const queryClient = useQueryClient();
  const { selectedProducts, decreaseMultipleSelectedProducts } =
    useSelectedCartItemStore();
  const [isLoading, setIsLoading] = useState(false);

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

  async function createOrderFn() {
    if (selectedProducts.length === 0) {
      showToast("info", "請選擇商品");
      return;
    }

    try {
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

      const orderResponse = await createOrder(
        { items: orderItems },
        tokenCookie!,
      );

      // clear cart
      const delectedShoppingCartItems: TShoppingCartBrief[] = [];
      selectedProducts.forEach((product) => {
        delectedShoppingCartItems.push({
          productId: product.product.productId!,
          variationName: product.variation.variationName,
          variationSpec: product.variation.variationSpec,
          quantity: product.quantity * -1,
          addedTime: new Date().toISOString(),
        });
      });

      await updateShoppingCart(delectedShoppingCartItems, tokenCookie!);
      await queryClient.invalidateQueries({
        queryKey: ["shoppingCart", tokenCookie],
      });
      decreaseMultipleSelectedProducts(selectedProducts);

      showToast("success", `訂單編號：「${orderResponse.orderId}」建立成功`, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-[110px] mx-48">
      <CartTable
        items={items}
        exitFn={exitCart}
        removeItemFn={removeProduct}
        createOrderFn={createOrderFn}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ShoppingCart;
