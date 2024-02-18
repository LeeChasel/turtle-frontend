type JsonType = {
  field: string;
};

const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/file";

async function updateFile(file: File): Promise<JsonType> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(URL, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("上傳圖片失敗");
  }

  return res.json() as Promise<JsonType>;
}

export default updateFile;
