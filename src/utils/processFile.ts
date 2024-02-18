import { encode } from "blurhash";
import type { TImage, TImageData } from "../types/Product";
import updateFile from "../actions/updateFile";

export async function getImageData(data: TImageData) {
  try {
    const imageData: TImage = {
      description: data.description ?? "",
    };
    if (data.image !== null) {
      const imageId = await updateFile(data.image);
      const { blurhash, width, height } = await imageToBlurhash(data.image);
      imageData.imageId = imageId.field;
      imageData.blurhash = blurhash;
      imageData.width = width;
      imageData.height = height;
    }
    return imageData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
}

export async function imageToBlurhash(file: File) {
  // Can't use remote storage as src, it would cause error
  const loadImage = async () =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        reject("Error happened when transform image to blurhash");
      };
      img.src = URL.createObjectURL(file);
    });

  const getImageData = (image: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
  };

  const image = await loadImage();
  const imageData = getImageData(image);
  const blurhash = encode(
    imageData.data,
    imageData.width,
    imageData.height,
    4,
    4,
  );
  return {
    blurhash: blurhash,
    width: image.width,
    height: image.height,
  };
}
