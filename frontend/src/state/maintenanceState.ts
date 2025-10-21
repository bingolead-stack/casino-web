import { atom } from "recoil";

export const maintenanceState = atom<string>({
  key: "maintenanceState",
  default: "",
});
