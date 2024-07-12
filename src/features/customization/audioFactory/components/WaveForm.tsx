import { showToast } from "@/utils/toastAlert";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import useCustomizationResultStore from "../../store/useCustomizationResultStore";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import CustomizeRulesModal from "../../components/CustomizeRulesModal";
import { CustomizationDetail } from "@/types/Customization/CustomizationBase";

type WaveFormProps = {
  factoryData: CustomizationDetail;
};

function WaveForm({ factoryData }: WaveFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [wsRegion, setWsRegion] = useState<RegionsPlugin>();
  const [result, setResult] = useState<AudioBuffer>();
  const addAudio = useCustomizationResultStore.use.addAudio();
  const preAudio = useCustomizationResultStore.getState().audioResult;
  const clipTime = factoryData.customization.fileRequirePara.audio_length;
  //const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || fileURL === null) return;
    const wavesurfer = WaveSurfer.create({
      container: container,
      url: fileURL,
      waveColor: "#263238",
      progressColor: "rgb(100, 0, 100)",
      plugins: [
        Hover.create({
          lineColor: "#ff0000",
          lineWidth: 2,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
        TimelinePlugin.create(),
      ],
    });
    setWavesurfer(wavesurfer);
    const wsRegion = wavesurfer.registerPlugin(RegionsPlugin.create());
    setWsRegion(wsRegion);

    wavesurfer.on("decode", () => {
      wsRegion.addRegion({
        start: 0,
        end: 8,
        color: "rgba(178, 178, 255, 0.3)",
        content: "修剪片段",
        drag: false,
        resize: true,
      });
    });

    wsRegion.on("region-updated", () => {
      setStartTime(wsRegion.getRegions()[0].start);
      setEndTime(wsRegion.getRegions()[0].end);
    });

    wavesurfer.on("play", () => {
      setIsPlaying(true);
    });
    wavesurfer.on("pause", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  async function playPause(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      if (wavesurfer === undefined) {
        throw new Error("請選擇檔案!");
      }
      await wavesurfer.playPause();
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  function playClip(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createBufferSource();
      if (preAudio === null) {
        if (wavesurfer === undefined || result === undefined) {
          throw new Error("請選擇檔案!");
        }
        // 设置AudioBufferSourceNode对象的buffer为复制的3秒AudioBuffer对象
        source.buffer = result;
        // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
        // 这里直接结束，实际上可以对结束做一些特效处理
        source.connect(audioCtx.destination);
        // 资源开始播放
        source.start();
      } else {
        if (wavesurfer === undefined || result === undefined) {
          source.buffer = preAudio[preAudio.length - 1].file;
          // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
          // 这里直接结束，实际上可以对结束做一些特效处理
          source.connect(audioCtx.destination);
          // 资源开始播放
          source.start();
        } else {
          source.buffer = result;
          // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
          // 这里直接结束，实际上可以对结束做一些特效处理
          source.connect(audioCtx.destination);
          // 资源开始播放
          source.start();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  const handleTrim = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (wsRegion === undefined) {
        throw new Error("請選擇檔案!");
      }
      if (wavesurfer === undefined) {
        throw new Error("請選擇檔案!");
      }
      if (endTime - startTime > clipTime) {
        throw new Error("音檔過長!");
      }
      const audioContext = new AudioContext();
      const arrayBuffer = await file!.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const clip = edit(audioBuffer);

      setResult(clip);

      showToast("success", "修剪成功");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  };

  function edit(clip: AudioBuffer) {
    const channels = clip.numberOfChannels;
    const rate = clip.sampleRate;
    const startOffset = rate * startTime;
    const endOffset = rate * endTime;
    const frameCount = endOffset - startOffset;

    const newAudioBuffer = new AudioContext().createBuffer(
      channels,
      frameCount,
      rate,
    );
    const anotherArray = new Float32Array(frameCount);
    for (let channel = 0; channel < channels; channel++) {
      clip.copyFromChannel(anotherArray, channel, startOffset);
      newAudioBuffer.copyToChannel(anotherArray, channel, 0);
    }

    return newAudioBuffer;
  }

  function submit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      if (result === null || file === undefined) {
        throw new Error("請上傳檔案!");
      }
      addAudio({
        name: file!.name,
        file: result!,
      });
      showToast("success", "儲存成功");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  return (
    <form>
      <div className="my-3 flex justify-between">
        <label htmlFor="file-upload" className="btn  bg-[#263238] text-white ">
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept="audio/*"
            onChange={handleFileChange}
          />
          {file != null ? file.name : "檔案上傳"}
        </label>
        <CustomizeRulesModal
          data={factoryData.customization.fileRequirePara}
          type="audio"
          name={factoryData.name}
        />
      </div>
      {file != null ? (
        <>
          <div ref={containerRef}></div>
          <div className="grid grid-flow-col grid-rows-1 my-3">
            <div className="grid grid-flow-col grid-rows-1 w-1/2">
              <button
                className="btn bg-[#263238] text-white text-2xl"
                onClick={playPause}
              >
                {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
              </button>
              <button
                className="btn bg-[#263238] text-white"
                onClick={playClip}
              >
                試聽
              </button>
            </div>
            <div className=" text-center grid grid-flow-col grid-rows-1">
              <label className="m-auto">剪裁時間</label>
              <input
                type="text"
                defaultValue={"00:00:00"}
                value={
                  Math.floor(startTime / 3600)
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  Math.floor(startTime / 60)
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  Math.floor(startTime % 60)
                    .toString()
                    .padStart(2, "0")
                }
              />
              <label className="m-auto">到</label>
              <input
                type="text"
                defaultValue={"00:00:00"}
                value={
                  Math.floor(endTime / 3600)
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  Math.floor(endTime / 60)
                    .toString()
                    .padStart(2, "0") +
                  ":" +
                  Math.floor(endTime % 60)
                    .toString()
                    .padStart(2, "0")
                }
              />
              <button
                className="btn bg-[#263238] text-white"
                onClick={handleTrim}
              >
                剪裁
              </button>
              <button className="btn bg-[#263238] text-white" onClick={submit}>
                儲存變更
              </button>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </form>
  );
}
export default WaveForm;
