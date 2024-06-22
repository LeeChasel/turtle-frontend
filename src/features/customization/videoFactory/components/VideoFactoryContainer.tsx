import { useRef, useState } from "react";
import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { UploadButton } from "./UploadButton";
import { useWaveSurfer } from "../hooks";
import { showToast } from "@/utils/toastAlert";
import updateFile from "@/actions/updateFile";
import { getTrimmedVideo, trimVideo } from "@/actions/trimVideo";

type VideoFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

export function VideoFactoryContainer({
  factoryData,
}: VideoFactoryContainerProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const videoSrc = file ? URL.createObjectURL(file) : undefined;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isProcessing, setIsPorcessing] = useState(false);

  const { waveformRef, getRegionTime } = useWaveSurfer({
    file,
    videoRef,
  });

  const updateFileBlob = (file: File) => {
    setFile(file);
    if (videoSrc) URL.revokeObjectURL(videoSrc);
  };

  const handleEdit = async () => {
    try {
      if (!file) {
        throw new Error("請先上傳影片");
      }

      const { start, end } = getRegionTime();
      if (start === end || start < 0 || end < 0) {
        throw new Error("請選擇正確的剪輯區間");
      }

      setIsPorcessing(true);
      const uploadedFile = await updateFile(file, true);
      const targetMimeType =
        factoryData.customization.fileRequirePara.fileMimeTypes[0];
      const extension = targetMimeType.split("/")[1];
      const trimmedVideo = await trimVideo(uploadedFile.fileId, extension, {
        startTime: start,
        endTime: end,
      });

      const videoBlob = await getTrimmedVideo(trimmedVideo.fileId);
      setFile(
        new File([videoBlob], trimmedVideo.fileId, {
          type: targetMimeType,
        }),
      );

      // @TODO: process heartbeat
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsPorcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      {isProcessing && <LoadingComponent />}
      <div className="flex justify-end">
        <UploadButton
          hasVideo={Boolean(file)}
          updateFile={(targetFile) => updateFileBlob(targetFile)}
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

      <div>
        {file && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEdit}
          >
            剪輯
          </button>
        )}
      </div>
      <div ref={waveformRef} className="w-full" />
    </div>
  );
}

const LoadingComponent = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};
