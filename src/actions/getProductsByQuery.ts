import type { TBanner } from "../types/Product";

async function getProductsByQuery(
  pageNum: number,
  searchParams: URLSearchParams,
) {
  const pageSize = 10;

  const queryStringObject = parseURLQuery(searchParams);
  queryStringObject.append("perPageSize", pageSize.toString());
  queryStringObject.append("page", pageNum.toString());

  const queryString = "?" + queryStringObject.toString();
  const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/product" + queryString;
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error("由條件取得商品們失敗");
  }

  return res.json() as Promise<TBanner[]>;
}

function parseURLQuery(searchParams: URLSearchParams) {
  const queryStringObject = new URLSearchParams();

  // Because query keys on page are different from api query keys
  const URLQueryKeys = ["minPrice", "maxPrice", "sua", "sort"];
  const APIQueryKeys = ["minPrice", "maxPrice", "showUnavailable", "sortBy"];

  URLQueryKeys.forEach((queryKey, index) => {
    const value = searchParams.get(queryKey);
    if (value && queryKey === "sort") {
      const parsedValue = value === "des" ? "DESCENDING" : "ASCENDING";
      queryStringObject.append(APIQueryKeys[index], parsedValue);
    } else if (value) {
      queryStringObject.append(APIQueryKeys[index], value);
    }
  });

  return queryStringObject;
}

export default getProductsByQuery;
