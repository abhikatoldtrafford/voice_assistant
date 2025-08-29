"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, Clock, Bot, Sparkles, TrendingUp, Zap, Target, Globe, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CoursesHeader() {
	const stats = [
		{
			icon: BookOpen,
			value: "1000+",
			label: "Courses",
			color: "text-accent",
			description: "Expert-designed",
		},
		{
			icon: Users,
			value: "50K+",
			label: "Students",
			color: "text-neural-primary",
			description: "Global learners",
		},
		{
			icon: Award,
			value: "95%",
			label: "Success Rate",
			color: "text-success",
			description: "Course completion",
		},
		{
			icon: Clock,
			value: "24/7",
			label: "AI Support",
			color: "text-warning",
			description: "Always available",
		},
	];

	const features = [
		{
			icon: Bot,
			title: "AI-Powered Learning",
			description: "Adaptive courses that learn from your progress",
		},
		{
			icon: Target,
			title: "Personalized Paths",
			description: "Custom learning journeys for your goals",
		},
		{
			icon: Globe,
			title: "Global Community",
			description: "Learn with students from around the world",
		},
	];

	return (
		<section className="section-padding bg-gradient-subtle relative overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-neural-pattern opacity-30"></div>
			<div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90"></div>

			{/* Floating Elements */}
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
					className="w-32 h-32 rounded-full bg-neural-primary/10 blur-sm"
				></motion.div>
			</div>

			<div className="container-custom relative z-10">
				<motion.div className="text-center max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
					{/* AI Badge */}
					<motion.div
						className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-8"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						whileHover={{ scale: 1.05 }}
					>
						<Bot className="w-4 h-4 text-accent" />
						<span className="text-accent text-sm font-medium">AI-Enhanced Education Platform</span>
					</motion.div>

					{/* Main Heading */}
					<motion.h1 className="heading-1 text-foreground mb-6 text-balance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
						Discover courses that{" "}
						<span className="relative">
							<span className="text-gradient">adapt to you</span>
							<motion.div className="absolute -bottom-2 left-0 w-full h-1 bg-accent/30 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 1 }}></motion.div>
						</span>
					</motion.h1>

					{/* Subtitle */}
					<motion.p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed text-balance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
						Explore our comprehensive catalog of courses designed to help you achieve your learning goals with the power of AI-enhanced education that understands how you learn best.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
						<Button size="lg" className="text-base px-8 py-4 bg-primary text-accent-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
							<Sparkles className="mr-2 h-5 w-5" />
							Start Learning Today
						</Button>
						<Button variant="outline" size="lg" className="text-base px-8 py-4 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent transition-all duration-300">
							<Play className="mr-2 h-4 w-4" />
							Watch Demo
						</Button>
					</motion.div>

					{/* Enhanced Stats Grid */}
					<motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
						{stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								className="group text-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-accent/30 hover:bg-card transition-all duration-300 hover:shadow-md"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
								whileHover={{ scale: 1.05, y: -5 }}
							>
								<div className="flex justify-center mb-4">
									<div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
										<stat.icon className={`h-6 w-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
									</div>
								</div>
								<div className="text-2xl md:text-3xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">{stat.value}</div>
								<div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
								<div className="text-xs text-muted-foreground">{stat.description}</div>
							</motion.div>
						))}
					</motion.div>

					{/* Feature Highlights */}
					<motion.div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}>
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								className="text-center p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-accent/30 hover:bg-card/50 transition-all duration-300"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
								whileHover={{ y: -5 }}
							>
								<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
									<feature.icon className="w-6 h-6 text-accent" />
								</div>
								<h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
							</motion.div>
						))}
					</motion.div>

					{/* Trust Indicators */}
					<motion.div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
						<div className="flex items-center gap-2">
							<Star className="w-4 h-4 text-warning fill-warning" />
							<span>4.9/5 average rating</span>
						</div>
						<div className="flex items-center gap-2">
							<Globe className="w-4 h-4 text-info" />
							<span>180+ countries</span>
						</div>
						<div className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4 text-success" />
							<span>95% completion rate</span>
						</div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4 text-accent" />
							<span>AI-powered learning</span>
						</div>
					</motion.div>

					{/* Bottom CTA */}
					<motion.div className="mt-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }}>
						<div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/5 border border-accent/20 rounded-full">
							<Sparkles className="w-4 h-4 text-accent" />
							<span className="text-accent font-medium">Experience the future of learning today</span>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
