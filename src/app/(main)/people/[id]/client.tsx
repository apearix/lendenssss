"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "../../../../components/common/Footer";
import Icon from "../../../../components/common/Icon";
import { formatRupees } from "../../../../lib/people";
import { usePeople } from "../../../../hooks/usePeople";
import { formatDate } from "../../../../lib/ledger";
import { useLedger } from "../../../../hooks/useLedger";
import MobilePageHeader from "../../../../components/common/MobilePageHeader";
import { api } from "../../../../lib/api";
import ConfirmModal from "../../../../components/common/ConfirmModal";

export default function PersonDetailsClient({ personId }: { personId: string }) {
  const router = useRouter();
  const { people, ready } = usePeople();
  const { entries } = useLedger();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const person = people.find((entry) => entry.id === personId);
  const personEntries = entries.filter((entry) => entry.personId === personId).sort((first, second) => second.date.localeCompare(first.date));

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da]">
        <MobilePageHeader title="Person details" backHref="/people" action={<Icon name="back" size={25} />} rightAction={<><button aria-expanded={menuOpen} aria-label="Person actions" className="grid size-10 place-items-center rounded-[10px] text-white hover:bg-white/10" onClick={() => setMenuOpen((open) => !open)} type="button"><Icon name="more" size={22} /></button>{menuOpen && <div className="absolute right-0 top-11 z-[10] min-w-[130px] rounded-[10px] border border-[#d6e4da] bg-white p-1.5 text-left shadow-[0_8px_24px_#164c3020]"><Link aria-label="Edit" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#293a30] hover:bg-[#eef7f1]" href={`/people/${personId}/edit`} onClick={() => setMenuOpen(false)}><Icon name="edit" size={17} />Edit</Link><button aria-label="Delete" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#c0393b] hover:bg-[#fff3f3]" disabled={deleting} onClick={() => { setMenuOpen(false); setDeleteModalOpen(true); }} type="button"><Icon name="trash" size={17} />Delete</button></div>}</>} />
        <main className="min-h-0 flex-1 overflow-y-auto px-5 pb-[104px] pt-[85px] text-center">
          {!ready ? (
            <p className="py-8 text-sm text-[var(--muted)]">Loading person...</p>
          ) : !person ? (
            <div className="grid place-items-center gap-2 py-8 text-sm text-[var(--muted)]">
              <h2 className="m-0 text-lg text-[var(--foreground)]">Person not found</h2>
              <p className="m-0">This person may have been removed from your list.</p>
              <Link className="font-bold text-[var(--green-700)]" href="/people">Back to people</Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <div
                  aria-label={`${person.name} profile photo`}
                  className={`grid size-[98px] place-items-center rounded-full border border-[#c8e8d5] bg-[#d9f0e3] bg-cover bg-center text-[30px] font-semibold text-[#075d43] ${person.avatar ? "text-transparent" : ""}`}
                >
                  {person.avatar ? <img className="size-full object-cover" src={person.avatar} alt="Profile" /> : person.initials}
                </div>
                <h2 className="mb-0 mt-3 text-xl font-bold">{person.name}</h2>
                <p className="my-1 flex items-center gap-1 text-sm text-[var(--muted)]"><Icon name="phone" size={16} />{person.phone || "No phone number"}</p>
                {person.note && <span className="text-xs text-[var(--muted)]">{person.note}</span>}
              </div>
              <section className="mt-5 grid gap-1 rounded-[14px] bg-[#e8f7ed] px-4 py-3" aria-label="Outstanding balance">
                <span className="text-xs text-[var(--muted)]">{person.direction === "receive" ? "They owe you" : "You owe"}</span>
                <strong className={`text-2xl font-extrabold tabular-nums text-[var(--green-900)] ${person.direction === "pay" ? "text-[var(--red-700)]" : ""}`}>
                  {formatRupees(person.amount)}
                </strong>
                <small className="text-[11px] text-[var(--muted)]">Current balance</small>
              </section>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link className="flex min-h-[44px] items-center justify-center gap-1 rounded-[10px] bg-[#e1f7e9] text-xs font-bold text-[#075d43]" href={`/entry?type=given&personId=${person.id}`}><Icon name="down" size={18} /> Give money</Link>
                <Link className="flex min-h-[44px] items-center justify-center gap-1 rounded-[10px] bg-[#e1f7e9] text-xs font-bold text-[#075d43]" href={`/entry?type=repayment&personId=${person.id}`}><Icon name="check" size={18} /> Record repayment</Link>
              </div>
              <section className="mt-6 text-left">
                <div className="mb-2 flex items-center justify-between border-b border-[var(--line)] pb-2">
                  <h2 className="m-0 text-base font-bold">Activity</h2>
                  <Icon name="clock" size={18} />
                </div>
                {personEntries.length ? personEntries.map((entry) => (
                  <div className="flex items-center gap-3 border-b border-[var(--line)] py-3" key={entry.id}>
                    <span className={`size-2.5 rounded-full ${entry.kind === "repayment" ? "bg-[#13a369]" : "bg-[#d54a4d]"}`} />
                    <div><strong className="block text-sm">{entry.kind === "given" ? "Money given" : entry.kind === "repayment" ? "Repayment received" : "Money taken"}</strong>
                      <span className="block text-[11px] text-[var(--muted)]">{formatDate(entry.date)} · {formatRupees(entry.amount)}{entry.note ? ` · ${entry.note}` : ""}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-[var(--muted)]">No outstanding transactions.</p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
      <ConfirmModal open={deleteModalOpen} title="Delete this person?" message={`This will also remove ${person?.name || "this person's"} transactions. This action cannot be undone.`} loading={deleting} onCancel={() => setDeleteModalOpen(false)} onConfirm={async () => { if (!person) return; setDeleting(true); try { await api.deletePerson(person.id); router.replace("/people"); } catch { setDeleting(false); } }} />
      <Footer active="People" />
    </div>
  );
}
