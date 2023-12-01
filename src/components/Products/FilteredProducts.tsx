import { useRef, useCallback } from "react";
import getProductsByQuery from "../../actions/getProductsByQuery";
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from "react-router-dom";
import BannerRef from "./BannerRef";

function FilteredProducts() {
  const [searchParams] = useSearchParams();

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["filteredProducts", searchParams.toString()],
    queryFn: ({pageParam}) => getProductsByQuery(pageParam, searchParams),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
  });

  const intObserver = useRef<IntersectionObserver>();
  const lastProductRef = useCallback((product: any) => {
    if (isFetchingNextPage) return;

    if (intObserver.current) intObserver.current.disconnect();

    intObserver.current = new IntersectionObserver(products => {
      if (products[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (product) intObserver.current.observe(product);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  if (status === 'error') return <p>Error: {error.message}</p>

  const content = data?.pages.map(pages => {
    return pages.map((product, index) => {
      if (pages.length === index + 1) {
        return <BannerRef ref={lastProductRef} product={product} key={index}/>
      }
      return <BannerRef product={product} key={index}/>
    })
  })

  return (
    <section className="grid grid-cols-4 gap-3 pl-12 grow">
      {content}
      {isFetchingNextPage && <p>Loading...</p>}
    </section>
  )
}
export default FilteredProducts;