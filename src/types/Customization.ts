export type OrderCustomization = {
  type: string;
  name: string;
  customization: OrderCustomizationBase;
};

export type OrderCustomizationBase = {
  /** This field will be overridden by the price set from ProductCustomization */
  price: number;
};
