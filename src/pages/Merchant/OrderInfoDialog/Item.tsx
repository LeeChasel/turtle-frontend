import { OrderDetailItem } from "@/types/Order";

type ItemProps = {
  itemData: OrderDetailItem;
};

export default function Item({ itemData }: ItemProps) {
  const hasCustomization = itemData.customizations.length > 0;
  return (
    <div className="overflow-x-auto border border-black rounded bg-stone-50">
      <table className="table">
        <thead>
          <tr>
            <th className="w-[40%]">商品名稱</th>
            <th className="w-[20%]">樣式</th>
            <th className="w-[20%]">規格</th>
            <th className="w-[20%]">數量</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-0">
            <td>{itemData.productName}</td>
            <td>{itemData.variationName}</td>
            <td>{itemData.variationSpec}</td>
            <td>{itemData.quantity}</td>
          </tr>
          {hasCustomization && <CustomizationBtn />}
        </tbody>
      </table>
    </div>
  );
}

function CustomizationBtn() {
  return (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>
        <button type="button" className="w-full bg-white btn btn-outline">
          客製化
        </button>
      </td>
    </tr>
  );
}
