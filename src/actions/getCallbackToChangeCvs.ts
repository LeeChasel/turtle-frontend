import { CvsMapCallback } from "@/types/Cvs";

type Heartbeat = {
  heartbeat: number;
};

type StreamResponse = {
  event: string;
  data: Heartbeat | CvsMapCallback;
};

async function fetchFn(url: string, init: RequestInit) {
  const res = await fetch(url, init);
  if (res.status === 401) {
    throw new Error("登入逾期，請重新登入");
  } else if (res.status === 404) {
    throw new Error(`找不到訂單的物流資訊`);
  } else if (!res.ok) {
    throw new Error("取得變更物流CVS商店的回應失敗");
  } else if (!res.body) {
    throw new Error("串流為空");
  }

  return res.body;
}

export async function getCallbackToChangeCvsForAnonymity(
  token: string,
  orderId: string,
  userEmail: string,
) {
  const url = `${
    import.meta.env.VITE_TURTLE_AUTH_URL
  }/ecpay/logistics/customer/anonymity/cvsmap/callback/${orderId}?userEmail=${userEmail}`;

  const init: RequestInit = {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "text/event-stream",
    },
  };

  let cvsCallbackResult: CvsMapCallback | undefined;

  const processStream = async () => {
    const stream = await fetchFn(url, init);
    const reader = stream.getReader();
    try {
      const readChunk = async () => {
        const readData = await reader.read();
        const { value } = readData;
        const chunkMsg = new TextDecoder("utf-8").decode(value);
        const { data } = parseStreamData(chunkMsg);
        if (isCvsMapCallback(data)) {
          cvsCallbackResult = data;
          await reader.cancel();
        } else if (data.heartbeat >= 110) {
          // handle api timeout 600s, resend request on 110 * 5 = 550s
          await processStream();
        } else {
          await readChunk();
        }
      };
      await readChunk();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  };

  await processStream();
  return cvsCallbackResult;
}

function parseStreamData(streamData: string): StreamResponse {
  const [event, data] = streamData.split("\n");
  const dataStr = data.replace("data:", "");
  let dataResult: Heartbeat | CvsMapCallback;
  if (dataStr.includes("Heartbeat")) {
    const ReArray = dataStr.match(/\d+/);
    dataResult = {
      heartbeat: ReArray ? parseInt(ReArray[0]) : -1,
    };
  } else {
    dataResult = JSON.parse(JSON.parse(dataStr) as string) as CvsMapCallback;
  }
  return {
    event: event.replace("event:", ""),
    data: dataResult,
  };
}

function isCvsMapCallback(
  data: Heartbeat | CvsMapCallback,
): data is CvsMapCallback {
  return (data as CvsMapCallback).MerchantID !== undefined;
}
