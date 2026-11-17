"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "../../../lib/api";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("reset") === "success") setMessage("Password reset successfully. You can now log in.");
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const session = await auth.login(email.trim(), password);
      auth.saveSession(session, session.user.phoneNumber || undefined, rememberMe);
      router.replace("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_50%_34%,#fff_0%,#f6f8f5_76%,#eaf0ec_100%)] p-[18px] text-[#18251f] max-[480px]:p-0" aria-labelledby="login-title">
      <section className="flex min-h-[min(620px,calc(100dvh-36px))] w-full max-w-[390px] flex-col rounded-[22px] border border-[#d5dfda] bg-white/[.96] p-5 pb-6 shadow-[0_12px_32px_rgba(34,66,52,.1)] max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none">
        <header className="relative flex min-h-11 items-center justify-center"><Link href="/welcome" aria-label="Back to welcome page" className="absolute left-0 grid size-10 place-items-center text-[#08714f]"><svg className="size-[25px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true" viewBox="0 0 24 24"><path d="M19 12H5m7 7-7-7 7-7" /></svg></Link><Link href="/welcome" className="inline-flex items-center gap-[7px] text-[22px] font-extrabold text-[#102b24]" aria-label="Lenden home"><img className="block size-[35px] object-contain" src="/images/logo.png" alt="" /><span>Lenden</span></Link></header>
        <div className="mt-7"><p className="m-0 mb-1 text-[13px] font-extrabold text-[#08714f]">WELCOME BACK</p><h1 className="m-0 text-[28px] font-extrabold leading-[1.1] text-[#14251e]" id="login-title">Log in to Lenden</h1><p className="m-0 mt-1.5 text-[14px] leading-[1.45] text-[#59645f]">Log in securely with your email and password.</p></div>
        <form className="mt-7 grid gap-3" onSubmit={login}>
          <label className="text-[14px] font-bold text-[#202a25]" htmlFor="login-email">Email address <span className="text-[#c0393b]">*</span></label>
          <input className="h-12 rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white px-3 text-[17px] outline-none focus:border-[#08714f]" autoComplete="email" id="login-email" onChange={(event) => { setEmail(event.target.value); setMessage(""); }} placeholder="Enter your email address" required type="email" value={email} />
          <label className="mt-1 text-[14px] font-bold text-[#202a25]" htmlFor="login-password">Password <span className="text-[#c0393b]">*</span></label>
          <div className="relative"><input className="h-12 w-full rounded-[10px] border-[1.5px] border-[#c7d0cb] bg-white px-3 pr-12 text-[17px] outline-none focus:border-[#08714f]" autoComplete="current-password" id="login-password" minLength={8} onChange={(event) => { setPassword(event.target.value); setMessage(""); }} placeholder="Enter your password" required type={showPassword ? "text" : "password"} value={password} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08714f]" onClick={() => setShowPassword((current) => !current)} type="button"><svg className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">{showPassword ? <><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 8.7 4 9.8 6a11.8 11.8 0 0 1-3.1 3.5M6.2 6.2C4.4 7.4 3.1 9.1 2.2 10c1.1 2 4.6 6 9.8 6 1 0 2-.2 2.9-.5" /></> : <><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.5" /></>}</svg></button></div>
          <div className="mt-1 flex items-center justify-between text-[13px]"><label className="flex cursor-pointer items-center gap-2 text-[#505d56]"><input className="size-4 accent-[#08714f]" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} type="checkbox" />Remember me</label><Link className="font-bold text-[#08714f] underline" href="/forgot-password">Forgot password?</Link></div>
          {message && <p className="m-0 text-[13px] text-[#9e3f36]" role="status">{message}</p>}
          <button className="mt-3 min-h-[47px] rounded-[11px] bg-[#087354] text-[17px] font-bold text-white disabled:opacity-60" disabled={loading} type="submit">{loading ? "Logging in..." : "Log in"}</button>
        </form>
        <p className="m-[20px_0_0] text-center text-[15px] text-[#58625d]">New here? <Link className="font-bold text-[#08714f] underline" href="/register">Create account</Link></p>
        <p className="m-auto mb-0 pt-[22px] text-center text-[11px] leading-[1.5] text-[#59645e]">By continuing, you agree to Lenden&apos;s<br /><Link className="text-[#08714f] underline" href="/terms">Terms of Service</Link> and <Link className="text-[#08714f] underline" href="/privacy">Privacy Policy</Link>.</p>
      </section>
    </main>
  );
}
