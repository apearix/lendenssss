"use client";

import Link from "next/link";
import { useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { auth } from "../../../lib/api";

type Step = "email" | "otp" | "password";

export default function ForgotPasswordClient() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);

  function updateOtp(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    const next = [...otp];
    if (!digits) next[index] = "";
    else digits.slice(0, 4 - index).split("").forEach((digit, offset) => { next[index + offset] = digit; });
    setOtp(next);
    setMessage("");
    if (digits) otpInputs.current[Math.min(index + digits.length, 3)]?.focus();
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      if (step === "email") {
        const result = await auth.sendOtp({ email: email.trim() });
        setStep("otp");
        setMessage(result.devOtpHint ? `OTP sent. Development OTP: ${result.devOtpHint}` : "OTP sent to your email.");
      } else if (step === "otp") {
        if (otp.some((digit) => !digit)) throw new Error("Enter the 4-digit OTP.");
        setStep("password");
      } else {
        if (password.length < 8) throw new Error("Password must be at least 8 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await auth.resetPassword(email.trim(), otp.join(""), password);
        window.location.href = "/login?reset=success";
        return;
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_50%_34%,#fff_0%,#f6f8f5_76%,#eaf0ec_100%)] p-[18px] text-[#18251f] max-[480px]:p-0">
      <section className="flex min-h-[min(560px,calc(100dvh-36px))] w-full max-w-[390px] flex-col rounded-[22px] border border-[#d5dfda] bg-white/[.96] p-5 pb-6 shadow-[0_12px_32px_rgba(34,66,52,.1)] max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none">
        <header className="relative flex min-h-11 items-center justify-center"><Link href="/login" aria-label="Back to login" className="absolute left-0 grid size-10 place-items-center text-[#08714f]"><svg className="size-[25px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5m7 7-7-7 7-7" /></svg></Link><Link href="/welcome" className="inline-flex items-center gap-[7px] text-[22px] font-extrabold text-[#102b24]"><img className="block size-[35px] object-contain" src="/images/logo.png" alt="" /><span>Lenden</span></Link></header>
        <div className="mt-7"><p className="m-0 mb-1 text-[13px] font-extrabold text-[#08714f]">ACCOUNT RECOVERY</p><h1 className="m-0 text-[28px] font-extrabold leading-[1.1] text-[#14251e]">Forgot password?</h1><p className="m-0 mt-1.5 text-[14px] leading-[1.45] text-[#59645f]">{step === "email" ? "We will send a verification OTP to your email." : step === "otp" ? "Enter the 4-digit OTP from your email." : "Create a new password for your account."}</p></div>
        <form className="mt-7 grid gap-3" onSubmit={submit}>
          {step === "email" && <><label className="text-[14px] font-bold text-[#202a25]" htmlFor="forgot-email">Email address <span className="text-[#c0393b]">*</span></label><input className="h-12 rounded-[10px] border-[1.5px] border-[#c7d0cb] px-3 text-[17px] outline-none focus:border-[#08714f]" autoComplete="email" id="forgot-email" onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" required type="email" value={email} /></>}
          {step === "otp" && <><label className="text-[14px] font-bold text-[#202a25]" htmlFor="forgot-otp">4-digit OTP <span className="text-[#c0393b]">*</span></label><div className="grid w-full grid-cols-4 gap-2" onPaste={handleOtpPaste}>{Array.from({ length: 4 }, (_, index) => <input className="h-12 w-full min-w-0 rounded-[9px] border-[1.5px] border-[#c5e8ce] bg-[#e8f8eb] p-0 text-center text-2xl font-semibold text-[#18251f] outline-none transition focus:border-[#08714f] focus:bg-[#f2fbf3] focus:shadow-[0_0_0_3px_rgba(8,113,79,.12)]" aria-label={`OTP digit ${index + 1}`} autoComplete={index === 0 ? "one-time-code" : "off"} id={index === 0 ? "forgot-otp" : undefined} inputMode="numeric" key={index} maxLength={1} onChange={(event) => updateOtp(index, event.target.value)} onKeyDown={(event) => handleOtpKeyDown(index, event)} ref={(element) => { otpInputs.current[index] = element; }} type="text" value={otp[index] ?? ""} />)}</div></>}
          {step === "password" && <><label className="text-[14px] font-bold text-[#202a25]" htmlFor="forgot-password">New password <span className="text-[#c0393b]">*</span></label><div className="relative"><input className="h-12 w-full rounded-[10px] border-[1.5px] border-[#c7d0cb] px-3 pr-12 text-[17px] outline-none focus:border-[#08714f]" autoComplete="new-password" id="forgot-password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required type={showPassword ? "text" : "password"} value={password} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08714f]" onClick={() => setShowPassword((current) => !current)} type="button"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{showPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 0 1-3.1 3.5M6.2 6.2C4.4 7.4 3.1 9.1 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.9-.5" /></> : <><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div><label className="mt-1 text-[14px] font-bold text-[#202a25]" htmlFor="forgot-confirm-password">Confirm password <span className="text-[#c0393b]">*</span></label><div className="relative"><input className="h-12 w-full rounded-[10px] border-[1.5px] border-[#c7d0cb] px-3 pr-12 text-[17px] outline-none focus:border-[#08714f]" autoComplete="new-password" id="forgot-confirm-password" minLength={8} onChange={(event) => setConfirmPassword(event.target.value)} required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} /><button aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08714f]" onClick={() => setShowConfirmPassword((current) => !current)} type="button"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{showConfirmPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 0 1-3.1 3.5M6.2 6.2C4.4 7.4 3.1 9.1 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.9-.5" /></> : <><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div></>}
          {message && <p className="m-0 text-[13px] text-[#9e3f36]" role="status">{message}</p>}
          <button className="mt-3 min-h-[47px] rounded-[11px] bg-[#087354] text-[17px] font-bold text-white disabled:opacity-60" disabled={loading} type="submit">{loading ? "Please wait..." : step === "email" ? "Send OTP" : step === "otp" ? "Continue" : "Reset password"}</button>
        </form>
        <p className="m-[20px_0_0] text-center text-[15px] text-[#58625d]"><Link className="font-bold text-[#08714f] underline" href="/login">Back to login</Link></p>
      </section>
    </main>
  );
}
