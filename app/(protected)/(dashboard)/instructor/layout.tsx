"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpen, Users, BarChart2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
	{
		title: "Courses",
		href: "/instructor/courses",
		icon: BookOpen,
	},
	{
		title: "Students",
		href: "/instructor/students",
		icon: Users,
	},
	{
		title: "Analytics",
		href: "/instructor/analytics",
		icon: BarChart2,
	},
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { profile } = useAuth();

	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<div className="w-64 bg-gray-50 dark:bg-gray-900 border-r">
				<div className="h-16 flex items-center px-6 border-b">
					<Link href="/instructor/courses" className="flex items-center space-x-2">
						<GraduationCap className="h-6 w-6" />
						<span className="font-bold">EduMattor</span>
					</Link>
				</div>
				<nav className="p-4 space-y-2">
					{sidebarItems.map((item) => (
						<Link key={item.href} href={item.href}>
							<Button variant="ghost" className={cn("w-full justify-start space-x-2", pathname === item.href && "bg-primary/10")}>
								<item.icon className="h-5 w-5" />
								<span>{item.title}</span>
							</Button>
						</Link>
					))}
				</nav>
			</div>

			{/* Main content */}
			<div className="flex-1">
				<header className="h-16 border-b flex items-center justify-between px-6">
					<h1 className="text-xl font-semibold">Instructor Dashboard</h1>
					<div className="flex-1"></div>
					{/* Profile dropdown */}
					<Avatar>
						<AvatarImage src={profile?.picture} />
						<AvatarFallback>{profile?.name[0]}</AvatarFallback>
					</Avatar>
					{/* Logout button */}
					<Button variant="ghost" size="icon">
						<LogOut className="h-5 w-5" />
					</Button>
				</header>
				<main className="p-6">{children}</main>
			</div>
		</div>
	);
}
