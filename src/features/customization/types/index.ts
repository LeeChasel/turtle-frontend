import { CustomizationDetail } from "@/types/Customization/CustomizationBase";
import { TBanner, TVariation } from "@/types/Product";

export type CustomizationContainerState = {
  readonly product: TBanner;
  readonly variation: TVariation;
  readonly quantity: number;
  readonly customization: CustomizationDetail[];
};
