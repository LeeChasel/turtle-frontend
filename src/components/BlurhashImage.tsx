import { useEffect, useState } from "react";
import clsx from "clsx";
import { BlurhashCanvas } from "react-blurhash";

type BlurhashImageProp = {
  productId: string;
  imageId: string;
  blurhash: string;
};

function BlurhashImage({ productId, imageId, blurhash }: BlurhashImageProp) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const src =
    import.meta.env.VITE_TURTLE_PRODUCT_IMAGE_URL +
    "/" +
    productId +
    "/" +
    imageId;
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = src;
  }, [src]);

  return (
    <>
      {!imageLoaded && <BlurhashCanvas hash={blurhash} className="size-full" />}
      <img
        src={src}
        alt={imageId}
        loading="lazy"
        className={clsx("size-full", !imageLoaded && "hidden")}
      />
    </>
  );
}

export default BlurhashImage;
