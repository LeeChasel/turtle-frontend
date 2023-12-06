import { useRef, useState } from "react";
import login from "../../actions/login";
import useUserTokenCookie from "../../hooks/useUserTokenCookie";
import getUserInfo from "../../actions/getUserInfo";
import { showToast } from "../../utils/toastAlert";
import updateNewpassword from "../../actions/updateNewpassword";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const checkNewpasswordRef = useRef<HTMLInputElement>(null);
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSending(true);
    const result = await getUserInfo(tokenCookie!);
    const email = result.email;
    const oldPassword = oldPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const checkNewpassword = checkNewpasswordRef.current?.value;

    try {
      await login({ email, password: oldPassword! }, "原密碼錯誤！");
      if (newPassword != checkNewpassword) {
        //之後修改成登入前確認新舊密碼一不一致、新密碼及確認一不一致
        throw new Error("修改密碼不一致!");
      }
      if (oldPassword == newPassword) {
        throw new Error("新舊密碼一致!");
      }
      const jwt = await updateNewpassword(tokenCookie!, newPassword!);
      showToast("success", "修改成功");
      setUserTokenCookie(jwt);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    } finally {
      setIsSending(false);
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
              修改密碼
            </th>{" "}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{ textAlign: "right" }}>請輸入原密碼</th>
            <td>
              <input
                type="text"
                className="w-full max-w-xs input input-bordered"
                ref={oldPasswordRef}
              />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>請輸入新密碼</th>
            <td>
              <input
                type="text"
                className="w-full max-w-xs input input-bordered"
                ref={newPasswordRef}
              />
            </td>
          </tr>
          <tr>
            <th style={{ textAlign: "right" }}>再次輸入密碼</th>
            <td>
              <input
                type="text"
                className="w-full max-w-xs input input-bordered"
                ref={checkNewpasswordRef}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-center">
        <button className="btn" disabled={isSending}>
          確認
        </button>
        <button className="btn" type="button" onClick={cancel}>
          取消
        </button>
      </p>
    </form>
  );
}

export default UpdatePassword;
