import getCustomizationFiles from "@/actions/getCustomizationFiles";
import getProductById from "@/actions/getProductById";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { OrderDetail } from "@/types/Order";
import { showToast } from "@/utils/toastAlert";

type ItemProps = {
  data: OrderDetail;
  itemIndex: number;
};

export default function Item({ data, itemIndex }: ItemProps) {
  const currentItem = data.items[itemIndex];
  const hasCustomization = currentItem.customizations.length > 0;
  const { productName, variationName, variationSpec, quantity } = currentItem;

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
            <td>{productName}</td>
            <td>{variationName}</td>
            <td>{variationSpec}</td>
            <td>{quantity}</td>
          </tr>
          {hasCustomization && (
            <CustomizationBtn data={data} itemIndex={itemIndex} />
          )}
        </tbody>
      </table>
    </div>
  );
}

function CustomizationBtn({
  data,
  itemIndex,
}: {
  data: OrderDetail;
  itemIndex: number;
}) {
  const { tokenCookie } = useUserTokenCookie();
  const { orderId } = data;
  async function handleDownload() {
    try {
      const filePromise = getCustomizationFiles(
        tokenCookie!,
        orderId,
        itemIndex,
      );
      const productPromise = getProductById(data.items[itemIndex].productId);
      const [file, product] = await Promise.all([filePromise, productPromise]);
      const url = window.URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${orderId}_${product.productName}_客製化檔案.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }
  return (
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>
        <button
          type="button"
          className="w-full bg-white btn btn-outline"
          onClick={handleDownload}
        >
          客製化檔案下載
        </button>
      </td>
    </tr>
  );
}
