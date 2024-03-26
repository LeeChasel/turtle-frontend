export default async function getCustomizationFiles(
  token: string,
  orderId: string,
  itemIndex: number,
) {
  const searchParams = new URLSearchParams({
    orderId,
    itemIndex: itemIndex.toString(),
  });
  const URL = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/merchant/order/customizations/file?${searchParams.toString()}`;
  const res = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/zip",
    },
  });

  // 401 and 403 are global error
  if (res.status === 401) {
    await res.json();
    throw new Error("請重新登入");
  } else if (res.status === 403) {
    await res.json();
    throw new Error("權限不足");
  } else if (res.status === 404) {
    await res.json();
    throw new Error("找不到客製化檔案或訂單");
  } else if (!res.ok) {
    await res.json();
    throw new Error("未知錯誤");
  }

  return res.blob();
}
