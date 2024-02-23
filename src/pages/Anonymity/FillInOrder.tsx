import { useSearchParams } from "react-router-dom";

function FillInOrder() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const userEmail = searchParams.get("userEmail");

  // TODO: adjuct height of the grid chilld elements
  return (
    <main className="mt-[40px] lg:mt-[120px] mx-[35px] lg:mx-28 lg:text-xl text-gray-800">
      <div className="overflow-x-auto border-2 border-gray-800 lg:px-20 lg:py-10 bg-stone-50">
        <div>
          <h1 className="border-b border-b-gray-800">訂單資訊</h1>
          <div className="grid items-center grid-cols-2 pt-3 gap-y-2 justify-items-center">
            <span>訂單編號：</span>
            <span className="font-bold text-red-500">{orderId}</span>
            <span>電子信箱：</span>
            <span>{userEmail}</span>
            <label htmlFor="name">姓名：</label>
            <input
              type="text"
              id="name"
              className="w-3/4 h-10 bg-white shadow-md input input-bordered"
            />
            <label htmlFor="cellPhone">手機號碼：</label>
            <input
              type="tel"
              id="cellPhone"
              className="w-3/4 h-10 bg-white shadow-md input input-bordered"
            />
          </div>
          <PickupOptions />
        </div>
      </div>
    </main>
  );
}

function PickupOptions() {
  return (
    <div>
      <h1 className="my-2 border-b border-b-gray-800">取貨方式</h1>
      <div role="tablist" className="tabs tabs-lifted">
        {/* 宅配 */}
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab [--tab-bg:white]"
          aria-label="宅配"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="p-6 bg-white border-base-300 tab-content rounded-box"
        >
          <div className="flex items-center gap-5 mb-5">
            <label htmlFor="zipCode">郵遞區號</label>
            <input
              type="number"
              id="zipCode"
              className="w-1/4 h-10 bg-white shadow-md input input-bordered"
            />
          </div>
          <div className="flex items-center gap-5">
            <label>收件地址</label>
            {/* <label className="w-full max-w-xs form-control">
              <div className="label">
                <span className="label-text">
                  Pick the best fantasy franchise
                </span>
              </div>
              <select className="select select-bordered">
                <option disabled selected>
                  Pick one
                </option>
                <option>Star Wars</option>
                <option>Harry Potter</option>
                <option>Lord of the Rings</option>
                <option>Planet of the Apes</option>
                <option>Star Trek</option>
              </select>
            </label> */}
          </div>
        </div>

        {/* 超商取貨 */}
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab [--tab-bg:white]"
          aria-label="超商取貨"
        />
        <div
          role="tabpanel"
          className="p-6 bg-white tab-content border-base-300 rounded-box"
        >
          超商取貨
        </div>
      </div>
    </div>
  );
}

export default FillInOrder;
