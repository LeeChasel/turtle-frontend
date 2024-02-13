import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TOrder, TOrderItem } from "../types/Order";
import { isEqual, remove } from "lodash";

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

          // for the second and more products
          const index = state.products.items.findIndex(
            (item) =>
              isEqual(item.product.productId, product.product.productId) &&
              isEqual(
                item.variation.variationName,
                product.variation.variationName,
              ) &&
              isEqual(
                item.variation.variationSpec,
                product.variation.variationSpec,
              ),
          );

          if (index === -1) {
            return {
              products: {
                items: [...state.products.items, product],
              },
            };
          } else {
            state.products.items[index].quantity += product.quantity;
            return state;
          }
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
