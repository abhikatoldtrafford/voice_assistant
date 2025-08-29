import { auth0 } from "@/lib/auth0";

export default async function UsersPage() {
	const session = await auth0.getSession();
	const profileId = session?.user?.profileId;
	const roles = session?.user?.roles;

	return (
		<div>
			<h1>Users </h1>
			<ul>
				<li>Profile ID: {profileId}</li>
				<li>Roles: {roles.join(", ")}</li>
				<li>Email: {session?.user?.email}</li>
				<li>Name: {session?.user?.name}</li>
			</ul>
		</div>
	);
}
