import type { TImage } from "../types/Product";
import { Link } from "react-router-dom";
import BlurhashImage from "./BlurhashImage";

type BannertCardProps = {
  productName: string;
  currentPrice: number;
  bannerImage: TImage;
};

function BannerCard({
  productName,
  currentPrice,
  bannerImage,
}: BannertCardProps) {
  const blurhash = bannerImage.blurhash!;
  const imageId = bannerImage.imageId!;
  const link = "/product/" + productName;

  return (
    <Link to={link}>
      <div className="shadow-xl card card-compact w-full h-[600px] bg-base-100">
        <figure className="h-full basis-4/5">
          <BlurhashImage imageId={imageId} blurhash={blurhash} />
        </figure>
        <div className="card-body basis-1/5">
          <h2 className="card-title">{productName}</h2>
          <h3 className="text-2xl font-extrabold text-gray-800">
            ${currentPrice}
          </h3>
        </div>
      </div>
    </Link>
  );
}

export default BannerCard;
