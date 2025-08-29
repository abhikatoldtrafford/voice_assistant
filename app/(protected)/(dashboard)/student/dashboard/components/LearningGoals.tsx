"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, CheckCircle2, Clock, TrendingUp, Calendar, Edit3, Trash2 } from "lucide-react";

export const LearningGoals: React.FC = () => {
	const [goals, setGoals] = useState([
		{
			id: 1,
			title: "Complete JavaScript Fundamentals",
			description: "Master the basics of JavaScript programming",
			progress: 75,
			deadline: "2024-02-15",
			priority: "high" as const,
			completed: false,
		},
		{
			id: 2,
			title: "Learn React Hooks",
			description: "Understand useState, useEffect, and custom hooks",
			progress: 40,
			deadline: "2024-02-28",
			priority: "medium" as const,
			completed: false,
		},
		{
			id: 3,
			title: "Build Portfolio Project",
			description: "Create a full-stack web application",
			progress: 100,
			deadline: "2024-01-30",
			priority: "high" as const,
			completed: true,
		},
	]);

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800";
			case "medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
			case "low":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-200 dark:border-gray-800";
		}
	};

	const getDaysUntilDeadline = (deadline: string) => {
		const today = new Date();
		const deadlineDate = new Date(deadline);
		const diffTime = deadlineDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const activeGoals = goals.filter((goal) => !goal.completed);
	const completedGoals = goals.filter((goal) => goal.completed);

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
			<Card className="adaptive-card h-full">
				<CardContent className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
								<Target className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Learning Goals</h3>
								<p className="text-sm text-muted-foreground">Track your objectives</p>
							</div>
						</div>

						<EnhancedButton variant="adaptive" size="sm" className="group">
							<Plus className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
							Add Goal
						</EnhancedButton>
					</div>

					{/* Active Goals */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h4 className="font-medium text-foreground">Active Goals ({activeGoals.length})</h4>
							{completedGoals.length > 0 && <span className="text-sm text-muted-foreground">{completedGoals.length} completed</span>}
						</div>

						{activeGoals.length === 0 ? (
							<div className="text-center py-6">
								<div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
									<Target className="w-6 h-6 text-gray-400" />
								</div>
								<p className="text-muted-foreground text-sm">No active goals</p>
							</div>
						) : (
							<div className="space-y-3">
								{activeGoals.map((goal, index) => {
									const daysLeft = getDaysUntilDeadline(goal.deadline);

									return (
										<motion.div
											key={goal.id}
											className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.8 + index * 0.1 }}
											whileHover={{ scale: 1.01 }}
										>
											<div className="space-y-3">
												<div className="flex items-start justify-between gap-3">
													<div className="flex-1 min-w-0">
														<h5 className="font-medium text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">{goal.title}</h5>
														<p className="text-sm text-muted-foreground line-clamp-1">{goal.description}</p>
													</div>

													<div className="flex items-center gap-2">
														<Badge variant="outline" className={`text-xs ${getPriorityColor(goal.priority)}`}>
															{goal.priority}
														</Badge>
														<button className="opacity-0 group-hover:opacity-100 transition-opacity">
															<Edit3 className="w-4 h-4 text-muted-foreground hover:text-blue-600" />
														</button>
													</div>
												</div>

												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">Progress</span>
														<span className="font-medium text-foreground">{goal.progress}%</span>
													</div>
													<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
														<motion.div
															className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
															initial={{ width: 0 }}
															animate={{ width: `${goal.progress}%` }}
															transition={{ duration: 1, delay: 1 + index * 0.1 }}
														/>
													</div>
												</div>

												<div className="flex items-center gap-4 text-xs text-muted-foreground">
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														<span>{daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Due today" : `${Math.abs(daysLeft)} days overdue`}</span>
													</div>
													<div className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														<span>{new Date(goal.deadline).toLocaleDateString()}</span>
													</div>
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						)}
					</div>

					{/* Completed Goals Preview */}
					{completedGoals.length > 0 && (
						<motion.div className="pt-4 border-t border-border/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
							<div className="flex items-center justify-between mb-3">
								<h4 className="font-medium text-foreground flex items-center gap-2">
									<CheckCircle2 className="w-4 h-4 text-green-600" />
									Recently Completed
								</h4>
							</div>

							<div className="space-y-2">
								{completedGoals.slice(0, 2).map((goal, index) => (
									<div key={goal.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
										<CheckCircle2 className="w-4 h-4 text-green-600" />
										<div className="flex-1 min-w-0">
											<p className="font-medium text-green-800 dark:text-green-200 line-clamp-1">{goal.title}</p>
											<p className="text-xs text-green-600 dark:text-green-300">Completed on {new Date(goal.deadline).toLocaleDateString()}</p>
										</div>
									</div>
								))}
							</div>
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default LearningGoals;
