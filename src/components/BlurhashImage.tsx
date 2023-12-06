import { useEffect, useState } from "react";
import clsx from "clsx";
import { BlurhashCanvas } from "react-blurhash";

type BlurhashImageProp = {
  imageId: string;
  blurhash: string;
};

function BlurhashImage({ imageId, blurhash }: BlurhashImageProp) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const src = import.meta.env.VITE_TURTLE_BACKEND_IMAGE_URL + "/" + imageId;
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = src;
  }, [src]);

  return (
    <>
      {!imageLoaded && (
        <BlurhashCanvas
          hash={blurhash}
          className="w-full h-full aspect-square"
        />
      )}
      <img
        src={src}
        alt={imageId}
        className={clsx(
          "w-full h-full pointer-events-none aspect-square",
          !imageLoaded && "hidden",
        )}
      />
    </>
  );
}

export default BlurhashImage;
