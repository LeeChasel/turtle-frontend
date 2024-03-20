import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useAnonymousProductStore from "../store/useAnonymousProductStore";
import login from "../actions/login";
import { anonymousUser } from "../utils/anonymity";
import { CiMail } from "react-icons/ci";
import { SiShopee } from "react-icons/si";
import useBeOrderedProductsStore from "@/store/useBeOrderedProductsStore";

function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function Header() {
  // TODO: implement the logic to determine if the user is a special role
  const location = useLocation();
  const { tokenCookie, deleteUserTokenCookie, setUserTokenCookie } =
    useUserTokenCookie();
  const isSpecialRole = validateTokenRole(
    tokenCookie,
    "ROLE_ANONYMITY_CUSTOMER",
  );
  const isSpecialRoute = location.pathname.startsWith("/special");
  const isOrderInfoRoute = location.pathname.startsWith("/checkOrder");
  const isPaymentCompletedRoute =
    location.pathname.startsWith("/PaymentCompleted");
  const isCheckoutRoute = location.pathname.startsWith("/checkout");

  // from special route to normal route will delete token cookie
  useEffect(() => {
    if (
      !isSpecialRoute &&
      tokenCookie &&
      isSpecialRole &&
      !isOrderInfoRoute &&
      !isPaymentCompletedRoute &&
      !isCheckoutRoute
    ) {
      deleteUserTokenCookie();
    }
  }, [
    isSpecialRoute,
    tokenCookie,
    isOrderInfoRoute,
    isPaymentCompletedRoute,
    isCheckoutRoute,
  ]);

  useEffect(() => {
    async function processAnonymousLogin() {
      try {
        const jwt = await login(anonymousUser, "匿名登入帳密錯誤");
        setUserTokenCookie(jwt);
      } catch (error) {
        if (error instanceof Error) console.error(error.message);
      }
    }
    if (
      !isSpecialRole &&
      (isSpecialRoute || isOrderInfoRoute || isCheckoutRoute)
    )
      void processAnonymousLogin();
    // Do not add dependency
  }, [isSpecialRole, isSpecialRoute, isOrderInfoRoute, isCheckoutRoute]);

  if (
    isSpecialRoute ||
    isSpecialRole ||
    isPaymentCompletedRoute ||
    isCheckoutRoute
  ) {
    return <AnonymousHeader />;
  }

  return <RegisteredHeader />;
}

function AnonymousHeader() {
  const productId = useAnonymousProductStore((state) => state.productId);
  const linkPath = productId === "" ? "#" : `/special/product/${productId}`;
  //TO-DO:同頁面購買無法刷新數字
  const products = useBeOrderedProductsStore((state) => state.products);
  const productNum = products.items.reduce(
    (prev, curr) => prev + curr.quantity,
    0,
  );
  return (
    <header className="h-[50px] md:h-[80px] lg:h-[100px] bg-gray-800 px-3 md:px-7 lg:px-10">
      <div className="flex items-center justify-between h-full max-w-[1500px] mx-auto">
        <nav className="h-full">
          <ul className="flex items-center h-full">
            <li className="h-full p-2 translate-y-1 md:p-3 lg:p-5">
              <Link to={linkPath} className="h-full">
                <img
                  src={
                    import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL +
                    "/Logo.webp"
                  }
                  alt="Logo image"
                  loading="lazy"
                  className="max-h-full"
                />
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-3 md:gap-5 lg:gap-7">
          <Link to="/special/cart">
            {productNum === 0 ? (
              <FaShoppingCart className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-sky-50" />
            ) : (
              <div className="indicator">
                <span className="indicator-item badge bg-[red]">
                  {productNum}
                </span>
                <FaShoppingCart className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-sky-50" />
              </div>
            )}
          </Link>
          <Link
            to="/special/orderSearch"
            className="rounded-md text-md md:text-xl lg:text-2xl text-sky-50 hover:bg-gray-700"
          >
            訂單查詢
          </Link>
        </div>
      </div>
    </header>
  );
}

// 可登入的記名使用者
function RegisteredHeader() {
  return (
    <header className="h-[50px] md:h-[80px] lg:h-[100px] bg-gray-800 px-3 md:px-7 lg:px-10">
      <div className="flex items-center justify-between h-full max-w-[1500px] mx-auto">
        <nav className="h-full">
          <ul className="flex items-center h-full gap-2 md:gap-4 lg:gap-6">
            <li className="h-full p-2 translate-y-1 md:p-3 lg:p-5">
              <Link to="/" className="h-full">
                <img
                  src={
                    import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL +
                    "/Logo.webp"
                  }
                  alt="Logo image"
                  loading="lazy"
                  className="max-h-full"
                />
              </Link>
            </li>

            <li>
              <Link
                to="/products"
                className="text-sm rounded-md md:text-xl lg:text-2xl text-sky-50 hover:bg-gray-700"
              >
                全部商品
              </Link>
            </li>
            <li>
              <Link
                to="/newProducts"
                className="text-sm rounded-md md:text-xl lg:text-2xl text-sky-50 hover:bg-gray-700"
              >
                新上市
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          <Link to="/shoppingCart" aria-label="Icon link to shopping cart page">
            <FaShoppingCart className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-sky-50" />
          </Link>
          <UserStatusLink />
          <Link
            to="/orderSearch"
            className="text-sm rounded-md md:text-xl lg:text-2xl text-sky-50 hover:bg-gray-700"
          >
            訂單查詢
          </Link>
        </div>
      </div>
    </header>
  );
}

function UserStatusLink() {
  const { tokenCookie } = useUserTokenCookie();
  const isLogging = Boolean(tokenCookie);
  const linkData = {
    to: isLogging ? "/user/setting" : "/loginOrSignup",
    text: isLogging ? "設定" : "登入",
  };
  return (
    <Link
      to={linkData.to}
      className="text-sm rounded-md md:text-xl lg:text-2xl text-sky-50 hover:bg-gray-700"
    >
      {linkData.text}
    </Link>
  );
}

function Footer() {
  return (
    <footer className="items-center p-4 bg-gray-800 footer text-neutral-content">
      <aside className="items-center grid-flow-col">
        <a
          href="mailto:lazyturtleshopping@gmail.com"
          className="flex items-center gap-2"
        >
          聯絡我們
          <CiMail className="w-5 h-5" />
        </a>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a href="https://shopee.tw/turtlelazy" target="_blank" rel="noreferrer">
          <SiShopee className="w-5 h-5" />
        </a>
      </nav>
    </footer>
  );
}

export default RootLayout;
