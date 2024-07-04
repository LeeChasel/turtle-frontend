import useCustomizationResultStore from "../store/useCustomizationResultStore";
import updateFile from "@/actions/updateFile";
import { showToast } from "@/utils/toastAlert";

export function FinishCustomization() {
  const audioResult = useCustomizationResultStore.use.audioResult();

  async function upload() {
    try {
      if (audioResult.length === 0) {
        showToast("error", "沒有音樂檔案");
        return;
      }
      const a = bufferToWave(audioResult[0].file);
      const file = new File([a], "audio.wave", {
        type: "audio/vnd.wav",
      });
      await updateFile(file);
      showToast("success", "上傳成功");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  async function send(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await upload();
  }

  return (
    <>
      {/*
      <div>
        <h2>欲客製化項目</h2>
        <ul>
          {customizationResult.map((customization) => (
            <li key={customization.name}>
              {customization.name} - {customization.customization.price}
            </li>
          ))}
        </ul>
        <ul>
          {audioResult.map((audio) => (
            <li key={audio.name}>音檔:{audio.name}</li>
          ))}
        </ul>
      </div>
      <AudioPlayer autoPlay src={url} />;
      <div className="text-right">
        <button className="btn bg-[#263238] text-white " onClick={send}>
          確認上傳
        </button>
      </div>
      */}
      <div className="text-left pt-10 text-[#263238] [text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] grid grid-cols-2">
        <img
          src={
            import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL +
            "/payment-completed.png"
          }
          className="w-1/2 m-auto"
        />

        <div className="text-[1.25rem] mt-20">
          <div>
            <div className="text-3xl ">完成客製化</div>
            <br />
            親愛的顧客，
            <br />
            感謝您選擇我們的客製化服務！
            <br />
            您的訂單已經完成並已加入您的購物車。
            <br />
            請檢查您的購物車以確認訂單詳情。
            <div className="text-right mt-20">
              <button className="btn shadow-md btn-outline " onClick={send}>
                確認上傳
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function bufferToWave(abuffer: AudioBuffer) {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  // write WAVE header
  // "RIFF"
  setUint32(0x46464952);
  // file length - 8
  setUint32(length - 8);
  // "WAVE"
  setUint32(0x45564157);
  // "fmt " chunk
  setUint32(0x20746d66);
  // length = 16
  setUint32(16);
  // PCM (uncompressed)
  setUint16(1);
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  // avg. bytes/sec
  setUint32(abuffer.sampleRate * 2 * numOfChan);
  // block-align
  setUint16(numOfChan * 2);
  // 16-bit (hardcoded in this demo)
  setUint16(16);
  // "data" - chunk
  setUint32(0x61746164);
  // chunk length
  setUint32(length - pos - 4);

  // write interleaved data
  for (let i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    // interleave channels
    for (let i = 0; i < numOfChan; i++) {
      // clamp
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      // scale to 16-bit signed int
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      // write 16-bit sample
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    // next source sample
    offset++;
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" });

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}
