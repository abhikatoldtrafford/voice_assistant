// app/(protected)/(dashboard)/student/courses/components/StudyStreakCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flame, Calendar, Target, TrendingUp, Star, Award, Zap, Clock } from "lucide-react";

interface StudyStreakCardProps {
	streak: number;
	weeklyGoal: number;
}

const StudyStreakCard: React.FC<StudyStreakCardProps> = ({ streak, weeklyGoal }) => {
	const streakMilestones = [7, 14, 30, 60, 100];
	const nextMilestone = streakMilestones.find((milestone) => milestone > streak) || 365;
	const daysToNextMilestone = nextMilestone - streak;

	const getStreakLevel = () => {
		if (streak >= 100) return { level: "Legendary", color: "from-purple-500 to-pink-500", emoji: "🔥" };
		if (streak >= 60) return { level: "Master", color: "from-orange-500 to-red-500", emoji: "⭐" };
		if (streak >= 30) return { level: "Expert", color: "from-blue-500 to-cyan-500", emoji: "💎" };
		if (streak >= 14) return { level: "Advanced", color: "from-green-500 to-emerald-500", emoji: "🚀" };
		if (streak >= 7) return { level: "Committed", color: "from-yellow-500 to-orange-500", emoji: "💪" };
		return { level: "Beginner", color: "from-gray-500 to-gray-600", emoji: "🌱" };
	};

	const streakLevel = getStreakLevel();

	// Weekly activity visualization (mock data)
	const weeklyActivity = [
		{ day: "Mon", minutes: 45, completed: true },
		{ day: "Tue", minutes: 30, completed: true },
		{ day: "Wed", minutes: 60, completed: true },
		{ day: "Thu", minutes: 0, completed: false },
		{ day: "Fri", minutes: 40, completed: true },
		{ day: "Sat", minutes: 55, completed: true },
		{ day: "Sun", minutes: 35, completed: true },
	];

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
			<Card className="adaptive-card overflow-hidden">
				<div className={`h-2 bg-gradient-to-r ${streakLevel.color}`} />
				<CardContent className="p-6 space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<motion.div
								className={`w-12 h-12 rounded-xl bg-gradient-to-r ${streakLevel.color} flex items-center justify-center text-white shadow-lg`}
								animate={{
									scale: [1, 1.05, 1],
									rotate: [0, 5, -5, 0],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								<Flame className="w-6 h-6" />
							</motion.div>
							<div>
								<h3 className="font-semibold text-foreground">Study Streak</h3>
								<p className="text-sm text-muted-foreground">Keep the momentum going!</p>
							</div>
						</div>

						<Badge className={`bg-gradient-to-r ${streakLevel.color} text-white border-0`}>{streakLevel.level}</Badge>
					</div>

					{/* Main Streak Display */}
					<div className="text-center space-y-3">
						<motion.div className="relative inline-block" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }}>
							<div className="text-4xl font-bold text-foreground">{streak}</div>
							<motion.div
								className="absolute -top-2 -right-2 text-2xl"
								animate={{
									rotate: [0, 10, -10, 0],
									scale: [1, 1.1, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								{streakLevel.emoji}
							</motion.div>
						</motion.div>

						<div className="space-y-1">
							<p className="text-lg font-medium text-foreground">{streak === 1 ? "Day" : "Days"} Strong!</p>
							<p className="text-sm text-muted-foreground">
								{daysToNextMilestone} more days to reach {nextMilestone}-day milestone
							</p>
						</div>
					</div>

					{/* Progress to Next Milestone */}
					<div className="space-y-3">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Next milestone</span>
							<span className="font-medium text-foreground">{nextMilestone} days</span>
						</div>
						<Progress value={(streak / nextMilestone) * 100} className="h-2" />
					</div>

					{/* Weekly Activity Grid */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm font-medium text-foreground">This Week</span>
						</div>

						<div className="grid grid-cols-7 gap-1">
							{weeklyActivity.map((day, index) => (
								<motion.div key={day.day} className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
									<div className="text-xs text-muted-foreground mb-1">{day.day}</div>
									<motion.div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${day.completed ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`} whileHover={{ scale: 1.1 }}>
										{day.completed ? <Zap className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
									</motion.div>
									{day.completed && <div className="text-xs text-green-600 mt-1">{day.minutes}m</div>}
								</motion.div>
							))}
						</div>
					</div>

					{/* Weekly Goal Progress */}
					<div className="space-y-3 pt-3 border-t border-border/50">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Target className="w-4 h-4 text-blue-600" />
								<span className="text-sm font-medium text-foreground">Weekly Goal</span>
							</div>
							<span className="text-sm font-medium text-foreground">{weeklyGoal}%</span>
						</div>

						<Progress value={weeklyGoal} className="h-2" />

						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{weeklyGoal >= 100 ? "Goal achieved! 🎉" : `${100 - weeklyGoal}% to reach your goal`}</span>
							<span>15h/week</span>
						</div>
					</div>

					{/* Achievements Preview */}
					<div className="space-y-3 pt-3 border-t border-border/50">
						<div className="flex items-center gap-2">
							<Award className="w-4 h-4 text-yellow-600" />
							<span className="text-sm font-medium text-foreground">Recent Achievements</span>
						</div>

						<div className="space-y-2">
							{streak >= 7 && (
								<div className="flex items-center gap-2 text-xs">
									<div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
										<Star className="w-2 h-2 text-white" />
									</div>
									<span className="text-muted-foreground">7-Day Streak Master</span>
								</div>
							)}
							{weeklyGoal >= 100 && (
								<div className="flex items-center gap-2 text-xs">
									<div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
										<Target className="w-2 h-2 text-white" />
									</div>
									<span className="text-muted-foreground">Weekly Goal Crusher</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default StudyStreakCard;
