"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../../components/common/Footer";
import Icon from "../../../components/common/Icon";
import { usePeople } from "../../../hooks/usePeople";
import { type EntryKind } from "../../../lib/ledger";
import MobilePageHeader from "../../../components/common/MobilePageHeader";
import { api } from "../../../lib/api";
import { useLanguage } from "../../../components/common/LanguageProvider";

export default function AddEntryPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { people } = usePeople();
  const [kind, setKind] = useState<EntryKind>(() => {
    if (typeof window === "undefined") return "given";
    const type = new URLSearchParams(window.location.search).get("type");
    return type === "received" || type === "repayment" ? type : "given";
  });
  const [personId, setPersonId] = useState(() => typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("personId") ?? "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);
  const selectedPerson = useMemo(() => people.find((person) => person.id === personId), [people, personId]);

  useEffect(() => {
    // The current date must be read in the browser so static prerendering stays deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date().toISOString().slice(0, 10));
  }, []);


  async function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingRef.current) return;
    const parsedAmount = Number(amount);
    if (!selectedPerson || !Number.isFinite(parsedAmount) || parsedAmount <= 0) return;

    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await api.addEntry({ contactId: selectedPerson.id, type: kind === "given" ? "I_GAVE" : "I_TOOK", amount: parsedAmount, date, note: note.trim() || undefined, dueDate: dueDate || undefined });
      router.push(`/people/${selectedPerson.id}`);
    } catch (cause) {
      savingRef.current = false;
      setSaving(false);
      setError(cause instanceof Error ? cause.message : "Unable to save entry.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da]">
        <MobilePageHeader title="Add entry" backHref="/" action={<Icon name="back" size={25} />} />
        <main className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[104px] pt-[72px]">
          <form className="flex min-h-full flex-col gap-[14px]" onSubmit={saveEntry}>
            <div className="grid grid-cols-3 gap-[3px] rounded-[10px] border border-[#dce5de] bg-[#f0f4f1] p-[3px]" role="group" aria-label="Entry direction">
              <button aria-pressed={kind === "given"} className={`flex min-h-9 items-center justify-center gap-1 rounded-lg border-0 text-[11px] font-semibold ${kind === "given" ? "bg-[var(--green-900)] text-white" : "bg-transparent text-[#526158]"}`} onClick={() => setKind("given")} type="button">
                <Icon name="up" size={16} /> {t("I gave")}
              </button>
              <button aria-pressed={kind === "received"} className={`flex min-h-9 items-center justify-center gap-1 rounded-lg border-0 text-[11px] font-semibold ${kind === "received" ? "bg-[var(--red-700)] text-white" : "bg-transparent text-[#526158]"}`} onClick={() => setKind("received")} type="button">
                <Icon name="down" size={16} /> {t("To pay")}
              </button>
              <button aria-pressed={kind === "repayment"} className={`flex min-h-9 items-center justify-center gap-1 rounded-lg border-0 text-[11px] font-semibold ${kind === "repayment" ? "bg-[var(--green-900)] text-white" : "bg-transparent text-[#526158]"}`} onClick={() => setKind("repayment")} type="button">
                <Icon name="check" size={16} /> {t("Repaid me")}
              </button>
            </div>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              <span>{t("Person")} <span className="text-[#c0393b]">*</span></span>
              <select className="h-[43px] w-full rounded-[9px] border border-[#d7e0da] bg-white px-3 text-sm outline-none focus:border-[#57b987] focus:shadow-[0_0_0_3px_#dff3e6]" required value={personId} onChange={(event) => setPersonId(event.target.value)}>
                <option value="">Select a person</option>
                {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              <span>{t("Amount")} <span className="text-[#c0393b]">*</span></span>
              <span className="flex h-[43px] items-center overflow-hidden rounded-[9px] border border-[#d7e0da] px-3 text-[#08714f]"><span>₹</span><input className="min-w-0 flex-1 border-0 bg-transparent px-2 text-sm text-[var(--foreground)] outline-none" min="1" required step="1" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0" /></span>
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              <span>{t("Date")} <span className="text-[#c0393b]">*</span></span>
              <span className="flex h-[43px] items-center gap-2 rounded-[9px] border border-[#d7e0da] px-3"><Icon name="calendar" size={17} /><input className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></span>
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              {t("Note")}
              <textarea className="min-h-[82px] w-full resize-y rounded-[9px] border border-[#d7e0da] px-3 py-2.5 text-sm outline-none focus:border-[#57b987] focus:shadow-[0_0_0_3px_#dff3e6]" maxLength={100} onChange={(event) => setNote(event.target.value)} placeholder="For groceries" value={note} />
              <span className="justify-self-end text-[11px] text-[var(--muted)]">{note.length}/100</span>
            </label>
            <label className="grid gap-1.5 text-[13px] font-semibold text-[#293a30]">
              {t("Due date")} <span className="optional-label">({t("optional")})</span>
              <span className="flex h-[43px] items-center gap-2 rounded-[9px] border border-[#d7e0da] px-3"><Icon name="calendar" size={17} /><input className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></span>
            </label>
            {error && <p className="m-0 text-xs text-[var(--red-700)]" role="alert">{error}</p>}
            <button aria-busy={saving} className="mt-auto flex min-h-[47px] items-center justify-center gap-2 rounded-[10px] border-0 bg-[linear-gradient(110deg,#0b8159,#08734f)] px-4 text-sm font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-80" disabled={saving} type="submit">
              {saving && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {saving ? "Saving..." : t("Save entry")}
            </button>
            <p className="m-0 flex items-center justify-center gap-1 text-xs text-[var(--muted)]"><Icon name="info" size={14} /> Record only · No money transfer</p>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
