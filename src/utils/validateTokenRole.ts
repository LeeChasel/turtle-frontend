import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { TRole } from "../types/User";

type TJWTPayload = JwtPayload & {
  role: TRole[];
};

/**
 * @param token JWT token string
 * @param role Validate target role
 * @returns
 */
function validateTokenRole(token: string, role: TRole) {
  const jwtInfo = jwtDecode<TJWTPayload>(token);
  return jwtInfo.role.includes(role);
}

export default validateTokenRole;
