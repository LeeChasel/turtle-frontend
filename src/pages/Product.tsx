import { useParams } from "react-router-dom";
import useProductByName from "../hooks/useProductByName";
import { ProductProvider } from "../Provider/ProductProvider";
import { VariationProvider } from "../Provider/VariationProvider";
import DetailImagesContainer from "../components/Product/DetailImagesContainer";
import InfoContainer from "../components/Product/InfoContainer";
import { useEffect } from "react";

function Product() {
  // The productName and productId is defined in route file as dynamic placeholder
  const productName = useParams().productName;
  const productId = useParams().productId;

  // Change document title when component mount and unmount
  useEffect(() => {
    document.title = productName + " | LazyTurtle";
    return () => {
      document.title = "Lazy Turtle";
    };
  }, [productName, productId]);

  const { data: productData, status, error } = useProductByName(productName!);
  if (status === "pending") {
    return <div>Loading...</div>;
  } else if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  const defaultVariation = productData.variation?.find(
    (item) => item.available,
  );
  if (!defaultVariation) {
    return <div>Have no variation can buy now</div>;
  }

  return (
    <ProductProvider defaultProduct={productData}>
      <div className="px-[60px] pt-20">
        <VariationProvider defaultVariation={defaultVariation}>
          <InfoContainer />
        </VariationProvider>
        <div className="mb-6 border-2 border-black" />
        <DetailImagesContainer />
      </div>
    </ProductProvider>
  );
}

export default Product;
