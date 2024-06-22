const baseURL = import.meta.env.VITE_TURTLE_PUBLIC_URL + "/file";

type TrimVideoPostResponse = {
  fileId: string;
  mimeType: string;
  videoDetail: {
    duration: number;
    width: number;
    height: number;
    frameRate: number;
  };
};

function secondsToHHMMSS(seconds: number) {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

async function trimVideo(
  fileId: string,
  fileExtension: string,
  trimTime?: { startTime: number; endTime: number },
) {
  const url = `${baseURL}/trim-video`;
  const body = {
    fileId,
    fileExtension,
    ...(trimTime && {
      startTime: secondsToHHMMSS(trimTime.startTime),
      endTime: secondsToHHMMSS(trimTime.endTime),
    }),
  };

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status === 400) {
    throw new Error("剪輯影片失敗, 參數錯誤");
  } else if (!res.ok) {
    throw new Error("剪輯影片失敗");
  }

  return res.json() as Promise<TrimVideoPostResponse>;
}

async function getTrimmedVideo(fileId: string): Promise<Blob> {
  const url = `${baseURL}/trimmed-video?fileId=${fileId}`;
  const res = await fetch(url, {
    headers: {
      'accept': 'application/octet-stream',
    }
  });

  if (res.status === 400) {
    throw new Error('無效的fileId');
  } else if (res.status === 404) {
    throw new Error('找不到剪輯後檔案');
  } else if (!res.ok) {
    throw new Error("取得影片失敗");
  }

  return res.blob();
}

// async function getTrimVideoProcess(fileId: string, fileExtension: string) {
//   console.log('start prpcess')
//   const queryString = new URLSearchParams({ fileId, fileExtension }).toString();
//   const url = `${baseURL}/trimmed-video-process?${queryString}`;
//   const stream = await fetch(url, {
//     headers: {
//       accept: "text/event-stream",
//     }
//   }).then(res => res.body);
//   const reader = stream?.getReader();
//   const readData = await reader?.read();
//   const chunkMessage = new TextDecoder("utf-8").decode(readData?.value);
//   console.log(chunkMessage);
// }


export {
  trimVideo,
  getTrimmedVideo,
  // getTrimVideoProcess,
}
