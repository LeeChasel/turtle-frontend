import { jwtDecode, type JwtPayload } from "jwt-decode";

type Roles =
  | "ROLE_ADMIN"
  | "ROLE_CUSTOMER"
  | "ROLE_CHANGE_PASSWORD"
  | "ROLE_VERIFY_EMAIL";

type TJWTPayload = JwtPayload & {
  role: Roles[];
};

/**
 * @param token JWT token string
 * @param role Validate target role
 * @returns
 */
function validateTokenRole(token: string, role: Roles) {
  const jwtInfo = jwtDecode<TJWTPayload>(token);
  return jwtInfo.role.includes(role);
}

export default validateTokenRole;
