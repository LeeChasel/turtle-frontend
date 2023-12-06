import React, { createContext, useContext, useMemo, useState } from "react";
import type { TProduct } from "../types/Product";

/**
 * 建立 Context, 定義 Context 中 value 的型別
 */
type TProductContextData = {
  product: TProduct;
};
const ProductContext = createContext<TProductContextData | undefined>(
  undefined,
);

/**
 * 建立 Provider 元件, 定義 Provider 元件 Props 的型別
 */
type TProductProviderProps = {
  defaultProduct: TProduct;
  children: React.ReactNode;
};

export function ProductProvider({
  defaultProduct,
  children,
}: TProductProviderProps) {
  const [product] = useState(defaultProduct);

  const productContextData: TProductContextData = useMemo(() => {
    return {
      product,
    };
  }, [product]);

  return (
    <ProductContext.Provider value={productContextData}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const contextData = useContext(ProductContext);
  if (contextData === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return contextData;
}
