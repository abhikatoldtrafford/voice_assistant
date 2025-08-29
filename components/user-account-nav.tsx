// components/user-account-nav.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { User, Settings, BookOpen, Award, LogOut, ChevronDown, Crown, Bell, Heart, BarChart3, HelpCircle } from "lucide-react";

interface UserProfile {
	_id: string;
	name: string;
	email: string;
	image?: string;
	roles: string[];
}

interface UserAccountNavProps {
	user: UserProfile;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Close dropdown on escape key
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen]);

	const menuItems = [
		{
			label: "Dashboard",
			href: "/student/dashboard",
			icon: BarChart3,
			description: "View your progress",
		},
		{
			label: "My Courses",
			href: "/student/courses",
			icon: BookOpen,
			description: "Continue learning",
		},
		{
			label: "Meet Coach",
			href: "/student/onboarding",
			icon: Settings,
			description: "Onboarding",
		},
		{
			label: "Help & Support",
			href: "/help",
			icon: HelpCircle,
			description: "Get assistance",
		},
	];

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const isPremium = user.roles?.includes("premium") || user.roles?.includes("admin");

	return (
		<div className="relative" ref={dropdownRef}>
			{/* User Avatar Button */}
			<motion.button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 p-1 rounded-full hover:bg-accent/10 transition-all duration-300 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
				{/* Avatar */}
				<div className="relative">
					<div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm border-2 border-transparent group-hover:border-accent/30 transition-all duration-300">
						{user.image ? <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
					</div>

					{/* Premium Badge */}
					{isPremium && (
						<div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
							<Crown className="w-2.5 h-2.5 text-accent-foreground" />
						</div>
					)}

					{/* Online Indicator */}
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-background rounded-full"></div>
				</div>

				{/* User Info (Desktop Only) */}
				<div className="hidden lg:block text-left">
					<div className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-300">{user.name}</div>
					<div className="text-xs text-muted-foreground">{isPremium ? "Premium Member" : "Free Member"}</div>
				</div>

				{/* Dropdown Arrow */}
				<motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="hidden lg:block">
					<ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
				</motion.div>
			</motion.button>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
					>
						{/* Header */}
						<div className="p-4 border-b border-border bg-muted/30">
							<div className="flex items-center gap-3">
								<div className="relative">
									<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
										{user.image ? <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
									</div>
									{isPremium && (
										<div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
											<Crown className="w-3 h-3 text-accent-foreground" />
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="font-semibold text-foreground truncate">{user.name}</div>
									<div className="text-sm text-muted-foreground truncate">{user.email}</div>
									{isPremium && (
										<div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-accent/10 rounded-full">
											<Crown className="w-3 h-3 text-accent" />
											<span className="text-xs text-accent font-medium">Premium</span>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className="py-2">
							{menuItems.map((item, index) => (
								<motion.div key={item.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
									<Link href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-colors duration-200 group">
										<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
											<item.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors duration-200" />
										</div>
										<div className="flex-1">
											<div className="font-medium text-foreground group-hover:text-accent transition-colors duration-200">{item.label}</div>
											<div className="text-xs text-muted-foreground">{item.description}</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>

						{/* Footer */}
						<div className="border-t border-border p-2">
							<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: 0.3 }}>
								<a href="/auth/logout" className="flex cursor-pointer items-center gap-3 px-4 py-3 w-full text-left hover:bg-destructive/10 transition-colors duration-200 group rounded-lg">
									<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-destructive/20 transition-colors duration-200">
										<LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors duration-200" />
									</div>
									<div className="flex-1">
										<div className="font-medium text-foreground group-hover:text-destructive transition-colors duration-200">Sign Out</div>
										<div className="text-xs text-muted-foreground">See you later!</div>
									</div>
								</a>
							</motion.div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
