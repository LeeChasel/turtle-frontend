import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { isNumber } from "lodash";
import { forwardRef, useRef, useState } from "react";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type CutDialogProps = {
  originalImage: string;
  factoryData: CustomizationDetail;
  setCropImageCallback: (
    img: HTMLImageElement | null,
    crop: PixelCrop | undefined,
  ) => void;
};

export const CropDialog = forwardRef<HTMLDialogElement, CutDialogProps>(
  (props, ref) => {
    const { originalImage, setCropImageCallback } = props;
    const { image_width, image_height } =
      props.factoryData.customization.fileRequirePara;
    const hasFixedSize = isNumber(image_width) && isNumber(image_height);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imageRef = useRef<HTMLImageElement>(null);

    return (
      <dialog ref={ref} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">剪裁圖片</h3>
          <div className="flex justify-between items-center">
            <p className="py-4">請選擇要剪裁的範圍</p>
            {hasFixedSize && (
              <div className="space-x-2">
                <span className="badge badge-primary p-3">
                  寬：{image_width}
                </span>
                <span className="badge badge-primary p-3">
                  高：{image_height}
                </span>
              </div>
            )}
          </div>

          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(crop) => {
              setCompletedCrop(crop);
            }}
            maxWidth={image_width || undefined}
            maxHeight={image_height || undefined}
          >
            <img
              ref={imageRef}
              src={originalImage}
              alt="crop image"
              className="w-full h-full"
            />
          </ReactCrop>

          <div className="modal-action">
            <form method="dialog" className="space-x-3">
              <button className="btn btn-primary">取消</button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setCropImageCallback(imageRef.current, completedCrop)
                }
              >
                確定
              </button>
            </form>
          </div>
        </div>
      </dialog>
    );
  },
);
