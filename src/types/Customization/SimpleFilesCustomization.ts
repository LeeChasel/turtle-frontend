import { CustomizationType } from "./CustomizationBase";

export type SimpleFilesCustomization = {
  type: CustomizationType.SIMPLEFILES;
  customization: SimpleFilesCustomizationDetail;
};

export type SimpleFilesCustomizationDetail = {
  price: number;
  fileRequirePara: SimpleFileRequirePara;
};

export type SimpleFileRequirePara = {
  fileMimeTypes: string[];
  minRequiredfilesCount: number;
  maxRequiredfilesCount: number;
};
