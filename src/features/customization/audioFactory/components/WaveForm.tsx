import { useRef, useEffect } from "react";
import { useWavesurfer } from "@wavesurfer/react";

function Waveform() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
  });

  return (
    <>
      <div>
        <input type="file" accept="audio/*" />
      </div>
      <div ref={containerRef} />
    </>
  );
}

export default Waveform;
