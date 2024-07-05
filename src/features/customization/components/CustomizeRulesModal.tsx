import { useEffect, useRef } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { SimpleFileRequirePara } from "@/types/Customization/SimpleFilesCustomization";
import useCustomizationResultStore from "../store/useCustomizationResultStore";

export default function CustomizeRulesModal({
  data,
  type,
  name,
}: {
  data: SimpleFileRequirePara;
  type: "image" | "audio" | "video";
  name: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const {
    image_width,
    image_height,
    audio_length,
    video_length,
    video_width,
    video_height,
    minRequiredfilesCount,
    maxRequiredfilesCount,
  } = data;
  const visitedCustomizes = useCustomizationResultStore.use.visitedCustomizes();
  const addVisit = useCustomizationResultStore.use.addVisitedCustomize();

  useEffect(() => {
    if (!visitedCustomizes.includes(name)) {
      openDialog();
    }
    addVisit(name);
  }, [name, visitedCustomizes, addVisit]);

  const content = (
    <ul className="list-disc ml-4">
      {minRequiredfilesCount !== 0 && (
        <li>最少需上傳 {minRequiredfilesCount} 個檔案</li>
      )}
      {maxRequiredfilesCount !== 0 && (
        <li>最多需上傳 {maxRequiredfilesCount} 個檔案</li>
      )}

      {type === "video" && (
        <>
          {video_length !== 0 && <li>影片長度不得超過 ${video_length} 秒</li>}
          {video_width !== 0 && <li>影片寬度不得超過 ${video_width} px</li>}
          {video_height !== 0 && <li>影片高度不得超過 ${video_height} px</li>}
        </>
      )}

      {type === "image" && (
        <>
          {image_width !== 0 && <li>圖片寬度不得超過 ${image_width} px</li>}
          {image_height !== 0 && <li>圖片高度不得超過 ${image_height} px</li>}
        </>
      )}

      {type === "audio" && (
        <>
          {audio_length !== 0 && <li>音樂長度不得超過 ${audio_length} 秒</li>}
        </>
      )}
    </ul>
  );

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openDialog}>
        <AiOutlineExclamationCircle className="w-5 h-5" />
        顯示客製化限制
      </button>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">客製化限制</h3>
          {content}
        </div>

        {/* it covers the screen so we can close the modal when clicked outside */}
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-auto">close</button>
        </form>
      </dialog>
    </>
  );
}
