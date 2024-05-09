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
import OrderCart from "./pages/Anonymity/Cart";
import OrderSearch from "./pages/OrderSearch";
import CheckOrder from "./pages/CheckOrder";
import PaymentCompleted from "./pages/PaymentCompleted";
import FillInOrder from "./pages/Anonymity/FillInOrder";
import CvsMapSuccess from "./pages/Anonymity/CvsMapSuccess";
import Checkout from "./pages/Checkout";
import OrderProcessing from "./pages/Merchant/OrderProcessing";
import ModifyProduct from "./pages/ModifyProduct";
import { CustomizationContainer } from "./features/customization/components/CustomizationContainer";
import MusicTesting from "./pages/MusicTesting";

const specialRoutes: RouteObject[] = [
  { path: "/special/product/:productId", Component: Product },
  { path: "/special/cart", Component: OrderCart },
  { path: "/special/orderSearch", Component: OrderSearch },
  { path: "/special/fillInOrder", Component: FillInOrder },
  { path: "/special/cvsMapSuccess", Component: CvsMapSuccess },
  { path: "/special/customization", Component: CustomizationContainer },
];

const merchantRoutes: RouteObject[] = [
  { path: "orders", Component: OrderProcessing },
];

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
      { path: "/checkOrder", Component: CheckOrder },
      { path: "/orderSearch", Component: OrderSearch },
      { path: "/PaymentCompleted", Component: PaymentCompleted },
      { path: "/checkout", Component: Checkout },
      { path: "/customization", Component: CustomizationContainer },
      { path: "/test", Component: MusicTesting },
      ...specialRoutes,
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
                Component: MerchantRoutes,
                children: merchantRoutes,
              },
              {
                Component: AdminRoutes,
                children: [
                  { path: "addProduct", Component: AddProduct },
                  { path: "modifyProduct", Component: ModifyProduct },
                ],
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

function MerchantRoutes() {
  const { tokenCookie } = useUserTokenCookie();
  const isMerchant = validateTokenRole(tokenCookie, "ROLE_MERCHANT");
  return isMerchant ? <Outlet /> : <Navigate to="/loginOrSignup" />;
}

const router = createBrowserRouter(routerData);

export default router;
