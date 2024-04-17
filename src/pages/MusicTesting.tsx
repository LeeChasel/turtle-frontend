import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

function MusicTesting() {
  const [file, setFile] = useState<File | null>(null);
  const containerRef = useRef(null);
  const [fileURL, setFileURL] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const wavesurfer = WaveSurfer.create({
      container: container,
      url: fileURL!,
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
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setFileURL(URL.createObjectURL(e.target.files[0]));
    }
  }

  function submit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
  }
  return (
    <form>
      <div>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button className="btn" onClick={submit}>
          上傳
        </button>
      </div>
      <div ref={containerRef}></div>
    </form>
  );
}
export default MusicTesting;
