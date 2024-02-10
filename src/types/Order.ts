import { TShoppingCartDetail } from "./ShoppingCart";

export type TOrder = {
  items: TOrderItem[];
};

export type TOrderItem = Omit<TShoppingCartDetail, "addedTime">;

export type TOrderRequest = {
  items: [
    {
      productId: string;
      quantity: number;
      variationName: string;
      variationSpec: string;
    },
  ];
};
