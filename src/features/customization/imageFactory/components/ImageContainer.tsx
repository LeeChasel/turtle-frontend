import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { forwardRef } from "react";

type ImageContainerProps = {
  factoryData: CustomizationDetail;
};

export const ImageContainer = forwardRef<
  HTMLCanvasElement,
  ImageContainerProps
>((props, ref) => {
  const { factoryData } = props;
  const defaultWidth =
    factoryData.customization.fileRequirePara.image_width || undefined;
  const defaultHeight =
    factoryData.customization.fileRequirePara.image_height || undefined;
  return (
    <div>
      <canvas
        ref={ref}
        width={defaultWidth}
        height={defaultHeight}
        className="object-contain m-auto border border-gray-800 w-full max-h-[60vh]"
      />
    </div>
  );
});
