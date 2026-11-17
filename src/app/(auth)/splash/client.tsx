"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashClient() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      router.replace("/welcome");
    }, 2500);

    return () => window.clearTimeout(redirectTimer);
  }, [router]);

  return (
    <main className="h-dvh min-h-dvh overflow-hidden bg-[radial-gradient(ellipse_at_20%_5%,#075844_0%,transparent_52%),linear-gradient(145deg,#004b3d_0%,#00604d_58%,#006a53_100%)]">
      <div className="relative isolate h-dvh min-h-dvh w-full overflow-hidden [container-type:inline-size]">
        <div className="pointer-events-none absolute -bottom-[14cqw] -right-[22cqw] size-[72cqw] rounded-full border border-[#2abe8f55] shadow-[0_0_0_7cqw_#0000,0_0_0_7.3cqw_#2abe8f4d,0_0_0_14cqw_#0000,0_0_0_14.3cqw_#2abe8f40,0_0_0_21cqw_#0000,0_0_0_21.3cqw_#2abe8f33]" aria-hidden="true" />
        <div className="relative z-[1] flex h-dvh min-h-dvh flex-col items-center px-[6.2cqw] pb-[calc(15cqw+env(safe-area-inset-bottom))] pt-[calc(14cqw+env(safe-area-inset-top))] text-center">
          <div className="w-[37.3cqw] flex-none" aria-hidden="true">
            <img src="/images/splash-logo.png" alt="Lenden logo" className="block h-auto w-full" />
          </div>

          <div className="mt-[1.55cqw]">
            <h1 className="m-0 text-[16cqw] font-extrabold leading-[.96] text-[#f7fdf9]">Lenden</h1>
            <p className="m-[2.5cqw_0_0] text-[5.35cqw] font-medium text-[rgba(233,244,236,.95)]">Har len-den ka saaf hisaab.</p>
          </div>

          <div className="mt-auto flex items-center gap-[2.2cqw]" aria-label="Page indicator">
            <span className="size-[3.2cqw] rounded-full bg-[#d5f86c]" />
            <span className="size-[3.2cqw] rounded-full bg-[rgba(209,245,186,.6)]" />
            <span className="size-[3.2cqw] rounded-full bg-[rgba(209,245,186,.6)]" />
          </div>

          <p className="m-[4cqw_0_0] text-[4.7cqw] font-medium text-[rgba(230,249,237,.95)]">Made for everyday clarity</p>
        </div>
      </div>
    </main>
  );
}
