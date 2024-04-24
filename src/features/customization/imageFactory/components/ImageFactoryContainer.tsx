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

  return (
    <div className="flex gap-2 md:gap-5 lg:gap-8">
      <ActionContainer changeActionCallback={changeFactoryAction} />
      <div className="w-full space-y-2">
        <UploadButton
          changeSourceImageCallback={handleSourceImageChange}
          hasSourceImage={hasSourceImage}
        />
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
