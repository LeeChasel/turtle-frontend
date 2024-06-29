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
  image_width: number;
  image_height: number;
  audio_length: number;
  video_length: number;
  video_width: number;
  video_height: number;
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
