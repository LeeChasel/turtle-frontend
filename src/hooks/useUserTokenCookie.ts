import { useCookies } from "react-cookie";
import { TJWTResponse } from "../types/JWT";

const userTokenName = "userToken";

function useUserTokenCookie() {
  const [cookies, setCookie, removeCookie] = useCookies([userTokenName]);

  const tokenCookie = cookies.userToken as string | undefined;

  function setUserTokenCookie(jwt: TJWTResponse) {
    const token = jwt.token;
    const expiresTime = new Date(jwt.expiresAt);
    setCookie(userTokenName, token, { expires: expiresTime, path: "/" });
  }

  function deleteUserTokenCookie() {
    removeCookie(userTokenName);
  }

  return {
    tokenCookie,
    setUserTokenCookie,
    deleteUserTokenCookie,
  };
}

export default useUserTokenCookie;
