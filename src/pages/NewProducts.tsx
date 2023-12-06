import { Fragment } from "react";
import BannerCard from "../components/BannerCard";
import useNewArrivalProducts from "../hooks/useNewArrivalProducts";

function NewProducts() {
  return (
    <div className="flex flex-col items-center mt-[185px] gap-[153px]">
      {/* Too ugly need to design */}
      <h1 className="text-4xl">新上市產品！ (醜到要設計)</h1>
      <div className="grid grid-cols-3 gap-[100px] w-full px-[260px]">
        <Products />
      </div>
    </div>
  );
}

function Products() {
  const { data: products, error, status } = useNewArrivalProducts();
  return (
    <>
      {status === "pending" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p>Error happened: {error.message}</p>
      ) : (
        products.map((banner) => (
          <Fragment key={banner.productId}>
            <BannerCard
              productName={banner.productName}
              currentPrice={banner.currentPrice!}
              bannerImage={banner.bannerImage}
            />
          </Fragment>
        ))
      )}
    </>
  );
}

export default NewProducts;
