function OrderProcessing() {
  return (
    <form
      className="bg-white border border-black grid grid-cols-7 gap-4 pl-12 grow h-20 text-center"
      /*onSubmit={submit}*/
    >
      <div className="m-auto">訂單狀態：</div>
      <div className="m-auto">
        <select /*onChange={(e) => handleChange(e)}*/>
          <option value="S">運送中</option>
          <option value="M">已付款</option>
          <option value="L">待付款</option>
          <option value="XL">待填寫訂單資訊</option>
          <option value="XL">取消訂單</option>
        </select>
      </div>
      <div className="m-auto">結帳日期：</div>
      <div className="m-auto">
        <input
          type="number"
          min={1000}
          max={9999}
          className="w-[10rem] max-w-xs input input-bordered"
          placeholder="年"
          /*ref={}*/
        />
      </div>
      <div className="m-auto">
        <input
          type="number"
          min={1}
          max={12}
          className="w-[10rem] max-w-xs input input-bordered"
          placeholder="月"
          /*ref={}*/
        />
      </div>
      <div className="m-auto">
        <input
          type="number"
          min={1}
          max={31}
          className="w-[10rem] max-w-xs input input-bordered"
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
