import { TShoppingCartDetail, TShoppingCartBrief } from "./ShoppingCart";

export type TOrder = {
  items: TOrderItem[];
};

export type TOrderItem = Omit<TShoppingCartDetail, "addedTime">;

export type TOrderRequestItem = Omit<TShoppingCartBrief, "addedTime">;

export type TOrderRequest = {
  items: TOrderRequestItem[];
};
