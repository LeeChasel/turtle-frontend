import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { showToast } from "../utils/toastAlert";

function OrderSearch() {
  const navigate = useNavigate();
  const isSpecialRoute = useLocation().pathname.startsWith("/special");
  const orderIdRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const orderIdSchema = z.string().min(1, { message: "請輸入訂單編號" });
  const emailSchema = z.string().email({ message: "電子郵件格式錯誤" });

  function handleSubmit() {
    try {
      const url = "/checkorder";
      const searchParams = new URLSearchParams();
      const orderId = orderIdSchema.parse(orderIdRef.current?.value);
      searchParams.append("orderId", orderId);

      if (isSpecialRoute) {
        const email = emailSchema.parse(emailRef.current?.value);
        searchParams.append("userEmail", email);
      }
      navigate(`${url}?${searchParams.toString()}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast("error", error.errors[0].message);
      } else if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  }

  return (
    <div className="flex justify-center pt-10">
      <div className="flex flex-col justify-center w-1/3 gap-5 p-10 bg-gray-200">
        <div className="flex items-center gap-3">
          <label>訂單編號</label>
          <input
            type="text"
            className="w-full max-w-xs input"
            ref={orderIdRef}
          />
        </div>
        {isSpecialRoute && (
          <div className="flex items-center gap-3">
            <label>訂購人電子郵件</label>
            <input
              type="email"
              className="w-full max-w-xs input"
              ref={emailRef}
            />
          </div>
        )}
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSubmit}
        >
          查詢
        </button>
      </div>
    </div>
  );
}

export default OrderSearch;
