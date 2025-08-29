"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Calendar, TrendingUp, Target, Award, Zap } from "lucide-react";

export const LearningStreak: React.FC = () => {
	const currentStreak = 7;
	const longestStreak = 21;
	const weeklyGoal = 5;
	const thisWeekSessions = 4;

	const streakData = [
		{ day: "Mon", completed: true, date: "29" },
		{ day: "Tue", completed: true, date: "30" },
		{ day: "Wed", completed: true, date: "31" },
		{ day: "Thu", completed: true, date: "1" },
		{ day: "Fri", completed: true, date: "2" },
		{ day: "Sat", completed: true, date: "3" },
		{ day: "Sun", completed: true, date: "4" },
	];

	const streakMilestones = [
		{ days: 7, title: "Week Warrior", unlocked: currentStreak >= 7 },
		{ days: 14, title: "Fortnight Focus", unlocked: currentStreak >= 14 },
		{ days: 30, title: "Monthly Master", unlocked: currentStreak >= 30 },
		{ days: 100, title: "Century Scholar", unlocked: currentStreak >= 100 },
	];

	const nextMilestone = streakMilestones.find((m) => !m.unlocked);

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
			<Card className="adaptive-card h-full">
				<CardContent className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
								<Flame className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Learning Streak</h3>
								<p className="text-sm text-muted-foreground">Keep the momentum going!</p>
							</div>
						</div>

						<Badge className="ai-badge">
							<Flame className="w-3 h-3" />
							<span>{currentStreak} days</span>
						</Badge>
					</div>

					{/* Current Streak Display */}
					<div className="text-center space-y-4">
						<motion.div
							className="relative inline-block"
							animate={{
								scale: [1, 1.05, 1],
								rotate: [0, 1, -1, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
								<div className="text-center">
									<div className="text-2xl font-bold text-white">{currentStreak}</div>
									<div className="text-xs text-orange-100">days</div>
								</div>
							</div>
							<motion.div
								className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
								animate={{
									scale: [1, 1.2, 1],
									rotate: [0, 10, -10, 0],
								}}
								transition={{
									duration: 1,
									repeat: Infinity,
									delay: 0.5,
								}}
							>
								<Flame className="w-4 h-4 text-orange-600" />
							</motion.div>
						</motion.div>

						<div className="space-y-2">
							<p className="font-semibold text-foreground">Great job! 🔥</p>
							<p className="text-sm text-muted-foreground">You're on fire! Keep learning daily to maintain your streak.</p>
						</div>
					</div>

					{/* Week Progress */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium text-foreground">This Week</h4>
							<span className="text-sm text-muted-foreground">
								{thisWeekSessions}/{weeklyGoal} sessions
							</span>
						</div>

						<div className="grid grid-cols-7 gap-2">
							{streakData.map((day, index) => (
								<motion.div key={day.day} className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 + index * 0.1 }}>
									<div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 transition-colors ${day.completed ? "bg-green-500 text-white shadow-sm" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
										<span className="text-xs font-medium">{day.date}</span>
									</div>
									<span className="text-xs text-muted-foreground">{day.day}</span>
								</motion.div>
							))}
						</div>

						{/* Weekly Goal Progress */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Weekly Goal Progress</span>
								<span className="font-medium text-foreground">{Math.round((thisWeekSessions / weeklyGoal) * 100)}%</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<motion.div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" initial={{ width: 0 }} animate={{ width: `${(thisWeekSessions / weeklyGoal) * 100}%` }} transition={{ duration: 1, delay: 1.5 }} />
							</div>
						</div>
					</div>

					{/* Statistics */}
					<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
						<div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
							<div className="text-lg font-bold text-blue-600">{longestStreak}</div>
							<div className="text-xs text-blue-600/80">Longest Streak</div>
						</div>
						<div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
							<div className="text-lg font-bold text-purple-600">{nextMilestone ? nextMilestone.days - currentStreak : "✅"}</div>
							<div className="text-xs text-purple-600/80">{nextMilestone ? "Days to Next Badge" : "All Unlocked!"}</div>
						</div>
					</div>

					{/* Next Milestone */}
					{nextMilestone && (
						<motion.div
							className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl border border-yellow-200/30"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.8 }}
						>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
									<Award className="w-4 h-4 text-yellow-800" />
								</div>
								<div>
									<p className="font-medium text-yellow-800 dark:text-yellow-200">Next: {nextMilestone.title}</p>
									<p className="text-sm text-yellow-600 dark:text-yellow-300">{nextMilestone.days - currentStreak} more days to unlock!</p>
								</div>
							</div>
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default LearningStreak;
