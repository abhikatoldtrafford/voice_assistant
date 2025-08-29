// components/navigation/EnhancedNavigation.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { GraduationCap, Menu, X, ChevronDown, BookOpen, Users, Zap, Bot, Sparkles, Search, Bell, Compass, Target, Award } from "lucide-react";
import { UserAccountNav } from "@/components/user-account-nav";
import { cn } from "@/lib/utils";

interface NavigationProps {
	user?: any;
	session?: any;
}

export function EnhancedNavigation({ user, session }: NavigationProps) {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigationItems = [
		{
			label: "Explore",
			href: "/courses",
			icon: Compass,
			description: "Discover AI-powered courses",
			dropdown: [
				{
					label: "All Courses",
					href: "/courses",
					icon: BookOpen,
					description: "Browse our complete catalog",
				},
				{
					label: "AI-Enhanced Learning",
					href: "/courses?ai=true",
					icon: Bot,
					description: "Courses with adaptive AI tutoring",
					badge: "Popular",
				},
				{
					label: "Learning Paths",
					href: "/paths",
					icon: Target,
					description: "Structured skill development",
				},
			],
		},
		{
			label: "For Educators",
			href: "/educators",
			icon: Users,
			description: "Tools for modern teaching",
			dropdown: [
				{
					label: "Become Instructor",
					href: "/auth/login",
					icon: GraduationCap,
					description: "Share your expertise with AI assistance",
				},
				{
					label: "AI Teaching Tools",
					href: "/ai-tools",
					icon: Zap,
					description: "Enhance your teaching with AI",
					badge: "New",
				},
				{
					label: "Analytics Dashboard",
					href: "/instructor/analytics",
					icon: Award,
					description: "Track student progress and engagement",
				},
			],
		},
	];

	return (
		<>
			<motion.header
				className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-border/50 shadow-neural" : "bg-transparent")}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<nav className="container-custom">
					<div className="flex items-center justify-between h-16 lg:h-20">
						{/* Logo */}
						<Link href="/" className="flex items-center space-x-3 group">
							<motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center micro-bounce group-hover:shadow-ai-glow transition-all duration-300">
									<GraduationCap className="w-6 h-6 text-white" />
								</div>
								<div className="ai-coach-indicator"></div>
							</motion.div>
							<div className="flex flex-col">
								<motion.span className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
									EduMattor
								</motion.span>
								<motion.span className="text-xs text-muted-foreground -mt-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
									AI-Powered Learning
								</motion.span>
							</div>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center space-x-8">
							{navigationItems.map((item, index) => (
								<motion.div
									key={item.label}
									className="relative group"
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									onMouseEnter={() => setActiveDropdown(item.label)}
									onMouseLeave={() => setActiveDropdown(null)}
								>
									<Link href={item.href} className="flex items-center space-x-2 text-foreground hover:text-blue-600 transition-colors font-medium relative group px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20">
										<item.icon className="w-4 h-4" />
										<span>{item.label}</span>
										{item.dropdown && <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />}
									</Link>

									{/* Dropdown Menu */}
									<AnimatePresence>
										{item.dropdown && activeDropdown === item.label && (
											<motion.div
												className="absolute top-full left-0 mt-2 w-80"
												initial={{ opacity: 0, y: 10, scale: 0.95 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.95 }}
												transition={{ duration: 0.2 }}
											>
												<div className="adaptive-card p-4 space-y-2">
													<div className="text-sm font-medium text-muted-foreground mb-3">{item.description}</div>
													{item.dropdown.map((dropdownItem) => (
														<Link key={dropdownItem.label} href={dropdownItem.href} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group">
															<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
																<dropdownItem.icon className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
															</div>
															<div className="flex-1">
																<div className="flex items-center gap-2">
																	<div className="font-medium text-foreground group-hover:text-blue-600 transition-colors">{dropdownItem.label}</div>
																	{dropdownItem.badge && (
																		<Badge variant="secondary" className="text-xs">
																			{dropdownItem.badge}
																		</Badge>
																	)}
																</div>
																<div className="text-sm text-muted-foreground">{dropdownItem.description}</div>
															</div>
														</Link>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							))}
						</div>

						{/* Right Side Actions */}
						<div className="flex items-center space-x-4">
							{/* Search Button */}
							<motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
								<EnhancedButton variant="ghost" size="icon" className="hidden md:flex" withFloat>
									<Search className="w-5 h-5" />
								</EnhancedButton>
							</motion.div>

							{/* AI Features Badge */}
							<motion.div className="hidden lg:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
								<div className="ai-badge">
									<Sparkles className="w-4 h-4" />
									<span>AI-Enhanced</span>
								</div>
							</motion.div>

							{/* User Actions */}
							{session && user ? (
								<motion.div className="flex items-center space-x-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
									{/* AI Coach Avatar */}
									<AICoachAvatar size="sm" personality="warm" mood="happy" className="hidden sm:block" />

									{/* Notifications */}
									<EnhancedButton variant="ghost" size="icon" className="relative">
										<Bell className="w-5 h-5" />
										<div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
									</EnhancedButton>

									<UserAccountNav user={user} />
								</motion.div>
							) : (
								<motion.div className="flex items-center space-x-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
									<Link href="/auth/login">
										<EnhancedButton variant="ghost" className="hidden sm:flex">
											Sign In
										</EnhancedButton>
									</Link>

									<Link href="/auth/login">
										<EnhancedButton variant="ai-primary" withGlow aiPersonality="warm">
											<Bot className="w-4 h-4" />
											<span className="hidden sm:inline">Get Started</span>
											<span className="sm:hidden">Start</span>
										</EnhancedButton>
									</Link>
								</motion.div>
							)}

							{/* Mobile Menu Button */}
							<motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}>
								<EnhancedButton variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} withFloat>
									{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
								</EnhancedButton>
							</motion.div>
						</div>
					</div>
				</nav>
			</motion.header>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						{/* Backdrop */}
						<motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

						{/* Mobile Menu */}
						<motion.div
							className="absolute top-16 left-0 right-0 adaptive-card mx-4 mt-4 p-6"
							initial={{ opacity: 0, y: -20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -20, scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<div className="space-y-6">
								{/* Mobile Navigation Items */}
								<div className="space-y-4">
									{navigationItems.map((item, index) => (
										<motion.div key={item.label} className="space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
											<Link href={item.href} className="flex items-center justify-between text-foreground hover:text-blue-600 transition-colors font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
												<div className="flex items-center space-x-3">
													<item.icon className="w-5 h-5" />
													<span>{item.label}</span>
												</div>
												{item.dropdown && <ChevronDown className="w-4 h-4" />}
											</Link>

											{/* Mobile Dropdown Items */}
											{item.dropdown && (
												<div className="pl-8 space-y-2 border-l-2 border-blue-100 dark:border-blue-900/30">
													{item.dropdown.map((dropdownItem) => (
														<Link key={dropdownItem.label} href={dropdownItem.href} className="flex items-center space-x-3 py-2 text-muted-foreground hover:text-blue-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
															<dropdownItem.icon className="w-4 h-4" />
															<span>{dropdownItem.label}</span>
															{dropdownItem.badge && (
																<Badge variant="secondary" className="text-xs">
																	{dropdownItem.badge}
																</Badge>
															)}
														</Link>
													))}
												</div>
											)}
										</motion.div>
									))}
								</div>

								{/* Mobile Search */}
								<motion.div className="pt-4 border-t border-border/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
									<EnhancedButton variant="outline" className="w-full justify-start">
										<Search className="w-4 h-4 mr-2" />
										Search courses...
									</EnhancedButton>
								</motion.div>

								{/* Mobile AI Badge */}
								<motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
									<div className="ai-badge">
										<Sparkles className="w-4 h-4" />
										<span>AI-Enhanced Learning Platform</span>
									</div>
								</motion.div>

								{/* Mobile Auth Actions */}
								{!session && (
									<motion.div className="pt-4 border-t border-border/50 space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
										<Link href="/auth/login" className="block">
											<EnhancedButton variant="outline" className="w-full">
												Sign In
											</EnhancedButton>
										</Link>
										<Link href="/auth/login" className="block">
											<EnhancedButton variant="ai-primary" className="w-full" withGlow>
												<Bot className="w-4 h-4 mr-2" />
												Get Started with AI Learning
											</EnhancedButton>
										</Link>
									</motion.div>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default EnhancedNavigation;
