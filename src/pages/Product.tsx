import { useParams } from "react-router-dom";
import useProductByName from "../hooks/useProductByName";
import { ProductProvider } from "../Provider/ProductProvider";
import { VariationProvider } from "../Provider/VariationProvider";
import DetailImagesContainer from "../components/Product/DetailImagesContainer";
import InfoContainer from "../components/Product/InfoContainer";
import { useEffect } from "react";
import useProductById from "../hooks/useProductById";
import Notfound from "./Notfound";

function Product() {
  // The productName and productId is defined in route file as dynamic placeholder
  const { productName, productId } = useParams();

  const { data: dataById, error: dataByIdError } = useProductById(productId);
  const { data: dataByName, error: dataByNameError } =
    useProductByName(productName);

  // Change document title when component mount and unmount
  useEffect(() => {
    if (productName) {
      document.title = productName + " | LazyTurtle";
    } else if (dataById) {
      document.title = dataById.productName + " | LazyTurtle";
    }
    return () => {
      document.title = "Lazy Turtle";
    };
  }, [productName, dataById]);

  // handle productName or productId not found, meaning no product found
  if (dataByIdError instanceof Error || dataByNameError instanceof Error) {
    return <Notfound />;
  }

  const productData = dataById ? dataById : dataByName;
  // data is loading
  if (!productData) {
    return <div className="fixed w-full h-full bg-base-100"></div>;
  }

  // process no variation can buy now
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
