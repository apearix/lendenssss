"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { api, auth } from "../../../lib/api";
import Icon from "../../../components/common/Icon";
import ImageCropModal from "../../../components/common/ImageCropModal";

export default function ProfileSetupClient() {
	const router = useRouter();
	const [fullName, setFullName] = useState("");
	const [photoUrl, setPhotoUrl] = useState("");
	const [cropSource, setCropSource] = useState("");
	const [cropOpen, setCropOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [saving, setSaving] = useState(false);
	const savingRef = useRef(false);

	useEffect(() => () => {
		if (photoUrl) URL.revokeObjectURL(photoUrl);
	}, [photoUrl]);


	function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setMessage("Choose an image file for your photo.");
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

	async function startUsingLenden(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (savingRef.current) return;
		const name = fullName.trim();
		if (name.length < 2) {
			setMessage("Enter your full name to continue.");
			return;
		}

		savingRef.current = true;
		setSaving(true);
		try {
			await api.updateProfile({ fullName: name, avatarUrl: photoUrl || undefined });
			auth.saveAvatar(photoUrl);
			router.replace("/dashboard");
		} catch (error) {
			savingRef.current = false;
			setSaving(false);
			setMessage(error instanceof Error ? error.message : "Unable to save profile.");
		}
	}

	return (
		<main className="grid min-h-dvh place-items-center bg-[radial-gradient(ellipse_at_50%_34%,#fff_0%,#f6f8f5_76%,#eaf0ec_100%)] p-[18px] text-[#18251f] max-[480px]:p-0" aria-labelledby="profile-setup-title">
			<section className="flex w-full max-w-[390px] flex-col rounded-[22px] border border-[#d5dfda] bg-white/[.96] p-[18px_20px_20px] shadow-[0_12px_32px_rgba(34,66,52,.1)] max-[480px]:min-h-dvh max-[480px]:rounded-none max-[480px]:border-0 max-[480px]:shadow-none">
				<header className="relative flex min-h-11 items-center justify-center">
					<Link href="/register" aria-label="Back to registration" className="absolute left-0 grid size-10 place-items-center text-[#08714f]">
						<svg className="size-[25px] fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" aria-hidden="true" viewBox="0 0 24 24">
							<path d="M19 12H5m7 7-7-7 7-7" />
						</svg>
					</Link>
					<Link href="/welcome" className="inline-flex items-center gap-[7px] text-[22px] font-extrabold text-[#102b24]" aria-label="Lenden home">
						<img className="block size-[35px] object-contain" src="/images/logo.png" alt="" />
						<span>Lenden</span>
					</Link>
				</header>

				<div className="mt-3.5">
					<p className="m-0 mb-1 text-[13px] font-extrabold text-[#08714f]">FINAL STEP</p>
					<h1 className="m-0 text-[25px] font-extrabold leading-[1.15] text-[#14251e]" id="profile-setup-title">What should we call you?</h1>
					<p className="m-0 mt-[5px] text-[14px] text-[#59645f]">Add your name to personalise your khata.</p>
				</div>

				<form className="mt-2.5 flex flex-col" onSubmit={startUsingLenden}>
					<div className="relative mb-2.5 flex flex-col items-center self-center">
						<div className="grid size-[78px] place-items-center overflow-hidden rounded-full border-2 border-[#08714f] bg-[#d9f4e3] text-[#08714f]">
							{photoUrl ? <img className="size-full object-cover" src={photoUrl} alt="Profile preview" /> : <Icon name="profile" size={40} strokeWidth={1.7} />}
						</div>
						<label className="absolute left-[54px] top-[53px] grid size-[29px] cursor-pointer place-items-center rounded-full border-2 border-white bg-[#08714f] text-white outline-offset-3 focus-within:outline focus-within:outline-[3px] focus-within:outline-[#70bd91]" aria-label="Add a profile photo">
							<input className="absolute size-px overflow-hidden [clip:rect(0,0,0,0)] [clip-path:inset(50%)]" accept="image/*" onChange={choosePhoto} type="file" />
							<svg className="size-[17px] fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]" strokeWidth="1.8" aria-hidden="true" viewBox="0 0 24 24">
								<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.5h4.6L15.5 6h2A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
								<circle cx="12" cy="12.5" r="3.2" />
							</svg>
						</label>
						<span className="mt-1 text-[12px] text-[#65716b]">Add photo (optional)</span>
					</div>

					<label className="mb-[5px] text-[14px] font-bold text-[#202a25]" htmlFor="profile-full-name">Full name <span className="text-[#c0393b]">*</span></label>
					<input
						autoComplete="name"
						className="min-h-11 w-full rounded-[9px] border-[1.5px] border-[#c7d0cb] bg-white px-3 text-[16px] text-[#17231d] outline-none focus:border-[#08714f] focus:shadow-[0_0_0_3px_rgba(8,113,79,.12)]"
						id="profile-full-name"
						maxLength={80}
						onChange={(event) => {
							setFullName(event.target.value);
							setMessage("");
						}}
						placeholder="Enter your full name"
						required
						value={fullName}
					/>

					{message && <p className="m-0 text-[13px] leading-[1.4] text-[#9e3f36]" role="status">{message}</p>}
					<button aria-busy={saving} className="mt-[13px] flex min-h-[46px] items-center justify-center gap-2 rounded-[11px] border-0 bg-[#087354] text-[17px] font-bold text-white transition hover:bg-[#066448] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-[#70bd91] disabled:cursor-not-allowed disabled:opacity-80" disabled={saving} type="submit">
						{saving && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
						{saving ? "Saving..." : "Start using Lenden"}
					</button>
				</form>

				<p className="m-[10px_0_0] flex items-center justify-center gap-[7px] text-[13px] text-[#4c5852]">
					<span className="grid size-5 place-items-center rounded-full bg-[#40a944]" aria-hidden="true">
						<svg className="size-[14px] fill-none stroke-white stroke-2" viewBox="0 0 20 20"><path d="m5 10 3.2 3.2L15.5 6" /></svg>
					</span>
					Your account is verified.
				</p>
			</section>
			<ImageCropModal open={cropOpen} imageSrc={cropSource} onCancel={() => setCropOpen(false)} onSave={(croppedImage) => { setPhotoUrl(croppedImage); setCropOpen(false); }} />
		</main>
	);
}
