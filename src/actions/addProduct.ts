import type { TProduct } from "../types/Product";
const URL = import.meta.env.VITE_TURTLE_AUTH_URL + '/product';

async function addProduct(token: string, productData: TProduct): Promise<TProduct> {
  const res = await fetch(URL, {
    headers: {
      "Authorization" : 'Bearer ' + token,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({
      product: productData,
      newArrival: true
    }),
  });

  if (!res.ok) {
    throw new Error("新增商品錯誤");
  }

  const json = await res.json();
  return json;
}

export default addProduct;