// components/Navigation.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UserAccountNav } from "@/components/user-account-nav";
import { GraduationCap, Menu, X, BookOpen, Users, Award, Bot, ChevronDown, Sparkles, User, LogIn } from "lucide-react";

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { isAuthenticated, profile } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigationLinks = [
		{
			label: "Courses",
			href: "/courses",
			icon: BookOpen,
			description: "Browse our AI-enhanced courses",
		},
		{
			label: "About",
			href: "/about",
			icon: Users,
			description: "Learn about our mission",
		},
		{
			label: "Pricing",
			href: "/pricing",
			icon: Award,
			description: "Simple, transparent pricing",
		},
	];

	return (
		<>
			<motion.nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent"}`}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="container-custom">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-3 group">
							<motion.div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-accent transition-all duration-300" whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }}>
								<GraduationCap className="h-6 w-6 text-primary-foreground group-hover:text-accent-foreground" />
							</motion.div>
							<span className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">EduMattor</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden lg:flex items-center gap-8">
							{navigationLinks.map((link, index) => (
								<motion.div key={link.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}>
									<Link href={link.href} className="group flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-300 relative">
										<link.icon className="w-4 h-4" />
										<span className="font-medium">{link.label}</span>
										<div className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
									</Link>
								</motion.div>
							))}

							{/* AI Badge */}
							<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
								<div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20">
									<Bot className="w-4 h-4 text-accent" />
									<span className="text-accent text-sm font-medium">AI-Powered</span>
								</div>
							</motion.div>
						</div>

						{/* Desktop Auth Section */}
						<div className="hidden lg:flex items-center gap-4">
							{isAuthenticated && profile ? (
								<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
									<UserAccountNav user={profile} />
								</motion.div>
							) : (
								<motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
									<Link href="/auth/login">
										<Button variant="ghost" className="text-muted-foreground hover:text-accent hover:bg-accent/10">
											<LogIn className="w-4 h-4 mr-2" />
											Log in
										</Button>
									</Link>
									<Link href="/student/profile">
										<Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300">
											<Sparkles className="w-4 h-4 mr-2" />
											Get Started
										</Button>
									</Link>
								</motion.div>
							)}
						</div>

						{/* Mobile Menu Button */}
						<motion.button className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} whileTap={{ scale: 0.95 }}>
							{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
						</motion.button>
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
						{/* Backdrop */}
						<div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

						{/* Mobile Menu Content */}
						<motion.div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
							<div className="container-custom py-6">
								{/* Navigation Links */}
								<div className="space-y-4 mb-8">
									{navigationLinks.map((link, index) => (
										<motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
											<Link href={link.href} className="flex items-center gap-3 p-4 rounded-xl hover:bg-accent/10 transition-colors duration-300 group" onClick={() => setIsMobileMenuOpen(false)}>
												<div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
													<link.icon className="w-5 h-5 text-accent" />
												</div>
												<div>
													<div className="font-medium text-foreground group-hover:text-accent transition-colors">{link.label}</div>
													<div className="text-sm text-muted-foreground">{link.description}</div>
												</div>
											</Link>
										</motion.div>
									))}
								</div>

								{/* AI Badge */}
								<motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
									<div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
										<Bot className="w-4 h-4 text-accent" />
										<span className="text-accent text-sm font-medium">AI-Enhanced Learning</span>
									</div>
								</motion.div>

								{/* Mobile Auth Section */}
								<motion.div className="border-t border-border pt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
									{isAuthenticated && profile ? (
										<div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
											<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
												<User className="w-5 h-5 text-primary-foreground" />
											</div>
											<div>
												<div className="font-medium text-foreground">{profile.name}</div>
												<div className="text-sm text-muted-foreground">{profile.email}</div>
											</div>
										</div>
									) : (
										<div className="space-y-3">
											<a href="/auth/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
												<Button variant="outline" className="w-full border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent">
													<LogIn className="w-4 h-4 mr-2" />
													Log in
												</Button>
											</a>
											<Link href="/student/profile" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
												<Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
													<Sparkles className="w-4 h-4 mr-2" />
													Get Started Free
												</Button>
											</Link>
										</div>
									)}
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Spacer to prevent content overlap */}
			<div className="h-16" />
		</>
	);
}
