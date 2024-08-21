import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { loginItems } from "../loginStore";
import { TEXTBELT_API_KEY } from "astro:env/server";

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

export class Otp {
  private _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public value(): string {
    return this._value;
  }
}

export async function sendOtp(
  phone: PhoneNumber,
  message: string = "Hi! This is Alex & Meghan! Your login code is $OTP",
) {
  try {
    const res = await fetch("https://textbelt.com/otp/generate", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone.value(),
        userid: phone.value(),
        message: message,
        key: TEXTBELT_API_KEY,
        length: 6,
      }),
    });

    const body = await res.json<{
      success: boolean;
      textId: string;
      otp: string;
      error?: string;
    }>();

    return { phoneNumber: phone, enteredOtp: body.otp, error: body.error };
  } catch (err) {
    let message = "There was an error sending the OTP";
    if (err instanceof Error) {
      console.error(err);
      message = err.message;
    }

    return { phoneNumber: phone, error: message };
  }
}

export async function verifyOtp(otp: Otp, phone: PhoneNumber) {
  try {
    console.log(`otp ${otp} phone ${phone}`);

    const params = new URLSearchParams({
      otp: otp.value(),
      userid: phone.value(),
      key: TEXTBELT_API_KEY,
    });

    const res = await fetch(
      `https://textbelt.com/otp/verify?${params.toString()}`,
    );

    const body = await res.json<{
      success: boolean;
      isValidOtp: boolean;
      message?: string;
    }>();

    return {
      success: body.isValidOtp,
      error:
        body.success && body.isValidOtp
          ? null
          : body.isValidOtp
            ? body.message
            : "Code did not match",
    };
  } catch (err) {
    return {
      success: false,
      error: `There was an error validating your code, ${err}`,
    };
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
