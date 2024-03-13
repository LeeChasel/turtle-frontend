import { useParams } from "react-router-dom";
import useProductByName from "../hooks/useProductByName";
import { ProductProvider } from "../Provider/ProductProvider";
import { VariationProvider } from "../Provider/VariationProvider";
import DetailImagesContainer from "../components/Product/DetailImagesContainer";
import InfoContainer from "../components/Product/InfoContainer";
import { useEffect } from "react";
import useProductById from "../hooks/useProductById";
import Notfound from "./Notfound";
import login from "../actions/login";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useAnonymousProductStore from "../store/useAnonymousProductStore";
import { anonymousUser } from "../utils/anonymity";
import RelatedProductsContainer from "@/components/Product/RelatedProductsContainer";
import { reject } from "lodash";

function Product() {
  // The productName and productId is defined in route file as dynamic placeholder
  const { productName, productId } = useParams();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const updateProductIdInSession = useAnonymousProductStore(
    (state) => state.updateProductId,
  );

  if (productId) {
    updateProductIdInSession(productId);
  }

  const { data: dataById, error: dataByIdError } = useProductById(productId);
  const { data: dataByName, error: dataByNameError } =
    useProductByName(productName);

  useEffect(() => {
    async function processAnonymousLogin() {
      try {
        if (validateTokenRole(tokenCookie, "ROLE_ANONYMITY_CUSTOMER")) return;
        const jwt = await login(anonymousUser, "匿名登入帳密錯誤");
        setUserTokenCookie(jwt);
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    }
    if (productId) void processAnonymousLogin();
    // Do not add dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const defaultVariation = productData.variations?.find(
    (item) => item.available,
  );
  if (!defaultVariation) {
    return <div>Have no variation can buy now</div>;
  }

  // only show the available related products
  const availableRelatedProducts = reject(productData.relatedProducts, {
    available: false,
  });

  return (
    <ProductProvider
      defaultProduct={{
        ...productData,
        relatedProducts: availableRelatedProducts,
      }}
    >
      <div className="pt-20">
        <VariationProvider defaultVariation={defaultVariation}>
          <InfoContainer />
        </VariationProvider>
        {availableRelatedProducts.length > 0 && (
          <>
            <div className="border-2 border-black" />
            <RelatedProductsContainer />
          </>
        )}
        <div className="my-2 border-2 border-black md:my-4" />
        <DetailImagesContainer />
      </div>
    </ProductProvider>
  );
}

export default Product;
