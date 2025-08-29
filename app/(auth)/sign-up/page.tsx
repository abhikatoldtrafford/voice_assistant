"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";

export default function SignUp() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		// TODO: Implement authentication
		setTimeout(() => {
			setIsLoading(false);
			router.push("/dashboard");
		}, 1000);
	};

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Link href="/" className="mb-8 flex items-center space-x-2 text-2xl font-bold">
				<GraduationCap className="h-8 w-8" />
				<span>EduMattor</span>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
					<p className="text-sm text-muted-foreground">Enter your details to get started</p>
				</div>
				<form onSubmit={onSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Full Name</Label>
						<Input id="name" type="text" placeholder="John Doe" required disabled={isLoading} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" required disabled={isLoading} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" required disabled={isLoading} />
					</div>
					<div className="space-y-2">
						<Label htmlFor="role">I want to</Label>
						<Select defaultValue="student" disabled={isLoading}>
							<SelectTrigger>
								<SelectValue placeholder="Select your role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="student">Learn as a student</SelectItem>
								<SelectItem value="instructor">Teach as an instructor</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button className="w-full" type="submit" disabled={isLoading}>
						{isLoading ? "Creating account..." : "Sign Up"}
					</Button>
				</form>
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link href="/sign-in" className="hover:text-brand underline">
						Already have an account? Sign In
					</Link>
				</p>
			</div>
		</div>
	);
}
