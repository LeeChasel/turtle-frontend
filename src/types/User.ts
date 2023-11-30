export type TLogin = {
  email: string;
  password: string;
}

export type TInfo = {
  id: string,
  email: string,
  emailVerified: boolean,
  username: string,
  birthday: string,
  phone: string,
  gender: "MALE" | "FEMALE",
  roles: string[],
  enabled: boolean,
  createdAt: string
}