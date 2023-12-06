import React, { forwardRef } from "react";
import type { TBanner } from "../../types/Product";
import BannerCard from "../BannerCard";

type ProductBannerRefProps = {
  product: TBanner;
};

const BannerRef = forwardRef<HTMLDivElement, ProductBannerRefProps>(
  ({ product }, ref) => {
    const productItem = (
      <BannerCard
        productName={product.productName}
        bannerImage={product.bannerImage}
        currentPrice={product.currentPrice!}
      />
    );
    const content = ref ? (
      <div ref={ref}>{productItem}</div>
    ) : (
      <div>{productItem}</div>
    );

    return content;
  },
);

// React.memo to prevent re-render this component when add new product to original product array
export default React.memo(BannerRef);
