import { FormEvent, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import validateTokenRole from "../utils/validateTokenRole";
import useAnonymousProductStore from "../store/useAnonymousProductStore";
import login from "../actions/login";
import { anonymousUser } from "../utils/anonymity";

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
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
  const isOrderProcessing = location.pathname.startsWith("/orderProcessing");
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
    if (!isSpecialRole && (isSpecialRoute || isOrderInfoRoute))
      void processAnonymousLogin();
    // Do not add dependency
  }, [isSpecialRole, isSpecialRoute, isOrderInfoRoute, isCheckoutRoute]);

  if (
    isSpecialRoute ||
    isSpecialRole ||
    isPaymentCompletedRoute ||
    isCheckoutRoute ||
    isOrderProcessing
  ) {
    return <AnonymousHeader />;
  }

  return <RegisteredHeader />;
}

function AnonymousHeader() {
  const productId = useAnonymousProductStore((state) => state.productId);
  const linkPath = productId === "" ? "#" : `/special/product/${productId}`;
  return (
    <header className="flex items-center justify-between w-[768.7px] h-[100px] bg-gray-800 px-[16.25rem] md:w-full lg:px-[16.25rem] lg:w-full">
      <nav>
        <ul className="flex items-center">
          <li className="translate-y-1">
            <Link to={linkPath}>
              <img
                src={
                  import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL + "/Logo.webp"
                }
                alt="Logo image"
                width={120}
                height={81}
                className="pointer-events-none"
              />
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-7">
        <Link to="/special/cart">
          <FaShoppingCart className="w-10 h-10 text-sky-50" />
        </Link>
        <Link
          to="/special/orderSearch"
          className="text-2xl font-normal rounded-md text-sky-50 hover:bg-gray-700"
        >
          訂單查詢
        </Link>
      </div>
    </header>
  );
}

// 可登入的記名使用者
function RegisteredHeader() {
  return (
    <header className="flex items-center justify-between w-full h-[100px] bg-gray-800 px-[260px]">
      <nav>
        <ul className="flex items-center gap-6 ">
          <li className="translate-y-1">
            <Link to="/" aria-label="Logo image can link to homepage">
              <img
                src={
                  import.meta.env.VITE_TURTLE_FRONTEND_IMAGE_URL + "/Logo.webp"
                }
                alt="Logo image"
                width={120}
                height={81}
                className="pointer-events-none"
              />
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="relative p-1 text-4xl font-normal rounded-md text-sky-50 top-1 hover:bg-gray-700"
            >
              全部商品
            </Link>
          </li>
          <li>
            <Link
              to="/newProducts"
              className="relative p-1 text-4xl font-normal rounded-md text-sky-50 top-1 hover:bg-gray-700"
            >
              新上市
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-7">
        <Link to="/shoppingCart" aria-label="Icon link to shopping cart page">
          <FaShoppingCart className="w-10 h-10 text-sky-50" />
        </Link>
        <div className="flex flex-col gap-2">
          <SearchBar />
          <div className="flex justify-between gap-3">
            <UserStatusLink />
            <Link
              to="/orderSearch"
              className="text-2xl font-normal rounded-md text-sky-50 hover:bg-gray-700"
            >
              訂單查詢
            </Link>
          </div>
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
      className="text-2xl font-normal rounded-md text-sky-50 hover:bg-gray-700"
    >
      {linkData.text}
    </Link>
  );
}

function SearchBar() {
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("you search for something");
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="text"
        placeholder="Search"
        className="w-full h-8 indent-2 rounded-l-md"
      />
      <button aria-label="搜尋商品按鈕" className="bg-white rounded-r-md">
        <IoSearch className="w-6 h-6" />
      </button>
    </form>
  );
}

function Footer() {
  return (
    <footer className="mt-60 lg:w-screen md:w-screen w-[768.7px]">
      <div className="border-4 border-gray-800 shadow" />
      <div className="border-4 border-gray-100 shadow" />
      <div className="h-60">footer</div>
    </footer>
  );
}

export default RootLayout;
