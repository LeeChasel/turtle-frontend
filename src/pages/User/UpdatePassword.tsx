function UpdatePassword() {
  return (
    <div className="overflow-x-auto border square border-dark " style={{backgroundColor: "white" }}>
      <table className="table-lg w-max" style={{borderCollapse:"collapse"}}>
      <thead>
        <tr><th style={{fontSize:'25px' , fontWeight: 'bolder' , textAlign: 'left' }}>基本設定</th></tr>
        <tr style={{borderBottom: '2px' , border:'1px solid' , borderColor:"black" }}></tr>
        <tr><th style={{textAlign: 'left' , fontWeight: 'bolder', fontSize:'20px' }}>修改密碼</th> </tr>
      </thead>
      <tbody>
        <tr>
          <th style={{textAlign: 'right'}}>請輸入原密碼</th>
          <td><input type="text" className="w-full max-w-xs input input-bordered" style={{width:'300px'}} /></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>請輸入新密碼</th>
          <td><input type="text"className="w-full max-w-xs input input-bordered"/></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>再次輸入密碼</th>
          <td><input type="text"className="w-full max-w-xs input input-bordered" /></td>
        </tr>
      </tbody>
    </table>
    
    <p className="text-center"><button className="btn">確認</button><button className="btn">取消</button></p>
  </div>
  )
}

export default UpdatePassword;