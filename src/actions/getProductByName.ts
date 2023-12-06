import type { TProduct } from "../types/Product";

async function getProductByName(name: string) {
  const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/product/name/" + name;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error("由商品名稱取得該商品資料失敗");
  }

  return res.json() as Promise<TProduct[]>;
}

export default getProductByName;
