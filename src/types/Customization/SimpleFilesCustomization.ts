import { CustomizationType } from "./CustomizationBase";

// Detail
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

// Brief
export type SimpleFilesCustomizationBrief = Omit<
  SimpleFilesCustomization,
  "customization"
> & {
  customization: SimpleFileRequireParaBrief;
};
export type SimpleFileRequireParaBrief = Omit<
  SimpleFilesCustomizationDetail,
  "fileRequirePara"
> & {
  fileRequirePara: {
    fileIds: string[];
  };
};
