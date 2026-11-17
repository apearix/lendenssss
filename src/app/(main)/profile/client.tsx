"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../../../components/common/Footer";
import Icon from "../../../components/common/Icon";
import { makeInitials } from "../../../lib/people";
import MobilePageHeader from "../../../components/common/MobilePageHeader";
import { api, auth } from "../../../lib/api";
import { useLanguage } from "../../../components/common/LanguageProvider";
import ConfirmModal from "../../../components/common/ConfirmModal";

export default function ProfilePage() {
  const router = useRouter();
  const [language, setLanguage] = useState("English");
  const [name, setName] = useState("Loading...");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const { t, setLanguage: setAppLanguage } = useLanguage();
  useEffect(() => {
    const cachedAvatar = localStorage.getItem("lenden_avatar_url") || "";
    void api.profile().then((profile) => {
      setName(profile.fullName);
      setPhone(profile.phoneNumber || profile.email || "");
      setAvatarUrl(profile.avatarUrl || cachedAvatar);
      setLanguage(profile.language);
      setAppLanguage(profile.language as "English" | "हिन्दी");
    }).catch(() => { if (cachedAvatar) setAvatarUrl(cachedAvatar); });
  }, [setAppLanguage]);

  return (
    <div className="min-h-dvh bg-[#edf4ef] p-2.5 min-[701px]:bg-[radial-gradient(#cbded2_0.8px,transparent_0.8px)] min-[701px]:[background-size:19px_19px] min-[701px]:px-5 min-[701px]:py-0 max-[700px]:p-0">
      <div className="mx-auto flex h-[calc(100dvh-20px)] w-full min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#d6e4da] bg-white shadow-[0_12px_30px_rgba(22,76,48,.1)] min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] max-[700px]:h-dvh max-[700px]:max-w-none max-[700px]:rounded-none max-[700px]:border-0 max-[700px]:shadow-none">
        <MobilePageHeader title="Profile" className="min-[701px]:top-0" />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[76px] pt-[70px] min-[701px]:px-[38px] min-[701px]:pb-[48px] min-[701px]:pt-[104px]">
          <section className="flex min-h-[108px] items-center gap-4 rounded-[17px] border border-[#dcebe0] bg-[linear-gradient(110deg,#f4fbf6,#e8f7ed)] px-5 pb-3 pt-3 shadow-[0_5px_18px_rgba(22,76,48,.05)] min-[701px]:min-h-[150px] min-[701px]:px-7 max-[480px]:min-h-[124px] max-[480px]:gap-[13px]" aria-label="Account profile">
            <div className="grid size-[72px] flex-none place-items-center overflow-hidden rounded-full border-2 border-[#08714f] bg-[#d7f2e1] text-[25px] font-bold text-[#08714f] min-[701px]:size-[92px] min-[701px]:text-[31px]">{avatarUrl ? <img className="size-full object-cover" src={avatarUrl} alt="Profile avatar" /> : makeInitials(name)}</div>
            <div><h2 className="m-0 text-[20px] font-bold leading-[1.2] text-[#18251f] min-[701px]:text-[25px] max-[480px]:text-[19px]">{name}</h2><p className="m-0 mt-[7px] text-[15px] text-[#56635c] min-[701px]:text-[16px]">{phone}</p></div>
          </section>

          <div className="mt-5 grid gap-[15px] min-[701px]:grid-cols-2 min-[701px]:gap-5">
          <section className="mb-[15px] overflow-hidden rounded-[14px] border border-[#e0e7e3] bg-white min-[701px]:mb-0" aria-label="Personal settings">
            <Link className="flex min-h-[50px] items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#29352f] last:border-b-0 hover:bg-[#f7fbf8]" href="/profile/edit"><Icon name="profile" size={21} /><span className="flex-1 text-[14px] font-semibold">{t("Edit profile")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></Link>
            <Link className="flex min-h-[50px] items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#29352f] last:border-b-0 hover:bg-[#f7fbf8]" href="/notifications"><Icon name="bell" size={21} /><span className="flex-1 text-[14px] font-semibold">{t("Notifications")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></Link>
            <label className="flex min-h-[50px] items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#29352f] last:border-b-0 hover:bg-[#f7fbf8]"><Icon name="globe" size={21} /><span className="flex-1 text-[14px] font-semibold">{t("Language")}</span><select className="ml-auto max-w-[98px] bg-transparent text-[14px] outline-none" aria-label="Language" value={language} onChange={(event) => { const value = event.target.value; setLanguage(value); setAppLanguage(value as "English" | "हिन्दी"); void api.updateProfile({ language: value }).catch(() => undefined); }}><option>English</option><option>हिन्दी</option></select><Icon name="chevron" size={19} className="text-[#58675f]" /></label>
            <button aria-disabled="true" aria-pressed="false" className="flex min-h-[50px] w-full cursor-not-allowed items-center gap-3 border-b border-[#e8edea] px-[14px] text-left text-[#9aa69e] opacity-70 last:border-b-0" disabled type="button"><Icon name="shield" size={21} /><span className="flex-1 text-[14px] font-semibold">App lock</span><span aria-label="Off" className="relative h-[30px] w-[52px] flex-none rounded-full bg-[#d9dfda] p-[3px]"><span className="block size-6 rounded-full bg-white" /></span></button>
          </section>

          <section className="mb-[15px] overflow-hidden rounded-[14px] border border-[#e0e7e3] bg-white min-[701px]:mb-0" aria-label="Support and privacy">
            <button aria-disabled="true" className="flex min-h-[50px] w-full cursor-not-allowed items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#9aa69e] opacity-70 last:border-b-0" disabled type="button"><Icon name="download" size={21} /><span className="flex-1 text-left text-[14px] font-semibold">{t("Export records")}</span><span className="text-[11px] font-semibold">Coming soon</span></button>
            <button className="flex min-h-[50px] w-full items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#29352f] last:border-b-0 hover:bg-[#f7fbf8]" type="button"><Icon name="help" size={21} /><span className="flex-1 text-left text-[14px] font-semibold">{t("Help & support")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></button>
            <button className="flex min-h-[50px] w-full items-center gap-3 border-b border-[#e8edea] px-[14px] text-[#29352f] last:border-b-0 hover:bg-[#f7fbf8]" type="button"><Icon name="shield" size={21} /><span className="flex-1 text-left text-[14px] font-semibold">{t("Privacy policy")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></button>
          </section>
          </div>

          <div className="mt-px min-[701px]:mt-5 min-[701px]:flex min-[701px]:items-center min-[701px]:gap-4">
            <button className="flex min-h-[50px] w-full items-center gap-3 rounded-[14px] border border-[#e0e7e3] bg-white px-[14px] text-left text-[#c0393b] hover:bg-[#f7fbf8] min-[701px]:w-auto min-[701px]:min-w-[220px]" onClick={() => setLogoutModalOpen(true)} type="button"><Icon name="logout" size={21} /><span className="flex-1 text-[14px] font-bold">{t("Log out")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></button>
            <button className="mt-3 flex min-h-[50px] w-full items-center gap-3 rounded-[14px] border border-[#f1d6d6] bg-white px-[14px] text-left text-[#c0393b] hover:bg-[#fff7f7] min-[701px]:mt-0 min-[701px]:w-auto min-[701px]:min-w-[220px]" onClick={() => setDeleteAccountModalOpen(true)} type="button"><Icon name="trash" size={21} /><span className="flex-1 text-[14px] font-bold">{t("Delete account")}</span><Icon name="chevron" size={19} className="text-[#58675f]" /></button>
          </div>
        </main>
      </div>
      <ConfirmModal open={logoutModalOpen} title={t("Log out?")} message={t("Are you sure you want to log out of your Lenden account?")} confirmLabel={t("Log out")} onCancel={() => setLogoutModalOpen(false)} onConfirm={() => { auth.clearSession(); router.replace("/login"); }} />
      <ConfirmModal open={deleteAccountModalOpen} title={t("Delete account?")} message={t("Deleting your account will permanently remove your profile, people, transactions, and account data. You will be logged out and this action cannot be undone.")} confirmLabel={t("Delete account")} confirmationText="Delete" confirmationPlaceholder={t("Type Delete to confirm")} loading={deletingAccount} onCancel={() => { if (!deletingAccount) setDeleteAccountModalOpen(false); }} onConfirm={async () => { setDeletingAccount(true); try { await api.deleteAccount(); auth.clearSession(); router.replace("/welcome"); } catch { setDeletingAccount(false); setDeleteAccountModalOpen(false); } }} />
      <Footer active="Profile" />
    </div>
  );
}
