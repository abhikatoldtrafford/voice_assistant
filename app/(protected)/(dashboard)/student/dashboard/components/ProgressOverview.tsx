"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, BookOpen, TrendingUp, Target, Zap, Award, Brain, Star, Calendar, BarChart3, CheckCircle2, Lock } from "lucide-react";

interface ProgressOverviewProps {
	stats: {
		completedCourses: number;
		totalCompletedChapters: number;
		estimatedLearningHours: number;
		averageProgress: number;
		activeCourses: number;
		totalCourses: number;
	};
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ stats }) => {
	const achievements = [
		{
			icon: Trophy,
			title: "Courses Completed",
			value: stats.completedCourses,
			total: stats.totalCourses,
			gradient: "from-yellow-400 to-orange-500",
			description: "Well done! Keep it up!",
			color: "text-yellow-600",
			bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
			borderColor: "border-yellow-200 dark:border-yellow-800",
		},
		{
			icon: Clock,
			title: "Learning Hours",
			value: stats.estimatedLearningHours,
			suffix: "h",
			gradient: "from-blue-400 to-cyan-500",
			description: "Time invested in growth",
			color: "text-blue-600",
			bgColor: "bg-blue-50 dark:bg-blue-950/20",
			borderColor: "border-blue-200 dark:border-blue-800",
		},
		{
			icon: BookOpen,
			title: "Chapters Completed",
			value: stats.totalCompletedChapters,
			gradient: "from-green-400 to-emerald-500",
			description: "Knowledge blocks mastered",
			color: "text-green-600",
			bgColor: "bg-green-50 dark:bg-green-950/20",
			borderColor: "border-green-200 dark:border-green-800",
		},
		{
			icon: TrendingUp,
			title: "Average Progress",
			value: Math.round(stats.averageProgress),
			suffix: "%",
			gradient: "from-purple-400 to-purple-600",
			description: "Across all courses",
			color: "text-purple-600",
			bgColor: "bg-purple-50 dark:bg-purple-950/20",
			borderColor: "border-purple-200 dark:border-purple-800",
		},
	];

	const milestones = [
		{ threshold: 1, title: "First Course", icon: Target, unlocked: stats.completedCourses >= 1 },
		{ threshold: 5, title: "Knowledge Seeker", icon: Brain, unlocked: stats.completedCourses >= 5 },
		{ threshold: 10, title: "Learning Expert", icon: Award, unlocked: stats.completedCourses >= 10 },
		{ threshold: 20, title: "Master Learner", icon: Star, unlocked: stats.completedCourses >= 20 },
	];

	const nextMilestone = milestones.find((m) => !m.unlocked);

	return (
		<motion.div className="space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
			{/* Section Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground mb-2">Your Learning Progress</h2>
					<p className="text-muted-foreground">Track your journey and celebrate achievements</p>
				</div>

				{nextMilestone && (
					<motion.div className="ai-badge" whileHover={{ scale: 1.05 }}>
						<nextMilestone.icon className="w-4 h-4" />
						<span>
							Next: {nextMilestone.title} ({stats.completedCourses}/{nextMilestone.threshold})
						</span>
					</motion.div>
				)}
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{achievements.map((achievement, index) => (
					<motion.div key={achievement.title} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.02, y: -2 }}>
						<Card className={`adaptive-card border-0 ${achievement.bgColor} ${achievement.borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
							<CardContent className="p-6 space-y-4">
								{/* Icon */}
								<motion.div
									className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${achievement.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
									whileHover={{ rotate: 5, scale: 1.1 }}
									transition={{ duration: 0.3 }}
								>
									<achievement.icon className="w-8 h-8 text-white" />
								</motion.div>

								{/* Content */}
								<div className="space-y-2">
									<div className="flex items-baseline gap-2">
										<motion.span className="text-3xl font-bold text-foreground" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 200 }}>
											{achievement.value}
										</motion.span>
										{achievement.suffix && <span className="text-lg font-semibold text-muted-foreground">{achievement.suffix}</span>}
										{achievement.total && <span className="text-sm text-muted-foreground">/ {achievement.total}</span>}
									</div>

									<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{achievement.title}</h3>

									<p className="text-sm text-muted-foreground">{achievement.description}</p>
								</div>

								{/* Progress Bar for courses */}
								{achievement.total && (
									<div className="space-y-2">
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
											<motion.div
												className={`h-2 rounded-full bg-gradient-to-r ${achievement.gradient}`}
												initial={{ width: 0 }}
												animate={{ width: `${(achievement.value / achievement.total) * 100}%` }}
												transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
											/>
										</div>
										<div className="flex justify-between text-xs text-muted-foreground">
											<span>{Math.round((achievement.value / achievement.total) * 100)}% Complete</span>
											<span>{achievement.total - achievement.value} remaining</span>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Milestones Section */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
				<Card className="adaptive-card p-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center">
								<Award className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="text-lg font-semibold">Learning Milestones</h3>
								<p className="text-sm text-muted-foreground">Your achievement journey</p>
							</div>
						</div>

						<Badge variant="secondary" className="bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
							<CheckCircle2 className="w-3 h-3 mr-1" />
							{milestones.filter((m) => m.unlocked).length} / {milestones.length} Unlocked
						</Badge>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{milestones.map((milestone, index) => (
							<motion.div
								key={milestone.title}
								className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
									milestone.unlocked ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20"
								}`}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 1 + index * 0.1 }}
								whileHover={{ scale: 1.02 }}
							>
								{milestone.unlocked && (
									<motion.div
										className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
										initial={{ scale: 0, rotate: -180 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
									>
										<CheckCircle2 className="w-4 h-4 text-white" />
									</motion.div>
								)}

								<div className="text-center space-y-3">
									<div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center ${milestone.unlocked ? "bg-green-500 text-white shadow-lg" : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"}`}>
										{milestone.unlocked ? <milestone.icon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
									</div>

									<div>
										<h4 className={`font-medium text-sm ${milestone.unlocked ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400"}`}>{milestone.title}</h4>
										<p className="text-xs text-muted-foreground mt-1">{milestone.unlocked ? "Unlocked!" : `${milestone.threshold} courses needed`}</p>
									</div>

									{!milestone.unlocked && (
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
											<motion.div
												className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
												initial={{ width: 0 }}
												animate={{
													width: `${Math.min(100, (stats.completedCourses / milestone.threshold) * 100)}%`,
												}}
												transition={{ duration: 1, delay: 1.4 + index * 0.1 }}
											/>
										</div>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</Card>
			</motion.div>

			{/* Weekly Progress Chart Preview */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
				<Card className="adaptive-card p-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
								<BarChart3 className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="text-lg font-semibold">This Week's Activity</h3>
								<p className="text-sm text-muted-foreground">Your learning consistency</p>
							</div>
						</div>

						<Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
							<Calendar className="w-3 h-3 mr-1" />7 day streak
						</Badge>
					</div>

					{/* Simple Activity Bar Chart */}
					<div className="flex items-end justify-between gap-2 h-20">
						{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
							const activity = [30, 45, 20, 60, 35, 50, 40][index]; // Mock data
							return (
								<div key={day} className="flex flex-col items-center gap-2 flex-1">
									<motion.div
										className="w-full bg-gradient-to-t from-blue-400 to-purple-500 rounded-t-lg"
										style={{ height: `${activity}%` }}
										initial={{ height: 0 }}
										animate={{ height: `${activity}%` }}
										transition={{ duration: 0.8, delay: 1.4 + index * 0.1 }}
									/>
									<span className="text-xs text-muted-foreground">{day}</span>
								</div>
							);
						})}
					</div>

					<div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
						<div className="text-sm text-muted-foreground">
							<span className="font-medium text-foreground">42 minutes</span> average daily
						</div>
						<div className="text-sm text-muted-foreground">
							<span className="font-medium text-green-600">+15%</span> from last week
						</div>
					</div>
				</Card>
			</motion.div>
		</motion.div>
	);
};

export default ProgressOverview;
