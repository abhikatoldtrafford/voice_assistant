"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Play, CheckCircle2, TrendingUp, Eye, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Course {
	_id: string;
	title: string;
	description: string;
	progress: number;
	lastAccessed: string;
	level: string;
	category: string;
}

interface RecentActivityProps {
	courses: Course[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ courses }) => {
	const getLastAccessedText = (lastAccessed: string) => {
		try {
			return formatDistanceToNow(new Date(lastAccessed), { addSuffix: true });
		} catch {
			return "Recently";
		}
	};

	const activities = courses.map((course) => ({
		id: course._id,
		type: course.progress > 0 ? "continued" : "enrolled",
		title: course.title,
		description: course.progress > 0 ? `Continued learning - ${Math.round(course.progress)}% complete` : "Enrolled in course",
		time: getLastAccessedText(course.lastAccessed),
		progress: course.progress,
		level: course.level,
		href: `/student/courses/${course._id}`,
	}));

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
			<Card className="adaptive-card h-full">
				<CardContent className="p-6 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
								<TrendingUp className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Recent Activity</h3>
								<p className="text-sm text-muted-foreground">Your latest learning sessions</p>
							</div>
						</div>
					</div>

					{activities.length === 0 ? (
						<div className="text-center py-8">
							<div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
								<Clock className="w-8 h-8 text-gray-400" />
							</div>
							<p className="text-muted-foreground">No recent activity</p>
						</div>
					) : (
						<div className="space-y-4">
							{activities.map((activity, index) => (
								<motion.div key={activity.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + index * 0.1 }}>
									<Link href={activity.href}>
										<div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group cursor-pointer">
											<div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
												{activity.type === "continued" ? <Play className="w-5 h-5 text-white" /> : <BookOpen className="w-5 h-5 text-white" />}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-2">
													<div className="flex-1 min-w-0">
														<h4 className="font-medium text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">{activity.title}</h4>
														<p className="text-sm text-muted-foreground line-clamp-1 mb-2">{activity.description}</p>

														<div className="flex items-center gap-3">
															<div className="flex items-center gap-1 text-xs text-muted-foreground">
																<Clock className="w-3 h-3" />
																<span>{activity.time}</span>
															</div>

															{activity.progress > 0 && (
																<div className="flex items-center gap-2">
																	<div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1">
																		<div className="h-1 rounded-full bg-gradient-primary" style={{ width: `${activity.progress}%` }} />
																	</div>
																	<span className="text-xs text-muted-foreground">{Math.round(activity.progress)}%</span>
																</div>
															)}
														</div>
													</div>

													<div className="flex flex-col items-end gap-2">
														<Badge variant="outline" className="text-xs">
															{activity.level}
														</Badge>
														<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
													</div>
												</div>
											</div>
										</div>
									</Link>
								</motion.div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default RecentActivity;
