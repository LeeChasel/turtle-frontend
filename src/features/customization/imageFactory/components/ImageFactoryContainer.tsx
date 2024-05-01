import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { useRef, useState } from "react";
import { ActionContainer } from "./ActionContainer";
import { UploadButton } from "./UploadButton";
import { ImageContainer } from "./ImageContainer";
import {
  FactoryAction,
  ImageFactoryData,
  ImageFactoryDataStore,
} from "../types";
import { CropDialog } from "./CropDialog";
import { readFileAsDataURL, setCanvasPreview } from "../utils";
import { showToast } from "@/utils/toastAlert";
import { PixelCrop } from "react-image-crop";
import { useForm, useFieldArray } from "react-hook-form";

type ImageFactoryContainerProps = {
  factoryData: CustomizationDetail;
};

type FormInputs = {
  factoryUnit: ImageFactoryDataStore[];
};

export function ImageFactoryContainer({
  factoryData,
}: ImageFactoryContainerProps) {
  const { minRequiredfilesCount, maxRequiredfilesCount } =
    factoryData.customization.fileRequirePara;

  const form = useForm<FormInputs>({
    defaultValues: { factoryUnit: [] },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "factoryUnit",
  });
  const appendable = fields.length < maxRequiredfilesCount;
  const removable = fields.length > minRequiredfilesCount;

  const content = fields.map((_, index) => {
    const isLatest = index === fields.length - 1;
    const removeFn = () => {
      remove(index);
    };
    const appendFn = () => {
      append({
        crop: {
          height: 0,
          unit: "px",
          width: 0,
          x: 0,
          y: 0,
        },
        completedCrop: { x: 0, y: 0, width: 0, height: 0, unit: "px" },
        originalImage: "",
        croppedImage: "",
      });
    };
    return (
      <FactoryUnit
        factoryData={factoryData}
        key={index}
        currentIndex={index}
        isLatest={isLatest}
        appendable={appendable}
        appendFn={appendFn}
        removable={removable && index > minRequiredfilesCount - 1}
        removeFn={removeFn}
      />
    );
  });

  return <div className="space-y-5">{content}</div>;
}

type FactoryUnitProps = ImageFactoryContainerProps & {
  isLatest?: boolean;
  currentIndex: number;
  appendable: boolean;
  appendFn: () => void;
  removable: boolean;
  removeFn: () => void;
};
const FactoryUnit = (props: FactoryUnitProps) => {
  const {
    factoryData,
    isLatest,
    appendable,
    removable,
    appendFn,
    removeFn,
    currentIndex,
  } = props;
  const [_factoryAction, setFactoryAction] = useState<FactoryAction>("crop");
  const [imageData, setImageData] = useState<ImageFactoryData>({
    originalImage: "",
    croppedImage: "",
  });
  const cropDialogRef = useRef<HTMLDialogElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const hasSourceImage = imageData.originalImage !== "";
  const isFirst = currentIndex === 0;

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
  return (
    <>
      <div className="flex gap-2 md:gap-5 lg:gap-8">
        <div className="flex flex-col justify-between basis-1/3 max-w-[300px]">
          <ActionContainer changeActionCallback={changeFactoryAction} />
          <div className="flex flex-col gap-2">
            {removable && (
              <button
                type="button"
                onClick={removeFn}
                className="btn btn-primary mt-2"
              >
                移除此項
              </button>
            )}

            {appendable && isLatest && (
              <button
                type="button"
                onClick={appendFn}
                className="btn btn-primary"
              >
                增加數量
              </button>
            )}
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="flex justify-end gap-2">
            {isFirst && (
              <button type="button" className="btn btn-primary">
                儲存全部
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

      {!isLatest && <div className="divider divider-primary" />}
    </>
  );
};
