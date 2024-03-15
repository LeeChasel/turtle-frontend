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
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  });

  const [checkoutDate, setCheckoutDate] = useState<Date>(
    new Date(date.year, date.month, date.day),
  );

  // prevent orderStatus changes would trigger re fetch resource
  const orderStatusRef = useRef<OrderStatus>(OrderStatus.ALL);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "orderList",
      orderStatusRef.current.toString(),
      checkoutDate.getTime(),
    ],
    queryFn: ({ pageParam }) =>
      getOrdersByMerchant(
        tokenCookie!,
        orderStatusRef.current,
        pageParam,
        Math.ceil(checkoutDate.getTime() / 1000),
      ),
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
        return <OrderInfoRef ref={lastOrderRef} info={order} key={index} />;
      }
      return <OrderInfoRef info={order} key={index} />;
    });
  });

  function onChangeYear(value: number) {
    setDate((prevDate) => ({ ...prevDate, year: value }));
  }

  function onChangeMonth(value: number) {
    setDate((prevDate) => ({ ...prevDate, month: value }));
  }

  function onChangeDay(value: number) {
    setDate((prevDate) => ({ ...prevDate, day: value }));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCheckoutDate(new Date(date.year, date.month, date.day));
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
            defaultValue={orderStatusRef.current}
            onChange={(e) =>
              (orderStatusRef.current = e.target.value as OrderStatus)
            }
          >
            <option value="SHIPPED,PAIED,PAYMENT_REQUIRED,COMPLETE_REQUIRED,CANCEL,WITHDRAWN,CLOSED,RECEIVED">
              全部
            </option>
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
            value={date.year} // mandatory
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
            year={date.year} // mandatory
            required={true} // default is false
            value={date.month} // mandatory
            onChange={onChangeMonth}
          />
        </div>
        <div className="m-auto">
          <DayPicker
            defaultValue={""}
            year={date.year} // mandatory
            month={date.month} // mandatory
            endYearGiven // mandatory if end={} is given in YearPicker
            required={true} // default is false
            value={date.day} // mandatory
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
