import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { TBanner, TVariation } from "@/types/Product";

type CustomizationContainerState = {
  readonly product: TBanner;
  readonly variation: TVariation;
  readonly quantity: number;
  readonly customization: CustomizationDetail[];
};

type ImageResult = {
  name: string;
  file: File[],
  fileType: string;
}

export type {
  CustomizationContainerState,
  ImageResult,
}