import { useParams } from "react-router-dom";


function Product() {
  const { productName } = useParams();  
  return (
    <div>Product, {productName}</div>
  )
}

export default Product