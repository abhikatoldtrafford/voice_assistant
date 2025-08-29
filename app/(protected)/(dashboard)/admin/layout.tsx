"use client";

import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import { GraduationCap, BookOpen, Users, Settings, Shield, LogOut, CheckSquare, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { getPendingReviewCourses } from "@/actions/course";
import { useEffect, useState } from "react";

const adminNavItems = [
	{
		title: "Course Review",
		href: "/admin/courses/review",
		icon: CheckSquare,
		highlight: true, // This will be used to highlight items that need attention
	},
	{
		title: "All Courses",
		href: "/admin/courses",
		icon: BookOpen,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "Analytics",
		href: "/admin/analytics",
		icon: BarChart2,
	},
	{
		title: "Settings",
		href: "/admin/settings",
		icon: Settings,
	},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const { profile } = useAuth();
	const [pendingReviewCount, setPendingReviewCount] = useState(0);
	const pathname = usePathname();

	if (!profile?.roles.includes("admin")) {
		return redirect("/admin");
	}
	useEffect(() => {
		getPendingReviewCourses().then((courses) => {
			setPendingReviewCount(courses.courses?.length || 0);
		});
	}, []);

	return (
		<div className="min-h-screen flex">
			<div className="w-64 bg-gray-50 dark:bg-gray-900 border-r">
				<div className="h-16 flex items-center px-6 border-b">
					<Link href="/admin/courses" className="flex items-center space-x-2">
						<Shield className="h-6 w-6" />
						<span className="font-bold">Admin Panel</span>
					</Link>
				</div>
				<nav className="p-4 space-y-2">
					{adminNavItems.map((item) => (
						<Link key={item.href} href={item.href}>
							<Button variant="ghost" className={cn("w-full justify-start space-x-2", pathname === item.href && "bg-primary/10")}>
								<item.icon className={cn("h-5 w-5", item.highlight && pendingReviewCount > 0 && "text-amber-500")} />
								<span>{item.title}</span>

								{/* Show count badge for review items */}
								{item.highlight && pendingReviewCount > 0 && <Badge className="ml-auto bg-amber-500 text-white">{pendingReviewCount}</Badge>}
							</Button>
						</Link>
					))}
				</nav>
			</div>

			<div className="flex-1">
				<header className="h-16 border-b flex items-center justify-between px-6">
					<h1 className="text-xl font-semibold">Admin Dashboard</h1>
					<Button variant="ghost" size="icon">
						<LogOut className="h-5 w-5" />
					</Button>
				</header>
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}
