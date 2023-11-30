import type { TBanner } from "../types/Product";

const URL = `${import.meta.env.VITE_TURTLE_PUBLIC_URL}/product/new-arrival`;

async function getNewArrivalProducts(): Promise<TBanner[]> {
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    throw new Error("取得最新的商品失敗");
  }
  const json = await res.json();
  return json;
}

export default getNewArrivalProducts;
