"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu, ChevronRight, Brain, BookOpen, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserAccountNav } from "@/components/user-account-nav";
import { useAuth } from "@/contexts/AuthContext";

interface TopNavigationProps {
	onMenuClick: () => void;
	className?: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuClick, className }) => {
	const pathname = usePathname();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const { profile } = useAuth();

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 60000);
		return () => clearInterval(timer);
	}, []);

	// Get current page title from pathname
	const getPageTitle = () => {
		const segments = pathname.split("/").filter(Boolean);
		const lastSegment = segments[segments.length - 1];

		const titles: Record<string, string> = {
			dashboard: "Dashboard",
			courses: "My Courses",
			"ai-tutor": "AI Tutor",
			goals: "Goals",
			achievements: "Achievements",
			settings: "Settings",
		};

		return titles[lastSegment] || "Dashboard";
	};

	// Simplified notifications
	const notifications = [
		{
			id: 1,
			title: "Course Progress",
			message: "You've completed 2 new lessons today",
			time: "10 min ago",
			unread: true,
		},
		{
			id: 2,
			title: "Achievement Unlocked",
			message: "Completed your first week of learning",
			time: "1 hour ago",
			unread: true,
		},
		{
			id: 3,
			title: "AI Tutor",
			message: "New personalized recommendations available",
			time: "2 hours ago",
			unread: false,
		},
	];

	const unreadCount = notifications.filter((n) => n.unread).length;

	return (
		<motion.header className={cn("sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border", className)} initial={{ y: -64 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
			<div className="flex items-center justify-between h-16 px-6">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					{/* Mobile Menu Button */}
					<Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
						<Menu className="w-5 h-5" />
					</Button>

					{/* Breadcrumb */}
					<div className="hidden md:flex items-center gap-2">
						<motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
							<Link href="/student/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
								Student
							</Link>
							<ChevronRight className="w-4 h-4 text-muted-foreground" />
							<span className="font-medium text-foreground">{getPageTitle()}</span>
						</motion.div>
					</div>

					{/* Current Time */}
					<motion.div className="hidden xl:flex items-center gap-2 text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
						<Calendar className="w-4 h-4" />
						<span>
							{currentTime.toLocaleDateString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
							})}
						</span>
					</motion.div>
				</div>

				{/* Center Section - Search */}
				<div className="flex-1 max-w-md mx-6">
					<AnimatePresence mode="wait">
						{isSearchOpen ? (
							<motion.div className="relative" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
									<Input
										placeholder="Search courses, topics, or ask AI..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-10 pr-4 bg-background border-border"
										autoFocus
										onKeyDown={(e) => {
											if (e.key === "Escape") {
												setIsSearchOpen(false);
												setSearchQuery("");
											}
										}}
									/>
								</div>

								{/* Search Results */}
								{searchQuery && (
									<motion.div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
										<div className="space-y-2">
											<div className="text-xs font-medium text-muted-foreground mb-2">Quick Results</div>
											<div className="space-y-1">
												<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
													<Brain className="w-4 h-4 text-accent" />
													<span className="text-sm">Ask AI: "{searchQuery}"</span>
												</div>
												<div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
													<Search className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm">Search courses</span>
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</motion.div>
						) : (
							<motion.div className="relative group cursor-pointer" onClick={() => setIsSearchOpen(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
								<div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-all duration-300">
									<Search className="w-4 h-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Search or ask AI...</span>
									<div className="ml-auto flex items-center gap-1">
										<kbd className="px-2 py-1 text-xs bg-background border border-border rounded">⌘</kbd>
										<kbd className="px-2 py-1 text-xs bg-background border border-border rounded">K</kbd>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Right Section */}
				<div className="flex items-center gap-3">
					{/* AI Status */}
					<motion.div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-lg border border-accent/20" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
						<Brain className="w-4 h-4" />
						<span className="hidden md:inline text-sm font-medium">AI Online</span>
						<motion.div className="w-2 h-2 bg-green-500 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
					</motion.div>

					{/* Notifications */}
					<motion.div className="relative" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
						<Button variant="ghost" size="icon" className="relative" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
							<Bell className="w-4 h-4" />
							{unreadCount > 0 && (
								<motion.div
									className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 300 }}
								>
									{unreadCount}
								</motion.div>
							)}
						</Button>

						{/* Notifications Dropdown */}
						<AnimatePresence>
							{isNotificationOpen && (
								<motion.div
									className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4"
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									transition={{ duration: 0.2 }}
								>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="font-semibold text-foreground">Notifications</h3>
											<Badge variant="secondary" className="text-xs">
												{unreadCount} new
											</Badge>
										</div>

										<div className="space-y-2 max-h-64 overflow-y-auto">
											{notifications.map((notification) => (
												<motion.div
													key={notification.id}
													className={cn("p-3 rounded-lg border cursor-pointer transition-all duration-200", notification.unread ? "bg-accent/5 border-accent/20" : "bg-muted/30 border-border")}
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
												>
													<div className="flex items-start gap-3">
														<div className="flex-1 min-w-0">
															<h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
															<p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
															<p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
														</div>
														{notification.unread && <div className="w-2 h-2 bg-accent rounded-full mt-1" />}
													</div>
												</motion.div>
											))}
										</div>

										<div className="pt-2 border-t border-border">
											<Button variant="ghost" className="w-full text-xs">
												View all notifications
											</Button>
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					{/* User Menu */}
					<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
						{profile ? (
							<UserAccountNav user={profile} />
						) : (
							<div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
								<span className="text-sm font-medium text-accent-foreground">{"U"}</span>
							</div>
						)}
					</motion.div>
				</div>
			</div>

			{/* Mobile Search Overlay */}
			<AnimatePresence>
				{isSearchOpen && (
					<motion.div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input placeholder="Search or ask AI..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-background border-border" autoFocus />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.header>
	);
};

export default TopNavigation;
