const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/user/@me/logout";

async function logout(token: string) {
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  if (!res.ok) {
    throw new Error("登出失敗!");
  }
}

export default logout;
