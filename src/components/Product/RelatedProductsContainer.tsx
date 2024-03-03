import { Link, useLocation } from "react-router-dom";
import { useProductContext } from "@/Provider/ProductProvider";
import { TBanner } from "@/types/Product";
import BlurhashImage from "@/components/BlurhashImage";

function RelatedProductsContainer() {
  const { product } = useProductContext();
  const location = useLocation();
  const isSpecialRoute = location.pathname.startsWith("/special");

  return (
    <div>
      <span className="ml-5 lg:ml-10 text-[0.56rem] md:text-[1.5rem]">
        其他配件：
      </span>
      <div className="relative flex w-full gap-10 px-[3.125rem] md:px-[7.547rem] lg:px-40  overflow-x-auto md:gap-24 lg:gap-32 snap-x mb-3 mt-1">
        {product.relatedProducts.map((relatedProduct) => (
          <RelatedProduct
            key={relatedProduct.productId}
            product={relatedProduct}
            linkPath={
              isSpecialRoute
                ? `/special/product/${relatedProduct.productId}`
                : `/product/${relatedProduct.productName}`
            }
          />
        ))}
      </div>
    </div>
  );
}

function RelatedProduct({
  product,
  linkPath,
}: {
  product: TBanner;
  linkPath: string;
}) {
  return (
    <Link to={linkPath}>
      <div
        className="flex flex-col items-center justify-center w-16 md:w-28 lg:w-60 snap-center shrink-0"
        title={product.productName}
      >
        <div className="w-full mask mask-square shrink-0">
          <BlurhashImage
            blurhash={product.bannerImage.blurhash!}
            imageId={product.bannerImage.imageId!}
            productId={product.productId!}
          />
        </div>
        <span className="w-full break-words line-clamp-2">
          {product.productName}
        </span>
      </div>
    </Link>
  );
}

export default RelatedProductsContainer;
