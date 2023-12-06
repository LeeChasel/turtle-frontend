import { TJWTResponse } from "../types/JWT";

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/user/@me/password";

async function updateNewpassword(token: string, password: string) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({
      password: password,
    }),
  });

  if (!res.ok) {
    throw new Error("修改密碼錯誤");
  }

  return res.json() as Promise<TJWTResponse>;
}

export default updateNewpassword;
