function OrderProcessing() {
  return (
    <form
      className="bg-[#F9F9F9] border border-black grid grid-cols-7 gap-4 pl-12 grow h-20 text-center"
      /*onSubmit={submit}*/
    >
      <div className="m-auto">訂單狀態：</div>
      <div className="m-auto">
        <select
          className="border-2 border-black" /*onChange={(e) => handleChange(e)}*/
        >
          <option value="SHIPPED">運送中</option>
          <option value="PAIED">已付款</option>
          <option value="PAYMENT_REQUIRED">待付款</option>
          <option value="COMPLETE_REQUIRED">待填寫訂單資訊</option>
          <option value="CANCEL">取消訂單</option>
        </select>
      </div>
      <div className="m-auto">結帳日期：</div>
      <div className="m-auto">
        <input
          type="number"
          min={1000}
          max={9999}
          className="w-[10rem] max-w-xs input input-bordered bg-white"
          placeholder="年"
          /*ref={}*/
        />
      </div>
      <div className="m-auto ">
        <input
          type="number"
          min={1}
          max={12}
          className="w-[10rem] max-w-xs input input-bordered bg-white"
          placeholder="月"
          /*ref={}*/
        />
      </div>
      <div className="m-auto">
        <input
          type="number"
          min={1}
          max={31}
          className="w-[10rem] max-w-xs input input-bordered bg-white"
          placeholder="日"
          /*ref={}*/
        />
      </div>
      <div className="m-auto">
        <button className="btn">查詢</button>
      </div>
    </form>
  );
}

export default OrderProcessing;
