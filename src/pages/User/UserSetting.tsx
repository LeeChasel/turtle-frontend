import useUserInfo from "../../hooks/useUserInfo";

function UserSetting() {
  const { data: userinfo, status, error } = useUserInfo();

  if (status === "pending") {
    return <></>;
  } else if (status === "error") {
    return <div>Error happened: {error.message}</div>;
  }

  return (
    <div
      className="overflow-x-auto border square border-dark "
      style={{ backgroundColor: "white" }}
    >
      <table className="table-lg w-max" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                fontSize: "25px",
                fontWeight: "bolder",
                textAlign: "left",
              }}
            >
              基本設定
            </th>
          </tr>
          <tr
            style={{
              borderBottom: "2px",
              border: "1px solid",
              borderColor: "black",
            }}
          ></tr>
          <tr>
            <th
              style={{
                textAlign: "left",
                fontWeight: "bolder",
                fontSize: "20px",
              }}
            >
              個人檔案
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{ textAlign: "right" }}>姓名</th>
            <td>
              <input
                type="text"
                defaultValue={userinfo.username}
                className="w-full max-w-xs input input-bordered"
                style={{ width: "300px" }}
              />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>性別</th>
            <td>
              <div className="form-control">
                <label className="cursor-default label">
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio"
                    id="MALE"
                    defaultChecked={userinfo.gender === "MALE"}
                  />
                  <label className="label-text" htmlFor="MALE">
                    男性
                  </label>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio"
                    id="FEMALE"
                    defaultChecked={userinfo.gender === "FEMALE"}
                  />
                  <label className="label-text" htmlFor="FEMALE">
                    女性
                  </label>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio"
                    id="UNKNOW"
                    defaultChecked={userinfo.gender === "UNKNOW"}
                  />
                  <label className="label-text" htmlFor="UNKNOW">
                    不願透漏
                  </label>
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>生日</th>
            <td>
              <input
                type="date"
                defaultValue={userinfo.birthday}
                className="w-full max-w-xs input input-bordered"
              />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>手機</th>
            <td>
              <input
                type="tel"
                defaultValue={userinfo.phone}
                className="w-full max-w-xs input input-bordered"
              />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>電子郵件</th>
            <td>
              <input
                type="email"
                defaultValue={userinfo.email}
                className="w-full max-w-xs cursor-default input input-bordered"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-center">
        <button className="btn">確認</button>
        <button className="btn">取消</button>
      </p>
    </div>
  );
}

export default UserSetting;
