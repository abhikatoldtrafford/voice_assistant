"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Users, BookOpen, Trophy, Clock, Bot, Sparkles, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
	return (
		<section className="relative min-h-screen flex items-center justify-center bg-background">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 bg-dot-pattern opacity-20"></div>

			{/* Background gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background"></div>

			<div className="relative z-10 container-custom">
				<div className="max-w-4xl mx-auto text-center">
					{/* Badge */}
					<motion.div className="inline-flex items-center gap-2 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
						<Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors">
							<Bot className="w-4 h-4 mr-2" />
							Introducing AI-powered learning
						</Badge>
					</motion.div>

					{/* Main heading */}
					<motion.h1 className="heading-1 text-foreground mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
						The future of{" "}
						<span className="relative">
							<span className="text-gradient">intelligent learning</span>
							<div className="absolute -bottom-2 left-0 w-full h-1 bg-accent/30 rounded-full"></div>
						</span>{" "}
						starts here
					</motion.h1>

					{/* Subtitle */}
					<motion.p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
						Experience personalized education with our advanced AI tutoring system. Adaptive learning that grows with you, providing real-time feedback and support.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
						<Link href="/courses">
							<Button size="lg" className="text-base px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
								<Sparkles className="mr-2 h-5 w-5" />
								Start learning
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Button variant="outline" size="lg" className="text-base px-8 py-4 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent transition-all duration-300">
							<Play className="mr-2 h-4 w-4" />
							Watch demo
						</Button>
					</motion.div>

					{/* Stats */}
					<motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
						{[
							{ icon: Users, value: "50K+", label: "Students", color: "text-accent" },
							{ icon: BookOpen, value: "1000+", label: "Courses", color: "text-accent" },
							{ icon: Trophy, value: "95%", label: "Success Rate", color: "text-accent" },
							{ icon: Clock, value: "24/7", label: "AI Support", color: "text-accent" },
						].map((stat, index) => (
							<motion.div
								key={stat.label}
								className="text-center p-4 rounded-xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-md"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
								whileHover={{ scale: 1.05 }}
							>
								<div className="flex justify-center mb-3">
									<stat.icon className={`h-6 w-6 ${stat.color}`} />
								</div>
								<div className="text-2xl font-bold text-foreground">{stat.value}</div>
								<div className="text-sm text-muted-foreground">{stat.label}</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>

			{/* Floating elements */}
			<div className="absolute top-20 left-10 opacity-20">
				<motion.div
					animate={{
						y: [0, -20, 0],
						rotate: [0, 5, 0],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className="w-20 h-20 rounded-full bg-accent/20 blur-sm"
				></motion.div>
			</div>

			<div className="absolute bottom-20 right-10 opacity-20">
				<motion.div
					animate={{
						y: [0, 20, 0],
						rotate: [0, -5, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 2,
					}}
					className="w-32 h-32 rounded-full bg-primary/10 blur-sm"
				></motion.div>
			</div>
		</section>
	);
}
