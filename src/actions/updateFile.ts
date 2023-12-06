type JsonType = {
  field: string;
};

const URL = import.meta.env.VITE_TURTLE_AUTH_URL + "/file";

async function updateFile(file: File, token: string): Promise<JsonType> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(URL, {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("上傳圖片失敗");
  }

  return res.json() as Promise<JsonType>;
}

export default updateFile;
