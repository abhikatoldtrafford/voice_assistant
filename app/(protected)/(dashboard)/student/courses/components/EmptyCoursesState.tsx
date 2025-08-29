// app/(protected)/(dashboard)/student/courses/components/EmptyCoursesState.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { BookOpen, Plus, Sparkles, Target, Brain, ArrowRight, Star, Users, Trophy, Zap, Heart, Compass, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";

const EmptyCoursesState: React.FC = () => {
	const courseCategories = [
		{
			title: "Programming & Development",
			icon: Brain,
			gradient: "from-blue-500 to-cyan-500",
			description: "Build apps, websites, and software",
			courses: "150+ courses",
		},
		{
			title: "Design & Creativity",
			icon: Target,
			gradient: "from-purple-500 to-pink-500",
			description: "UI/UX, graphic design, and more",
			courses: "80+ courses",
		},
		{
			title: "Business & Marketing",
			icon: TrendingUp,
			gradient: "from-green-500 to-emerald-500",
			description: "Grow your business skills",
			courses: "120+ courses",
		},
		{
			title: "Data & Analytics",
			icon: BarChart3,
			gradient: "from-orange-500 to-red-500",
			description: "Master data science and AI",
			courses: "90+ courses",
		},
	];

	const features = [
		{
			icon: Brain,
			title: "AI-Powered Learning",
			description: "Personalized tutoring that adapts to your pace",
		},
		{
			icon: Users,
			title: "Expert Instructors",
			description: "Learn from industry professionals",
		},
		{
			icon: Trophy,
			title: "Verified Certificates",
			description: "Earn credentials recognized by employers",
		},
		{
			icon: Zap,
			title: "Interactive Projects",
			description: "Build real-world projects as you learn",
		},
	];

	return (
		<motion.div className="space-y-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
			{/* Main Empty State Card */}
			<Card className="adaptive-card p-12 text-center intelligence-glow">
				<div className="max-w-2xl mx-auto space-y-8">
					{/* AI Coach Interaction */}
					<motion.div className="space-y-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
						<motion.div
							animate={{
								y: [0, -10, 0],
								rotate: [0, 5, -5, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<AICoachAvatar size="xl" personality="warm" mood="encouraging" isActive={true} className="mx-auto" />
						</motion.div>

						<div className="space-y-4">
							<div className="ai-badge mx-auto text-lg px-6 py-3">
								<Sparkles className="w-5 h-5" />
								<span>Your Learning Journey Awaits!</span>
							</div>

							<h1 className="text-3xl lg:text-4xl font-bold text-foreground">Ready to Start Learning?</h1>
							<p className="text-lg text-muted-foreground max-w-xl mx-auto">Your AI tutor is excited to guide you through an amazing learning experience. Choose from thousands of courses designed to help you achieve your goals.</p>
						</div>
					</motion.div>

					{/* AI Message */}
					<motion.div
						className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/30 max-w-md mx-auto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<div className="flex items-start gap-4">
							<AICoachAvatar size="sm" personality="warm" mood="happy" />
							<div className="text-left">
								<p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Hi there! I'm your AI learning companion.</p>
								<p className="text-xs text-blue-600 dark:text-blue-300">I'll help you choose the perfect courses and guide you every step of the way. Let's discover what sparks your curiosity!</p>
							</div>
						</div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
						<Link href="/courses">
							<EnhancedButton variant="ai-primary" size="lg" withGlow aiPersonality="warm" className="group">
								<BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
								Explore All Courses
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</EnhancedButton>
						</Link>

						<EnhancedButton variant="adaptive" size="lg" className="group">
							<Compass className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
							Take Skills Assessment
						</EnhancedButton>
					</motion.div>

					{/* Trust Indicators */}
					<motion.div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">1000+</div>
							<div className="text-xs text-muted-foreground">Courses</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">50K+</div>
							<div className="text-xs text-muted-foreground">Students</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary">4.9★</div>
							<div className="text-xs text-muted-foreground">Rating</div>
						</div>
					</motion.div>
				</div>
			</Card>

			{/* Course Categories Preview */}
			<motion.div className="space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
				<div className="text-center">
					<h2 className="text-2xl font-bold text-foreground mb-2">Popular Learning Paths</h2>
					<p className="text-muted-foreground">Discover courses in these trending categories</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{courseCategories.map((category, index) => (
						<motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
							<Card className="adaptive-card hover:shadow-lg transition-all duration-300 group cursor-pointer">
								<CardContent className="p-6 text-center space-y-4">
									<motion.div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`} whileHover={{ scale: 1.05, rotate: 5 }}>
										<category.icon className="w-8 h-8 text-white" />
									</motion.div>

									<div>
										<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{category.title}</h3>
										<p className="text-sm text-muted-foreground mt-1">{category.description}</p>
									</div>

									<Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
										{category.courses}
									</Badge>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Features Grid */}
			<motion.div className="space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
				<div className="text-center">
					<h2 className="text-2xl font-bold text-foreground mb-2">Why Choose EduMattor?</h2>
					<p className="text-muted-foreground">Experience the future of personalized learning</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, index) => (
						<motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + index * 0.1 }}>
							<Card className="adaptive-card p-6 text-center hover:shadow-lg transition-all duration-300 group">
								<CardContent className="p-0 space-y-4">
									<motion.div className="w-12 h-12 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center group-hover:shadow-lg transition-shadow" whileHover={{ scale: 1.1, rotate: 10 }}>
										<feature.icon className="w-6 h-6 text-white" />
									</motion.div>

									<div>
										<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
										<p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</motion.div>

			{/* Final CTA */}
			<motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
				<Card className="adaptive-card p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200/30">
					<CardContent className="p-0 space-y-4">
						<div className="flex items-center justify-center gap-2 mb-3">
							<Heart className="w-5 h-5 text-red-500" />
							<span className="font-semibold text-foreground">Ready to transform your future?</span>
						</div>
						<p className="text-muted-foreground max-w-md mx-auto">Join thousands of learners who are already building amazing careers with AI-powered education.</p>
						<Link href="/courses">
							<EnhancedButton variant="ai-primary" withGlow className="group">
								<Star className="w-4 h-4 mr-2" />
								Start Your Journey Today
								<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
							</EnhancedButton>
						</Link>
					</CardContent>
				</Card>
			</motion.div>
		</motion.div>
	);
};

export default EmptyCoursesState;
