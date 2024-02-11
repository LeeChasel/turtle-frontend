import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TShoppingCartDetail } from "../types/ShoppingCart";
import { TOrderItem } from "../types/Order";
import { remove } from "lodash";

type SelectedCartItemStore = {
  selectedProducts: TShoppingCartDetail[] | TOrderItem[];
  increaseSelectedProducts: (product: TShoppingCartDetail | TOrderItem) => void;
  decreaseSelectedProducts: (product: TShoppingCartDetail | TOrderItem) => void;
  increaseMultipleSelectedProducts: (
    products: TShoppingCartDetail[] | TOrderItem[],
  ) => void;
  decreaseMultipleSelectedProducts: (
    products: TShoppingCartDetail[] | TOrderItem[],
  ) => void;
};

const useSelectedCartItemStore = create<SelectedCartItemStore>()(
  persist(
    (set) => ({
      selectedProducts: [],
      increaseSelectedProducts: (product) =>
        set((state) => {
          if (
            !state.selectedProducts.find(
              (selectedProduct) =>
                product.product.productId ===
                  selectedProduct.product.productId &&
                product.variation.variationName ===
                  selectedProduct.variation.variationName &&
                product.variation.variationSpec ===
                  selectedProduct.variation.variationSpec,
            )
          ) {
            return {
              selectedProducts: [...state.selectedProducts, product],
            };
          }
          return state;
        }),
      decreaseSelectedProducts: (product) =>
        set((state) => {
          remove(
            state.selectedProducts,
            (selectedProduct) =>
              product.product.productId === selectedProduct.product.productId &&
              product.variation.variationName ===
                selectedProduct.variation.variationName &&
              product.variation.variationSpec ===
                selectedProduct.variation.variationSpec,
          );
          return {
            selectedProducts: state.selectedProducts,
          };
        }),
      increaseMultipleSelectedProducts: (products) =>
        set({ selectedProducts: products }),
      decreaseMultipleSelectedProducts: (products) => {
        set((state) => {
          products.forEach((product) => {
            remove(
              state.selectedProducts,
              (selectedProduct) =>
                product.product.productId ===
                  selectedProduct.product.productId &&
                product.variation.variationName ===
                  selectedProduct.variation.variationName &&
                product.variation.variationSpec ===
                  selectedProduct.variation.variationSpec,
            );
          });
          return {
            selectedProducts: state.selectedProducts,
          };
        });
      },
    }),
    {
      name: "selected-cart-items",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useSelectedCartItemStore;
