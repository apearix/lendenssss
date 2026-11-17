"use client";

import Link from "next/link";

export default function WelcomeClient() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#fff_0%,#f7f8f5_76%,#eef1ed_100%)] px-5 pb-5 pt-4 text-[#102b24] max-[480px]:h-dvh max-[480px]:min-h-0 max-[480px]:p-0 max-[480px]:bg-white">
      <section className="flex h-[min(650px,calc(100dvh-74px))] min-h-0 w-full max-w-[356px] flex-col items-center overflow-hidden rounded-[23px] border border-[#d2dfd9] bg-white/[.94] px-[18px] pb-[13px] pt-4 text-center shadow-[0_12px_30px_rgba(27,74,56,.1)] max-[480px]:h-dvh max-[480px]:max-w-none max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:pb-[calc(13px+env(safe-area-inset-bottom))] max-[480px]:shadow-none" aria-labelledby="welcome-title">
        <header className="flex min-h-[54px] flex-none items-center justify-center gap-[9px] text-[32px] font-extrabold">
          <img className="block size-[52px] object-contain" src="/images/logo.png" alt="" />
          <span>Lenden</span>
        </header>

        <div className="flex min-h-[125px] w-full max-h-[250px] flex-1 items-center justify-center py-1" aria-hidden="true">
          <img className="block w-full max-h-[235px] object-contain" src="/images/welcome.png" alt="" />
        </div>

        <div className="flex-none">
          <h1 className="m-0 text-[29px] font-extrabold leading-[1.03] max-[360px]:text-[27px]" id="welcome-title">Har Lenden ka<br />Clear Hisaab</h1>
          <p className="m-0 mt-[7px] text-[14px] leading-[1.3] text-[#374640]">Track money given, money received<br /> and bills due.</p>
        </div>

        <div className="mt-6 grid w-full flex-none gap-[9px]">
          <Link className="flex min-h-[41px] items-center justify-center rounded-[10px] border-[1.5px] border-[#08714f] bg-[#087354] text-[16px] font-bold text-white outline-offset-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#70bd91]" href="/register">Create account</Link>
          <Link className="flex min-h-[41px] items-center justify-center rounded-[10px] border-[1.5px] border-[#08714f] text-[16px] font-bold text-[#075b40] outline-offset-3 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#70bd91]" href="/login">Log in</Link>
        </div>

        <p className="mt-3 mb-0 flex-none text-[11px] leading-[1.35] text-[#4a5751]">
          By continuing, you agree to Lenden&apos;s<br />
          <Link className="text-[#08714f] underline decoration-1 underline-offset-2" href="/terms">Terms of Service</Link> and <Link className="text-[#08714f] underline decoration-1 underline-offset-2" href="/privacy">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
}
