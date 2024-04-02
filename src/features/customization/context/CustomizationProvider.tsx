import React, { createContext, useContext, useMemo, useState } from "react";
import { CustomizationContainerState } from "../types";

type CustomizationContextData = {
  customization: Omit<CustomizationContainerState, "customization">;
};

const CustomizationContext = createContext<
  CustomizationContextData | undefined
>(undefined);

type CustomizationProviderProps = {
  defaultCustomization: CustomizationContainerState;
  children: React.ReactNode;
};

export function CustomizationProvider({
  defaultCustomization,
  children,
}: CustomizationProviderProps) {
  const [customization] = useState(defaultCustomization);

  const customizationContextData: CustomizationContextData = useMemo(
    () => ({
      customization,
    }),
    [customization],
  );

  return (
    <CustomizationContext.Provider value={customizationContextData}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomizationContext() {
  const contextData = useContext(CustomizationContext);
  if (contextData === undefined) {
    throw new Error(
      "useCustomization must be used within a CustomizationProvider",
    );
  }
  return contextData;
}
