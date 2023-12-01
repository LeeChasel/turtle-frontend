import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { TVariation } from '../types/Product';

/**
 * 建立 Context, 定義 Context 中 value 的型別
 */
type TVariationContextData = {
  variation: TVariation;
  changeVariation: (newVariation: TVariation) => void;
}
const VariationContext = createContext<TVariationContextData | undefined>(undefined);

/**
 * 建立 Provider 元件, 定義 Provider 元件 Props 的型別
 */
type TVariationProviderProps = {
  defaultVariation: TVariation;
  children: React.ReactNode;
}

export function VariationProvider({ defaultVariation ,children }: TVariationProviderProps)
{
  const [variation, setVariation] = useState(defaultVariation);

  const changeVariation = useCallback((newVariation: TVariation) => {
    setVariation(newVariation);
  }, []);

  const variationContextData : TVariationContextData = useMemo(() => {
    return {
      variation,
      changeVariation
    };
  }, [variation, changeVariation]);

  return (
    <VariationContext.Provider value={variationContextData}>
      {children}
    </VariationContext.Provider>
  )
}

export function useVariationContext()
{
  const contextData = useContext(VariationContext);
  if (contextData === undefined) {
    throw new Error('useVariation must be used within a VariationProvider');
  }
  return contextData;
}