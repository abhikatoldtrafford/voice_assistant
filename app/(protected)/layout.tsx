import { AuthProvider } from "@/contexts/AuthContext";
import { auth0 } from "@/lib/auth0";
import { getUserProfile } from "@/lib/utils";
import { IUserProfileData } from "@/models/UserProfile";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const session = await auth0.getSession();

	if (!session?.user) {
		redirect("/auth/login");
	}
	const profile = await getUserProfile(session);
	if (profile === null) {
		return <div>You dont have the proper profile to view this page</div>;
	}
	const userProfile = profile.toJSON({
		flattenObjectIds: true,
	}) as any as IUserProfileData;

	return (
		<AuthProvider initialSession={session} initialProfile={userProfile}>
			<div className="protected-layout">
				{/* Your protected layout UI components */}
				<main>{children}</main>
			</div>
		</AuthProvider>
	);
}
