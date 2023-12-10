import { TJWTResponse } from "../types/JWT";

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/user/@me/token/refresh";

async function refreshToken(token: string, password: string) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      password: password,
    }),
  });

  if (!res.ok) {
    throw new Error("更新錯誤");
  }

  return res.json() as Promise<TJWTResponse>;
}

export default refreshToken;
