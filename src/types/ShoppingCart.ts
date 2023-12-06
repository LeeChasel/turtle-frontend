import type { TBanner, TVariation } from "./Product";

/**
 * Shopping cart item detail info
 */
export type TShoppingCartDetail = {
  shoppingCartItems: TItemDetail[];
};
export type TItemDetail = {
  product: TBanner;
  variation: TVariation;
  quantity: number;
  addedTime: string;
};

/**
 * Shopping cart item brief info used to update shopping cart
 */
export type TShoppingCartBrief = {
  shoppingCartItems: TItemBrief[];
};
export type TItemBrief = {
  productId: string;
  variationName: string;
  variationSpec: string;
  quantity: number;
  addedTime: string;
};
