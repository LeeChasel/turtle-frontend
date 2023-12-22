import useUserInfo from "../../hooks/useUserInfo";
import { useRef, useState } from "react";
import { showToast } from "../../utils/toastAlert";
import updateUserInfo from "../../actions/updateUserInfo";
import { useNavigate } from "react-router-dom";
import { TUpdateInfo } from "../../types/User";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import { useQueryClient } from "@tanstack/react-query";

function UserSetting() {
  const { data: userinfo, status, error } = useUserInfo();
  const nameRef = useRef<HTMLInputElement>(null);
  const birthdayRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const { tokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "UNKNOW">();
  const queryClient = useQueryClient();

  if (status === "pending") {
    return <></>;
  } else if (status === "error") {
    return <div>Error happened: {error.message}</div>;
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setIsSending(true);
      const name = nameRef.current?.value;
      const birthday = birthdayRef.current?.value;
      const phoneNumber = phoneNumberRef.current?.value;
      const updateInfo: TUpdateInfo = {};
      if (name != userinfo?.username) {
        updateInfo.username = name;
      }
      if (birthday != userinfo?.birthday) {
        updateInfo.birthday = birthday;
      }
      if (phoneNumber != userinfo?.phone) {
        updateInfo.phone = phoneNumber;
      }
      if (gender != userinfo?.gender) {
        updateInfo.gender = gender;
      }
      if (updateInfo != null) {
        await updateUserInfo(tokenCookie!, updateInfo);
        await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
        showToast("success", "修改成功");
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsSending(false);
    }
  }

  function onChangeGender(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value === "MALE" || value === "FEMALE" || value === "UNKNOW") {
      setGender(value);
    }
  }

  function cancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate("/");
  }

  return (
    <form
      className="overflow-x-auto border square border-dark "
      style={{ backgroundColor: "white" }}
      onSubmit={submit}
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
                ref={nameRef}
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
                    value="MALE"
                    defaultChecked={userinfo.gender === "MALE"}
                    onChange={onChangeGender}
                  />
                  <label className="label-text" htmlFor="MALE">
                    男性
                  </label>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio"
                    id="FEMALE"
                    value="FEMALE"
                    defaultChecked={userinfo.gender === "FEMALE"}
                    onChange={onChangeGender}
                  />
                  <label className="label-text" htmlFor="FEMALE">
                    女性
                  </label>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio"
                    id="UNKNOW"
                    value="UNKNOW"
                    defaultChecked={userinfo.gender === "UNKNOW"}
                    onChange={onChangeGender}
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
                ref={birthdayRef}
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
                ref={phoneNumberRef}
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
                disabled={true}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-center">
        <button className="btn" disabled={isSending}>
          確認
        </button>
        <button className="btn" onClick={cancel}>
          取消
        </button>
      </p>
    </form>
  );
}

export default UserSetting;
