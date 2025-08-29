"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import {
	Target,
	Plus,
	X,
	ArrowRight,
	Star,
	Clock,
	Calendar,
	Zap,
	Brain,
	Trophy,
	Heart,
	Lightbulb,
	TrendingUp,
	BookOpen,
	Code,
	Palette,
	Music,
	Camera,
	Globe,
	Briefcase,
	GraduationCap,
	Award,
	Users,
	Sparkles,
	CheckCircle2,
	AlertCircle,
	Rocket,
	Coffee,
	Mountain,
	Flame,
} from "lucide-react";

interface LearningGoalsSetupProps {
	onNext: (data?: any) => void;
	onPrevious: () => void;
	canGoBack: boolean;
	isVoiceEnabled: boolean;
	userData: any;
	onboardingData: any;
}

export default function LearningGoalsSetup({ onNext, onPrevious, canGoBack, isVoiceEnabled, userData, onboardingData }: LearningGoalsSetupProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [shortTermGoals, setShortTermGoals] = useState<string[]>([]);
	const [longTermGoals, setLongTermGoals] = useState<string[]>([]);
	const [skillsToLearn, setSkillsToLearn] = useState<string[]>([]);
	const [certificationGoals, setCertificationGoals] = useState<string[]>([]);
	const [careerObjectives, setCareerObjectives] = useState<string[]>([]);
	const [weeklyHours, setWeeklyHours] = useState(10);
	const [targetDate, setTargetDate] = useState("");
	const [motivation, setMotivation] = useState("");

	const [newGoal, setNewGoal] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("short-term");
	const [showSuggestions, setShowSuggestions] = useState(true);
	const [completionScore, setCompletionScore] = useState(0);

	const goalCategories = [
		{
			id: "short-term",
			title: "Short-term Goals",
			subtitle: "Next 3-6 months",
			icon: Target,
			color: "from-blue-500 to-cyan-500",
			goals: shortTermGoals,
			setGoals: setShortTermGoals,
			placeholder: "e.g., Complete Python basics course",
		},
		{
			id: "long-term",
			title: "Long-term Vision",
			subtitle: "6+ months ahead",
			icon: Star,
			color: "from-purple-500 to-pink-500",
			goals: longTermGoals,
			setGoals: setLongTermGoals,
			placeholder: "e.g., Become a Data Scientist",
		},
		{
			id: "skills",
			title: "Skills to Master",
			subtitle: "Technical & soft skills",
			icon: Brain,
			color: "from-green-500 to-emerald-500",
			goals: skillsToLearn,
			setGoals: setSkillsToLearn,
			placeholder: "e.g., JavaScript, Leadership",
		},
		{
			id: "certifications",
			title: "Certifications",
			subtitle: "Professional credentials",
			icon: Award,
			color: "from-orange-500 to-red-500",
			goals: certificationGoals,
			setGoals: setCertificationGoals,
			placeholder: "e.g., AWS Cloud Practitioner",
		},
		{
			id: "career",
			title: "Career Objectives",
			subtitle: "Professional aspirations",
			icon: Briefcase,
			color: "from-indigo-500 to-purple-500",
			goals: careerObjectives,
			setGoals: setCareerObjectives,
			placeholder: "e.g., Get promoted to Senior Developer",
		},
	];

	const popularGoals = {
		"short-term": ["Complete a programming course", "Learn a new language", "Master Excel/Google Sheets", "Improve presentation skills", "Build my first website", "Learn data analysis basics"],
		"long-term": ["Switch to tech career", "Start my own business", "Become a team leader", "Master machine learning", "Become a full-stack developer", "Get into product management"],
		skills: ["Python programming", "Public speaking", "Project management", "Digital marketing", "UI/UX design", "Data visualization", "Communication skills", "Time management"],
		certifications: ["Google Analytics", "AWS Cloud Practitioner", "PMP Certification", "Google Ads Certification", "Salesforce Admin", "Microsoft Azure", "Scrum Master", "HubSpot Certification"],
		career: ["Get promoted", "Change career paths", "Increase salary by 20%", "Lead a team", "Work remotely", "Join a startup", "Become a consultant", "Start freelancing"],
	};

	const motivationOptions = [
		{
			id: "career-change",
			title: "Career Transition",
			description: "Looking to switch to a new field or role",
			icon: TrendingUp,
			color: "from-blue-500 to-indigo-500",
		},
		{
			id: "skill-upgrade",
			title: "Skill Enhancement",
			description: "Want to improve existing skills and stay current",
			icon: Zap,
			color: "from-green-500 to-emerald-500",
		},
		{
			id: "personal-growth",
			title: "Personal Development",
			description: "Learning for personal satisfaction and growth",
			icon: Heart,
			color: "from-pink-500 to-rose-500",
		},
		{
			id: "promotion",
			title: "Career Advancement",
			description: "Aiming for a promotion or leadership role",
			icon: Trophy,
			color: "from-yellow-500 to-orange-500",
		},
		{
			id: "entrepreneurship",
			title: "Start a Business",
			description: "Building skills to launch my own venture",
			icon: Rocket,
			color: "from-purple-500 to-pink-500",
		},
		{
			id: "curiosity",
			title: "Pure Curiosity",
			description: "Love learning new things and exploring ideas",
			icon: Lightbulb,
			color: "from-orange-500 to-red-500",
		},
	];

	const timeCommitmentOptions = [
		{ hours: 5, label: "Light", description: "5 hours/week - Perfect for busy schedules", icon: Coffee },
		{ hours: 10, label: "Moderate", description: "10 hours/week - Balanced learning pace", icon: Clock },
		{ hours: 15, label: "Intensive", description: "15 hours/week - Accelerated progress", icon: Flame },
		{ hours: 20, label: "Immersive", description: "20+ hours/week - Maximum learning", icon: Mountain },
	];

	useEffect(() => {
		// Calculate completion score
		const totalGoals = shortTermGoals.length + longTermGoals.length + skillsToLearn.length + certificationGoals.length + careerObjectives.length;
		const hasMotivation = motivation.length > 0;
		const hasTimeCommitment = weeklyHours > 0;

		let score = 0;
		if (totalGoals >= 3) score += 40;
		if (totalGoals >= 6) score += 20;
		if (hasMotivation) score += 25;
		if (hasTimeCommitment) score += 15;

		setCompletionScore(score);
	}, [shortTermGoals, longTermGoals, skillsToLearn, certificationGoals, careerObjectives, motivation, weeklyHours]);

	const currentCategory = goalCategories.find((cat) => cat.id === selectedCategory);

	const addGoal = () => {
		if (newGoal.trim() && currentCategory) {
			const goals = currentCategory.goals;
			if (!goals.includes(newGoal.trim())) {
				currentCategory.setGoals([...goals, newGoal.trim()]);
				setNewGoal("");
			}
		}
	};

	const removeGoal = (category: string, goal: string) => {
		const cat = goalCategories.find((c) => c.id === category);
		if (cat) {
			cat.setGoals(cat.goals.filter((g) => g !== goal));
		}
	};

	const addSuggestedGoal = (goal: string) => {
		if (currentCategory && !currentCategory.goals.includes(goal)) {
			currentCategory.setGoals([...currentCategory.goals, goal]);
		}
	};

	const handleContinue = () => {
		onNext({
			shortTerm: shortTermGoals,
			longTerm: longTermGoals,
			skillsToLearn,
			certificationGoals,
			careerObjectives,
			weeklyHoursGoal: weeklyHours,
			targetCompletionDate: targetDate ? new Date(targetDate) : undefined,
			motivation,
			completionScore,
		});
	};

	const getTotalGoalsCount = () => {
		return shortTermGoals.length + longTermGoals.length + skillsToLearn.length + certificationGoals.length + careerObjectives.length;
	};

	const coachPersonality = onboardingData.welcome?.coachPersonality || "warm";

	const getCoachMessage = () => {
		const totalGoals = getTotalGoalsCount();

		switch (coachPersonality) {
			case "warm":
				return totalGoals === 0
					? "I'm here to help you discover what excites you! Take your time thinking about what you'd love to learn. There's no rush - we'll figure this out together! 💫"
					: `I love seeing your ambition! ${totalGoals} goals shows you're really committed to growth. I'm so excited to help you achieve every single one! 🌟`;
			case "energetic":
				return totalGoals === 0
					? "Let's GET those goals flowing! 🚀 Think big, dream bigger! What's going to make you UNSTOPPABLE? I'm here to cheer you on every step!"
					: `AMAZING! ${totalGoals} goals?! You're on FIRE! 🔥 This energy is exactly what it takes to CRUSH your learning journey! Let's GO!`;
			case "focused":
				return totalGoals === 0
					? "Clear objectives drive effective learning. Consider your current skills, desired outcomes, and timeline. I'll optimize your path once we define targets."
					: `${totalGoals} defined objectives. Good foundation. I'll create an efficient learning sequence to maximize your goal achievement rate.`;
			case "wise":
				return totalGoals === 0
					? "The journey of a thousand miles begins with knowing your destination. Take time to reflect on what truly matters to your growth."
					: `${totalGoals} aspirations show thoughtful planning. Remember, the goal is not just to learn, but to become who you're meant to be.`;
			default:
				return "Let's define your learning goals together! What would you like to achieve?";
		}
	};

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			{/* Header */}
			<motion.div className="text-center space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
				<motion.div
					className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center"
					animate={{
						scale: [1, 1.1, 1],
						boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 20px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0.4)"],
					}}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<Target className="w-10 h-10 text-white" />
				</motion.div>

				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-foreground">Define Your Learning Goals</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Let's map out your learning journey with clear, achievable objectives</p>
				</div>

				<div className="flex justify-center gap-2">
					<Badge className={`${completionScore >= 80 ? "ai-badge" : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"}`}>
						<Target className="w-3 h-3 mr-1" />
						{completionScore}% Complete
					</Badge>
					<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
						<CheckCircle2 className="w-3 h-3 mr-1" />
						{getTotalGoalsCount()} Goals Set
					</Badge>
				</div>
			</motion.div>

			{/* AI Coach Message */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
				<Card className="adaptive-card border-green-200 dark:border-green-800 max-w-4xl mx-auto">
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<motion.div
								animate={{
									scale: [1, 1.05, 1],
									rotate: [0, 2, -2, 0],
								}}
								transition={{ duration: 4, repeat: Infinity }}
							>
								<AICoachAvatar size="lg" personality={coachPersonality as any} mood="encouraging" isActive={true} />
							</motion.div>

							<div className="flex-1 space-y-3">
								<div className="flex items-center gap-2">
									<h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Your AI Coach</h3>
									<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
										<Heart className="w-3 h-3 mr-1" />
										Encouraging
									</Badge>
								</div>

								<motion.p
									className="text-green-700 dark:text-green-300 leading-relaxed"
									key={getTotalGoalsCount()} // Re-animate when goals change
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								>
									{getCoachMessage()}
								</motion.p>
							</div>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Goal Categories */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="space-y-6">
							{/* Category Selector */}
							<div className="flex flex-wrap gap-2 justify-center">
								{goalCategories.map((category, index) => (
									<motion.button
										key={category.id}
										onClick={() => setSelectedCategory(category.id)}
										className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 ${
											selectedCategory === category.id ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105` : "hover:bg-white/50 dark:hover:bg-gray-800/30"
										}`}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.7 + index * 0.1 }}
										whileHover={{ scale: selectedCategory === category.id ? 1.05 : 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<category.icon className="w-5 h-5" />
										<div className="text-left">
											<p className="font-medium text-sm">{category.title}</p>
											<p className="text-xs opacity-80">{category.subtitle}</p>
										</div>
										<Badge variant="secondary" className={`text-xs ${selectedCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-800"}`}>
											{category.goals.length}
										</Badge>
									</motion.button>
								))}
							</div>

							{/* Current Category Goals */}
							{currentCategory && (
								<motion.div key={selectedCategory} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
									<div className="text-center">
										<h3 className="text-xl font-semibold text-foreground mb-2">{currentCategory.title}</h3>
										<p className="text-muted-foreground">{currentCategory.subtitle}</p>
									</div>

									{/* Add New Goal */}
									<div className="flex gap-2 max-w-2xl mx-auto">
										<Input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder={currentCategory.placeholder} onKeyPress={(e) => e.key === "Enter" && addGoal()} className="flex-1" />
										<EnhancedButton onClick={addGoal} disabled={!newGoal.trim()} variant="ai-primary">
											<Plus className="w-4 h-4 mr-1" />
											Add
										</EnhancedButton>
									</div>

									{/* Current Goals */}
									<div className="space-y-2 max-w-4xl mx-auto">
										<AnimatePresence>
											{currentCategory.goals.map((goal, index) => (
												<motion.div
													key={goal}
													initial={{ opacity: 0, scale: 0.9, y: -10 }}
													animate={{ opacity: 1, scale: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.9, y: -10 }}
													transition={{ duration: 0.3 }}
													className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all group"
												>
													<div className="flex items-center gap-3">
														<div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentCategory.color} flex items-center justify-center`}>
															<CheckCircle2 className="w-4 h-4 text-white" />
														</div>
														<span className="text-foreground">{goal}</span>
													</div>
													<motion.button
														onClick={() => removeGoal(selectedCategory, goal)}
														className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all"
														whileHover={{ scale: 1.1 }}
														whileTap={{ scale: 0.9 }}
													>
														<X className="w-4 h-4" />
													</motion.button>
												</motion.div>
											))}
										</AnimatePresence>
									</div>

									{/* Popular Suggestions */}
									{showSuggestions && popularGoals[selectedCategory as keyof typeof popularGoals] && (
										<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-4xl mx-auto">
											<div className="text-center mb-3">
												<p className="text-sm text-muted-foreground">Popular choices:</p>
											</div>
											<div className="flex flex-wrap gap-2 justify-center">
												{popularGoals[selectedCategory as keyof typeof popularGoals]
													.filter((suggestion) => !currentCategory.goals.includes(suggestion))
													.slice(0, 6)
													.map((suggestion, index) => (
														<motion.button
															key={suggestion}
															onClick={() => addSuggestedGoal(suggestion)}
															className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-full hover:bg-primary hover:text-white transition-all duration-200"
															initial={{ opacity: 0, scale: 0.8 }}
															animate={{ opacity: 1, scale: 1 }}
															transition={{ delay: 0.5 + index * 0.1 }}
															whileHover={{ scale: 1.05 }}
															whileTap={{ scale: 0.95 }}
														>
															+ {suggestion}
														</motion.button>
													))}
											</div>
										</motion.div>
									)}
								</motion.div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Learning Commitment */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-foreground mb-2">Time Commitment</h2>
							<p className="text-muted-foreground">How much time can you dedicate to learning each week?</p>
						</div>

						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
							{timeCommitmentOptions.map((option, index) => (
								<motion.button
									key={option.hours}
									onClick={() => setWeeklyHours(option.hours)}
									className={`p-4 rounded-xl border-2 transition-all duration-300 ${weeklyHours === option.hours ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 1.1 + index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="text-center space-y-3">
										<div className={`w-12 h-12 mx-auto rounded-xl ${weeklyHours === option.hours ? "bg-gradient-primary" : "bg-gray-100 dark:bg-gray-800"} flex items-center justify-center`}>
											<option.icon className={`w-6 h-6 ${weeklyHours === option.hours ? "text-white" : "text-muted-foreground"}`} />
										</div>
										<div>
											<p className="font-semibold text-foreground">{option.label}</p>
											<p className="text-xs text-muted-foreground mt-1">{option.description}</p>
										</div>
										{weeklyHours === option.hours && (
											<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center">
												<CheckCircle2 className="w-5 h-5 text-primary" />
											</motion.div>
										)}
									</div>
								</motion.button>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Motivation */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }}>
				<Card className="adaptive-card">
					<CardContent className="p-6">
						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-foreground mb-2">What Drives You?</h2>
							<p className="text-muted-foreground">Understanding your motivation helps us create the perfect learning experience</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
							{motivationOptions.map((option, index) => (
								<motion.button
									key={option.id}
									onClick={() => setMotivation(option.id)}
									className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${motivation === option.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.5 + index * 0.1 }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-start gap-3">
										<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center flex-shrink-0`}>
											<option.icon className="w-6 h-6 text-white" />
										</div>
										<div className="flex-1">
											<h4 className="font-semibold text-foreground mb-1">{option.title}</h4>
											<p className="text-sm text-muted-foreground">{option.description}</p>
										</div>
										{motivation === option.id && (
											<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex-shrink-0">
												<CheckCircle2 className="w-5 h-5 text-primary" />
											</motion.div>
										)}
									</div>
								</motion.button>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Progress Summary */}
			{getTotalGoalsCount() > 0 && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.6 }}>
					<Card className="adaptive-card border-blue-200 dark:border-blue-800">
						<CardContent className="p-6">
							<div className="text-center mb-4">
								<h3 className="text-xl font-semibold text-foreground mb-2">Your Learning Blueprint</h3>
								<p className="text-muted-foreground">Here's what you're planning to achieve</p>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
								{goalCategories.map(
									(category, index) =>
										category.goals.length > 0 && (
											<motion.div key={category.id} className="text-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.9 + index * 0.1 }}>
												<div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
													<category.icon className="w-6 h-6 text-white" />
												</div>
												<p className="font-semibold text-foreground text-sm">{category.title}</p>
												<p className="text-2xl font-bold text-primary">{category.goals.length}</p>
												<p className="text-xs text-muted-foreground">goals set</p>
											</motion.div>
										)
								)}
							</div>

							<div className="mt-6 text-center">
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
									<Clock className="w-4 h-4" />
									<span className="font-medium">{weeklyHours} hours/week commitment</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Navigation */}
			<motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.6 }}>
				{canGoBack && (
					<EnhancedButton variant="outline" onClick={onPrevious} className="max-w-xs">
						← Previous Step
					</EnhancedButton>
				)}

				<EnhancedButton variant={completionScore >= 60 ? "ai-primary" : "adaptive"} onClick={handleContinue} disabled={getTotalGoalsCount() === 0} className="flex-1 max-w-md" withGlow={completionScore >= 80}>
					{getTotalGoalsCount() === 0 ? (
						<>
							<AlertCircle className="w-4 h-4 mr-2" />
							Set at least 1 goal to continue
						</>
					) : (
						<>
							Continue to Final Step
							<ArrowRight className="w-4 h-4 ml-2" />
						</>
					)}
				</EnhancedButton>
			</motion.div>

			{/* Helpful Tips */}
			<motion.div className="text-center py-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.6 }}>
				<div className="max-w-2xl mx-auto space-y-3">
					<p className="text-muted-foreground text-sm">
						💡 <strong>Pro Tip:</strong> Start with 2-3 goals in each category. You can always add more later!
					</p>
					<div className="flex justify-center gap-4 text-xs text-muted-foreground">
						<span>✨ Goals can be updated anytime</span>
						<span>🎯 AI will suggest relevant courses</span>
						<span>📈 Track progress automatically</span>
					</div>
				</div>
			</motion.div>

			{/* Floating Action Button for Mobile */}
			{getTotalGoalsCount() > 0 && (
				<motion.div className="fixed bottom-6 right-6 md:hidden z-50" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5 }}>
					<EnhancedButton variant="ai-primary" onClick={handleContinue} className="w-14 h-14 rounded-full p-0 shadow-floating" withGlow>
						<ArrowRight className="w-6 h-6" />
					</EnhancedButton>
				</motion.div>
			)}
		</div>
	);
}
