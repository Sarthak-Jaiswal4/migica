"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const TIMER_DURATION_S = 900;
const DISCOUNT_CODE = "MAGICA10";

export interface DiscountPopupProps {
  open: boolean;
  onClose: () => void;
  onEmailSubmit?: (email: string) => Promise<void> | void;
}

type PopupPhase = "form" | "success";

export function DiscountPopup({ open, onClose, onEmailSubmit }: DiscountPopupProps) {
  const [phase, setPhase] = useState<PopupPhase>("form");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION_S);
  const [isExpired, setIsExpired] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearTimer();
    onClose();
  }, [clearTimer, onClose]);

  useEffect(() => {
    if (!open) {
      setPhase("form");
      setEmail("");
      setEmailError("");
      setIsSubmitting(false);
      setTimeLeft(TIMER_DURATION_S);
      setIsExpired(false);
      clearTimer();
      return;
    }

    setPhase("form");
    setTimeLeft(TIMER_DURATION_S);
    setIsExpired(false);
    setEmailError("");
  }, [open, clearTimer]);

  useEffect(() => {
    if (!open || phase !== "form") return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 350);
    return () => window.clearTimeout(id);
  }, [open, phase]);

  useEffect(() => {
    if (!open || phase !== "form") return;

    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [open, phase, clearTimer]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, handleClose]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    setEmailError("");
    setIsSubmitting(true);
    clearTimer();

    try {
      await onEmailSubmit?.(email);
    } catch {
      // intentionally ignore — show success regardless
    } finally {
      setIsSubmitting(false);
      setPhase("success");
    }
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") void handleSubmit();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerLabel = `${minutes}:${String(seconds).padStart(2, "0")}`;
  const timerPercent = (timeLeft / TIMER_DURATION_S) * 100;

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get 10% off your first order"
      className={cn(
        dmSans.className,
        "fixed inset-0 z-[9999] flex items-center justify-center p-4",
        "bg-black/[0.52] animate-[magica-discount-overlay-in_0.25s_ease_forwards]"
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={cn(
          "relative w-full max-w-[430px] overflow-hidden rounded-[20px] border border-[#EDD9C8] bg-[#FFFBF7]",
          "animate-[magica-discount-card-in_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close popup"
          className={cn(
            "absolute right-3.5 top-3.5 z-[2] flex h-[30px] w-[30px] items-center justify-center rounded-full",
            "border border-[#EDD9C8] bg-white/60 text-[#A07060] transition-colors",
            "hover:bg-white hover:text-[#5C3D2E]"
          )}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>

        {phase === "form" && (
          <>
            <div className="relative border-b border-[#EDD9C8] bg-[#F9EDE3] px-9 pb-7 pt-9 text-center">
              <div className="mx-auto mb-[18px] flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#EDD9C8] bg-white">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B3A1A"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#B07050]">
                Welcome to Magica
              </p>
              <h2
                className={cn(
                  cormorant.className,
                  "mb-3 text-[36px] font-medium leading-[1.15] text-[#3A1E10]"
                )}
              >
                Get 10% off
                <br />
                your first order
              </h2>
              <p className="m-0 text-[13.5px] leading-relaxed text-[#8C5A42]">
                Candles, jewellery, scarfs & more — join thousands of happy customers.
              </p>
            </div>

            <div className="px-7 pb-7 pt-6">
              <div className="relative mb-2.5">
                <input
                  ref={inputRef}
                  type="email"
                  className={cn(
                    "box-border w-full rounded-[10px] border bg-white px-4 py-3 text-sm text-[#3A1E10] outline-none transition-[border-color,box-shadow]",
                    "placeholder:text-[#C4A090]",
                    "focus:border-[#A0522D] focus:shadow-[0_0_0_3px_rgba(160,82,45,0.12)]",
                    emailError
                      ? "border-[#E24B4A] shadow-[0_0_0_3px_rgba(226,75,74,0.1)]"
                      : "border-[#DEC8B8]"
                  )}
                  placeholder="Your email address"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="email"
                  disabled={isSubmitting || isExpired}
                />
                {emailError ? (
                  <p className="mt-1.5 pl-0.5 text-xs text-[#C0392B]" role="alert">
                    {emailError}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || isExpired}
                className={cn(
                  "mb-2.5 flex w-full items-center justify-center gap-2 rounded-[10px] px-3.5 py-3.5 text-[15px] font-medium",
                  "bg-[#8B3A1A] text-[#FDF0E8] transition-[background-color,transform]",
                  "hover:bg-[#6B2A10] active:scale-[0.985]",
                  "disabled:cursor-not-allowed disabled:bg-[#C4A090] disabled:hover:bg-[#C4A090]"
                )}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border-2 border-[rgba(253,240,232,0.3)] border-t-[#FDF0E8] animate-spin"
                      aria-hidden
                    />
                    Claiming your offer…
                  </>
                ) : isExpired ? (
                  "Offer expired"
                ) : (
                  "Claim my 10% off"
                )}
              </button>

              <p className="mb-[18px] text-center text-[11.5px] text-[#B09080]">
                No spam, ever. Unsubscribe at any time.
              </p>

              <div className="border-t border-[#EDD9C8] pt-4">
                <p className="mb-2 text-center text-xs text-[#B09080]">
                  {isExpired ? "This offer has expired" : "Offer expires in"}
                </p>
                <div className="h-[5px] overflow-hidden rounded-full bg-[#EDD9C8]">
                  <div
                    className="h-full rounded-full bg-[#8B3A1A] transition-[width] duration-1000 ease-linear"
                    style={{ width: `${timerPercent}%` }}
                  />
                </div>
                <p
                  className={cn(
                    "mt-2 text-center text-[13px] font-medium",
                    isExpired ? "text-[#B09080]" : "text-[#8B3A1A]"
                  )}
                >
                  {isExpired ? "Expired" : timerLabel}
                </p>
              </div>
            </div>
          </>
        )}

        {phase === "success" && (
          <div className="animate-[magica-discount-success-in_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] px-7 pb-9 pt-8 text-center">
            <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full border border-[#C0DD97] bg-[#EAF3DE]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <polyline
                  className="animate-[magica-discount-check_0.4s_ease_0.2s_forwards]"
                  points="20 6 9 17 4 12"
                  stroke="#3B6D11"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={40}
                  strokeDashoffset={40}
                />
              </svg>
            </div>

            <h3
              className={cn(cormorant.className, "mb-2 text-[28px] font-medium text-[#3A1E10]")}
            >
              You&apos;re in!
            </h3>
            <p className="mb-[22px] text-[13.5px] leading-relaxed text-[#8C5A42]">
              Your 10% off code is ready to use. Check your inbox for the full details.
            </p>

            <div className="mb-[22px] rounded-xl border-[1.5px] border-dashed border-[#C89070] bg-[#F9EDE3] px-4 py-4">
              <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#A07050]">
                Your discount code
              </p>
              <p
                className="m-0 bg-clip-text text-[26px] font-medium tracking-[0.12em] text-transparent animate-[magica-discount-shimmer_3s_linear_infinite]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #3A1E10 0%, #8B3A1A 40%, #3A1E10 60%, #8B3A1A 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                }}
              >
                {DISCOUNT_CODE}
              </p>
              <button
                type="button"
                className="mt-1 border-0 bg-transparent p-1 pt-1 text-xs text-[#A07050] transition-colors hover:text-[#5C3D2E]"
                onClick={() => {
                  void navigator.clipboard.writeText(DISCOUNT_CODE).catch(() => {});
                }}
              >
                tap to copy
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "w-full rounded-[10px] px-3.5 py-3.5 text-[15px] font-medium",
                "bg-[#8B3A1A] text-[#FDF0E8] transition-[background-color,transform]",
                "hover:bg-[#6B2A10] active:scale-[0.985]"
              )}
            >
              Start shopping
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
