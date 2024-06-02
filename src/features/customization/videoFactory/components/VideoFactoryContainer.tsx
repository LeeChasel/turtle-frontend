import { useRef, useState } from "react";
import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { UploadButton } from "./UploadButton";
import { useWaveSurfer } from "../hooks";

type VideoFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

export function VideoFactoryContainer({
  factoryData,
}: VideoFactoryContainerProps) {
  console.log(factoryData);
  const [file, setFile] = useState<File | undefined>(undefined);
  const videoSrc = file ? URL.createObjectURL(file) : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);

  const { waveformRef } = useWaveSurfer({
    file,
    videoRef,
  });

  const updateFile = (file: File) => {
    setFile(file);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <UploadButton
          hasVideo={Boolean(file)}
          updateFile={(targetFile) => updateFile(targetFile)}
        />
      </div>
      {videoSrc && (
        <div className="flex flex-col items-center">
          <video
            key={videoSrc}
            controls
            playsInline
            className="block"
            ref={videoRef}
            src={videoSrc}
          />
        </div>
      )}
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}
