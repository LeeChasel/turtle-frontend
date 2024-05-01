import { type Crop, PixelCrop } from "react-image-crop";
export type FactoryAction = "crop";

export type ImageFactoryData = {
  originalImage: string;
  croppedImage: string;
};

export type ImageFactoryDataStore = {
  originalImage: string;
  croppedImage: string;
  crop: Crop;
  completedCrop: PixelCrop;
};
