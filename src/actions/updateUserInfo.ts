import type { TUpdateInfo } from "../types/User";

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/user/@me";

async function updateUserInfo(token: string, info: TUpdateInfo) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(info),
  });

  if (!res.ok) {
    throw new Error("更新個人資料錯誤");
  }

  return res.json() as Promise<TUpdateInfo>;
}

export default updateUserInfo;
