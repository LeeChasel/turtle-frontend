import { getOrdersByMerchant } from "@/actions/getOrdersByMerchant";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { OrderStatus } from "@/types/Order";
import { useCallback, useRef, useState } from "react";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date-3";
import OrderInfoDialog from "./OrderInfoDialog/Index";
import { useInfiniteQuery } from "@tanstack/react-query";
import OrderInfoRef from "./OrderInfoRef";

function OrderProcessing() {
  const { tokenCookie } = useUserTokenCookie();
  const [checkoutDate, setCheckoutDate] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [day, setDay] = useState(new Date().getDate());
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.ALL);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["orderStatus", orderStatus.toString()],
    queryFn: ({ pageParam }) =>
      getOrdersByMerchant(
        tokenCookie!,
        orderStatus,
        pageParam,
        Math.ceil(checkoutDate.getTime() / 1000),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    refetchOnWindowFocus: false,
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
        return <OrderInfoRef ref={lastOrderRef} info={order} key={index} />;
      }
      return <OrderInfoRef info={order} key={index} />;
    });
  });

  function onChangeYear(value: number) {
    setYear(value);
  }

  function onChangeMonth(value: number) {
    setMonth(value);
  }

  function onChangeDay(value: number) {
    setDay(value);
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCheckoutDate(new Date(year, month, day));
  }

  return (
    <>
      <form
        className="bg-[#F9F9F9] border border-black grid grid-cols-7 gap-4 pl-12 grow h-20 text-center"
        onSubmit={submit}
      >
        <div className="m-auto">訂單狀態：</div>
        <div className="m-auto">
          <select
            className="border-2 border-black"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
          >
            <option value="ALL">全部</option>
            <option value="WITHDRAWN">已收款</option>
            <option value="CLOSED">可收款</option>
            <option value="RECEIVED">買家已收到貨</option>
            <option value="SHIPPED">運送中</option>
            <option value="PAIED">已付款</option>
            <option value="PAYMENT_REQUIRED">待付款</option>
            <option value="COMPLETE_REQUIRED">待填寫訂單資訊</option>
            <option value="CANCEL">取消訂單</option>
          </select>
        </div>
        <div className="m-auto">結帳日期：</div>
        <div className="m-auto">
          <YearPicker
            defaultValue={""}
            start={2010} // default is 1900
            reverse // default is ASCENDING
            required={true} // default is false
            value={year} // mandatory
            onChange={onChangeYear}
          />
        </div>
        <div className="m-auto ">
          <MonthPicker
            defaultValue={""}
            numeric // to get months as numbers
            short // default is full name
            caps // default is Titlecase
            endYearGiven // mandatory if end={} is given in YearPicker
            year={year} // mandatory
            required={true} // default is false
            value={month} // mandatory
            onChange={onChangeMonth}
          />
        </div>
        <div className="m-auto">
          <DayPicker
            defaultValue={""}
            year={year} // mandatory
            month={month} // mandatory
            endYearGiven // mandatory if end={} is given in YearPicker
            required={true} // default is false
            value={day} // mandatory
            onChange={onChangeDay}
          />
        </div>
        <div className="m-auto">
          <button className="btn">查詢</button>
        </div>
      </form>
      {content}
      {isFetchingNextPage && <p>Loading...</p>}

      <OrderInfoDialog />
    </>
  );
}

export default OrderProcessing;
