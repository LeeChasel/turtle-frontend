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
  merchant: Merchant;
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
  | "ROLE_VERIFY_EMAIL"
  | "ROLE_MERCHANT";

export type TUpdateInfo = {
  username?: string;
  birthday?: string;
  phone?: string;
  gender?: Gender;
};

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOW = "UNKNOW",
}

export type Merchant = {
  returnAddress: string;
  platformFeeRate: number;
};
