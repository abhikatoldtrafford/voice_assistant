// app/(public)/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GraduationCap, User, BookOpen, LogOut, Settings, ChevronDown } from "lucide-react";
import { auth0 } from "@/lib/auth0";
import { getCurrentUser } from "@/actions/user";
import { UserAccountNav } from "@/components/user-account-nav";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/layout/Footer";

export default async function Layout({ children }: { children: React.ReactNode }) {
	const session = await auth0.getSession();

	// Get user info if logged in
	let userProfile = null;
	if (session) {
		userProfile = await getCurrentUser().catch(() => null);
	}

	return (
		<AuthProvider initialSession={session} initialProfile={userProfile}>
			<div className="flex min-h-screen flex-col">
				<Navigation />

				<main className="flex-1">{children}</main>

				<Footer />
			</div>
		</AuthProvider>
	);
}
