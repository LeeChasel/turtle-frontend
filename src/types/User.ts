export type TLogin = {
  email: string;
  password: string;
};

export type TInfo = {
  id: string;
  email: string;
  emailVerified: boolean;
  username: string;
  birthday: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "UNKNOW";
  roles: TRole[];
  enabled: boolean;
  createdAt: string;
};

export type TRole =
  | "ROLE_ADMIN"
  | "ROLE_CUSTOMER"
  | "ROLE_CHANGE_PASSWORD"
  | "ROLE_VERIFY_EMAIL";
