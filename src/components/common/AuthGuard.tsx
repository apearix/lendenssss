"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/") {
      // The splash screen is public and handles its own redirect to /welcome.
      setChecking(false);
      return;
    }
    if (!localStorage.getItem("lenden_access_token") && !sessionStorage.getItem("lenden_access_token")) {
      router.replace("/");
      return;
    }
    // Session state is read from browser storage after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="grid min-h-dvh place-items-center overflow-hidden bg-[linear-gradient(145deg,#004b3d_0%,#00604d_58%,#006a53_100%)]">
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <img className="size-32 object-contain" src="/images/logo.png" alt="Lenden" />
          <h1 className="m-0 text-4xl font-extrabold">Lenden</h1>
        </div>
      </main>
    );
  }

  return children;
}
