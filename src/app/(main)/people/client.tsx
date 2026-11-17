"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "../../../components/common/Footer";
import Icon from "../../../components/common/Icon";
import { formatRupees } from "../../../lib/people";
import { usePeople } from "../../../hooks/usePeople";
import MobilePageHeader from "../../../components/common/MobilePageHeader";
import { useLanguage } from "../../../components/common/LanguageProvider";

type Filter = "all" | "receive" | "pay";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "To receive", value: "receive" },
  { label: "To pay", value: "pay" },
];

function openNewPersonForm() {
  window.dispatchEvent(new Event("lenden:new-person"));
}

export default function PeoplePage() {
  const { people } = usePeople();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePeople = people.filter((person) => {
    const matchesQuery = `${person.name} ${person.phone}`.toLowerCase().includes(normalizedQuery);
    return matchesQuery && (filter === "all" || person.direction === filter);
  });

  return (
    <div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:bg-[radial-gradient(#cbded2_0.8px,transparent_0.8px)] min-[701px]:[background-size:19px_19px] min-[701px]:px-5 min-[701px]:py-0">
      <div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da] min-[701px]:shadow-[0_16px_48px_#164c3020]">
        <MobilePageHeader title="People" action={<Link className="grid size-10 place-items-center rounded-[10px] text-white transition hover:bg-white/10" href="/people/add" onClick={openNewPersonForm} aria-label="Add person"><Icon name="plus" size={27} /></Link>} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-[15px] pb-[104px] pt-[62px] max-[700px]:px-3 max-[700px]:pb-[70px]">
          <div className="sticky top-[6px] z-[4] bg-white pb-3 pt-px">
            <label className="flex min-h-[42px] items-center gap-[9px] rounded-[10px] border border-[#d6e0d9] bg-[#fbfdfb] px-[11px] text-[#617168] shadow-[0_1px_3px_#153d2410] focus-within:border-[#57b987] focus-within:shadow-[0_0_0_3px_#dff3e6]">
              <Icon name="search" size={20} />
              <input className="h-[38px] w-full min-w-0 border-0 bg-transparent p-0 text-[13px] text-[var(--foreground)] outline-none placeholder:text-[#66756d]"
                aria-label="Search people by name or number"
                placeholder="Search people by name or number"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="mt-[15px] grid grid-cols-3 gap-[3px] rounded-[10px] border border-[#dce5de] bg-[#f0f4f1] p-[3px]" aria-label="Filter people" role="group">
              {filters.map((option) => (
                <button
                  aria-pressed={filter === option.value}
                  className={`min-h-9 min-w-0 rounded-lg border-0 px-[5px] text-xs font-semibold transition ${filter === option.value ? "bg-[var(--green-900)] text-white shadow-[0_2px_6px_#064a3730]" : "bg-transparent text-[#526158]"}`}
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  type="button"
                >
                  {t(option.label)}
                </button>
              ))}
            </div>
          </div>
          <section className="mt-3" aria-label="People list">
            {visiblePeople.length ? visiblePeople.map((person) => (
              <Link className="flex min-h-[59px] items-center gap-3 border-b border-[var(--line)]" href={`/people/${person.id}`} key={person.id}>
                <span className={`grid size-[39px] flex-none place-items-center overflow-hidden rounded-full text-xs font-bold ${person.direction === "pay" ? "border border-[#f0c9c9] bg-[#fff0f0] text-[var(--red-700)]" : "border border-[#cde8d6] bg-[#e1f3e7] text-[#0d694c]"}`}>{person.avatar ? <img className="size-full object-cover" src={person.avatar} alt="" /> : person.initials}</span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{person.name}</span>
                <span className="text-right">
                  <strong className={`block text-sm font-extrabold tabular-nums text-[var(--green-900)] ${person.direction === "pay" ? "text-[var(--red-700)]" : ""}`}>
                    {formatRupees(person.amount)}
                  </strong>
                  <span className={`mt-px block text-[10px] ${person.direction === "pay" ? "text-[var(--red-700)]" : "text-[var(--green-700)]"}`}>{person.direction === "receive" ? "To receive" : "To pay"}</span>
                </span>
                <Icon name="chevron" size={18} className="text-[#4a5b51]" />
              </Link>
            )) : people.length === 0 ? (
              <div className="grid min-h-[255px] place-content-center justify-items-center gap-3 px-5 text-center">
                <span className="grid size-[76px] place-items-center rounded-full border border-[#ccebd8] bg-[#e5f8eb] text-[#087354] shadow-[0_8px_20px_#08735418]">
                  <Icon name="people" size={40} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className="m-0 text-[17px] font-extrabold text-[#20342a]">{t("No people yet")}</h2>
                  <p className="m-0 mt-1 max-w-[260px] text-[13px] leading-[1.45] text-[#718078]">{t("Add someone to start tracking money you give or receive.")}</p>
                </div>
              </div>
            ) : (
              <div className="grid min-h-[150px] place-content-center justify-items-center gap-2.5 text-[13px] text-[var(--muted)]">
                <span>{t("No people match this search.")}</span>
                <button className="border-0 bg-transparent px-2.5 py-[7px] font-bold text-[var(--green-700)]" type="button" onClick={() => { setQuery(""); setFilter("all"); }}>
                  {t("Clear filters")}
                </button>
              </div>
            )}
          </section>
          <Link className="mt-auto flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-[#e1f7e9] px-3 py-2 text-sm font-bold text-[#075d43] transition hover:bg-[#d3f0de]" href="/people/add" onClick={openNewPersonForm}>
            <Icon name="plus" size={22} />
            {t("Add person")}
          </Link>
        </main>
      </div>
      <Footer active="People" />
    </div>
  );
}
