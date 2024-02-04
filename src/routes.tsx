import {
  createBrowserRouter,
  type RouteObject,
  Outlet,
  Navigate,
} from "react-router-dom";
import {
  Home,
  LoginOrSignup,
  NewProducts,
  Product,
  Products,
  ShoppingCart,
  UserSetting,
  UpdatePassword,
  AddProduct,
  Notfound,
} from "./pages/Index";
import RootLayout from "./components/RootLayout";
import UserNav from "./components/UserNav";
import { showToast } from "./utils/toastAlert";
import useUserTokenCookie from "./hooks/useUserTokenCookie";
import validateTokenRole from "./utils/validateTokenRole";

const routerData: RouteObject[] = [
  {
    Component: RootLayout,
    children: [
      { path: "*", Component: Notfound },
      { path: "/", Component: Home },
      { path: "/product/:productName", Component: Product },
      { path: "/products", Component: Products },
      { path: "/loginOrSignup", Component: LoginOrSignup },
      { path: "/newProducts", Component: NewProducts },
      // TODO: should be :productId, but it would cause error
      { path: "/special/:productName", Component: Product },
      {
        Component: AuthRoutes,
        children: [
          { path: "/shoppingCart", Component: ShoppingCart },
          {
            path: "/user/*",
            Component: UserNav,
            children: [
              { path: "setting", Component: UserSetting },
              { path: "updatePassword", Component: UpdatePassword },
              {
                Component: AdminRoutes,
                children: [{ path: "addProduct", Component: AddProduct }],
              },
            ],
          },
        ],
      },
    ],
  },
];

function AuthRoutes() {
  const { tokenCookie } = useUserTokenCookie();
  if (!tokenCookie) showToast("error", "請先登入");
  return tokenCookie ? <Outlet /> : <Navigate to="/loginOrSignup" />;
}

function AdminRoutes() {
  const { tokenCookie } = useUserTokenCookie();
  const isAdmin = validateTokenRole(tokenCookie, "ROLE_ADMIN");
  return isAdmin ? <Outlet /> : <Navigate to="/loginOrSignup" />;
}

const router = createBrowserRouter(routerData);

export default router;
