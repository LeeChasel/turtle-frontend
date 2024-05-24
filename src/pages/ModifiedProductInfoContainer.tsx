import useProductByAdmin from "@/hooks/useProductByAdmin";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { useSearchParams } from "react-router-dom";
import ModifyProductInfo from "./ModifyProductInfo";

function ModifiedProductInfoContainer() {
  const { tokenCookie } = useUserTokenCookie();
  const [searchParams] = useSearchParams();
  const productID = searchParams.get("productID");
  const { data: productInfo, status } = useProductByAdmin(
    productID!,
    tokenCookie!,
  );
  if (status === "pending") {
    return <>Loading...</>;
  }
  console.log(productInfo);
  return <ModifyProductInfo data={productInfo!} tokenCookie={tokenCookie!} />;
}
export default ModifiedProductInfoContainer;
