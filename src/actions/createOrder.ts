import { CustomizationBrief } from "@/types/Customization/CustomizationBase";
import { TShoppingCartBrief } from "@/types/ShoppingCart";
import { OrderDetail } from "@/types/Order";

/**
 * Use to create order include customizations
 */
export type CreateOrderDTO = {
  items: CreateOrderItemDTO[];
};
export type CreateOrderItemDTO = Omit<TShoppingCartBrief, "addedTime"> & {
  customizations: CustomizationBrief[];
};

export async function createOrder(order: CreateOrderDTO, token: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order";
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("建立訂單失敗");
  }

  return res.json() as Promise<OrderDetail>;
}

export async function createOrderForAnonymity(
  order: CreateOrderDTO,
  userEmail: string,
  token: string,
) {
  const URL =
    import.meta.env.VITE_TURTLE_AUTH_URL +
    `/order/anonymity?userEmail=${userEmail}`;

  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("建立匿名訂單失敗");
  }

  return res.json() as Promise<OrderDetail>;
}
