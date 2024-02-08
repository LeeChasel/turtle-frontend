function CheckOrder() {
  const ProductTable = ({ products }) => (
    <table className="product-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Sold Quantity</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.quantity}</td>
            <td>{product.soldQuantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <div>
      訂購人資訊:
      <div>訂購人:</div>
      <div>電子郵件:</div>
      <div>訂購日期:</div>
      <div>訂單狀態:</div>
      <div>訂購商品:</div>
      <ProductTable products={products} />
    </div>
  );
}

export default CheckOrder;
