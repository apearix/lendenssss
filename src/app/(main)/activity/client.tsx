"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Footer from "../../../components/common/Footer";
import Icon from "../../../components/common/Icon";
import { useLedger } from "../../../hooks/useLedger";
import { formatDate, type EntryKind } from "../../../lib/ledger";
import { formatRupees } from "../../../lib/people";
import MobilePageHeader from "../../../components/common/MobilePageHeader";
import { useLanguage } from "../../../components/common/LanguageProvider";

const filters = ["All", "Given", "Received"] as const;
type Filter = (typeof filters)[number];
const initialMonth = new Date().toISOString().slice(0, 7);

export default function ActivityPage() {
  const { entries } = useLedger();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState(initialMonth);
  const [currentMonth] = useState(initialMonth);
  const months = useMemo(() => [...new Set([currentMonth, ...entries.map((entry) => entry.date.slice(0, 7))])].sort().reverse(), [currentMonth, entries]);
  const visibleEntries = useMemo(() => entries.filter((entry) => {
    const matchesText = `${entry.personName} ${entry.note}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesKind = filter === "All" || (filter === "Given" ? entry.kind === "given" : entry.kind !== "given");
    return matchesText && matchesKind && entry.date.slice(0, 7) <= month;
  }), [entries, filter, month, query]);

  const grouped = visibleEntries.reduce<Record<string, typeof visibleEntries>>((groups, entry) => {
    (groups[entry.date] ??= []).push(entry);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:bg-[radial-gradient(#cbded2_0.8px,transparent_0.8px)] min-[701px]:[background-size:19px_19px] min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da] min-[701px]:shadow-[0_16px_48px_#164c3020]">
        <MobilePageHeader title="Activity" />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-[15px] pb-[104px] pt-[62px] max-[700px]:px-3 max-[700px]:pb-[70px]">
          <div className="sticky top-[6px] z-[3] bg-white pb-3 pt-px">
            <label className="flex min-h-[42px] items-center gap-[9px] rounded-[10px] border border-[#d6e0d9] bg-[#fbfdfb] px-[11px] text-[#617168] shadow-[0_1px_3px_#153d2410] focus-within:border-[#57b987] focus-within:shadow-[0_0_0_3px_#dff3e6]">
              <Icon name="search" size={19} />
              <input className="h-[38px] w-full min-w-0 border-0 bg-transparent p-0 text-[13px] text-[var(--foreground)] outline-none placeholder:text-[#66756d]" aria-label="Search activity" placeholder="Search people or notes" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <div className="mt-[15px] grid grid-cols-3 gap-[3px] rounded-[10px] border border-[#dce5de] bg-[#f0f4f1] p-[3px]" role="group" aria-label="Filter activity">
              {filters.map((option) => <button aria-pressed={filter === option} className={`min-h-9 min-w-0 rounded-lg border-0 px-[5px] text-xs font-semibold transition ${filter === option ? "bg-[var(--green-900)] text-white shadow-[0_2px_6px_#064a3730]" : "bg-transparent text-[#526158]"}`} key={option} onClick={() => setFilter(option)} type="button">{t(option)}</button>)}
            </div>
            <label className="mt-2 flex min-h-10 items-center gap-2 rounded-[10px] border border-[#dce5de] bg-white px-3 text-[#53635a]"><Icon name="calendar" size={19} /><select className="min-w-0 flex-1 appearance-none bg-transparent text-[12px] outline-none" aria-label="Show activity through month" value={month} onChange={(event) => setMonth(event.target.value)}>{months.map((value) => <option key={value} value={value}>{new Date(`${value}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</option>)}</select><Icon name="chevron" size={17} /></label>
          </div>
          <section className="space-y-0" aria-label="Transaction history">
            {Object.entries(grouped).sort(([first], [second]) => second.localeCompare(first)).map(([date, group]) => (
              <div key={date}>
                <h2 className="my-0 mb-2 rounded-md bg-[#eef5f0] px-2 py-1 text-[10px] font-bold text-[#53635a]">{formatDate(date)}</h2>
                {group.map((entry) => <ActivityRow key={entry.id} entry={entry} />)}
              </div>
            ))}
            {!visibleEntries.length && (entries.length === 0 ? (
              <div className="grid min-h-[255px] place-content-center justify-items-center gap-3 px-5 text-center">
                <span className="grid size-[76px] place-items-center rounded-full border border-[#ccebd8] bg-[#e5f8eb] text-[#087354] shadow-[0_8px_20px_#08735418]"><Icon name="activity" size={40} strokeWidth={1.7} /></span>
                <div><h2 className="m-0 text-[17px] font-extrabold text-[#20342a]">{t("No activity yet")}</h2><p className="m-0 mt-1 max-w-[270px] text-[13px] leading-[1.45] text-[#718078]">{t("Your money entries and repayments will appear here.")}</p></div>
              </div>
            ) : <p className="py-8 text-center text-sm text-[var(--muted)]">{t("No matching activity found.")}</p>)}
          </section>
        </main>
      </div>
      <Footer active="Activity" />
    </div>
  );
}

function ActivityRow({ entry }: { entry: { id: string; personId: string; personName: string; kind: EntryKind; amount: number; note: string } }) {
  const isPositive = entry.kind === "repayment";
  const label = entry.kind === "given" ? "Money given" : entry.kind === "repayment" ? "Repayment received" : "Money taken";
  return (
    <Link className="flex min-h-[63px] items-center gap-3 border-b border-[var(--line)]" href={`/people/${entry.personId}`}>
      <span className={`grid size-9 flex-none place-items-center rounded-full ${isPositive ? "bg-[#e1f7e9] text-[#08714f]" : "bg-[#fff0f0] text-[#d54a4d]"}`}><Icon name={isPositive ? "downRight" : "upRight"} size={19} /></span>
      <span className="min-w-0 flex-1"><strong className="block truncate text-[13px] font-bold">{entry.personName}</strong><span className="block truncate text-[10px] text-[var(--muted)]">{label}{entry.note ? ` · ${entry.note}` : ""}</span></span>
      <strong className={`text-sm font-extrabold tabular-nums ${isPositive ? "text-[var(--green-900)]" : "text-[var(--red-700)]"}`}>{isPositive ? "+" : "−"}{formatRupees(entry.amount)}</strong>
    </Link>
  );
}
