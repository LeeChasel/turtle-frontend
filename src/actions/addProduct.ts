import type { TProduct } from "../types/Product";
const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/product";

async function addProduct(token: string, productData: TProduct) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      product: productData,
      newArrival: true,
    }),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await res.json();

  if (!res.ok) {
    console.error(json);
    throw new Error("新增商品錯誤");
  }

  return json as TProduct;
}

export default addProduct;
