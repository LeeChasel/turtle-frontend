import type { TInfo } from "../types/User";

async function getUserByEmail(token: string, id: string) {
  const URL = import.meta.env.VITE_TURTLE_AUTH_URL + `/user/id?id=${id}`;
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  return res.json() as Promise<TInfo>;
}

export default getUserByEmail;
