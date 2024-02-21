import type { TBanner } from "../types/Product";
import { Link } from "react-router-dom";
import BlurhashImage from "./BlurhashImage";

type BannerCardProp = {
  banner: TBanner;
};

function BannerCard(props: BannerCardProp) {
  const blurhash = props.banner.bannerImage.blurhash!;
  const imageId = props.banner.bannerImage.imageId!;
  const link = "/product/" + props.banner.productName;
  const productId = props.banner.productId!;
  const productName = props.banner.productName;
  const currentPrice = props.banner.currentPrice;

  return (
    <Link to={link}>
      <div className="shadow-xl card card-compact w-full h-[600px] bg-base-100">
        <figure className="h-full basis-4/5">
          <BlurhashImage
            productId={productId}
            imageId={imageId}
            blurhash={blurhash}
          />
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
