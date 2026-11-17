import type { ReactNode } from "react";
import AuthGuard from "../../components/common/AuthGuard";

export default function MainLayout({ children }: { children: ReactNode }) {
	return <AuthGuard>{children}</AuthGuard>;
}
