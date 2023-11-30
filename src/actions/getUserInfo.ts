import type { TInfo } from "../types/User";

async function getUserInfo(token: string): Promise<TInfo> {
  const URL = import.meta.env.VITE_PUBLIC_TURTLE_AUTH_URL + '/user/@me';
  const res = await fetch(URL, {
    headers: {
      "Authorization" : 'Bearer ' + token,
      "Content-Type": "application/json"
    },
  });

  if (!res.ok) {
    throw new Error("取得使用者資料失敗");
  }
  const json = await res.json();
  return json;
}

export default getUserInfo;