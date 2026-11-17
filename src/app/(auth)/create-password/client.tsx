"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { auth } from "../../../lib/api";

export default function CreatePasswordClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  async function createPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;
    if (password.length < 8) return setMessage("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    savingRef.current = true;
    setSaving(true);
    try {
      await auth.setPassword(password);
      router.replace("/profile-setup");
    } catch (error) {
      savingRef.current = false;
      setSaving(false);
      setMessage(error instanceof Error ? error.message : "Unable to create password.");
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_50%_34%,#fff_0%,#f6f8f5_76%,#eaf0ec_100%)] p-[18px] text-[#18251f] max-[480px]:p-0">
      <section className="flex min-h-[min(560px,calc(100dvh-36px))] w-full max-w-[390px] flex-col rounded-[22px] border border-[#d5dfda] bg-white/[.96] p-5 pb-6 shadow-[0_12px_32px_rgba(34,66,52,.1)] max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none">
        <header className="relative flex min-h-11 items-center justify-center">
          <Link href="/register" aria-label="Back to registration" className="absolute left-0 grid size-10 place-items-center text-[#08714f]">←</Link>
          <Link href="/welcome" className="inline-flex items-center gap-[7px] text-[22px] font-extrabold text-[#102b24]"><img className="block size-[35px] object-contain" src="/images/logo.png" alt="" /><span>Lenden</span></Link>
        </header>
        <div className="mt-7"><p className="m-0 mb-1 text-[13px] font-extrabold text-[#08714f]">ACCOUNT SECURED</p><h1 className="m-0 text-[28px] font-extrabold leading-[1.1] text-[#14251e]">Create your password</h1><p className="m-0 mt-1.5 text-[14px] leading-[1.45] text-[#59645f]">Use your password to log in next time without OTP.</p></div>
        <form className="mt-7 grid gap-3" onSubmit={createPassword}>
          <label className="text-[14px] font-bold text-[#202a25]" htmlFor="create-password">Password <span className="text-[#c0393b]">*</span></label>
          <div className="relative"><input className="h-12 w-full rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white px-3 pr-12 text-[17px] outline-none focus:border-[#08714f]" autoComplete="new-password" id="create-password" minLength={8} onChange={(event) => { setPassword(event.target.value); setMessage(""); }} placeholder="At least 8 characters" required type={showPassword ? "text" : "password"} value={password} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08714f]" onClick={() => setShowPassword((current) => !current)} type="button"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{showPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 0 1-3.1 3.5M6.2 6.2C4.4 7.4 3.1 9.1 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.9-.5" /></> : <><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div>
          <label className="mt-1 text-[14px] font-bold text-[#202a25]" htmlFor="confirm-password">Confirm password <span className="text-[#c0393b]">*</span></label>
          <div className="relative"><input className="h-12 w-full rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white px-3 pr-12 text-[17px] outline-none focus:border-[#08714f]" autoComplete="new-password" id="confirm-password" minLength={8} onChange={(event) => { setConfirmPassword(event.target.value); setMessage(""); }} placeholder="Re-enter your password" required type={showConfirmPassword ? "text" : "password"} value={confirmPassword} /><button aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08714f]" onClick={() => setShowConfirmPassword((current) => !current)} type="button"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{showConfirmPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 0 1-3.1 3.5M6.2 6.2C4.4 7.4 3.1 9.1 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.9-.5" /></> : <><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div>
          {message && <p className="m-0 text-[13px] text-[#9e3f36]" role="status">{message}</p>}
          <button aria-busy={saving} className="mt-3 flex min-h-[47px] items-center justify-center gap-2 rounded-[11px] bg-[#087354] text-[17px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-80" disabled={saving} type="submit">
            {saving && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {saving ? "Saving..." : "Create password"}
          </button>
        </form>
      </section>
    </main>
  );
}
