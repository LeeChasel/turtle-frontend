import type { TProduct } from "../types/Product";

async function getAllProduct(page: number, sortBy: string) {
  const URL =
    import.meta.env.VITE_TURTLE_PUBLIC_URL +
    "/product?page=" +
    page +
    "&perPageSize=10&maxPrice=2147483647&minPrice=0&showUnavailable=false&sortBy=" +
    sortBy;
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await res.json();

  if (!res.ok) {
    console.error(json);
    throw new Error("查詢商品錯誤");
  }

  return json as Promise<TProduct[]>;
}

export default getAllProduct;
