import useUserInfo from "../../hooks/useUserInfo";

function UserSetting() {
  const { data: userinfo, status, error } = useUserInfo();

  if (status === 'pending') {
    return <></>
  } else if (status === 'error') {
    return <div>Error happened: {error.message}</div>
  }

  return (
    <div className="overflow-x-auto border square border-dark " style={{backgroundColor: "white" }}>
      <table className="table-lg w-max" style={{borderCollapse:"collapse"}}>
      <thead>
        <tr><th style={{fontSize:'25px' , fontWeight: 'bolder' , textAlign: 'left' }}>基本設定</th></tr>
        <tr style={{borderBottom: '2px' , border:'1px solid' , borderColor:"black" }}></tr>
        <tr><th style={{textAlign: 'left' , fontWeight: 'bolder', fontSize:'20px' }}>個人檔案</th> </tr>
      </thead>
      <tbody>
        <tr>
          <th style={{textAlign: 'right'}}>姓名</th>
          <td><input type="text" className="w-full max-w-xs input input-bordered" style={{width:'300px'}} /></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>性別</th>
          <td><div className="form-control">
            <label className="cursor-default label">
              <input type="radio" name="radio-10" className="radio"  id = "male"/>
              <label className="label-text" htmlFor="male">男性</label> 
              <input type="radio" name="radio-10" className="radio" id= "female"/>
              <label className="label-text" htmlFor="female">女性</label> 
              <input type="radio" name="radio-10" className="radio" />
              <label className="label-text">不願透漏</label> 
            </label>
          </div></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>生日</th>
          <td><input type="text"className="w-full max-w-xs input input-bordered"/></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>手機</th>
          <td><input type="text"className="w-full max-w-xs input input-bordered" /></td>
        </tr>
        <tr>
          <th style={{textAlign: 'right'}}>電子郵件</th>
          <td><input type="text" defaultValue={userinfo.email} className="w-full max-w-xs cursor-default input input-bordered" /></td>
        </tr>
        
      </tbody>
    </table>
    
    <p className="text-center"><button className="btn">確認</button><button className="btn">取消</button></p>
  </div>
  )
}

export default UserSetting;