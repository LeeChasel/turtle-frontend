import { useProductContext } from "../../Provider/ProductProvider";
import BlurhashImage from "../BlurhashImage";

function DetailImagesContainer() {
  const { product } = useProductContext();

  return (
    <div className="flex flex-col px-48 xl:px-80">
      <div className="p-1 border border-black rounded-lg shadow border-opacity-20">
        {product.detailImage?.map((detailData, index) => (
          <div key={index} className="flex flex-col">
            {detailData.description?.trim().length !== 0 && (
              <span>{detailData.description}</span>
            )}
            {detailData.blurhash && (
              <BlurhashImage
                blurhash={detailData.blurhash}
                imageId={detailData.imageId!}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetailImagesContainer;
