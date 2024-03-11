import { useSearchParams, useNavigate } from "react-router-dom";
import zipCodeJson from "@/data/district-zip-code.json";
import { useRef, useState } from "react";
import { getParamToChangeCvsForAnonymity } from "@/actions/getParamToChangeCvs";
import useUserTokenCookie from "@/hooks/useUserTokenCookie";
import { showToast } from "@/utils/toastAlert";
import { getCallbackToChangeCvsForAnonymity } from "@/actions/getCallbackToChangeCvs";
import { LogisticsSubType, LogisticsType } from "@/types/Shipping";
import { forEach } from "lodash";
import { z } from "zod";
import { CvsMapCallback } from "@/types/Cvs";
import { setShippingInfoForAnonymity } from "@/actions/setShippingInfo";

const baseInfoSchema = z.object({
  orderId: z.string().min(1, { message: "訂單編號不可為空" }),
  receiverEmail: z.string().email({ message: "電子信箱格式錯誤" }),
  receiverName: z
    .string()
    .regex(/^[^\d\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/u, {
      message: "不可包含特殊符號或數字",
    })
    .min(2, { message: "姓名長度最少2為2" })
    .max(4, { message: "姓名長度最多為4" }),
  receiverCellPhone: z.string().regex(/^09\d{8}$/, {
    message: "手機號碼格式錯誤",
  }),
});

const homeBaseSchema = z.object({
  logisticsType: z.literal(LogisticsType.HOME),
  logisticsSubType: z.enum([LogisticsSubType.TCAT, LogisticsSubType.POST]),
  receiverZipCode: z
    .string()
    .regex(/^\d{3}(?:\d{2})?$/, { message: "郵遞區號格式錯誤" }),
  receiverAddress: z
    .string()
    .min(6, { message: "地址長度需大於6個字元" })
    .max(60, { message: "地址長度不可超過60個字元" }),
  payOnDelivery: z.literal(false),
});

const cvsBaseSchema = z.object({
  logisticsType: z.literal(LogisticsType.CVS),
  logisticsSubType: z.enum([
    LogisticsSubType.UNIMARTC2C,
    LogisticsSubType.FAMIC2C,
  ]),
  payOnDelivery: z.boolean(),
});

function FillInOrder() {
  const { tokenCookie } = useUserTokenCookie();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [shippingType, setShippingType] = useState<LogisticsType>(
    LogisticsType.HOME,
  );
  // base
  const orderId = searchParams.get("orderId");
  const userEmail = searchParams.get("userEmail");
  const receiverNameRef = useRef<HTMLInputElement>(null);
  const receiverCellPhoneRef = useRef<HTMLInputElement>(null);

  // home
  const receiverZipCodeRef = useRef<HTMLInputElement>(null);
  const [countryCity, setCountryCity] = useState<string>(zipCodeJson[0].name);
  const [districts, setDistricts] = useState(zipCodeJson[0].districts[0].name);
  const receiverAddressRef = useRef<HTMLInputElement>(null);

  // Cvs
  const [cvs, setCvs] = useState<CvsMapCallback>();
  const [payOnDelivery, setPayOnDelivery] = useState(true);

  if (!orderId || !userEmail) {
    showToast("error", "缺少訂單編號或電子信箱");
    navigate(-1);
    // make orderId and userEmail not undefined
    return;
  }

  async function onSubmitForm() {
    try {
      const baseInfo = baseInfoSchema.parse({
        orderId: orderId!,
        receiverEmail: userEmail!,
        receiverName: receiverNameRef.current?.value,
        receiverCellPhone: receiverCellPhoneRef.current?.value,
      });

      let shippingData: z.infer<typeof homeBaseSchema | typeof cvsBaseSchema>;
      if (shippingType === LogisticsType.HOME) {
        const detailedAddress = z
          .string()
          .min(1, { message: "地址不可為空" })
          .parse(receiverAddressRef.current?.value);
        shippingData = homeBaseSchema.parse({
          logisticsType: shippingType,
          logisticsSubType: LogisticsSubType.POST, // 目前指定郵局
          receiverZipCode: receiverZipCodeRef.current?.value,
          receiverAddress: `${countryCity}${districts}${detailedAddress}`,
          payOnDelivery: false,
        });
      } else {
        if (!cvs) {
          throw new Error("請選擇超商取貨門市");
        }
        shippingData = cvsBaseSchema.parse({
          logisticsType: shippingType,
          logisticsSubType: cvs.LogisticsSubType,
          payOnDelivery: payOnDelivery,
        });
      }

      const orderResult = await setShippingInfoForAnonymity(
        tokenCookie!,
        userEmail!,
        {
          ...baseInfo,
          ...shippingData,
          merchantId: cvs?.MerchantID,
        },
      );

      showToast("success", `已成立訂單並發送通知至 ${orderResult.userEmail}`);
      const params = new URLSearchParams();
      if (shippingType === LogisticsType.CVS && shippingData.payOnDelivery) {
        // 若為超商取貨且貨到付款，則導向貨到訂單查詢結果頁面
        params.append("orderId", orderId!);
        params.append("userEmail", userEmail!);
        navigate(`/checkOrder?${params.toString()}`);
      } else {
        params.append("orderId", orderId!);
        params.append("userEmail", userEmail!);
        navigate(`/checkout?${params.toString()}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast("error", error.errors[0].message);
      } else if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  // TODO: adjuct height of the grid chilld elements
  return (
    <main className="mt-[2.5rem] lg:mt-[7.5rem] mx-[2.12rem] lg:mx-28 text-gray-800 md:mx-[3.69rem] md:mt-[5.56rem] text-[0.375rem] md:text-[1rem] lg:text-[1.25rem]">
      <div className="px-2 py-3 overflow-x-auto border-2 border-gray-800 lg:px-20 md:py-8 lg:py-10 md:px-14 bg-stone-50">
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
              className="w-3/4 bg-white shadow-md input input-xs md:input-sm lg:input-md input-bordered"
              ref={receiverNameRef}
            />
            <label htmlFor="cellPhone">手機號碼：</label>
            <input
              type="tel"
              id="cellPhone"
              className="w-3/4 bg-white shadow-md input input-xs md:input-sm lg:input-md input-bordered"
              ref={receiverCellPhoneRef}
            />
          </div>
          <PickupOptions
            tokenCookie={tokenCookie}
            orderId={orderId}
            userEmail={userEmail}
            setShippingType={setShippingType}
            receiverZipCodeRef={receiverZipCodeRef}
            countryCity={countryCity}
            setCountryCity={setCountryCity}
            setDistricts={setDistricts}
            receiverAddressRef={receiverAddressRef}
            setCvs={setCvs}
            setPayOnDelivery={setPayOnDelivery}
          />
          <div className="flex justify-end">
            <button
              className="bg-white shadow-md btn btn-sm md:btn-md lg:btn-lg hover:bg-gray-100"
              onClick={onSubmitForm}
            >
              送出
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function PickupOptions({
  tokenCookie,
  orderId,
  userEmail,
  setShippingType,
  receiverZipCodeRef,
  countryCity,
  setCountryCity,
  setDistricts,
  receiverAddressRef,
  setCvs,
  setPayOnDelivery,
}: {
  tokenCookie: string | undefined;
  orderId: string;
  userEmail: string;
  setShippingType: React.Dispatch<React.SetStateAction<LogisticsType>>;
  receiverZipCodeRef: React.RefObject<HTMLInputElement>;
  countryCity: string;
  setCountryCity: React.Dispatch<React.SetStateAction<string>>;
  setDistricts: React.Dispatch<React.SetStateAction<string>>;
  receiverAddressRef: React.RefObject<HTMLInputElement>;
  setCvs: React.Dispatch<React.SetStateAction<CvsMapCallback | undefined>>;
  setPayOnDelivery: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [storeName, setStoreName] = useState<string>();
  const districts = zipCodeJson.find(
    (item) => item.name === countryCity,
  )!.districts;

  function handleChangeCountryCity(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setCountryCity(event.target.value);
  }

  function handleChangeDistricts(event: React.ChangeEvent<HTMLSelectElement>) {
    setDistricts(event.target.value);
  }

  function handlePayOnDelivery(event: React.ChangeEvent<HTMLSelectElement>) {
    setPayOnDelivery(event.target.value === "true");
  }

  // TODO: waiting for ECPay online, need to seperate env file like .env.development and .env.production
  const url = import.meta.env.VITE_ECPAY_CVS_URL as string;

  async function handleSelectStore() {
    try {
      const params = await getParamToChangeCvsForAnonymity(
        tokenCookie!,
        orderId,
        userEmail,
      );
      params.LogisticsType = LogisticsType.CVS;
      params.LogisticsSubType = LogisticsSubType.UNIMARTC2C;

      const form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", url);
      form.setAttribute("target", "_blank");
      forEach(params, (value, key) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", value ?? "");
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      const callbackResult = await getCallbackToChangeCvsForAnonymity(
        tokenCookie!,
        orderId,
        userEmail,
      );
      if (!callbackResult) {
        return;
      }
      setCvs(callbackResult);
      setStoreName(`7-ELEVEN ${callbackResult.CVSStoreName}`);
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  return (
    <div className="text-[0.375rem] md:text-[1rem] lg:text-[1.25rem]">
      <h1 className="my-2 border-b border-b-gray-800">取貨方式</h1>
      <div role="tablist" className="tabs tabs-sm md:tabs-md tabs-lifted">
        {/* 宅配 */}
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab [--tab-bg:white] text-[0.6rem] lg:text-lg"
          aria-label="宅配"
          onChange={() => setShippingType(LogisticsType.HOME)}
          defaultChecked
        />
        <div
          role="tabpanel"
          className="p-2 space-y-2 bg-white md:space-y-5 md:p-6 border-base-300 tab-content rounded-box"
        >
          <div className="flex items-center space-x-2 md:space-x-5">
            <label htmlFor="zipCode">郵遞區號：</label>
            <input
              type="number"
              id="zipCode"
              className="w-1/2 bg-white shadow-md md:w-1/4 input input-xs md:input-sm lg:input-md input-bordered"
              ref={receiverZipCodeRef}
            />
          </div>
          <div className="flex items-center space-x-2 md:space-x-5">
            <label htmlFor="address" className="shrink-0">
              收件地址：
            </label>
            <select
              className="w-full bg-white shadow-md md:w-1/4 select select-xs md:select-sm lg:select-md select-bordered"
              defaultValue={countryCity}
              onChange={handleChangeCountryCity}
            >
              {zipCodeJson.map((countryCity) => (
                <option key={countryCity.name} value={countryCity.name}>
                  {countryCity.name}
                </option>
              ))}
            </select>
            <select
              className="w-full bg-white shadow-md md:w-1/4 select select-xs md:select-sm lg:select-md select-bordered"
              onChange={handleChangeDistricts}
            >
              {districts.map((district) => (
                <option key={district.name} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2 md:space-x-5">
            <span className="invisible">收件地址：</span>
            <input
              id="address"
              type="text"
              className="w-5/6 bg-white shadow-md md:w-2/3 input input-xs md:input-sm lg:input-md input-bordered"
              ref={receiverAddressRef}
            />
          </div>
        </div>

        {/* 超商取貨 */}
        <input
          type="radio"
          name="my_tabs_1"
          role="tab"
          className="tab [--tab-bg:white] text-[0.5rem] lg:text-lg"
          aria-label="超商取貨"
          onChange={() => setShippingType(LogisticsType.CVS)}
        />
        <div
          role="tabpanel"
          className="p-6 space-y-5 bg-white tab-content border-base-300 rounded-box"
        >
          <div className="flex items-center space-x-5">
            <label>取貨門市：</label>
            <button
              className="font-normal bg-white shadow-md btn btn-xs md:btn-md hover:bg-gray-100"
              onClick={handleSelectStore}
            >
              {storeName ? storeName : "選擇門市"}
            </button>
          </div>
          <div className="flex items-center space-x-5">
            <label className="shrink-0">付款方式：</label>
            <select
              className="w-3/4 bg-white shadow-md md:w-1/4 select select-xs md:select-sm lg:select-md select-bordered"
              onChange={handlePayOnDelivery}
            >
              <option value="false">線上付款</option>
              <option value="true">貨到付款</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FillInOrder;
