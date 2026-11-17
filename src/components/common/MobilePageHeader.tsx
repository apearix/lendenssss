import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";

type MobilePageHeaderProps = {
  title: string;
  action?: ReactNode;
  rightAction?: ReactNode;
  backHref?: string;
  className?: string;
};

export default function MobilePageHeader({ title, action, rightAction, backHref, className = "" }: MobilePageHeaderProps) {
	const { t } = useLanguage();
  return (
    <header className={`fixed left-1/2 top-0 z-[5] flex min-h-[62px] w-[min(calc(100%-40px),1120px)] -translate-x-1/2 items-center justify-between rounded-b-[14px] bg-[linear-gradient(118deg,#064a37_0%,#08734f_55%,#0a6047_100%)] px-[14px] text-white max-[700px]:left-0 max-[700px]:top-0 max-[700px]:w-full max-[700px]:translate-x-0 ${className}`}>
      {backHref ? <Link className="grid size-10 place-items-center rounded-[10px]" href={backHref} aria-label="Go back">{action}</Link> : <h1 className="m-0 text-[18px] font-bold">{t(title)}</h1>}
      {backHref ? <h1 className="m-0 flex-1 text-center text-[18px] font-bold">{t(title)}</h1> : action ? <span className="grid size-10 place-items-center">{action}</span> : null}
      {backHref && <span className="relative grid size-10 place-items-center">{rightAction}</span>}
    </header>
  );
}
