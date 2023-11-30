import type { TJWTResponse } from "../types/JWT";
import type { TLogin } from "../types/User";

const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + '/auth/login';

async function login({email, password}: TLogin): Promise<TJWTResponse> {
  const res = await fetch(URL, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (!res.ok) {
    throw new Error("帳號或密碼錯誤，登入失敗！");
  }

  const json = await res.json();
  return json;
}

export default login