"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../../components/common/Footer";
import Icon from "../../../../components/common/Icon";
import ImageCropModal from "../../../../components/common/ImageCropModal";
import MobilePageHeader from "../../../../components/common/MobilePageHeader";
import { api } from "../../../../lib/api";

export default function NewPersonPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cropSource, setCropSource] = useState("");
  const [cropOpen, setCropOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fieldsReady, setFieldsReady] = useState(false);
  const savingRef = useRef(false);

  function resetForm() {
    setName("");
    setCountryCode("+91");
    setPhone("");
    setNote("");
    setAvatar("");
    setCropSource("");
    setCropOpen(false);
    setError("");
    setSaving(false);
    setFieldsReady(false);
    savingRef.current = false;
  }

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      // Mobile browsers can restore the previous form and React state from
      // the back-forward cache when returning to this route.
      if (event.persisted) resetForm();
    }

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("lenden:new-person", resetForm);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("lenden:new-person", resetForm);
    };
  }, []);

  function choosePhoto(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 1_000_000) {
      setError("Choose an image under 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(typeof reader.result === "string" ? reader.result : "");
      setCropOpen(true);
      setError("");
    };
    reader.readAsDataURL(file);
  }

  async function savePerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanName) {
      setError("Enter the person's full name.");
      return;
    }
    if (cleanPhone.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError("");

    try {
      const person = await api.createPerson({ fullName: cleanName, phoneNumber: `${countryCode}${cleanPhone}`, avatarUrl: avatar || undefined, note: note.trim() || undefined });
      // Clear the form before navigating so a cached route can never restore
      // the submitted person or its loading state.
      resetForm();
      router.push(`/people/${person.id}`);
    } catch (error) {
      savingRef.current = false;
      setSaving(false);
      setError(error instanceof Error ? error.message : "Unable to save person.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da]">
        <MobilePageHeader title="Add person" backHref="/people" action={<Icon name="back" size={25} />} />
        <main className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[104px] pt-[72px]"><form autoComplete="new-password" className="flex min-h-full flex-col gap-[14px]" onSubmit={savePerson}>
            <div className="relative mx-auto my-2 grid size-[116px] flex-none place-items-center">
              <div
                aria-label={name ? `${name} profile photo` : "Profile photo"}
                className={`grid size-[98px] place-items-center overflow-hidden rounded-full border-2 border-[#08714f] bg-[#d9f0e3] bg-cover bg-center text-[30px] font-semibold text-[#075d43] ${avatar ? "text-transparent" : ""}`}
              >
                {avatar ? <img className="size-full object-cover" src={avatar} alt="Profile preview" /> : <Icon name="profile" size={48} strokeWidth={1.7} />}
              </div>
              <label className="absolute bottom-1 right-0 grid size-[38px] cursor-pointer place-items-center rounded-full border-2 border-white bg-[#e4f6eb] text-[#075d43] shadow-[0_2px_6px_#143b241f]" aria-label="Choose profile photo">
                <Icon name="camera" size={19} />
                <input className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)] [clip-path:inset(50%)]" accept="image/*" onChange={(event) => choosePhoto(event.target.files?.[0])} type="file" />
              </label>
            </div>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              <span>Full name <span className="text-[#c0393b]">*</span></span>
              <input className="h-[43px] w-full rounded-[9px] border border-[#d7e0da] bg-white px-3 text-sm outline-none focus:border-[#57b987] focus:shadow-[0_0_0_3px_#dff3e6]"
                autoComplete="new-password"
                maxLength={70}
                name="new-person-name"
                onChange={(event) => setName(event.target.value)}
                onFocus={() => setFieldsReady(true)}
                placeholder="Enter full name"
                required
                readOnly={!fieldsReady}
                value={name}
              />
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              <span>Mobile number <span className="text-[#c0393b]">*</span></span>
              <span className="flex min-h-12 items-center overflow-hidden rounded-[10px] border border-[#d7e0da] bg-white focus-within:border-[#57b987] focus-within:shadow-[0_0_0_3px_#dff3e6]">
                <select className="h-[30px] w-[82px] border-0 border-r border-[#d6ddd9] bg-white px-[9px] pl-3 text-[17px] font-semibold text-[#1e2823] outline-none" aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                </select>
                <input className="h-[46px] min-w-0 w-full border-0 bg-transparent px-3 text-[17px] text-[#17231d] outline-none placeholder:text-[#7d8581]"
                  autoComplete="new-password"
                  inputMode="numeric"
                  maxLength={10}
                  name="new-person-phone"
                  onChange={(event) => { setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }}
                  onFocus={() => setFieldsReady(true)}
                  placeholder="Enter your mobile number"
                  required
                  readOnly={!fieldsReady}
                  type="tel"
                  value={phone}
                />
              </span>
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              Optional note
              <textarea className="min-h-[82px] w-full resize-y rounded-[9px] border border-[#d7e0da] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#57b987] focus:shadow-[0_0_0_3px_#dff3e6]"
                maxLength={100}
                onChange={(event) => setNote(event.target.value)}
                placeholder="e.g. Friend, Colleague, Shop etc."
                value={note}
              />
              <span className="justify-self-end text-[11px] text-[var(--muted)]">{note.length}/100</span>
            </label>
            {error && <p className="m-0 text-xs text-[var(--red-700)]" role="alert">{error}</p>}
            <button
              aria-busy={saving}
              className="mt-auto flex min-h-[47px] items-center justify-center gap-2 rounded-[10px] border-0 bg-[linear-gradient(110deg,#0b8159,#08734f)] px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-80"
              disabled={saving}
              type="submit"
            >
              {saving && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {saving ? "Saving..." : "Save person"}
            </button>
          </form>
        </main>
      </div>
      <ImageCropModal open={cropOpen} imageSrc={cropSource} onCancel={() => setCropOpen(false)} onSave={(croppedImage) => { setAvatar(croppedImage); setCropOpen(false); }} />
      <Footer active="People" />
    </div>
  );
}
