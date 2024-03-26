import {
  SimpleFilesCustomization,
  SimpleFilesCustomizationBrief,
} from "./SimpleFilesCustomization";

export type CustomizationBase = {
  name: string;
  /** Set to true if this customization is required */
  required: boolean;
};

export enum CustomizationType {
  SIMPLEFILES = "SimpleFiles",
}

export type CustomizationDetail = CustomizationBase & SimpleFilesCustomization;
export type CustomizationBrief = Omit<CustomizationBase, "required"> &
  SimpleFilesCustomizationBrief;
