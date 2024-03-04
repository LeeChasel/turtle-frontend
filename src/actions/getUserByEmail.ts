import type { TInfo } from "../types/User";

async function getUserByEmail(token: string, email: string) {
  const URL =
    import.meta.env.VITE_TURTLE_AUTH_URL + `/user/email?email=${email}`;
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) {
    throw new Error(`使用者「${email}」不存在`);
  } else if (res.status === 401) {
    throw new Error("使用者未登入");
  } else if (res.status === 403) {
    throw new Error("使用者未授權");
  } else if (!res.ok) {
    throw new Error(`取得使用者資料失敗`);
  }

  return res.json() as Promise<TInfo>;
}

export default getUserByEmail;
