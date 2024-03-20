import { ChangeEvent, useRef } from "react";
import { useProductContext } from "../../Provider/ProductProvider";
import { useVariationContext } from "../../Provider/VariationProvider";
import { showToast } from "../../utils/toastAlert";
import PurchaseInfo from "./PurchaseInfo";
import ImageGallery, { type ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import clsx from "clsx";

const ImageURL = import.meta.env.VITE_TURTLE_PRODUCT_IMAGE_URL as string;

function InfoContainer() {
  const { product } = useProductContext();
  const { variation, changeVariation } = useVariationContext();
  const variationIndexs: number[] = [];
  const galleryImages: ReactImageGalleryItem[] = [];
  // Banner image
  galleryImages.push({
    original: `${ImageURL}/${product.productId}/${product.bannerImage?.imageId}`,
    thumbnail: `${ImageURL}/${product.productId}/${product.bannerImage?.imageId}`,
    loading: "lazy",
  });
  // Preview image
  product.previewImages?.forEach((image) => {
    // TODO: Prevent bannerImage and the first of previewImages are the same. Not working now
    if (image.blurhash === product.bannerImage?.blurhash) return;

    const url = `${ImageURL}/${product.productId}/${image.imageId}`;
    galleryImages.push({
      original: url,
      thumbnail: url,
      loading: "lazy",
    });
  });
  // Variation image
  product.variations?.forEach((image) => {
    const url = `${ImageURL}/${product.productId}/${image.bannerImage?.imageId}`;
    galleryImages.push({
      original: url,
      thumbnail: url,
      loading: "lazy",
    });
    variationIndexs.push(galleryImages.length - 1);
  });

  const galleryRef = useRef<ImageGallery>(null);

  const changeImage = (event: ChangeEvent<HTMLSelectElement>) => {
    const values = event.target.value.split("-");
    const variationName = values[0];
    const variationSpec = values[1];
    const variationIndex = Number(values[2]);
    const newVariation = product.variations?.find(
      (item) =>
        item.variationName === variationName &&
        item.variationSpec === variationSpec,
    );
    if (!newVariation) {
      showToast("error", "selected option value match no variations");
      return;
    }
    galleryRef.current?.slideToIndex(variationIndexs[variationIndex]);
    changeVariation(newVariation);
  };

  return (
    <div className="flex gap-2 px-1 lg:px-5">
      <div className="w-1/2 md:px-5 lg:px-10">
        <ImageGallery
          items={galleryImages}
          showPlayButton={false}
          showFullscreenButton={false}
          ref={galleryRef}
          renderItem={(item) => (
            <div className="aspect-square flex">
              <img
                src={item.original}
                alt={item.originalAlt}
                className="justify-items-center items-center w-full object-contain"
              />
            </div>
          )}
          renderThumbInner={(item) => (
            <div className="aspect-square">
              <img
                src={item.thumbnail}
                alt={item.thumbnailAlt}
                className="max-w-full max-h-full m-auto"
              />
            </div>
          )}
        />
      </div>
      <div className="flex flex-col w-1/2 space-y-2">
        <div
          className="pl-2 text-sm font-bold md:text-md lg:text-xl line-clamp-3"
          title={product.productName}
        >
          {product.productName}
        </div>
        {product.productDescription && (
          <div
            className="pl-2 text-sm md:text-md lg:text-xl line-clamp-2"
            title={product.productDescription}
          >
            {product.productDescription}
          </div>
        )}
        <div className="border-2 border-gray-800" />
        <section className="inline-block p-2 text-lg bg-white rounded-full md:text-center lg:text-2xl w-fit">
          ${variation.currentPrice}
        </section>
        <div className="flex flex-col p-1 border border-gray-800 rounded-lg shadow md:p-2 border-opacity-20">
          <label className="text-sm md:text-md lg:text-xl" htmlFor="select">
            種類
          </label>
          <select
            id="select"
            className="bg-white w-full select select-bordered select-sm md:select-md"
            defaultValue={
              variation.variationName + "-" + variation.variationSpec
            }
            onChange={changeImage}
          >
            {product.variations?.map((item, index) => {
              const optionName =
                item.variationName + " - " + item.variationSpec;
              const optionValue =
                item.variationName + "-" + item.variationSpec + "-" + index;
              const available = item.available;
              return (
                <option
                  key={index}
                  value={optionValue}
                  disabled={available ? false : true}
                  className={clsx(
                    "text-sm  bg-white md:text-base lg:text-lg",
                    available ? "" : "",
                  )}
                >
                  {optionName}
                </option>
              );
            })}
          </select>
        </div>
        <PurchaseInfo />
      </div>
    </div>
  );
}

export default InfoContainer;
