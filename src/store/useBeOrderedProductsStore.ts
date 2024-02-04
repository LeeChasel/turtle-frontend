import { create } from "zustand";
import { TOrder, TOrderItem } from "../types/Order";
import { isEqual, omit } from "lodash";

type BeOrderedProducts = {
  products: TOrder;
  increaseProduct: (product: TOrderItem) => void;
};

const useBeOrderedProductsStore = create<BeOrderedProducts>((set) => ({
  products: {
    items: [],
  },
  increaseProduct: (product) =>
    set((state) => {
      const resultProducts: TOrderItem[] = [];
      state.products.items.forEach((orderProduct) => {
        if (
          isEqual(omit(orderProduct, "quantity"), omit(product, "quantity"))
        ) {
          resultProducts.push({
            ...orderProduct,
            quantity: orderProduct.quantity + product.quantity,
          });
        } else {
          resultProducts.push(product);
        }
      });
      return {
        products: {
          items: resultProducts,
        },
      };
    }),
}));

export default useBeOrderedProductsStore;
