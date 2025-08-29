"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TopNavigation from "./components/TopNavigation";
import { GraduationCap, BookOpen, Home, Target, Trophy, Brain, User, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const studentNavItems = [
	{
		title: "Dashboard",
		href: "/student/dashboard",
		icon: Home,
		description: "Overview & progress",
	},
	{
		title: "My Courses",
		href: "/student/courses",
		icon: BookOpen,
		description: "Continue learning",
		badge: "3 Active",
	},
	// {
	// 	title: "AI Tutor",
	// 	href: "/student/ai-tutor",
	// 	icon: Brain,
	// 	description: "Get help instantly",
	// },
	// {
	// 	title: "Goals",
	// 	href: "/student/goals",
	// 	icon: Target,
	// 	description: "Track progress",
	// },
	// {
	// 	title: "Achievements",
	// 	href: "/student/achievements",
	// 	icon: Trophy,
	// 	description: "Your milestones",
	// },
];

interface StudentLayoutProps {
	children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
	const pathname = usePathname();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Check if we're in a course content page
	const isCourseContentPage = pathname.includes("/student/courses/") && pathname.split("/").length > 3;

	useEffect(() => {
		setIsSidebarOpen(false);
	}, [pathname]);

	if (isCourseContentPage) {
		return children;
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="flex h-screen">
				{/* Sidebar */}
				<motion.aside
					className={cn("fixed lg:static inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}
					initial={{ x: -288 }}
					animate={{ x: 0 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					{/* Mobile backdrop */}
					<AnimatePresence>
						{isSidebarOpen && <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} />}
					</AnimatePresence>

					{/* Sidebar content */}
					<div className="relative flex flex-col h-full w-72 bg-card border-r border-border">
						{/* Header */}
						<div className="p-6 border-b border-border">
							<Link href="/student/dashboard" className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
									<GraduationCap className="w-6 h-6 text-accent-foreground" />
								</div>
								<div>
									<span className="text-lg font-semibold text-foreground">EduMattor</span>
									<div className="text-xs text-muted-foreground">Student Portal</div>
								</div>
							</Link>
						</div>

						{/* Navigation */}
						<nav className="flex-1 p-4 space-y-2">
							{studentNavItems.map((item, index) => {
								const isActive = pathname === item.href;
								return (
									<motion.div key={item.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
										<Link href={item.href}>
											<motion.div
												className={cn("group relative p-3 rounded-lg transition-all duration-200 cursor-pointer", isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}
												whileHover={{ x: 2 }}
												whileTap={{ scale: 0.98 }}
											>
												{isActive && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-accent rounded-r-full" layoutId="activeIndicator" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}

												<div className="flex items-center space-x-3">
													<div
														className={cn(
															"w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
															isActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent"
														)}
													>
														<item.icon className="w-4 h-4" />
													</div>

													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<span className="font-medium text-sm">{item.title}</span>
															{item.badge && (
																<Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
																	{item.badge}
																</Badge>
															)}
														</div>
														<p className="text-xs text-muted-foreground">{item.description}</p>
													</div>
												</div>
											</motion.div>
										</Link>
									</motion.div>
								);
							})}
						</nav>

						{/* AI Status */}
						<div className="p-4 border-t border-border">
							<motion.div className="p-3 bg-accent/5 rounded-lg border border-accent/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
										<Brain className="w-4 h-4 text-accent" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">AI Tutor</p>
										<p className="text-xs text-muted-foreground">Ready to help</p>
									</div>
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								</div>
							</motion.div>
						</div>

						{/* Settings */}
						<div className="p-4">
							<Link href="/student/profile">
								<motion.div className="flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer" whileHover={{ x: 2 }}>
									<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
										<Settings className="w-4 h-4" />
									</div>
									<span className="text-sm font-medium">Settings</span>
								</motion.div>
							</Link>
						</div>
					</div>
				</motion.aside>

				{/* Main Content */}
				<div className="flex-1 lg:ml-0 flex flex-col min-h-0">
					{/* Top Navigation */}
					<TopNavigation onMenuClick={() => setIsSidebarOpen(true)} />

					{/* Page Content */}
					<main className="flex-1 overflow-auto">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="h-full">
							{children}
						</motion.div>
					</main>
				</div>
			</div>
		</div>
	);
}
