import { TProduct } from "@/types/Product";

async function getProductByAdmin(id: string, token: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/product/id/" + id;
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("由商品ID得該商品資料失敗");
  }

  return res.json() as Promise<TProduct>;
}

export default getProductByAdmin;
