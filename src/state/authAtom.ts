import { atom } from "recoil";

export interface AuthUser {
  accessToken: string;
  username: string;
  email: string;
}

const stored = localStorage.getItem("accountState");
const defaultUser = stored ? (JSON.parse(stored) as AuthUser) : null;

export const authAtom = atom<AuthUser | null>({
  key: "authAtom",
  default: defaultUser,
});
