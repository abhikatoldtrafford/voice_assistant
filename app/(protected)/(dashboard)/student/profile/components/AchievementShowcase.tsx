// app/(protected)/(dashboard)/student/profile/components/AchievementShowcase.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Trophy,
	Star,
	Medal,
	Award,
	Target,
	Zap,
	Heart,
	Brain,
	BookOpen,
	Clock,
	TrendingUp,
	Sparkles,
	Crown,
	Shield,
	Flame,
	Lock,
	CheckCircle2,
	Calendar,
	Share2,
	Download,
	Users,
	Coffee,
	Mountain,
	Rocket,
	Diamond,
	Gem,
	Sunrise,
	Moon,
	Activity,
	BarChart3,
	Headphones,
	Code,
	Database,
	Globe,
	Camera,
	Palette,
	Music,
	Gift,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface AchievementShowcaseProps {
	userData: IUserProfileData;
	detailed?: boolean;
}

interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: any;
	category: string;
	rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
	unlockedDate?: string;
	progress: number;
	gradient: string;
	points: number;
	locked?: boolean;
	requirement?: {
		type: string;
		value: number;
		current: number;
	};
}

export default function AchievementShowcase({ userData, detailed = false }: AchievementShowcaseProps) {
	const [selectedCategory, setSelectedCategory] = useState("all");

	// Generate dynamic achievements based on user data
	const achievements = useMemo(() => {
		const baseAchievements: Achievement[] = [
			// Learning Milestones
			{
				id: "first-course",
				title: "First Steps",
				description: "Completed your first course",
				icon: BookOpen,
				category: "milestone",
				rarity: "common",
				unlockedDate: userData.learningStats.coursesCompleted > 0 ? "2024-01-20" : undefined,
				progress: userData.learningStats.coursesCompleted > 0 ? 100 : 0,
				gradient: "from-green-500 to-emerald-500",
				points: 100,
				locked: userData.learningStats.coursesCompleted === 0,
				requirement: {
					type: "courses_completed",
					value: 1,
					current: userData.learningStats.coursesCompleted,
				},
			},
			{
				id: "course-collector",
				title: "Course Collector",
				description: "Completed 5 courses",
				icon: Trophy,
				category: "milestone",
				rarity: "uncommon",
				unlockedDate: userData.learningStats.coursesCompleted >= 5 ? "2024-02-15" : undefined,
				progress: Math.min((userData.learningStats.coursesCompleted / 5) * 100, 100),
				gradient: "from-blue-500 to-indigo-500",
				points: 250,
				locked: userData.learningStats.coursesCompleted < 5,
				requirement: {
					type: "courses_completed",
					value: 5,
					current: userData.learningStats.coursesCompleted,
				},
			},
			{
				id: "learning-machine",
				title: "Learning Machine",
				description: "Completed 10 courses",
				icon: Crown,
				category: "milestone",
				rarity: "rare",
				unlockedDate: userData.learningStats.coursesCompleted >= 10 ? "2024-03-10" : undefined,
				progress: Math.min((userData.learningStats.coursesCompleted / 10) * 100, 100),
				gradient: "from-purple-500 to-pink-500",
				points: 500,
				locked: userData.learningStats.coursesCompleted < 10,
				requirement: {
					type: "courses_completed",
					value: 10,
					current: userData.learningStats.coursesCompleted,
				},
			},

			// Streak Achievements
			{
				id: "week-warrior",
				title: "Week Warrior",
				description: "7-day learning streak",
				icon: Flame,
				category: "streak",
				rarity: "uncommon",
				unlockedDate: userData.learningStats.currentStreak >= 7 || userData.learningStats.longestStreak >= 7 ? "2024-02-05" : undefined,
				progress: Math.min((Math.max(userData.learningStats.currentStreak, userData.learningStats.longestStreak) / 7) * 100, 100),
				gradient: "from-orange-500 to-red-500",
				points: 200,
				locked: userData.learningStats.currentStreak < 7 && userData.learningStats.longestStreak < 7,
				requirement: {
					type: "streak_days",
					value: 7,
					current: userData.learningStats.currentStreak,
				},
			},
			{
				id: "month-master",
				title: "Month Master",
				description: "30-day learning streak",
				icon: Diamond,
				category: "streak",
				rarity: "epic",
				unlockedDate: userData.learningStats.longestStreak >= 30 ? "2024-03-01" : undefined,
				progress: Math.min((Math.max(userData.learningStats.currentStreak, userData.learningStats.longestStreak) / 30) * 100, 100),
				gradient: "from-cyan-500 to-blue-500",
				points: 750,
				locked: userData.learningStats.currentStreak < 30 && userData.learningStats.longestStreak < 30,
				requirement: {
					type: "streak_days",
					value: 30,
					current: userData.learningStats.currentStreak,
				},
			},

			// Time-based Achievements
			{
				id: "dedicated-learner",
				title: "Dedicated Learner",
				description: "100 hours of learning",
				icon: Clock,
				category: "time",
				rarity: "rare",
				unlockedDate: userData.learningStats.totalLearningHours >= 100 ? "2024-04-01" : undefined,
				progress: Math.min((userData.learningStats.totalLearningHours / 100) * 100, 100),
				gradient: "from-indigo-500 to-purple-500",
				points: 400,
				locked: userData.learningStats.totalLearningHours < 100,
				requirement: {
					type: "learning_hours",
					value: 100,
					current: userData.learningStats.totalLearningHours,
				},
			},
			{
				id: "time-master",
				title: "Time Master",
				description: "500 hours of learning",
				icon: Mountain,
				category: "time",
				rarity: "legendary",
				unlockedDate: userData.learningStats.totalLearningHours >= 500 ? "2024-06-01" : undefined,
				progress: Math.min((userData.learningStats.totalLearningHours / 500) * 100, 100),
				gradient: "from-yellow-500 to-orange-500",
				points: 1500,
				locked: userData.learningStats.totalLearningHours < 500,
				requirement: {
					type: "learning_hours",
					value: 500,
					current: userData.learningStats.totalLearningHours,
				},
			},

			// AI Coach Achievements
			{
				id: "ai-companion",
				title: "AI Companion",
				description: "100 conversations with AI coach",
				icon: Heart,
				category: "social",
				rarity: "uncommon",
				unlockedDate: userData.aiCoachRelationship.totalInteractions >= 100 ? "2024-03-15" : undefined,
				progress: Math.min((userData.aiCoachRelationship.totalInteractions / 100) * 100, 100),
				gradient: "from-pink-500 to-rose-500",
				points: 300,
				locked: userData.aiCoachRelationship.totalInteractions < 100,
				requirement: {
					type: "ai_interactions",
					value: 100,
					current: userData.aiCoachRelationship.totalInteractions,
				},
			},
			{
				id: "ai-best-friend",
				title: "AI Best Friend",
				description: "500 conversations with AI coach",
				icon: Sparkles,
				category: "social",
				rarity: "epic",
				unlockedDate: userData.aiCoachRelationship.totalInteractions >= 500 ? "2024-05-01" : undefined,
				progress: Math.min((userData.aiCoachRelationship.totalInteractions / 500) * 100, 100),
				gradient: "from-purple-500 to-indigo-500",
				points: 800,
				locked: userData.aiCoachRelationship.totalInteractions < 500,
				requirement: {
					type: "ai_interactions",
					value: 500,
					current: userData.aiCoachRelationship.totalInteractions,
				},
			},

			// Skill Achievements
			{
				id: "skill-explorer",
				title: "Skill Explorer",
				description: "Acquired 10 skills",
				icon: Target,
				category: "skill",
				rarity: "uncommon",
				unlockedDate: userData.learningStats.skillsAcquired >= 10 ? "2024-02-20" : undefined,
				progress: Math.min((userData.learningStats.skillsAcquired / 10) * 100, 100),
				gradient: "from-green-500 to-cyan-500",
				points: 250,
				locked: userData.learningStats.skillsAcquired < 10,
				requirement: {
					type: "skills_acquired",
					value: 10,
					current: userData.learningStats.skillsAcquired,
				},
			},
			{
				id: "skill-master",
				title: "Skill Master",
				description: "Acquired 25 skills",
				icon: Gem,
				category: "skill",
				rarity: "rare",
				unlockedDate: userData.learningStats.skillsAcquired >= 25 ? "2024-04-10" : undefined,
				progress: Math.min((userData.learningStats.skillsAcquired / 25) * 100, 100),
				gradient: "from-emerald-500 to-teal-500",
				points: 600,
				locked: userData.learningStats.skillsAcquired < 25,
				requirement: {
					type: "skills_acquired",
					value: 25,
					current: userData.learningStats.skillsAcquired,
				},
			},

			// Learning Style Achievements
			{
				id: "early-bird",
				title: "Early Bird",
				description: "Prefers morning learning sessions",
				icon: Sunrise,
				category: "style",
				rarity: "common",
				unlockedDate: userData.learningPreferences.studyTime === "early-morning" || userData.learningPreferences.studyTime === "morning" ? "2024-01-25" : undefined,
				progress: userData.learningPreferences.studyTime === "early-morning" || userData.learningPreferences.studyTime === "morning" ? 100 : 0,
				gradient: "from-yellow-400 to-orange-400",
				points: 150,
				locked: !(userData.learningPreferences.studyTime === "early-morning" || userData.learningPreferences.studyTime === "morning"),
			},
			{
				id: "night-owl",
				title: "Night Owl",
				description: "Prefers evening learning sessions",
				icon: Moon,
				category: "style",
				rarity: "common",
				unlockedDate: userData.learningPreferences.studyTime === "evening" || userData.learningPreferences.studyTime === "night" ? "2024-01-25" : undefined,
				progress: userData.learningPreferences.studyTime === "evening" || userData.learningPreferences.studyTime === "night" ? 100 : 0,
				gradient: "from-indigo-500 to-purple-500",
				points: 150,
				locked: !(userData.learningPreferences.studyTime === "evening" || userData.learningPreferences.studyTime === "night"),
			},

			// Performance Achievements
			{
				id: "high-performer",
				title: "High Performer",
				description: "Average quiz score above 85%",
				icon: TrendingUp,
				category: "performance",
				rarity: "rare",
				unlockedDate: userData.learningStats.averageQuizScore >= 85 ? "2024-03-05" : undefined,
				progress: Math.min((userData.learningStats.averageQuizScore / 85) * 100, 100),
				gradient: "from-green-400 to-emerald-600",
				points: 500,
				locked: userData.learningStats.averageQuizScore < 85,
				requirement: {
					type: "quiz_average",
					value: 85,
					current: userData.learningStats.averageQuizScore,
				},
			},

			// Special Achievements
			{
				id: "subscriber",
				title: "Premium Member",
				description: "Upgraded to premium subscription",
				icon: Crown,
				category: "special",
				rarity: "uncommon",
				unlockedDate: userData.subscriptionStatus === "premium" || userData.subscriptionStatus === "enterprise" ? "2024-01-15" : undefined,
				progress: userData.subscriptionStatus === "premium" || userData.subscriptionStatus === "enterprise" ? 100 : 0,
				gradient: "from-yellow-500 to-amber-500",
				points: 200,
				locked: userData.subscriptionStatus === "free",
			},
		];

		return baseAchievements;
	}, [userData]);

	const categories = [
		{ name: "All Achievements", value: "all", icon: Trophy },
		{ name: "Milestones", value: "milestone", icon: Target },
		{ name: "Streaks", value: "streak", icon: Flame },
		{ name: "Time Mastery", value: "time", icon: Clock },
		{ name: "AI Friendship", value: "social", icon: Heart },
		{ name: "Skill Building", value: "skill", icon: Brain },
		{ name: "Learning Style", value: "style", icon: Activity },
		{ name: "Performance", value: "performance", icon: TrendingUp },
		{ name: "Special", value: "special", icon: Star },
	];

	const rarityColors = {
		common: "border-gray-300 bg-gray-50 dark:bg-gray-800/50",
		uncommon: "border-green-300 bg-green-50 dark:bg-green-950/20",
		rare: "border-blue-300 bg-blue-50 dark:bg-blue-950/20",
		epic: "border-purple-300 bg-purple-50 dark:bg-purple-950/20",
		legendary: "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/20",
	};

	const rarityGlow = {
		common: "",
		uncommon: "shadow-green-500/20",
		rare: "shadow-blue-500/20",
		epic: "shadow-purple-500/20",
		legendary: "shadow-yellow-500/20",
	};

	const filteredAchievements = selectedCategory === "all" ? achievements : achievements.filter((achievement) => achievement.category === selectedCategory);

	const unlockedAchievements = achievements.filter((a) => !a.locked);
	const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
	const recentAchievement = unlockedAchievements.sort((a, b) => new Date(b.unlockedDate || 0).getTime() - new Date(a.unlockedDate || 0).getTime())[0];

	return (
		<div className="space-y-6">
			{/* Achievement Summary */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="w-5 h-5 text-primary" />
						Achievement Gallery
						<Badge className="ai-badge ml-2">
							<Sparkles className="w-3 h-3 mr-1" />
							{unlockedAchievements.length} Unlocked
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Stats Overview */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
								<Star className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-foreground">{totalPoints}</p>
							<p className="text-sm text-muted-foreground">Achievement Points</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
								<Award className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</p>
							<p className="text-sm text-muted-foreground">Unlocked</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
								<Target className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-foreground">{achievements.filter((a) => a.locked).length}</p>
							<p className="text-sm text-muted-foreground">In Progress</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
								<Gem className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-foreground">{Math.round((unlockedAchievements.length / achievements.length) * 100)}%</p>
							<p className="text-sm text-muted-foreground">Completion</p>
						</div>
					</div>

					{/* Recent Achievement */}
					{!detailed && recentAchievement && (
						<motion.div
							className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
						>
							<div className="flex items-center gap-4">
								<div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${recentAchievement.gradient} flex items-center justify-center shadow-lg relative overflow-hidden`}>
									<recentAchievement.icon className="w-8 h-8 text-white" />
									<motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0" animate={{ x: [-64, 64] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} />
								</div>
								<div className="flex-1">
									<p className="font-semibold text-purple-800 dark:text-purple-200">Latest Achievement</p>
									<p className="text-sm text-purple-600 dark:text-purple-300">{recentAchievement.title}</p>
									<p className="text-xs text-purple-500 dark:text-purple-400">+{recentAchievement.points} points</p>
								</div>
								<Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
									<Gift className="w-3 h-3 mr-1" />
									New!
								</Badge>
							</div>
						</motion.div>
					)}
				</CardContent>
			</Card>

			{detailed && (
				<>
					{/* Category Filter */}
					<Card className="adaptive-card">
						<CardContent className="p-4">
							<div className="flex flex-wrap gap-2">
								{categories.map((category) => (
									<motion.button
										key={category.value}
										onClick={() => setSelectedCategory(category.value)}
										className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${selectedCategory === category.value ? "bg-gradient-primary text-white shadow-lg" : "hover:bg-white/50 dark:hover:bg-gray-800/30"}`}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<category.icon className="w-4 h-4" />
										<span className="text-sm font-medium">{category.name}</span>
										<Badge variant="secondary" className="text-xs">
											{achievements.filter((a) => category.value === "all" || a.category === category.value).filter((a) => !a.locked).length}
										</Badge>
									</motion.button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Achievement Grid */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
						{filteredAchievements.map((achievement, index) => (
							<motion.div key={achievement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
								<Card className={`relative overflow-hidden cursor-pointer transition-all duration-300 ${achievement.locked ? "opacity-60" : `${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]} hover:shadow-lg`}`}>
									<CardContent className="p-6">
										{/* Achievement Icon */}
										<div className="relative mb-4">
											<div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${achievement.gradient} flex items-center justify-center shadow-lg relative overflow-hidden`}>
												{achievement.locked ? <Lock className="w-8 h-8 text-white" /> : <achievement.icon className="w-8 h-8 text-white" />}

												{!achievement.locked && achievement.rarity !== "common" && (
													<motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" animate={{ x: [-100, 100] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} />
												)}
											</div>

											{/* Rarity Badge */}
											<div className="absolute -top-1 -right-1">
												<Badge
													variant="secondary"
													className={`text-xs px-2 py-0.5 ${
														achievement.rarity === "legendary"
															? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
															: achievement.rarity === "epic"
															? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
															: achievement.rarity === "rare"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
															: achievement.rarity === "uncommon"
															? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
															: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
													}`}
												>
													{achievement.rarity}
												</Badge>
											</div>
										</div>

										{/* Achievement Info */}
										<div className="text-center space-y-3">
											<h3 className="font-bold text-foreground">{achievement.title}</h3>
											<p className="text-sm text-muted-foreground">{achievement.description}</p>

											{/* Progress Bar for Locked/In-Progress Achievements */}
											{(achievement.locked || achievement.progress < 100) && achievement.requirement && (
												<div className="space-y-2">
													<div className="flex justify-between text-xs">
														<span className="text-muted-foreground">
															{achievement.requirement.current} / {achievement.requirement.value}
														</span>
														<span className="text-muted-foreground">{Math.round(achievement.progress)}%</span>
													</div>
													<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
														<motion.div className={`bg-gradient-to-r ${achievement.gradient} h-2 rounded-full`} initial={{ width: 0 }} animate={{ width: `${achievement.progress}%` }} transition={{ duration: 1, delay: 0.3 }} />
													</div>
												</div>
											)}

											{/* Points & Date */}
											<div className="flex items-center justify-between pt-3 border-t border-border/30">
												<div className="flex items-center gap-1">
													<Star className="w-4 h-4 text-yellow-500" />
													<span className="text-sm font-medium text-foreground">{achievement.points}</span>
												</div>
												{achievement.unlockedDate && (
													<div className="flex items-center gap-1">
														<Calendar className="w-4 h-4 text-muted-foreground" />
														<span className="text-xs text-muted-foreground">{new Date(achievement.unlockedDate).toLocaleDateString()}</span>
													</div>
												)}
											</div>
										</div>

										{/* Sparkle Effect for Rare+ Achievements */}
										{!achievement.locked && ["rare", "epic", "legendary"].includes(achievement.rarity) && (
											<div className="absolute top-2 left-2">
												<motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
													<Sparkles className="w-4 h-4 text-yellow-400" />
												</motion.div>
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					{/* Achievement Actions */}
					<Card className="adaptive-card">
						<CardContent className="p-4">
							<div className="flex flex-wrap gap-3">
								<EnhancedButton variant="ai-primary" className="flex-1 min-w-0">
									<Share2 className="w-4 h-4 mr-2" />
									Share Achievements
								</EnhancedButton>
								<EnhancedButton variant="outline" className="flex-1 min-w-0">
									<Download className="w-4 h-4 mr-2" />
									Download Certificate
								</EnhancedButton>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
