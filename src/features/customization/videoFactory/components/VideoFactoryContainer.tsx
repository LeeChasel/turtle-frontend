import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { UploadButton } from "./UploadButton";
import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";

type VideoFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

export function VideoFactoryContainer({
  factoryData,
}: VideoFactoryContainerProps) {
  const [file, setFile] = useState<File | null>(null);
  const videoSrc = file ? URL.createObjectURL(file) : undefined;
  const waveformRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const updateFile = (file: File) => {
    setFile(file);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
  };

  useEffect(() => {
    if (!waveformRef.current || !videoRef.current || !file) return;

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#263238",
      progressColor: "rgb(100, 0, 100)",
      media: videoRef.current,
    });

    return () => ws.destroy();
  }, [file]);

  return (
    <>
      <div className="flex justify-end">
        <UploadButton
          hasVideo={Boolean(file)}
          updateFile={(targetFile) => updateFile(targetFile)}
        />
      </div>
      <div className="flex flex-col items-center">
        {videoSrc && (
          <video
            controls
            playsInline
            className="block"
            ref={videoRef}
            src={videoSrc}
          />
        )}
        <div ref={waveformRef} className="w-full" />
      </div>
    </>
  );
}
