import type { TJWTResponse } from "../types/JWT";
import type { TLogin } from "../types/User";

const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + '/auth/login';
const defaultErrorMessage = "帳號或密碼錯誤，登入失敗！";

async function login({email, password}: TLogin, errorMessage = defaultErrorMessage): Promise<TJWTResponse> {
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
    throw new Error(errorMessage);
  }

  const json = await res.json();
  return json;
}

export default login