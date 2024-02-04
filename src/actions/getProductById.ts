import type { TProduct } from "../types/Product";

async function getProductById(id: string) {
  const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/product/id/" + id;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error("由商品ID得該商品資料失敗");
  }

  return res.json() as Promise<TProduct>;
}

export default getProductById;
