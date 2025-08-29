// app/(protected)/(dashboard)/student/profile/components/LearningStats.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { TrendingUp, Calendar, Clock, Target, BookOpen, Brain, Zap, Trophy, Activity, BarChart3, Eye, Heart, Star, Users, MessageCircle, Award, Timer, Coffee, Moon, Sun, Lightbulb, CheckCircle2, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface LearningStatsProps {
	userData: IUserProfileData;
}

export default function LearningStats({ userData }: LearningStatsProps) {
	const [timeRange, setTimeRange] = useState("week");

	// Calculate time-range specific data
	const getTimeRangeData = () => {
		const base = userData.learningStats;

		switch (timeRange) {
			case "week":
				return {
					totalHours: Math.round(base.totalLearningHours * 0.1), // ~10% of total for this week
					avgPerDay: base.averageSessionDuration / 60,
					streak: Math.min(base.currentStreak, 7),
					progress: userData.learningStats.weeklyProgress,
					coursesStarted: 1,
					aiInteractions: Math.round(base.totalAIInteractions * 0.05),
					quizzesTaken: 3,
					trend: "+15%",
				};
			case "month":
				return {
					totalHours: Math.round(base.totalLearningHours * 0.4), // ~40% of total for this month
					avgPerDay: (base.averageSessionDuration * 0.8) / 60,
					streak: Math.min(base.currentStreak, 30),
					progress: userData.learningStats.monthlyProgress,
					coursesStarted: 2,
					aiInteractions: Math.round(base.totalAIInteractions * 0.2),
					quizzesTaken: 12,
					trend: "+23%",
				};
			case "year":
				return {
					totalHours: base.totalLearningHours,
					avgPerDay: base.averageSessionDuration / 60,
					streak: base.currentStreak,
					progress: 85,
					coursesStarted: base.coursesCompleted + base.coursesInProgress,
					aiInteractions: base.totalAIInteractions,
					quizzesTaken: Math.round(base.totalLearningHours * 2.5), // Estimate
					trend: "+145%",
				};
			default:
				return {
					totalHours: base.totalLearningHours,
					avgPerDay: base.averageSessionDuration / 60,
					streak: base.currentStreak,
					progress: 85,
					coursesStarted: base.coursesCompleted + base.coursesInProgress,
					aiInteractions: base.totalAIInteractions,
					quizzesTaken: 25,
					trend: "+145%",
				};
		}
	};

	const currentData = getTimeRangeData();

	const timeRanges = [
		{ value: "week", label: "This Week" },
		{ value: "month", label: "This Month" },
		{ value: "year", label: "All Time" },
	];

	const mainStats = [
		{
			title: "Learning Hours",
			value: currentData.totalHours,
			subtitle: `${currentData.avgPerDay.toFixed(1)}h avg/day`,
			icon: Clock,
			gradient: "from-blue-500 to-cyan-500",
			trend: currentData.trend,
			trendDirection: "up",
		},
		{
			title: "Current Streak",
			value: currentData.streak,
			subtitle: "days in a row",
			icon: Zap,
			gradient: "from-orange-500 to-red-500",
			trend: `${userData.learningStats.currentStreak - userData.learningStats.longestStreak + 5} days`,
			trendDirection: userData.learningStats.currentStreak > 7 ? "up" : "down",
		},
		{
			title: "Progress Rate",
			value: `${currentData.progress}%`,
			subtitle: "completion average",
			icon: TrendingUp,
			gradient: "from-green-500 to-emerald-500",
			trend: "+12%",
			trendDirection: "up",
		},
		{
			title: "AI Interactions",
			value: currentData.aiInteractions,
			subtitle: "with your coach",
			icon: MessageCircle,
			gradient: "from-purple-500 to-pink-500",
			trend: "+8%",
			trendDirection: "up",
		},
	];

	const detailedStats = [
		{
			label: "Courses Completed",
			value: userData.learningStats.coursesCompleted,
			icon: BookOpen,
			color: "text-purple-600",
			description: "Successfully finished",
		},
		{
			label: "Skills Acquired",
			value: userData.learningStats.skillsAcquired,
			icon: Brain,
			color: "text-blue-600",
			description: "New competencies gained",
		},
		{
			label: "Courses In Progress",
			value: userData.learningStats.coursesInProgress,
			icon: Activity,
			color: "text-green-600",
			description: "Currently studying",
		},
		{
			label: "Certifications Earned",
			value: userData.learningStats.certificationsEarned,
			icon: Award,
			color: "text-yellow-600",
			description: "Professional credentials",
		},
		{
			label: "Average Quiz Score",
			value: `${userData.learningStats.averageQuizScore}%`,
			icon: Target,
			color: "text-orange-600",
			description: "Assessment performance",
		},
		{
			label: "Session Duration",
			value: `${userData.learningStats.averageSessionDuration}min`,
			icon: Timer,
			color: "text-cyan-600",
			description: "Average study time",
		},
	];

	// Mock weekly data for visualization
	const weeklyData = [
		{ day: "Mon", hours: 2.5, progress: 85, mood: "focused", aiInteractions: 3 },
		{ day: "Tue", hours: 1.8, progress: 92, mood: "motivated", aiInteractions: 2 },
		{ day: "Wed", hours: 3.2, progress: 78, mood: "challenged", aiInteractions: 5 },
		{ day: "Thu", hours: 2.1, progress: 88, mood: "confident", aiInteractions: 4 },
		{ day: "Fri", hours: 1.5, progress: 95, mood: "accomplished", aiInteractions: 1 },
		{ day: "Sat", hours: 0.8, progress: 70, mood: "relaxed", aiInteractions: 1 },
		{ day: "Sun", hours: 2.3, progress: 87, mood: "prepared", aiInteractions: 3 },
	];

	const maxHours = Math.max(...weeklyData.map((d) => d.hours));

	// Learning patterns analysis
	const learningPatterns = {
		bestDay: userData.learningStats.preferredLearningDays[0] || "Monday",
		bestTime: userData.learningStats.mostProductiveHour,
		averageScore: userData.learningStats.averageQuizScore,
		strongestSubject: userData.personalInfo.interests[0] || "Programming",
		preferredStyle: userData.learningPreferences.learningStyle,
		aiPersonality: userData.learningPreferences.aiPersonality,
	};

	const getTimeIcon = (hour: number) => {
		if (hour < 6) return Moon;
		if (hour < 12) return Sun;
		if (hour < 18) return Coffee;
		return Moon;
	};

	const TimeIcon = getTimeIcon(learningPatterns.bestTime);

	const getTrendIcon = (direction: string) => {
		switch (direction) {
			case "up":
				return ArrowUp;
			case "down":
				return ArrowDown;
			default:
				return Minus;
		}
	};

	return (
		<div className="space-y-6">
			{/* Time Range Selector */}
			<Card className="adaptive-card">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="w-5 h-5 text-primary" />
							Learning Analytics
						</CardTitle>
						<div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
							{timeRanges.map((range) => (
								<motion.button
									key={range.value}
									onClick={() => setTimeRange(range.value)}
									className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === range.value ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									{range.label}
								</motion.button>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Main Stats Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{mainStats.map((stat, index) => {
							const TrendIcon = getTrendIcon(stat.trendDirection);
							return (
								<motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ scale: 1.02 }}>
									<div className="p-4 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-border/50 hover:border-border transition-all">
										<div className="flex items-center justify-between mb-3">
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
												<stat.icon className="w-6 h-6 text-white" />
											</div>
											<div className="flex items-center gap-1">
												<TrendIcon className={`w-3 h-3 ${stat.trendDirection === "up" ? "text-green-500" : stat.trendDirection === "down" ? "text-red-500" : "text-gray-500"}`} />
												<Badge
													variant="secondary"
													className={`text-xs ${
														stat.trendDirection === "up"
															? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
															: stat.trendDirection === "down"
															? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
															: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
													}`}
												>
													{stat.trend}
												</Badge>
											</div>
										</div>
										<div>
											<p className="text-2xl font-bold text-foreground">{stat.value}</p>
											<p className="text-sm font-medium text-foreground">{stat.title}</p>
											<p className="text-xs text-muted-foreground">{stat.subtitle}</p>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>

					{/* Weekly Progress Chart */}
					{timeRange === "week" && (
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
							<div className="space-y-4">
								<h4 className="font-semibold text-foreground flex items-center gap-2">
									<Calendar className="w-4 h-4" />
									This Week's Learning Activity
								</h4>
								<div className="grid grid-cols-7 gap-2">
									{weeklyData.map((day, index) => (
										<motion.div
											key={day.day}
											className="text-center space-y-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer group"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 + index * 0.1 }}
											whileHover={{ scale: 1.05 }}
										>
											<p className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{day.day}</p>
											<div className="w-full h-20 bg-gray-100 dark:bg-gray-800 rounded-md relative overflow-hidden">
												<motion.div
													className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-md"
													initial={{ height: 0 }}
													animate={{ height: `${(day.hours / maxHours) * 100}%` }}
													transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-xs font-bold text-white mix-blend-difference">{day.hours}h</span>
												</div>
											</div>

											{/* Progress indicator */}
											<div className="flex items-center justify-center gap-1">
												<div className={`w-2 h-2 rounded-full ${day.progress >= 90 ? "bg-green-500" : day.progress >= 75 ? "bg-yellow-500" : "bg-orange-500"}`} />
												<span className="text-xs text-muted-foreground">{day.progress}%</span>
											</div>

											{/* AI interactions */}
											<div className="flex items-center justify-center gap-1">
												<MessageCircle className="w-3 h-3 text-purple-500" />
												<span className="text-xs text-muted-foreground">{day.aiInteractions}</span>
											</div>

											{/* Mood indicator */}
											<div className="text-xs text-center">
												<span
													className={`px-2 py-0.5 rounded-full text-xs ${
														day.mood === "motivated" || day.mood === "accomplished"
															? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
															: day.mood === "confident" || day.mood === "focused"
															? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
															: day.mood === "challenged"
															? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
															: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
													}`}
												>
													{day.mood}
												</span>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</CardContent>
			</Card>

			{/* Detailed Statistics */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="w-5 h-5 text-primary" />
						Learning Milestones & Performance
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
						{detailedStats.map((stat, index) => (
							<motion.div
								key={stat.label}
								className="text-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 + index * 0.1 }}
								whileHover={{ scale: 1.05 }}
							>
								<div className="space-y-3">
									<div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:shadow-lg transition-shadow">
										<stat.icon className={`w-6 h-6 ${stat.color}`} />
									</div>
									<div>
										<p className="text-xl font-bold text-foreground">{stat.value}</p>
										<p className="text-sm font-medium text-foreground">{stat.label}</p>
										<p className="text-xs text-muted-foreground">{stat.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Learning Insights & Patterns */}
			<div className="grid md:grid-cols-2 gap-6">
				{/* Learning Patterns */}
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Lightbulb className="w-5 h-5 text-primary" />
							Your Learning Patterns
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-3">
							<div className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
								<div className="flex items-center gap-3">
									<Calendar className="w-5 h-5 text-blue-600" />
									<div>
										<p className="font-medium text-foreground">Best Learning Day</p>
										<p className="text-sm text-muted-foreground">Most productive</p>
									</div>
								</div>
								<Badge variant="secondary">{learningPatterns.bestDay}</Badge>
							</div>

							<div className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
								<div className="flex items-center gap-3">
									<TimeIcon className="w-5 h-5 text-orange-600" />
									<div>
										<p className="font-medium text-foreground">Peak Hours</p>
										<p className="text-sm text-muted-foreground">Most focused time</p>
									</div>
								</div>
								<Badge variant="secondary">{learningPatterns.bestTime}:00</Badge>
							</div>

							<div className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
								<div className="flex items-center gap-3">
									<Eye className="w-5 h-5 text-purple-600" />
									<div>
										<p className="font-medium text-foreground">Learning Style</p>
										<p className="text-sm text-muted-foreground">Preferred method</p>
									</div>
								</div>
								<Badge variant="secondary" className="capitalize">
									{learningPatterns.preferredStyle}
								</Badge>
							</div>

							<div className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
								<div className="flex items-center gap-3">
									<Heart className="w-5 h-5 text-pink-600" />
									<div>
										<p className="font-medium text-foreground">AI Coach Style</p>
										<p className="text-sm text-muted-foreground">Preferred personality</p>
									</div>
								</div>
								<Badge variant="secondary" className="capitalize">
									{learningPatterns.aiPersonality}
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* AI-Generated Insights */}
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="w-5 h-5 text-primary" />
							AI Learning Insights
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<motion.div
							className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.6 }}
						>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
									<TrendingUp className="w-4 h-4 text-white" />
								</div>
								<div>
									<p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">Performance Trend</p>
									<p className="text-blue-600 dark:text-blue-300 text-xs">
										Your {timeRange} performance shows consistent improvement. Keep maintaining your {userData.learningStats.currentStreak}-day streak!
									</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.7 }}
						>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
									<CheckCircle2 className="w-4 h-4 text-white" />
								</div>
								<div>
									<p className="font-semibold text-green-800 dark:text-green-200 text-sm">Optimal Learning Window</p>
									<p className="text-green-600 dark:text-green-300 text-xs">You're most productive around {learningPatterns.bestTime}:00. Consider scheduling complex topics during this time.</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
						>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
									<Star className="w-4 h-4 text-white" />
								</div>
								<div>
									<p className="font-semibold text-purple-800 dark:text-purple-200 text-sm">Strength Recognition</p>
									<p className="text-purple-600 dark:text-purple-300 text-xs">
										You excel in {learningPatterns.strongestSubject} with {learningPatterns.averageScore}% average score. Great job!
									</p>
								</div>
							</div>
						</motion.div>

						<EnhancedButton variant="outline" className="w-full" size="sm">
							<Eye className="w-4 h-4 mr-2" />
							View Detailed Analytics
						</EnhancedButton>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
