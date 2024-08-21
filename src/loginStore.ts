import { map } from "nanostores";
import { PhoneNumber } from "./server/auth";

export type LoginItem = {
  phoneNumber: PhoneNumber;
  enteredOtp?: string | null;
  error?: string | null;
};

export const loginItems = map<Record<string, LoginItem>>({});
