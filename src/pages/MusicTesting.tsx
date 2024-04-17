import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

function MusicTesting() {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef(null);
  const [fileURL, setFileURL] = useState<string | null>(null); //改成陣列
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(8);
  const [flag, setFlag] = useState(false);

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
    const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create());

    wavesurfer.on("decode", () => {
      wsRegions.addRegion({
        start: startTime,
        end: endTime,
        content: "Resize me",
        drag: false,
        resize: true,
      });
    });
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  function refresh(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setFlag(true);
  }
  return (
    <form>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button className="btn" onClick={refresh}>
          重新上傳
        </button>
      </div>

      <div ref={containerRef}></div>
    </form>
  );
}
export default MusicTesting;
