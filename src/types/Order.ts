import { TShoppingCartBrief } from "./ShoppingCart";

export type TOrder = {
  items: TOrderItem[];
};

export type TOrderItem = Omit<TShoppingCartBrief, "addedTime">;
