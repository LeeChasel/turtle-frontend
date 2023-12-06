import type { TInfo } from "../types/User";

async function getUserInfo(token: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/user/@me";
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("取得使用者資料失敗");
  }
  return res.json() as Promise<TInfo>;
}

export default getUserInfo;
