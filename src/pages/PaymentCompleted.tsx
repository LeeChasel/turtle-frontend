import { useNavigate } from "react-router-dom";
import useAnonymousProductStore from "../store/useAnonymousProductStore";

function PaymentCompleted() {
  const navigate = useNavigate();
  const homepage = useAnonymousProductStore((state) => state.productId);
  function cancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate("/special/product/" + homepage);
  }
  return (
    <div className="text-center pt-10 text-[#263238] [text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)]">
      <img
        src="https://storage.googleapis.com/turtle_static/frontend/payment-completed.png"
        className="w-1/4 m-auto"
      />

      <div className="text-3xl ">感謝您的購買！</div>
      <div className="text-base ">
        <br />
        您的訂單已經付款完成
        <br />
        您的支持是我們最大的鼓勵
        <br />
        我們將竭誠為您提供優質的商品和服務
        <br />
        <br />
        我們將盡快為您處理訂單並安排出貨
        <br />
        如有任何問題或特殊需求
        <br />
        請隨時與我們聯繫
        <br />
        我們將誠摯為您服務
        <br />
        <br />
        再次感謝您的訂購
        <br />
        祝您購物愉快！
      </div>

      <button className="btn shadow-md btn-outline" onClick={cancel}>
        回首頁
      </button>
    </div>
  );
}
export default PaymentCompleted;
