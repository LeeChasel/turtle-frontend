import { useCallback, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import getAllProduct from "@/actions/getAllProduct";
import getProductByName from "@/actions/getProductByName";
import ProductInfoRef from "./ProductInfoRef";
import { ProductResponse } from "@/types/Product";
import ProductModifiedInfoRef from "./ProductModifiedInfoRef";
import { showToast } from "@/utils/toastAlert";

function ModifyProduct() {
  const productNameRef = useRef<HTMLInputElement>(null);
  const [priceOrder, setPriceOrder] = useState("DESCENDING");
  const [targetTProduct, setTargetTProduct] = useState<ProductResponse[]>();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["productList", priceOrder],
    queryFn: ({ pageParam }) => getAllProduct(pageParam, priceOrder),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: true,
  });

  const intObserver = useRef<IntersectionObserver>();
  const lastOrderRef = useCallback(
    (order: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((order) => {
        if (order[0].isIntersecting && hasNextPage) {
          void fetchNextPage();
        }
      });

      if (order) intObserver.current.observe(order);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  if (status === "error") return <p>Error: {error.message}</p>;

  const content = data?.pages.map((pages) => {
    return pages.map((order, index) => {
      if (pages.length === index + 1) {
        return <ProductInfoRef ref={lastOrderRef} info={order} key={index} />;
      }
      return <ProductInfoRef info={order} key={index} />;
    });
  });

  const targetProduct =
    targetTProduct != undefined ? (
      <ProductModifiedInfoRef info={targetTProduct[0]} key={0} />
    ) : null;

  async function getProductResponse(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const name = productNameRef.current?.value;
    if (name != undefined && name.length > 0) {
      try {
        const target = await getProductByName(name);
        if (target.length === 0) {
          throw new Error("查無資料");
        } else {
          setTargetTProduct(target);
        }
      } catch (error) {
        if (error instanceof Error) {
          showToast("error", error.message);
        }
      }
    } else {
      setTargetTProduct(undefined);
    }
  }
  return (
    <>
      <form className="bg-[#F9F9F9] border border-black grid grid-cols-5 gap-4 pl-12 grow h-20 text-center">
        <div className="m-auto">商品名稱：</div>
        <div className="m-auto">
          <input
            type="text"
            className="w-full max-w-xs input input-bordered"
            ref={productNameRef}
          />
        </div>
        <div className="m-auto">價錢順序:</div>
        <div className="m-auto">
          <select
            className="border-2 border-black"
            defaultValue={priceOrder}
            onChange={(e) => setPriceOrder(e.target.value)}
          >
            <option value="DESCENDING">高到低</option>
            <option value="ASCENDING">低到高</option>
          </select>
        </div>

        <div className="m-auto">
          <button className="btn" onClick={getProductResponse}>
            查詢
          </button>
        </div>
      </form>
      {targetProduct ? targetProduct : content}
      {isFetchingNextPage && <p>Loading...</p>}
    </>
  );
}
export default ModifyProduct;
