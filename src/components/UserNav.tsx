import { Link, Outlet, useNavigate } from "react-router-dom";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import { useMutation } from "@tanstack/react-query";
import logout from "../actions/logout";
import { showToast } from "../utils/toastAlert";
import validateTokenRole from "../utils/validateTokenRole";

function UserNav() {
  return (
    <div className="flex gap-2 p-5">
      <SideNavbar />
      <section className="w-3/4">
        <Outlet />
      </section>
    </div>
  );
}

function SideNavbar() {
  const navigate = useNavigate();
  const { tokenCookie, deleteUserTokenCookie } = useUserTokenCookie();
  const isAdmin = validateTokenRole(tokenCookie, "ROLE_ADMIN");
  const isMerchant = validateTokenRole(tokenCookie, "ROLE_MERCHANT");

  const logoutMutation = useMutation({
    mutationFn: logout,
  });

  const handleLogout = () => {
    try {
      deleteUserTokenCookie();
      showToast("success", "登出成功");
      navigate("/");
      logoutMutation.mutate(tokenCookie!);
    } catch (error) {
      // pass logout error handling because user is already logged out and this error should only occur when CICD
    }
  };

  return (
    <nav>
      <ul className="w-40 gap-2 menu bg-base-200 rounded-box ">
        <li>
          <Link to="/user/setting">基本設定</Link>
        </li>
        <li>
          <Link to="/user/updatePassword">修改密碼</Link>
        </li>
        {isMerchant && (
          <li>
            <Link to="/user/orders">訂單列表</Link>
          </li>
        )}
        {isAdmin && (
          <>
            <li>
              <Link to="/user/addProduct">新增商品</Link>
            </li>
            <li>
              <Link to="/user/modifyProduct">修改商品</Link>
            </li>
          </>
        )}
        <li>
          <button onClick={handleLogout}>登出</button>
        </li>
      </ul>
    </nav>
  );
}

export default UserNav;
