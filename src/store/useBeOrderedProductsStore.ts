import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOrder, TOrderItem } from "../types/Order";
import { isEqual, omit, remove } from "lodash";

type BeOrderedProducts = {
  products: TOrder;
  increaseProduct: (product: TOrderItem) => void;
  removeProduct: (product: TOrderItem) => void;
  removeMultipleProducts: (products: TOrderItem[]) => void;
};

const useBeOrderedProductsStore = create<BeOrderedProducts>()(
  persist(
    (set) => ({
      products: {
        items: [],
      },

      increaseProduct: (product) =>
        set((state) => {
          // for the first product
          if (state.products.items.length === 0) {
            return {
              products: {
                items: [product],
              },
            };
          }

          // If the product is not in the list, add it to the list
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

      removeProduct: (product) =>
        set((state) => {
          // remove function would change the original array
          remove(
            state.products.items,
            (orderProduct) =>
              isEqual(
                product.product.productId,
                orderProduct.product.productId,
              ) &&
              isEqual(
                product.variation.variationName,
                orderProduct.variation.variationName,
              ) &&
              isEqual(
                product.variation.variationSpec,
                orderProduct.variation.variationSpec,
              ),
          );

          return {
            products: {
              items: state.products.items,
            },
          };
        }),
      removeMultipleProducts: (products) => {
        set((state) => {
          products.forEach((product) => {
            remove(
              state.products.items,
              (orderProduct) =>
                isEqual(
                  product.product.productId,
                  orderProduct.product.productId,
                ) &&
                isEqual(
                  product.variation.variationName,
                  orderProduct.variation.variationName,
                ) &&
                isEqual(
                  product.variation.variationSpec,
                  orderProduct.variation.variationSpec,
                ),
            );
          });

          return {
            products: {
              items: state.products.items,
            },
          };
        });
      },
    }),
    {
      name: "be-ordered-products",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useBeOrderedProductsStore;
