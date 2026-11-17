"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";
import { makeInitials } from "../../lib/people";
import { useLanguage } from "./LanguageProvider";

export default function PageHeader() {
	const [fullName, setFullName] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const { t, language } = useLanguage();

	useEffect(() => {
		const cachedAvatar = localStorage.getItem("lenden_avatar_url") || "";
		void api.profile().then((profile) => {
			setFullName(profile.fullName.trim());
			setAvatarUrl(profile.avatarUrl || cachedAvatar);
		}).catch(() => { if (cachedAvatar) setAvatarUrl(cachedAvatar); });
	}, []);

	const firstName = fullName.split(/\s+/)[0] || "there";
	const initials = makeInitials(fullName) || "?";

	return (
		<header className="fixed left-1/2 !top-0 z-[5] h-[190px] w-[min(calc(100%-40px),1120px)] -translate-x-1/2 bg-[linear-gradient(118deg,#064a37_0%,#08734f_55%,#0a6047_100%)] px-[38px] pb-24 pt-[27px] text-white max-[700px]:left-0 max-[700px]:top-0 max-[700px]:h-[205px] max-[700px]:w-full max-[700px]:translate-x-0 max-[700px]:rounded-b-[14px] max-[700px]:px-5 max-[700px]:pb-[82px] max-[700px]:pt-[18px]" id="home">
			<div className="flex items-center justify-between">
				<Link className="flex items-center gap-[9px] text-[21px] font-bold" href="/" aria-label="Lenden home">
					<span className="grid size-[30px] place-items-center text-[#b7f4ce]"><img className="size-[30px] object-contain" src="/images/dashboard-logo.png" alt="" /></span>
					<span>Lenden</span>
				</Link>
				<Link className="grid size-[38px] place-items-center rounded-full border-2 border-white/30 bg-[#e8f7ed] text-[12px] font-bold text-[#07563f]" id="profile" href="/profile" aria-label="Your profile">
					{avatarUrl ? <img className="size-full rounded-full object-cover" src={avatarUrl} alt="Profile avatar" /> : <span aria-hidden="true">{initials}</span>}
				</Link>
			</div>
			<div className="mt-[21px] flex flex-col items-start gap-[5px]">
				<p className="m-0 text-[10px] font-bold tracking-[1px] text-[#b8dfca] max-[700px]:hidden">{t("Your money, in balance")}</p>
				<h1 className="m-0 text-[28px] font-semibold leading-[1.2]">{language === "हिन्दी" ? `नमस्ते, ${firstName}` : `Hi, ${firstName}`}</h1>
			</div>
		</header>
	);
}
