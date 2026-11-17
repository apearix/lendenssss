import Link from "next/link";
import Icon from "./Icon";
import { useLanguage } from "./LanguageProvider";

const navigation = [
 { label: "Home", href: "/dashboard", icon: "home" as const },
 { label: "People", href: "/people", icon: "people" as const },
 { label: "Activity", href: "/activity", icon: "activity" as const },
 { label: "Profile", href: "/profile", icon: "profile" as const },
];

type FooterProps = {
 active?: (typeof navigation)[number]["label"];
};

export default function Footer({ active = "Home" }: FooterProps) {
	const { t } = useLanguage();
	return (
		<nav className="fixed bottom-0 left-1/2 z-[4] flex w-[min(calc(100%-40px),1120px)] -translate-x-1/2 items-center justify-around border-t border-[#dce5de] bg-white/[.93] px-[15px] py-[13px] pb-[15px] shadow-[0_-8px_24px_#164c3010] backdrop-blur-[12px] max-[700px]:left-0 max-[700px]:w-full max-[700px]:translate-x-0 max-[700px]:px-2 max-[700px]:pb-[calc(10px+env(safe-area-inset-bottom))] max-[700px]:pt-2.5" aria-label="Main navigation">
			{navigation.map((item) => (
	<Link
	 className={`flex min-w-[72px] flex-col items-center gap-1 text-[11px] text-[#748078] transition-colors hover:text-[var(--green-700)] max-[700px]:min-w-[58px] ${item.label === active ? "font-bold text-[var(--green-700)]" : ""}`}
					href={item.href}
					key={item.label}
	 aria-current={item.label === active ? "page" : undefined}
				>
					<Icon name={item.icon} size={22} />
					<span>{t(item.label)}</span>
	</Link>
			))}
		</nav>
	);
}
