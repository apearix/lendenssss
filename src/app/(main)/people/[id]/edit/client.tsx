"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../../../components/common/Footer";
import Icon from "../../../../../components/common/Icon";
import MobilePageHeader from "../../../../../components/common/MobilePageHeader";
import { api } from "../../../../../lib/api";

export default function EditPersonClient({ personId }: { personId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void api.person(personId).then((person) => {
      setName(person.fullName);
      setNote(person.note || "");
      const match = ["+91", "+1", "+44", "+61"].find((code) => person.phoneNumber.startsWith(code)) || "+91";
      setCountryCode(match);
      setPhone(person.phoneNumber.slice(match.length).replace(/\D/g, "").slice(0, 10));
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load person.")).finally(() => setLoading(false));
  }, [personId]);

  async function savePerson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanName) return setError("Enter the person's full name.");
    if (cleanPhone.length !== 10) return setError("Enter a valid 10-digit mobile number.");
    setSaving(true);
    try { await api.updatePerson(personId, { fullName: cleanName, phoneNumber: `${countryCode}${cleanPhone}`, note: note.trim() || undefined }); router.replace(`/people/${personId}`); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update person."); } finally { setSaving(false); }
  }

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da]">
        <MobilePageHeader title="Edit person" backHref={`/people/${personId}`} action={<Icon name="back" size={25} />} />
        <main className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[104px] pt-[72px]"><form className="flex min-h-full flex-col gap-[14px]" onSubmit={savePerson}>
          {loading ? <p className="py-8 text-center text-sm text-[var(--muted)]">Loading person...</p> : <>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]"><span>Full name <span className="text-[#c0393b]">*</span></span><input className="h-[43px] w-full rounded-[9px] border border-[#d7e0da] bg-white px-3 text-sm outline-none focus:border-[#57b987]" autoFocus maxLength={70} onChange={(event) => setName(event.target.value)} required value={name} /></label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]"><span>Mobile number <span className="text-[#c0393b]">*</span></span><span className="flex min-h-12 items-center overflow-hidden rounded-[10px] border border-[#d7e0da] bg-white focus-within:border-[#57b987]"><select className="h-[30px] w-[82px] border-0 border-r border-[#d6ddd9] bg-white px-[9px] pl-3 text-[17px] font-semibold outline-none" aria-label="Country calling code" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}><option value="+91">+91</option><option value="+1">+1</option><option value="+44">+44</option><option value="+61">+61</option></select><input className="h-[46px] min-w-0 w-full border-0 bg-transparent px-3 text-[17px] outline-none" inputMode="numeric" maxLength={10} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} required type="tel" value={phone} /></span></label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">Optional note<textarea className="min-h-[82px] w-full resize-y rounded-[9px] border border-[#d7e0da] px-3 py-2.5 text-sm outline-none focus:border-[#57b987]" maxLength={100} onChange={(event) => setNote(event.target.value)} value={note} /><span className="justify-self-end text-[11px] text-[var(--muted)]">{note.length}/100</span></label>
          </>}
          {error && <p className="m-0 text-xs text-[var(--red-700)]" role="alert">{error}</p>}
          {!loading && <button className="mt-auto min-h-[47px] rounded-[10px] bg-[linear-gradient(110deg,#0b8159,#08734f)] px-4 text-sm font-bold text-white disabled:opacity-60" disabled={saving} type="submit">{saving ? "Saving..." : "Save changes"}</button>}
        </form></main>
      </div>
      <Footer active="People" />
    </div>
  );
}
