import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TShoppingCartDetail } from "../types/ShoppingCart";
import { TOrderItem } from "../types/Order";
import { remove } from "lodash";
import createSelectors from "@/lib/zustand";

type State = {
  selectedProducts: TShoppingCartDetail[] | TOrderItem[];
  merchantId: string;
};

type Action = {
  increaseSelectedProducts: (product: TShoppingCartDetail | TOrderItem) => void;
  decreaseSelectedProducts: (product: TShoppingCartDetail | TOrderItem) => void;
  increaseMultipleSelectedProducts: (
    products: State["selectedProducts"],
  ) => void;
  decreaseMultipleSelectedProducts: (
    products: State["selectedProducts"],
  ) => void;
  setMerchantId: (merchantId: State["merchantId"]) => void;
};

const useSelectedCartItemStore = create<State & Action>()(
  persist(
    (set) => ({
      selectedProducts: [],
      merchantId: "",
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
      setMerchantId: (merchantId) => set({ merchantId }),
    }),
    {
      name: "selected-cart-items",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default createSelectors(useSelectedCartItemStore);
