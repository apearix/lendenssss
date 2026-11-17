"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { auth } from "../../../lib/api";

export default function RegisterClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
  const submittingRef = useRef(false);
  const resendingRef = useRef(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => setResendCooldown((current) => Math.max(current - 1, 0)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  function updateOtp(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setOtp((current) => current.map((digit, position) => position === index ? "" : digit));
      return;
    }

    setOtp((current) => {
      const next = [...current];
      digits.slice(0, next.length - index).split("").forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      return next;
    });
    setMessage("");
    otpInputs.current[Math.min(index + digits.length, 3)]?.focus();
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) otpInputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 3) otpInputs.current[index + 1]?.focus();
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLDivElement>) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!digits) return;
    event.preventDefault();
    setOtp(Array.from({ length: 4 }, (_, index) => digits[index] ?? ""));
    setMessage("");
    otpInputs.current[Math.min(digits.length - 1, 3)]?.focus();
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const normalizedEmail = email.trim().toLowerCase();
    const phoneNumber = `${countryCode}${phone}`;

    if (!otpRequested) {
      const digits = phone.replace(/\D/g, "");

      if (digits.length !== 10) {
        setMessage("Enter a 10-digit mobile number.");
        return;
      }
      if (!normalizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setMessage("Enter a valid email address.");
        return;
      }

      submittingRef.current = true;
      setSubmitting(true);
      try {
        // Keep the identity used to create the OTP identical to the one used
        // during verification. The API accepts both fields for registration.
        const result = await auth.sendOtp({ email: normalizedEmail, phoneNumber });
        setOtpRequested(true);
        setResendCooldown(30);
        setMessage(result.devOtpHint ? `OTP sent to your email. Development OTP: ${result.devOtpHint}` : "OTP sent successfully to your email.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to send OTP.");
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
      return;
    }

    if (otp.some((digit) => !digit)) {
      setMessage("Enter the 4-digit OTP.");
      return;
    }

    const identifier = { email: normalizedEmail, phoneNumber };
    const initialFullName = normalizedEmail.split("@")[0] || "Lenden User";
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const session = await auth.verifyOtp(identifier, otp.join(""), initialFullName);
      auth.saveSession(session, phoneNumber);
      router.replace("/create-password");
    } catch (error) {
      submittingRef.current = false;
      setSubmitting(false);
      setMessage(error instanceof Error ? error.message : "Invalid OTP.");
    }
  }

  async function resendOtp() {
    if (!otpRequested || submittingRef.current || resendingRef.current || resendCooldown > 0) return;
    const normalizedEmail = email.trim().toLowerCase();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10 || !normalizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setMessage("Enter a valid email address and 10-digit mobile number.");
      return;
    }

    resendingRef.current = true;
    setResending(true);
    setMessage("");
    try {
      const result = await auth.sendOtp({ email: normalizedEmail, phoneNumber: `${countryCode}${digits}` });
      setOtp(["", "", "", ""]);
      setResendCooldown(30);
      setMessage(result.devOtpHint ? `OTP resent. Development OTP: ${result.devOtpHint}` : "OTP resent successfully to your email.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend OTP.");
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_50%_34%,#fff_0%,#f6f8f5_76%,#eaf0ec_100%)] p-[18px] text-[#18251f] max-[480px]:p-0" aria-labelledby="register-title">
      <section className="flex min-h-[min(720px,calc(100dvh-36px))] w-full max-w-[390px] flex-col rounded-[22px] border border-[#d5dfda] bg-white/[.96] p-5 pb-6 shadow-[0_12px_32px_rgba(34,66,52,.1)] max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none">
        <header className="relative flex min-h-11 items-center justify-center">
          <Link href="/welcome" aria-label="Back to welcome page" className="absolute left-0 grid size-10 place-items-center text-[#08714f]">
            <svg className="size-[25px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
          </Link>
          <Link href="/welcome" className="inline-flex items-center gap-[7px] text-[22px] font-extrabold text-[#102b24]" aria-label="Lenden home">
            <img className="block size-[35px] object-contain" src="/images/logo.png" alt="" />
            <span>Lenden</span>
          </Link>
        </header>

        <div className="mt-5">
          <p className="m-0 mb-1 text-[13px] font-extrabold text-[#08714f]">GET STARTED</p>
          <h1 className="m-0 text-[28px] font-extrabold leading-[1.1] text-[#14251e]" id="register-title">Create your account</h1>
          <p className="m-0 mt-1.5 text-[14px] leading-[1.45] text-[#59645f]">Enter your details. OTP will be sent to your email.</p>
        </div>

        <form className="mt-[21px] grid gap-3" onSubmit={requestOtp}>
          <label className="text-[14px] font-bold text-[#202a25]" htmlFor="register-email">Email address <span className="text-[#c0393b]">*</span></label>
          <input className="h-12 rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white px-3 text-[17px] text-[#17231d] outline-none placeholder:text-[#7d8581] focus:border-[#08714f] focus:shadow-[0_0_0_3px_rgba(8,113,79,.12)]" autoComplete="email" id="register-email" name="email" onChange={(event) => { setEmail(event.target.value); setOtpRequested(false); setOtp(["", "", "", ""]); setMessage(""); }} placeholder="Enter your email address" required type="email" value={email} />
          <label className="text-[14px] font-bold text-[#202a25]" htmlFor="register-phone">Mobile number <span className="text-[#c0393b]">*</span></label>
          <div className="flex min-h-12 items-center overflow-hidden rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white transition focus-within:border-[#08714f] focus-within:shadow-[0_0_0_3px_rgba(8,113,79,.12)]">
            <select
              className="h-[30px] w-[82px] border-0 border-r border-[#d6ddd9] bg-white px-[9px] pl-3 text-[17px] font-semibold text-[#1e2823] outline-none"
              aria-label="Country calling code"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
            </select>
            <input
              className="h-[46px] min-w-0 w-full border-0 bg-transparent px-3 text-[17px] text-[#17231d] outline-none placeholder:text-[#7d8581]"
              autoComplete="tel-national"
              id="register-phone"
              inputMode="numeric"
              maxLength={10}
              name="phone"
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                setOtpRequested(false);
                setOtp(["", "", "", ""]);
                setMessage("");
              }}
              placeholder="Enter your mobile number"
              required
              type="tel"
              value={phone}
            />
          </div>

          {otpRequested && (
            <div className="grid gap-[7px]">
              <label className="text-[14px] font-bold text-[#202a25]" htmlFor="register-otp">One-time password <span className="text-[#c0393b]">*</span></label>
              <div className="grid w-full grid-cols-4 gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    className="h-12 w-full min-w-0 rounded-[9px] border-[1.5px] border-[#c5e8ce] bg-[#e8f8eb] p-0 text-center text-2xl font-semibold text-[#18251f] outline-none transition focus:border-[#08714f] focus:bg-[#f2fbf3] focus:shadow-[0_0_0_3px_rgba(8,113,79,.12)]"
                    aria-label={`OTP digit ${index + 1}`}
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    id={index === 0 ? "register-otp" : undefined}
                    inputMode="numeric"
                    key={index}
                    maxLength={1}
                    onChange={(event) => updateOtp(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    ref={(element) => { otpInputs.current[index] = element; }}
                    type="text"
                    value={digit}
                  />
                ))}
              </div>
              <button
                className="justify-self-end border-0 bg-transparent px-1 text-[13px] font-bold text-[#08714f] disabled:cursor-not-allowed disabled:text-[#8b9891]"
                disabled={resending || resendCooldown > 0 || submitting}
                onClick={() => void resendOtp()}
                type="button"
              >
                {resending ? "Sending..." : resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
              </button>
            </div>
          )}

          <label className="mt-[5px] flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-[#39453f]">
            <input className="mt-0.5 size-[22px] flex-none accent-[#08714f]" required type="checkbox" />
            <span>
                I agree to the <Link className="font-semibold text-[#08714f] underline decoration-1 underline-offset-0.5" href="/terms">Terms of Service</Link> &amp; <Link className="font-semibold text-[#08714f] underline decoration-1 underline-offset-0.5" href="/privacy">Privacy Policy</Link>. <span className="text-[#c0393b]">*</span>
            </span>
          </label>

          {message && <p className="m-0 text-[13px] leading-[1.4] text-[#9e3f36]" role="status">{message}</p>}
          <button aria-busy={submitting} className="mt-2 flex min-h-[47px] cursor-pointer items-center justify-center gap-2 rounded-[11px] border-0 bg-[#087354] text-[17px] font-bold text-white outline-offset-3 transition hover:bg-[#066448] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#70bd91] disabled:cursor-not-allowed disabled:opacity-80" disabled={submitting} type="submit">
            {submitting && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {submitting ? (otpRequested ? "Verifying..." : "Sending OTP...") : otpRequested ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <p className="m-[18px_0_0] text-center text-[15px] text-[#58625d]">
          Already registered? <Link className="font-bold text-[#08714f] underline decoration-1 underline-offset-[3px]" href="/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
