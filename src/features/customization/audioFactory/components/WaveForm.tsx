import { showToast } from "@/utils/toastAlert";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

function WaveForm() {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef(null);
  const [fileURL, setFileURL] = useState<string | null>(null); //改成陣列
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [wsRegion, setWsRegion] = useState<RegionsPlugin>();
  const [result, setResult] = useState<AudioBuffer>();
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || fileURL === null) return;
    const wavesurfer = WaveSurfer.create({
      container: container,
      url: fileURL,
      waveColor: "#263238",
      plugins: [
        Hover.create({
          lineColor: "#ff0000",
          lineWidth: 2,
          labelBackground: "#555",
          labelColor: "#fff",
          labelSize: "11px",
        }),
      ],
    });
    setWavesurfer(wavesurfer);
    const wsRegion = wavesurfer.registerPlugin(RegionsPlugin.create());
    setWsRegion(wsRegion);

    wavesurfer.on("decode", () => {
      wsRegion.addRegion({
        start: 0,
        end: 8,
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
      if (wsRegion === undefined || wavesurfer === undefined) {
        throw new Error("請選擇檔案!");
      }

      wsRegion.getRegions()[0].play();

      wsRegion.on("region-out", () => {
        wavesurfer?.pause();
      });
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
      const audioContext = new AudioContext();
      const arrayBuffer = await file!.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const clip = edit(audioBuffer);

      setResult(clip);
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

  function test(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const audioCtx = new AudioContext();
    const source = audioCtx.createBufferSource();
    source.buffer = result!;

    source.connect(audioCtx.destination);
    // 资源开始播放
    source.start();
  }
  return (
    <form>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      <div ref={containerRef}></div>

      <div className="grid grid-flow-col grid-rows-1">
        <div>
          <button className="btn bg-[#263238] text-white" onClick={playPause}>
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button className="btn bg-[#263238] text-white" onClick={playClip}>
            試聽
          </button>
        </div>
        <div className=" text-center grid grid-flow-col grid-rows-1 w-4/5">
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
          <button className="btn bg-[#263238] text-white" onClick={handleTrim}>
            剪裁
          </button>
          <button className="btn bg-[#263238] text-white" onClick={test}>
            play
          </button>
        </div>
      </div>
    </form>
  );
}
export default WaveForm;
