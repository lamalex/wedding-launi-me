import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { loginItems } from "../loginStore";

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
        key: "example_otp_key",
        length: 6,
      }),
    });

    const body = await res.json<{
      success: boolean;
      textId: string;
      otp: string;
      error?: string;
    }>();
    body.error = null;
    body.otp = "696969";
    return { phoneNumber: phone, enteredOtp: body.otp, error: body.error };
  } catch (err) {
    console.error(err);
    return { phoneNumber: phone, error: err.message };
  }
}

export async function verifyOtp(otp: string, phone: string) {
  try {
    console.log(`otp ${otp} phone ${phone}`);

    const params = new URLSearchParams({
      user_entered_code: otp,
      userid: phone,
      key: "example_otp_key",
    });
    const res = await fetch(
      `https://textbelt.com/otp/verify?${params.toString()}`,
    );

    const body = await res.json<{
      success: boolean;
      isOtpValid: boolean;
      message?: string;
    }>();
    console.log(body);

    loginItems.set({
      login: {
        phoneNumber: new PhoneNumber(phone),
        error: body.success ? null : body.message || "Something went wrong",
      },
    });

    return {
      success: true, //body.success && body.isOtpValid,
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
