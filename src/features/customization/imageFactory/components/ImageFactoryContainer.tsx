import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { useRef, useState } from "react";
import { ActionContainer } from "./ActionContainer";
import { UploadButton } from "./UploadButton";
import { ImageContainer } from "./ImageContainer";
import { FactoryAction, ImageFactoryData } from "../types";
import { CropDialog } from "./CropDialog";
import { readFileAsDataURL, setCanvasPreview } from "../utils";
import { showToast } from "@/utils/toastAlert";
import { PixelCrop } from "react-image-crop";
import useCustomizationResultStore from "../../store/useCustomizationResultStore";
import CustomizeRulesModal from "../../components/CustomizeRulesModal";

type ImageFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

export function ImageFactoryContainer({
  factoryData,
}: ImageFactoryContainerProps) {
  const [_factoryAction, setFactoryAction] = useState<FactoryAction>("crop");
  const [imageData, setImageData] = useState<ImageFactoryData>({
    originalImage: "",
    croppedImage: "",
  });
  const cropDialogRef = useRef<HTMLDialogElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const hasSourceImage = imageData.originalImage !== "";
  const toStoreImage = useCustomizationResultStore.use.addImage();

  const changeFactoryAction = (action: FactoryAction) => {
    if (!hasSourceImage) {
      showToast("error", "請先上傳圖片");
      return;
    }
    if (action === "crop") {
      cropDialogRef.current?.showModal();
    }
    setFactoryAction(action);
  };

  const handleSourceImageChange = (image: File) => {
    void readFileAsDataURL(image).then((dataUrl) => {
      setImageData({
        originalImage: dataUrl,
        croppedImage: "",
      });
      const canvas = previewCanvasRef.current;
      canvas
        ?.getContext("2d")
        ?.clearRect(
          0,
          0,
          factoryData.customization.fileRequirePara.image_width || canvas.width,
          factoryData.customization.fileRequirePara.image_height ||
            canvas.height,
        );
    });
    cropDialogRef.current?.showModal();
  };

  const handleCropImageChange = (
    img: HTMLImageElement | null,
    crop: PixelCrop | undefined,
  ) => {
    const canvas = previewCanvasRef.current;
    if (!img || !canvas || !crop) {
      showToast("error", "無法取得圖片或畫布內容，請重新選擇圖片或重新剪裁");
      return;
    }
    setCanvasPreview(img, canvas, crop);
  };

  const handleStore = () => {
    const canvas = previewCanvasRef.current;
    const fileMimeType =
      factoryData.customization.fileRequirePara.fileMimeTypes[0];
    canvas?.toBlob(
      (blob) => {
        if (!blob) {
          showToast("error", "儲存圖片錯誤");
          return;
        }

        const fileResult = new File([blob], `圖片客製化_${factoryData.name}`, {
          type: fileMimeType,
        });

        toStoreImage({
          name: factoryData.name,
          fileType: fileMimeType,
          file: [fileResult],
        });
      },
      fileMimeType,
      1,
    );
  };

  return (
    <div className="flex gap-2 md:gap-5 lg:gap-8">
      <ActionContainer changeActionCallback={changeFactoryAction} />
      <CustomizeRulesModal
        data={factoryData.customization.fileRequirePara}
        type="image"
      />
      <div className="w-full space-y-2">
        <div className="flex justify-end gap-2">
          {/* @TODO: hasSourceImage ? */}
          {hasSourceImage && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleStore}
            >
              儲存此客製化
            </button>
          )}
          <UploadButton
            changeSourceImageCallback={handleSourceImageChange}
            hasSourceImage={hasSourceImage}
          />
        </div>
        <ImageContainer factoryData={factoryData} ref={previewCanvasRef} />
      </div>

      <CropDialog
        originalImage={imageData.originalImage}
        setCropImageCallback={handleCropImageChange}
        factoryData={factoryData}
        ref={cropDialogRef}
      />
    </div>
  );
}
