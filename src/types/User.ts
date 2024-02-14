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
  gender: Gender;
  roles: TRole[];
  enabled: boolean;
  createdAt: string;
};

export type TRole =
  | "ROLE_ADMIN"
  | "ROLE_CUSTOMER"
  | "ROLE_CHANGE_PASSWORD"
  | "ROLE_ANONYMITY_CUSTOMER"
  | "ROLE_USER"
  | "ROLE_VERIFY_EMAIL";

export type TUpdateInfo = {
  username?: string;
  birthday?: string;
  phone?: string;
  gender?: Gender;
};

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOW = "UNKNOW",
}
