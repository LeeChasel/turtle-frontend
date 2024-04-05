import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TShoppingCartDetail } from "../types/ShoppingCart";
import { CartItem } from "../types/Order";
import { isEqual } from "lodash";
import createSelectors from "@/lib/zustand";

type State = {
  selectedProducts: TShoppingCartDetail[] | CartItem[];
  merchantId: string;
};

type Action = {
  increaseSelectedProducts: (product: TShoppingCartDetail | CartItem) => void;
  decreaseSelectedProducts: (product: TShoppingCartDetail | CartItem) => void;
  decreaseMultipleSelectedProducts: (
    products: State["selectedProducts"],
  ) => void;
  setMerchantId: (merchantId: State["merchantId"]) => void;
  reset: () => void;
};

const initialState: State = {
  selectedProducts: [],
  merchantId: "",
};

const useSelectedCartItemStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...initialState,
      increaseSelectedProducts: (newProduct) => {
        const originalProducts = get().selectedProducts;
        const index = getProductIndex(originalProducts, newProduct);
        if (index === -1) {
          // TODO:type判斷，未來於ShoppingCart也有Customization時進行簡化
          originalProducts.push({
            product: newProduct.product,
            variation: newProduct.variation,
            quantity: newProduct.quantity,
            customizations: isCartItemType(newProduct)
              ? newProduct.customizations
              : [],
            addedTime: new Date().getTime().toString(),
          });
        } else {
          originalProducts[index].quantity += newProduct.quantity;
        }
        set({ selectedProducts: originalProducts });
      },

      decreaseSelectedProducts: (newProduct) => {
        const originalProducts = get().selectedProducts;
        const index = getProductIndex(originalProducts, newProduct);
        if (index === -1) {
          return;
        }
        originalProducts.splice(index, 1);
        set({ selectedProducts: originalProducts });
      },
      decreaseMultipleSelectedProducts: (newProducts) => {
        const originalProducts = get().selectedProducts;
        newProducts.forEach((newProduct) => {
          const index = getProductIndex(originalProducts, newProduct);
          if (index === -1) {
            return;
          }
          originalProducts.splice(index, 1);
        });
        set({ selectedProducts: originalProducts });
      },

      setMerchantId: (merchantId) => set({ merchantId }),
      reset: () =>
        set({
          merchantId: initialState.merchantId,
          selectedProducts: [],
        }),
    }),
    {
      name: "selected-cart-items",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const getProductIndex = (
  originalProducts: TShoppingCartDetail[] | CartItem[],
  newProduct: TShoppingCartDetail | CartItem,
) => {
  const { product, variation } = newProduct;
  const { variationName, variationSpec } = variation;
  return originalProducts.findIndex((originalProduct) => {
    const baseInfoSame =
      isEqual(originalProduct.product.productId, product.productId) &&
      isEqual(originalProduct.variation.variationName, variationName) &&
      isEqual(originalProduct.variation.variationSpec, variationSpec);
    if (isCartItemType(newProduct) && isCartItemType(originalProduct)) {
      const isCustimizationSame = isEqual(
        originalProduct.customizations,
        newProduct.customizations,
      );
      return baseInfoSame && isCustimizationSame;
    }
    return baseInfoSame;
  });
};

const isCartItemType = (
  product: TShoppingCartDetail | CartItem,
): product is CartItem => "customizations" in product;

export default createSelectors(useSelectedCartItemStore);
