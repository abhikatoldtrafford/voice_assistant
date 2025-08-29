"use client";

import React from "react";
import { motion } from "framer-motion";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus, Target, TrendingUp, Clock, Trophy, Sparkles, Brain, ArrowRight, Calendar, Flame, Star } from "lucide-react";
import Link from "next/link";

interface CoursesHeaderProps {
	user: any;
	stats: {
		total: number;
		active: number;
		completed: number;
		notStarted: number;
		totalHoursLearned: number;
		averageProgress: number;
		weeklyGoalProgress: number;
		currentStreak: number;
	} | null;
}

const CoursesHeader: React.FC<CoursesHeaderProps> = ({ user, stats }) => {
	const userName = user?.name?.split(" ")[0] || "Student";

	return (
		<motion.div className="mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
			<div className="adaptive-card p-8 intelligence-glow">
				<div className="grid lg:grid-cols-3 gap-8 items-center">
					{/* Left: Title and Description */}
					<div className="lg:col-span-2 space-y-6">
						<div className="space-y-4">
							<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
								<div className="ai-badge w-fit mb-4">
									<BookOpen className="w-4 h-4" />
									<span>My Learning Journey</span>
								</div>

								<h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Your Courses, {userName}</h1>
								<p className="text-lg text-muted-foreground">Continue your learning adventure with AI-powered guidance</p>
							</motion.div>

							{/* Stats Row */}
							{stats && (
								<motion.div className="flex flex-wrap gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
											<BookOpen className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-xl font-bold text-foreground">{stats.total}</div>
											<div className="text-xs text-muted-foreground">Total Courses</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
											<TrendingUp className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-xl font-bold text-foreground">{stats.active}</div>
											<div className="text-xs text-muted-foreground">In Progress</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
											<Trophy className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-xl font-bold text-foreground">{stats.completed}</div>
											<div className="text-xs text-muted-foreground">Completed</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
											<Clock className="w-5 h-5 text-white" />
										</div>
										<div>
											<div className="text-xl font-bold text-foreground">{stats.totalHoursLearned}h</div>
											<div className="text-xs text-muted-foreground">Time Learned</div>
										</div>
									</div>
								</motion.div>
							)}

							{/* Action Buttons */}
							<motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
								<Link href="/courses">
									<EnhancedButton variant="ai-primary" withGlow aiPersonality="warm" className="group">
										<Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
										Browse New Courses
										<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
									</EnhancedButton>
								</Link>

								<EnhancedButton variant="adaptive" className="group">
									<Brain className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
									AI Study Plan
								</EnhancedButton>
							</motion.div>
						</div>
					</div>

					{/* Right: Progress Card */}
					{stats && (
						<motion.div className="lg:col-span-1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
							<div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200/30">
								<div className="space-y-4">
									{/* Weekly Goal Progress */}
									<div className="text-center">
										<div className="flex items-center justify-center gap-2 mb-3">
											<Target className="w-5 h-5 text-blue-600" />
											<h3 className="font-semibold text-blue-800 dark:text-blue-200">Weekly Goal</h3>
										</div>

										<div className="relative w-24 h-24 mx-auto mb-4">
											<svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
												{/* Background circle */}
												<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-blue-200 dark:text-blue-800" />
												{/* Progress circle */}
												<motion.circle
													cx="50"
													cy="50"
													r="40"
													fill="none"
													stroke="url(#progressGradient)"
													strokeWidth="8"
													strokeLinecap="round"
													strokeDasharray={`${2 * Math.PI * 40}`}
													initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
													animate={{
														strokeDashoffset: 2 * Math.PI * 40 * (1 - stats.weeklyGoalProgress / 100),
													}}
													transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
												/>
												<defs>
													<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
														<stop offset="0%" stopColor="#3b82f6" />
														<stop offset="100%" stopColor="#8b5cf6" />
													</linearGradient>
												</defs>
											</svg>
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.weeklyGoalProgress}%</span>
											</div>
										</div>

										<p className="text-sm text-blue-600 dark:text-blue-300">{stats.weeklyGoalProgress < 100 ? `${100 - stats.weeklyGoalProgress}% to reach your goal` : "Goal achieved! 🎉"}</p>
									</div>

									{/* Study Streak */}
									<div className="pt-4 border-t border-blue-200/30">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Flame className="w-4 h-4 text-orange-500" />
												<span className="text-sm font-medium text-blue-800 dark:text-blue-200">Study Streak</span>
											</div>
											<div className="flex items-center gap-1">
												<span className="text-lg font-bold text-orange-600">{stats.currentStreak}</span>
												<span className="text-sm text-blue-600 dark:text-blue-300">days</span>
											</div>
										</div>
									</div>

									{/* Next Milestone */}
									<div className="pt-2">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Star className="w-4 h-4 text-yellow-500" />
												<span className="text-sm font-medium text-blue-800 dark:text-blue-200">Next Milestone</span>
											</div>
											<span className="text-sm text-blue-600 dark:text-blue-300">{stats.currentStreak < 30 ? `${30 - stats.currentStreak} days` : "Achieved!"}</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default CoursesHeader;
