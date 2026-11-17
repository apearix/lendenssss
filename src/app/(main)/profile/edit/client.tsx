"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../../components/common/Footer";
import Icon from "../../../../components/common/Icon";
import MobilePageHeader from "../../../../components/common/MobilePageHeader";
import { api, auth } from "../../../../lib/api";
import ImageCropModal from "../../../../components/common/ImageCropModal";

export default function EditProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [cropSource, setCropSource] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void api.profile().then((profile) => {
      setFullName(profile.fullName);
      setPhone(profile.phoneNumber || profile.email || "");
      setAvatarUrl(profile.avatarUrl || "");
    }).catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load profile.")).finally(() => setLoading(false));
  }, []);

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Choose an image file.");
      return;
    }
    if (file.size > 1_000_000) {
      setMessage("Choose an image under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(typeof reader.result === "string" ? reader.result : "");
      setCropOpen(true);
      setMessage("");
    };
    reader.readAsDataURL(file);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = fullName.trim();
    if (name.length < 2) {
      setMessage("Enter your full name.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await api.updateProfile({ fullName: name, avatarUrl: avatarUrl || undefined });
      auth.saveAvatar(avatarUrl);
      router.replace("/profile");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#edf4ef] p-2.5 max-[700px]:p-0">
      <div className="mx-auto flex h-[calc(100dvh-20px)] w-full flex-col overflow-hidden rounded-[22px] border border-[#d6e4da] bg-white shadow-[0_12px_30px_rgba(22,76,48,.1)] min-[701px]:w-[min(100%,1120px)] max-[700px]:h-dvh max-[700px]:rounded-none max-[700px]:border-0 max-[700px]:shadow-none">
        <MobilePageHeader title="Edit profile" backHref="/profile" action={<Icon name="back" size={25} />} />
        <main className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[104px] pt-[78px]">
          <form className="mx-auto flex w-full max-w-[520px] flex-col gap-4" onSubmit={saveProfile}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="grid size-[104px] place-items-center overflow-hidden rounded-full border-2 border-[#08714f] bg-[#d9f4e3] text-[#08714f]">
                  {avatarUrl ? <img className="size-full object-cover" src={avatarUrl} alt="Profile preview" /> : <Icon name="profile" size={50} strokeWidth={1.7} />}
                </div>
                <label className="absolute bottom-0 right-0 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-white bg-[#08714f] text-white shadow-[0_2px_6px_#143b2440]" aria-label="Change profile photo">
                  <Icon name="camera" size={18} />
                  <input className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)] [clip-path:inset(50%)]" accept="image/*" onChange={choosePhoto} type="file" />
                </label>
              </div>
              <span className="mt-2 text-[12px] text-[#65716b]">Change profile photo</span>
            </div>
            <div>
              <h2 className="m-0 text-xl font-bold text-[#18251f]">Edit your profile</h2>
              <p className="m-0 mt-1 text-sm text-[#59645f]">Update the details shown on your account.</p>
            </div>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]" htmlFor="edit-full-name">
              <span>Full name <span className="text-[#c0393b]">*</span></span>
              <input autoFocus autoComplete="name" className="h-12 w-full rounded-[9px] border-[1.5px] border-[#c7d0cb] bg-white px-3 text-[16px] text-[#17231d] outline-none focus:border-[#08714f] focus:shadow-[0_0_0_3px_rgba(8,113,79,.12)]" id="edit-full-name" maxLength={80} onChange={(event) => { setFullName(event.target.value); setMessage(""); }} placeholder="Enter your full name" required value={fullName} />
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]" htmlFor="edit-phone">
              Mobile number
              <input className="h-12 w-full rounded-[9px] border border-[#d7e0da] bg-[#f5f8f6] px-3 text-[16px] text-[#59645f] outline-none" id="edit-phone" readOnly value={loading ? "Loading..." : phone} />
            </label>
            {message && <p className="m-0 text-[13px] text-[var(--red-700)]" role="alert">{message}</p>}
            <button className="min-h-[47px] rounded-[10px] border-0 bg-[linear-gradient(110deg,#0b8159,#08734f)] px-4 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>
          </form>
        </main>
      </div>
      <ImageCropModal open={cropOpen} imageSrc={cropSource} onCancel={() => setCropOpen(false)} onSave={(croppedImage) => { setAvatarUrl(croppedImage); setCropOpen(false); }} />
      <Footer active="Profile" />
    </div>
  );
}
