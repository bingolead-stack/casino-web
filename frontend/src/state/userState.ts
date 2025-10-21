import { tUser } from "@/types/tUser";
import { atom } from "recoil";

export const userState = atom<tUser | null>({
  key: "userState",
  default: null,
});
