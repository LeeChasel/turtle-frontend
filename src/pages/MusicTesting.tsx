import { showToast } from "@/utils/toastAlert";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

function MusicTesting() {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef(null);
  const [fileURL, setFileURL] = useState<string | null>(null); //改成陣列
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer>();
  const [wsRegion, setWsRegion] = useState<RegionsPlugin>();

  useEffect(() => {
    const container = containerRef.current;
    if (container === null || fileURL === null) return;
    const wavesurfer = WaveSurfer.create({
      container: container,
      url: fileURL,
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
      if (isPlaying === true) {
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  function playClip(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      if (wsRegion === undefined) {
        throw new Error("請選擇檔案!");
      }
      setIsPlaying(true);
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

  /*const handleTrim = () => {
    try {
      if (wavesurfer === undefined) {
        throw new Error("請選擇檔案!");
      }
      const trimData = wavesurfer.exportPeaks(1024, startTime, endTime);
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  };*/

  return (
    <form>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      <div ref={containerRef}></div>

      <div className="grid grid-flow-col grid-rows-1">
        <div>
          <button className="btn" onClick={playPause}>
            {isPlaying ? "PAUSE" : "PLAY"}
          </button>
          <button className="btn" onClick={playClip}>
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
          <button className="btn">剪裁</button>
        </div>
      </div>
    </form>
  );
}
export default MusicTesting;
