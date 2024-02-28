import { ChangeEvent, useRef } from "react";
import { useProductContext } from "../../Provider/ProductProvider";
import { useVariationContext } from "../../Provider/VariationProvider";
import { showToast } from "../../utils/toastAlert";
import PurchaseInfo from "./PurchaseInfo";
import ImageGallery, { type ReactImageGalleryItem } from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

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
  });
  // Preview image
  product.previewImages?.forEach((image) => {
    // TODO: Prevent bannerImage and the first of previewImages are the same. Not working now
    if (image.blurhash === product.bannerImage?.blurhash) return;

    const url = `${ImageURL}/${product.productId}/${image.imageId}`;
    galleryImages.push({
      original: url,
      thumbnail: url,
    });
  });
  // Variation image
  product.variations?.forEach((image) => {
    const url = `${ImageURL}/${product.productId}/${image.bannerImage?.imageId}`;
    galleryImages.push({
      original: url,
      thumbnail: url,
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
    <div className="w-screen  flex mb-[6.75rem]">
      <div className="px-10 basis-1/2 w-3/4">
        <ImageGallery
          items={galleryImages}
          showPlayButton={false}
          showFullscreenButton={false}
          ref={galleryRef}
        />
      </div>
      <div className="text-base flex flex-col basis-1/2 pl-[105px]">
        <div className="pl-2 text-2xl font-bold">{product.productName}</div>
        <div className="pl-4 mb-3 text-2xl">{product.productDescription}</div>
        <div className="mb-3 border-2 border-black" />
        <section className="inline-block px-4 py-2 mb-3 text-2xl text-white bg-blue-500 rounded-full w-fit">
          ${variation.currentPrice}
        </section>
        <div className="flex flex-col gap-3 mb-[34px] p-3 border border-black rounded-lg shadow border-opacity-20">
          <label className="text-lg">選擇種類</label>
          <select
            className="w-full select select-bordered"
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
                  className={available ? "" : "bg-gray-300"}
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
