import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";

export class PhoneNumber {
  private _value: string;

  constructor(value: string) {
    this._value = value;
    this.validate();
  }

  public value(): string {
    return this._value;
  }

  private validate() {
    // throw new Error("unimplemented");
  }
}

export async function verifyOtp(otp: string) {
  console.log(`verify ${otp}`);
}

export async function sendOtp(phone: PhoneNumber, message: string) {
  try {
    const res = await fetch("https://textbelt.com/otp/generate", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value(),
        userid: phone.value(),
        message: "Hi! This is Alex & Meghan! Your login code is $OTP",
        key: "example_otp_key",
      }),
    });

    const body = await res.json();
    console.log(body);
  } catch (err) {
    console.error(err);
  }
}

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session",
  });
  return new Lucia(adapter);
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
  }
}
