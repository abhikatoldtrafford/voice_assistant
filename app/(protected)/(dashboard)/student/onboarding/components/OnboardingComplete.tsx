"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { Trophy, Sparkles, ArrowRight, CheckCircle2, Heart, Zap, Target, Brain, Star, Rocket, Gift, BookOpen, Users, Clock, TrendingUp, Award, Smile, MessageCircle, Calendar, Play } from "lucide-react";

interface OnboardingCompleteProps {
	onNext: (data?: any) => void;
	onPrevious: () => void;
	canGoBack: boolean;
	isVoiceEnabled: boolean;
	userData: any;
	onboardingData: any;
}

export default function OnboardingComplete({ onNext, onPrevious, canGoBack, isVoiceEnabled, userData, onboardingData }: OnboardingCompleteProps) {
	const [showConfetti, setShowConfetti] = useState(false);
	const [achievementIndex, setAchievementIndex] = useState(0);
	const [personalizedMessage, setPersonalizedMessage] = useState("");

	const achievements = [
		{
			id: "onboarding-complete",
			title: "Welcome Aboard!",
			description: "Completed the onboarding journey",
			icon: Trophy,
			color: "from-yellow-500 to-orange-500",
			points: 100,
		},
		{
			id: "ai-connection",
			title: "AI Companion",
			description: "Connected with your AI coach",
			icon: Heart,
			color: "from-pink-500 to-rose-500",
			points: 50,
		},
		{
			id: "preferences-set",
			title: "Personalized Setup",
			description: "Customized your learning preferences",
			icon: Star,
			color: "from-blue-500 to-indigo-500",
			points: 75,
		},
		{
			id: "goals-defined",
			title: "Goal Setter",
			description: "Defined your learning objectives",
			icon: Target,
			color: "from-green-500 to-emerald-500",
			points: 75,
		},
	];

	const quickStats = [
		{
			icon: BookOpen,
			label: "Courses Available",
			value: "500+",
			description: "Ready to explore",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: Users,
			label: "Learning Community",
			value: "10K+",
			description: "Students worldwide",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Clock,
			label: "AI Coach Availability",
			value: "24/7",
			description: "Always here for you",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: TrendingUp,
			label: "Success Rate",
			value: "95%",
			description: "Student satisfaction",
			color: "from-orange-500 to-red-500",
		},
	];

	const nextSteps = [
		{
			title: "Explore Course Catalog",
			description: "Browse our extensive library of courses",
			icon: BookOpen,
			action: "Browse Courses",
			color: "from-blue-500 to-indigo-500",
		},
		{
			title: "Take a Skill Assessment",
			description: "Get personalized course recommendations",
			icon: Target,
			action: "Start Assessment",
			color: "from-green-500 to-emerald-500",
		},
		{
			title: "Join Study Groups",
			description: "Connect with fellow learners",
			icon: Users,
			action: "Find Groups",
			color: "from-purple-500 to-pink-500",
		},
		{
			title: "Schedule Learning Time",
			description: "Set up your study schedule",
			icon: Calendar,
			action: "Set Schedule",
			color: "from-orange-500 to-red-500",
		},
	];

	useEffect(() => {
		// Trigger confetti animation
		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 3000);

		// Generate personalized message based on onboarding data
		const coachPersonality = onboardingData.welcome?.coachPersonality || "warm";
		const hasGoals = onboardingData.goals?.shortTerm?.length > 0;
		const learningStyle = onboardingData.preferences?.learningStyle || "visual";

		let message = "";
		switch (coachPersonality) {
			case "warm":
				message = hasGoals
					? `I'm so excited to help you achieve your learning goals! As a ${learningStyle} learner, I've prepared some amazing visual content just for you.`
					: `Welcome to your learning journey! I can't wait to discover what sparks your curiosity and help you grow.`;
				break;
			case "energetic":
				message = `WOW! You're all set to CRUSH your learning goals! 🚀 Let's turn your ${learningStyle} learning style into your superpower!`;
				break;
			case "focused":
				message = `Setup complete. Your ${learningStyle} learning preferences have been optimized. Ready to begin efficient skill acquisition.`;
				break;
			case "wise":
				message = `A journey of a thousand miles begins with a single step. You've taken that step today, and I'm honored to guide you forward.`;
				break;
			default:
				message = "Your personalized learning experience is ready! Let's begin this exciting journey together.";
		}
		setPersonalizedMessage(message);

		// Stagger achievement animations
		const interval = setInterval(() => {
			setAchievementIndex((prev) => (prev + 1) % achievements.length);
		}, 2000);

		return () => clearInterval(interval);
	}, [onboardingData]);

	const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
	const coachPersonality = onboardingData.welcome?.coachPersonality || "warm";

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Confetti Animation */}
			<AnimatePresence>
				{showConfetti && (
					<div className="fixed inset-0 pointer-events-none z-50">
						{[...Array(50)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-3 h-3 rounded-full"
								style={{
									backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"][i % 6],
									left: `${Math.random() * 100}%`,
									top: "-10px",
								}}
								animate={{
									y: [0, window.innerHeight + 100],
									x: [0, (Math.random() - 0.5) * 200],
									rotate: [0, 360],
									scale: [1, 0],
								}}
								transition={{
									duration: 3 + Math.random() * 2,
									ease: "easeOut",
									delay: Math.random() * 0.5,
								}}
							/>
						))}
					</div>
				)}
			</AnimatePresence>

			{/* Success Header */}
			<motion.div className="text-center space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
				<motion.div
					className="relative inline-block"
					animate={{
						scale: [1, 1.1, 1],
						rotate: [0, 5, -5, 0],
					}}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative overflow-hidden">
						<Trophy className="w-16 h-16 text-white" />

						{/* Sparkle effects */}
						<motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />

						{/* Floating sparkles */}
						{[...Array(8)].map((_, i) => (
							<motion.div
								key={i}
								className="absolute w-2 h-2 bg-white rounded-full"
								style={{
									left: `${20 + Math.cos((i * 45 * Math.PI) / 180) * 40}%`,
									top: `${20 + Math.sin((i * 45 * Math.PI) / 180) * 40}%`,
								}}
								animate={{
									scale: [0, 1, 0],
									opacity: [0, 1, 0],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									delay: i * 0.25,
								}}
							/>
						))}
					</div>
				</motion.div>

				<div className="space-y-4">
					<motion.h1 className="text-5xl font-bold text-foreground" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
						🎉 You're All Set! 🎉
					</motion.h1>

					<motion.p className="text-xl text-muted-foreground max-w-3xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
						Congratulations! Your personalized learning experience is ready to begin. You've earned <span className="font-bold text-primary">{totalPoints} points</span> just for getting started!
					</motion.p>

					<div className="flex justify-center gap-3">
						<Badge className="ai-badge text-lg px-4 py-2">
							<Sparkles className="w-4 h-4 mr-2" />
							Setup Complete
						</Badge>
						<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-lg px-4 py-2">
							<CheckCircle2 className="w-4 h-4 mr-2" />
							Ready to Learn
						</Badge>
					</div>
				</div>
			</motion.div>

			{/* AI Coach Personalized Message */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
				<Card className="adaptive-card border-blue-200 dark:border-blue-800 max-w-4xl mx-auto">
					<CardContent className="p-8">
						<div className="flex items-start gap-6">
							<motion.div
								animate={{
									scale: [1, 1.05, 1],
									rotate: [0, 2, -2, 0],
								}}
								transition={{ duration: 4, repeat: Infinity }}
							>
								<AICoachAvatar size="xl" personality={coachPersonality as any} mood="celebrating" isActive={true} />
							</motion.div>

							<div className="flex-1 space-y-4">
								<div className="flex items-center gap-2">
									<h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">Your AI Coach Says:</h3>
									<Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
										<MessageCircle className="w-3 h-3 mr-1" />
										Personalized
									</Badge>
								</div>

								<motion.p className="text-blue-700 dark:text-blue-300 text-lg leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}>
									{personalizedMessage}
								</motion.p>

								<div className="flex items-center gap-4 pt-2">
									<EnhancedButton variant="adaptive" size="sm" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
										<Play className="w-4 h-4 mr-1" />
										Hear Voice Message
									</EnhancedButton>
									<span className="text-sm text-blue-600 dark:text-blue-400">🎯 Personalized based on your preferences</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Achievement Gallery */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-foreground mb-2">Your First Achievements!</h2>
							<p className="text-muted-foreground">You've unlocked these badges during onboarding</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{achievements.map((achievement, index) => (
								<motion.div key={achievement.id} className="relative" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 + index * 0.2, duration: 0.5 }}>
									<Card className={`text-center p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${index === achievementIndex ? "ring-2 ring-primary shadow-lg" : ""}`}>
										<CardContent className="p-0 space-y-3">
											<div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${achievement.color} flex items-center justify-center relative overflow-hidden`}>
												<achievement.icon className="w-8 h-8 text-white" />

												{index === achievementIndex && <motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" animate={{ x: [-64, 64] }} transition={{ duration: 1.5, repeat: Infinity }} />}
											</div>

											<div>
												<h4 className="font-bold text-foreground text-sm">{achievement.title}</h4>
												<p className="text-xs text-muted-foreground">{achievement.description}</p>
												<div className="flex items-center justify-center gap-1 mt-2">
													<Star className="w-3 h-3 text-yellow-500" />
													<span className="text-xs font-medium">{achievement.points} pts</span>
												</div>
											</div>
										</CardContent>
									</Card>

									{/* New badge indicator */}
									<motion.div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.3 + index * 0.2 }}>
										<Gift className="w-3 h-3 text-white" />
									</motion.div>
								</motion.div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Platform Overview Stats */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-foreground mb-2">What Awaits You</h2>
							<p className="text-muted-foreground">Explore the amazing learning ecosystem you now have access to</p>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							{quickStats.map((stat, index) => (
								<motion.div key={stat.label} className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 + index * 0.1 }} whileHover={{ scale: 1.05 }}>
									<div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
										<stat.icon className="w-8 h-8 text-white" />
									</div>
									<div className="space-y-1">
										<p className="text-2xl font-bold text-foreground">{stat.value}</p>
										<p className="text-sm font-medium text-foreground">{stat.label}</p>
										<p className="text-xs text-muted-foreground">{stat.description}</p>
									</div>
								</motion.div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Next Steps */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-foreground mb-2">Your Next Adventures</h2>
							<p className="text-muted-foreground">Here are some great ways to start your learning journey</p>
						</div>

						<div className="grid md:grid-cols-2 gap-4">
							{nextSteps.map((step, index) => (
								<motion.div key={step.title} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.9 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
									<Card className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group">
										<CardContent className="p-0">
											<div className="flex items-center gap-4">
												<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
													<step.icon className="w-6 h-6 text-white" />
												</div>
												<div className="flex-1">
													<h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{step.title}</h4>
													<p className="text-sm text-muted-foreground">{step.description}</p>
												</div>
												<ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Action Buttons */}
			<motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.6 }}>
				<EnhancedButton variant="ai-primary" size="lg" onClick={() => onNext()} className="flex-1 max-w-md text-lg py-4" withGlow aiPersonality="energetic">
					<Rocket className="w-5 h-5 mr-2" />
					Start My Learning Journey!
					<Sparkles className="w-5 h-5 ml-2" />
				</EnhancedButton>

				{canGoBack && (
					<EnhancedButton variant="outline" size="lg" onClick={onPrevious} className="max-w-xs">
						← Go Back
					</EnhancedButton>
				)}
			</motion.div>

			{/* Fun Footer Message */}
			<motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.6 }}>
				<p className="text-muted-foreground italic">"The beautiful thing about learning is that no one can take it away from you." - B.B. King</p>
				<div className="flex justify-center gap-2 mt-2">
					{[...Array(5)].map((_, i) => (
						<motion.div key={i} animate={{ scale: [1, 1.2, 1] }} transition={{ delay: 2.5 + i * 0.1, duration: 0.3 }}>
							⭐
						</motion.div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
