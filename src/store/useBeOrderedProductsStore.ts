import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem } from "../types/Order";
import { isEqual, pullAt } from "lodash";
import createSelectors from "@/lib/zustand";

type State = {
  products: CartItem[];
};

type Action = {
  increaseProduct: (product: State["products"][0]) => void;
  removeProducts: (products: State["products"][0] | State["products"]) => void;
};

const initialState: State = {
  products: [],
};

const useBeOrderedProductsStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...initialState,
      increaseProduct: (newProduct) => {
        const originalProductItems = get().products;
        const index = getProductIndex(originalProductItems, newProduct);
        if (index === -1) {
          originalProductItems.push(newProduct);
        } else {
          originalProductItems[index].quantity += newProduct.quantity;
        }

        set({
          products: [...originalProductItems],
        });
      },

      removeProducts: (removedProducts) => {
        const originalProductItems = get().products;
        if (!Array.isArray(removedProducts)) {
          removedProducts = [removedProducts];
        }

        // find the indexes of the products to be removed
        const indexes = removedProducts.map((removedProduct) =>
          getProductIndex(originalProductItems, removedProduct),
        );
        const beRemovedProducts = pullAt(originalProductItems, indexes);
        if (beRemovedProducts.length !== removedProducts.length) {
          // should not happen
          console.error("Some products are not found in the original products");
        }

        set({
          products: [...originalProductItems],
        });
      },
    }),
    {
      name: "be-ordered-products",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const getProductIndex = (
  originalProducts: CartItem[],
  newProduct: CartItem,
) => {
  const { product, variation, customizations } = newProduct;
  const { variationName, variationSpec } = variation;
  return originalProducts.findIndex(
    (originalProduct) =>
      isEqual(originalProduct.product.productId, product.productId) &&
      isEqual(originalProduct.variation.variationName, variationName) &&
      isEqual(originalProduct.variation.variationSpec, variationSpec) &&
      isEqual(originalProduct.customizations, customizations),
  );
};

export default createSelectors(useBeOrderedProductsStore);
