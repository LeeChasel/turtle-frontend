import { useSearchParams } from "react-router-dom";
import zipCodeJson from "@/data/district-zip-code.json";
import { useState } from "react";

function FillInOrder() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const userEmail = searchParams.get("userEmail");

  // TODO: adjuct height of the grid chilld elements
  return (
    <main className="mt-[40px] lg:mt-[120px] mx-[35px] lg:mx-28 lg:text-xl text-gray-800">
      <div className="overflow-x-auto border-2 border-gray-800 lg:px-20 lg:py-10 bg-stone-50">
        <div className="space-y-5">
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
          <div className="flex justify-end">
            <button className="bg-white shadow-md btn btn-lg hover:bg-gray-100">
              送出
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function PickupOptions() {
  const [countryCity, setCountryCity] = useState<string>(zipCodeJson[0].name);
  const districts = zipCodeJson.find(
    (item) => item.name === countryCity,
  )!.districts;
  function handleChangeCountryCity(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setCountryCity(event.target.value);
  }

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
          className="p-6 space-y-5 bg-white border-base-300 tab-content rounded-box"
        >
          <div className="space-x-5">
            <label htmlFor="zipCode">郵遞區號：</label>
            <input
              type="number"
              id="zipCode"
              className="w-1/4 h-10 bg-white shadow-md input input-bordered"
            />
          </div>
          <div className="space-x-5">
            <label>收件地址：</label>
            <select
              className="w-1/4 bg-white shadow-md select select-bordered"
              defaultValue={countryCity}
              onChange={handleChangeCountryCity}
            >
              {zipCodeJson.map((countryCity) => (
                <option key={countryCity.name} value={countryCity.name}>
                  {countryCity.name}
                </option>
              ))}
            </select>
            <select className="w-1/4 bg-white shadow-md select select-bordered">
              {districts.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-x-5">
            <label className="invisible">收件地址：</label>
            <input
              type="text"
              className="w-2/3 h-10 bg-white shadow-md input input-bordered"
            />
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
          className="p-6 space-y-5 bg-white tab-content border-base-300 rounded-box"
        >
          <div className="space-x-5">
            <label>取貨門市：</label>
            <button className="font-normal bg-white shadow-md btn hover:bg-gray-100">
              選擇門市
            </button>
          </div>
          <div className="space-x-5">
            <label htmlFor="">付款方式：</label>
            <select className="w-1/4 bg-white shadow-md select select-bordered">
              <option value="1">貨到付款</option>
              <option value="2">線上付款</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FillInOrder;
