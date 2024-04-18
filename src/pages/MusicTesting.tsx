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
    const wsRegion = wavesurfer.registerPlugin(RegionsPlugin.create());

    wavesurfer.on("decode", () => {
      wsRegion.addRegion({
        start: 0,
        end: 8,
        content: "修剪片段",
        drag: false,
        resize: true,
      });
    });

    wavesurfer.on("click", async () => {
      wavesurfer.playPause();
    });

    wsRegion.on("region-updated", () => {
      setStartTime(wsRegion.getRegions()[0].start);
      setEndTime(wsRegion.getRegions()[0].end);
    });

    wsRegion.on("region-double-clicked", () => {
      wsRegion.getRegions()[0].play();
    });

    wsRegion.on("region-out", () => {
      wavesurfer.pause();
    });

    wavesurfer.on("ready", async () => {
      await wavesurfer.play();
    });

    return () => {
      wavesurfer.destroy();
      setIsPlaying(false);
    };
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  return (
    <form>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      <div ref={containerRef}></div>

      <div className="grid grid-flow-col grid-rows-1">
        <div>
          <button className="btn">試聽</button>
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
