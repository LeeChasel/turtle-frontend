const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/order";

export type item = {
  productId: string;
  quantity: number;
  variationName: string;
  variationSpec: string;
};
async function createOrder(token: string, productData: item) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      product: productData,
    }),
  });

  if (!res.ok) {
    throw new Error("訂單錯誤");
  }

  return res.json() as Promise<item>;
}

export default createOrder;
