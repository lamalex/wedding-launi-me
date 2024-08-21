import { OTPInput } from "input-otp";
import type { SlotProps } from "input-otp";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import { useRef } from "react";

export function InputOtp() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form method="POST" ref={formRef}>
      <div>
        <p className="text-bold">Enter your code</p>
        <input type="hidden" name="step" value="otp" />
        <OTPInput
          id="otp"
          name="otp"
          onComplete={() => formRef.current?.submit()}
          maxLength={6}
          containerClassName="group flex items-center has-[:disabled]:opacity-30"
          render={({ slots }) => (
            <>
              <div className="flex">
                {slots.slice(0, 6).map((slot, idx) => (
                  <Slot key={idx} {...slot} />
                ))}
              </div>
            </>
          )}
        />
      </div>
    </form>
  );
}

// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "relative w-10 h-14 text-[2rem]",
        "flex items-center justify-center",
        "transition-all duration-300",
        "text-pink-200 border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md",
        "group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20",
        "outline outline-0 outline-accent-foreground/20",
        { "outline-3 outline-accent-foreground": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
