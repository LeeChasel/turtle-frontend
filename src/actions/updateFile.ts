import mimeTypes from "@/data/mimeTypes.json";
import { findKey } from "lodash";

type FileUpdateJson = {
  fileId: string;
  mimeType?: string;
};

const URL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/file";

async function updateFile(
  file: File,
  identifyMimeType = false,
): Promise<FileUpdateJson> {
  const searchParams = new URLSearchParams();
  const fileType = file.type;
  // 取得副檔名(不含.)
  const extension = findKey(mimeTypes, { mime: fileType });
  if (!extension) {
    console.error(fileType);
    throw new Error("不支援的檔案格式，請確認上傳檔案類型或擴充支援的檔案格式");
  }
  searchParams.append("extension", extension);
  searchParams.append("identifyMimeType", `${identifyMimeType}`);

  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${URL}?${searchParams.toString()}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("上傳圖片失敗");
  }

  return res.json() as Promise<FileUpdateJson>;
}

export default updateFile;
