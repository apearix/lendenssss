"use client";

import Link from "next/link";
import Footer from "../../components/common/Footer";
import Icon from "../../components/common/Icon";
import PageHeader from "../../components/common/PageHeader";
import { formatRupees } from "../../lib/people";
import { usePeople } from "../../hooks/usePeople";
import { useLanguage } from "../../components/common/LanguageProvider";

export default function Home() {
	const { people } = usePeople();
	const { t } = useLanguage();
	const toReceive = people.filter((person) => person.direction === "receive").reduce((total, person) => total + person.amount, 0);
	const toPay = people.filter((person) => person.direction === "pay").reduce((total, person) => total + person.amount, 0);
	const netBalance = toReceive - toPay;
	return (
		<div className="min-h-screen bg-[#f4f8f5] p-0 min-[701px]:bg-[radial-gradient(#cbded2_0.8px,transparent_0.8px)] min-[701px]:[background-size:19px_19px] min-[701px]:px-5 min-[701px]:!py-0">
			<div className="mx-auto flex h-dvh w-full min-h-0 flex-col overflow-hidden bg-white min-[701px]:w-[min(100%,1120px)] min-[701px]:min-h-[760px] min-[701px]:rounded-[20px] min-[701px]:border min-[701px]:border-[#d6e4da] min-[701px]:shadow-[0_16px_48px_#164c3020]">
				<PageHeader />
				<main className="flex min-h-0 flex-1 flex-col overflow-visible px-[38px] pb-[100px] pt-[190px] max-[700px]:px-[17px] max-[700px]:pb-[calc(60px+env(safe-area-inset-bottom))] max-[700px]:pt-[205px]">
					<section className="relative z-[6] flex-none" aria-label="Balance summary">
						<div className="relative mt-[-52px] overflow-hidden rounded-[17px] border border-[#57c894] bg-[linear-gradient(115deg,#0b8159,#139264)] px-[23px] pt-[21px] text-white shadow-[0_8px_20px_#07563f21] max-[700px]:mt-[-77px] max-[700px]:rounded-[15px] max-[700px]:px-4 max-[700px]:pt-[17px]">
							<div className="flex items-center justify-between">
								<span className="text-[13px] font-medium text-[#dcf4e7]">{t("Net balance")}</span>
								<button className="grid size-[30px] place-items-center border-0 bg-transparent text-[#e5f7ed]" type="button" aria-label="About net balance" title="Money to receive minus money to pay">
									<Icon name="info" size={20} />
								</button>
							</div>
							<p className="mb-4 mt-[3px] text-[38px] font-extrabold leading-[1.1] tabular-nums max-[700px]:mb-[13px] max-[700px]:text-[35px]">{formatRupees(netBalance)}</p>
							<div className="-mx-[23px] flex border-t border-[#b5e3c9] bg-[#f3fbf5] px-[10px] py-3 text-center text-[var(--foreground)] max-[700px]:-mx-4 max-[700px]:px-[6px] max-[700px]:py-2.5">
								<div className="flex-1">
									<span className="mb-0.5 block text-[11px] text-[var(--muted)]">{t("You will receive")}</span>
									<strong className="block text-xl font-extrabold tabular-nums text-[var(--green-900)] max-[700px]:text-lg">{formatRupees(toReceive)}</strong>
								</div>
								<div className="flex-1 border-l border-[#d1e4d7]">
									<span className="mb-0.5 block text-[11px] text-[var(--muted)]">{t("You will pay")}</span>
									<strong className="block text-xl font-extrabold tabular-nums text-[var(--red-700)] max-[700px]:text-lg">{formatRupees(toPay)}</strong>
								</div>
							</div>
						</div>
						<div className="mb-[29px] mt-[15px] grid grid-cols-2 gap-3 max-[700px]:mb-[23px] max-[700px]:mt-[13px] max-[700px]:gap-[9px]">
							<Link className="flex min-h-[46px] items-center justify-center gap-[9px] rounded-[11px] bg-[#e1f7e9] text-[13px] font-bold text-[#075d43] transition hover:-translate-y-px hover:border-[#b2dfc2] hover:bg-[#d3f0de] max-[700px]:min-h-[42px] max-[700px]:gap-1.5 max-[700px]:rounded-[9px] max-[700px]:text-xs" href="/entry?type=given">
								<Icon name="down" size={19} />
										{t("Give money")}
							</Link>
							<Link className="flex min-h-[46px] items-center justify-center gap-[9px] rounded-[11px] bg-[#fff0f0] text-[13px] font-bold text-[var(--red-700)] transition hover:-translate-y-px hover:border-[#f0c9c9] hover:bg-[#ffe5e5] max-[700px]:min-h-[42px] max-[700px]:gap-1.5 max-[700px]:rounded-[9px] max-[700px]:text-xs" href="/entry?type=received">
								<Icon name="up" size={19} />
										{t("To pay")}
							</Link>
						</div>
					</section>

					<div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.45fr)_minmax(260px,.8fr)] items-start gap-9 overflow-y-auto overscroll-contain max-[700px]:grid-cols-1 max-[700px]:gap-5">
						<section id="people" aria-labelledby="people-title">
							<div className="mb-3 flex items-center justify-between">
									<h2 className="m-0 text-[17px] font-bold max-[700px]:text-base" id="people-title">{t("Your people")}</h2>
								<Link className="inline-flex items-center gap-px text-xs font-bold text-[var(--green-700)]" href="/people">
									{t("View all")} <Icon name="chevron" size={16} />
								</Link>
							</div>
							<div className="border-t border-[var(--line)]" id="activity">
								{people.slice(0, 3).map((person, index) => (
									<Link className="flex min-h-[63px] items-center gap-3 border-b border-[var(--line)] transition hover:bg-[#f8fcf9] max-[700px]:min-h-[57px] max-[700px]:gap-2.5" href={`/people/${person.id}`} key={`${person.id}-${index}`}>
										<span className="grid size-[39px] flex-none place-items-center rounded-full border border-[#cde8d6] bg-[#e1f3e7] text-xs font-bold text-[#0d694c] max-[700px]:size-[37px]">{person.initials}</span>
										<span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{person.name}</span>
										<span className="text-right">
											<strong className={`block text-sm font-extrabold tabular-nums text-[var(--green-900)] ${person.direction === "pay" ? "text-[var(--red-700)]" : ""}`}>
												{formatRupees(person.amount)}
											</strong>
											<span className="mt-px block text-[10px] text-[var(--muted)]">{person.direction === "receive" ? "To receive" : "To pay"}</span>
										</span>
										<Icon name="chevron" size={18} className="text-[#4a5b51]" />
									</Link>
								))}
							</div>
						</section>

						<aside className="pt-px max-[700px]:pb-px" aria-labelledby="reminder-title">
							<h2 className="mb-3 mt-0 text-[17px] font-bold max-[700px]:hidden" id="reminder-title">Coming up</h2>
							<a className="mb-4 flex min-h-[56px] items-center gap-[11px] rounded-xl border border-[#cbeed4] bg-[linear-gradient(110deg,#e6f8eb,#d9f5df)] px-3 py-[11px] text-[#173a29] transition hover:bg-[#d3f1dc]" href="/activity">
								<span className="text-[#176f4e]"><Icon name="bell" size={22} /></span>
								<span className="min-w-0 flex-1">
									<strong className="block text-xs font-bold">1 reminder due today</strong>
									<span className="mt-[3px] block text-[11px] text-[#52645a]">Priya Verma · {formatRupees(2500)}</span>
								</span>
								<Icon name="chevron" size={18} />
							</a>
						</aside>
					</div>
				</main>
			</div>
			<Footer active="Home" />

		</div>
	);
}
