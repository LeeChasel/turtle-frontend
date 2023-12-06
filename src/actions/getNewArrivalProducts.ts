import type { TBanner } from "../types/Product";

const URL = `${import.meta.env.VITE_TURTLE_PUBLIC_URL}/product/new-arrival`;

async function getNewArrivalProducts() {
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("取得最新的商品失敗");
  }

  return res.json() as Promise<TBanner[]>;
}

export default getNewArrivalProducts;
