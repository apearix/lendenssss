"use client";

import Link from "next/link";
import Footer from "../../../components/common/Footer";
import Icon from "../../../components/common/Icon";
import MobilePageHeader from "../../../components/common/MobilePageHeader";
import { useLanguage } from "../../../components/common/LanguageProvider";

export default function NotificationsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da]">
        <MobilePageHeader title="Notifications" backHref="/profile" action={<Icon name="back" size={25} />} />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[104px] pt-[78px]">
          <section className="grid min-h-[360px] place-content-center justify-items-center gap-3 px-5 text-center" aria-label="Notifications">
            <span className="grid size-[82px] place-items-center rounded-full border border-[#ccebd8] bg-[#e5f8eb] text-[#087354] shadow-[0_8px_20px_#08735418]"><Icon name="bell" size={42} strokeWidth={1.7} /></span>
            <div><h1 className="m-0 text-[19px] font-extrabold text-[#20342a]">{t("No notifications yet")}</h1><p className="m-0 mt-1 max-w-[280px] text-[13px] leading-[1.5] text-[#718078]">{t("Reminders and account updates will appear here.")}</p></div>
          </section>
          <Link className="mx-auto flex min-h-[44px] max-w-[260px] items-center justify-center rounded-[10px] bg-[#e1f7e9] text-sm font-bold text-[#075d43]" href="/profile">{t("Back to profile")}</Link>
        </main>
      </div>
      <Footer active="Profile" />
    </div>
  );
}
