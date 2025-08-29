"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { PlayCircle, Clock, BookOpen, Star, CheckCircle2, ArrowRight, Trophy, Target, Calendar, Brain, BarChart3, Eye, Users, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Course {
	_id: string;
	title: string;
	description: string;
	imageUrl?: string;
	progress: number;
	totalChapters: number;
	completedChapters: string[];
	isCompleted: boolean;
	lastAccessed: string;
	category: string;
	level: string;
	estimatedTimeLeft?: number;
}

interface EnhancedCourseCardProps {
	course: Course;
	variant?: "active" | "completed" | "not-started";
	className?: string;
}

const EnhancedCourseCard: React.FC<EnhancedCourseCardProps> = ({ course, variant = "active", className }) => {
	const getDifficultyConfig = (level: string) => {
		switch (level.toLowerCase()) {
			case "beginner":
				return {
					className: "difficulty-beginner",
					color: "text-green-600",
					bgColor: "bg-green-50 dark:bg-green-950/20",
				};
			case "intermediate":
				return {
					className: "difficulty-intermediate",
					color: "text-yellow-600",
					bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
				};
			case "advanced":
				return {
					className: "difficulty-advanced",
					color: "text-red-600",
					bgColor: "bg-red-50 dark:bg-red-950/20",
				};
			default:
				return {
					className: "difficulty-beginner",
					color: "text-gray-600",
					bgColor: "bg-gray-50 dark:bg-gray-950/20",
				};
		}
	};

	const getCategoryConfig = (category: string) => {
		const configs: any = {
			programming: { icon: Brain, color: "from-blue-500 to-cyan-500" },
			design: { icon: Target, color: "from-purple-500 to-pink-500" },
			business: { icon: BarChart3, color: "from-green-500 to-emerald-500" },
			marketing: { icon: TrendingUp, color: "from-orange-500 to-red-500" },
			default: { icon: BookOpen, color: "from-gray-500 to-gray-600" },
		};

		return configs[category.toLowerCase()] || configs.default;
	};

	const difficultyConfig = getDifficultyConfig(course.level);
	const categoryConfig = getCategoryConfig(course.category);
	const CategoryIcon = categoryConfig.icon;

	const getVariantStyles = () => {
		switch (variant) {
			case "completed":
				return {
					cardClass: "border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10",
					badgeClass: "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-300",
					actionButton: "bg-green-500 hover:bg-green-600",
				};
			case "not-started":
				return {
					cardClass: "border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10",
					badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
					actionButton: "bg-blue-500 hover:bg-blue-600",
				};
			default: // active
				return {
					cardClass: "border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-yellow-50/50 dark:from-orange-950/10 dark:to-yellow-950/10",
					badgeClass: "bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
					actionButton: "bg-orange-500 hover:bg-orange-600",
				};
		}
	};

	const styles = getVariantStyles();
	const lastAccessedDate = new Date(course.lastAccessed);
	const isRecent = Date.now() - lastAccessedDate.getTime() < 24 * 60 * 60 * 1000; // Last 24 hours

	return (
		<motion.div className={cn("group", className)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} whileHover={{ y: -4 }}>
			<Card className={cn("adaptive-card hover:shadow-xl transition-all duration-300 overflow-hidden", styles.cardClass)}>
				<div className="relative">
					{/* Course Image/Thumbnail */}
					<div className="relative aspect-video bg-gradient-neural overflow-hidden">
						{course.imageUrl ? (
							<img src={`/api/files${course.imageUrl}`} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
						) : (
							<div className={cn("w-full h-full bg-gradient-to-br flex items-center justify-center", categoryConfig.color)}>
								<CategoryIcon className="w-12 h-12 text-white" />
							</div>
						)}

						{/* Overlay with status indicators */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
								<Badge className={styles.badgeClass}>
									{variant === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
									{variant === "active" && <PlayCircle className="w-3 h-3 mr-1" />}
									{variant === "not-started" && <Eye className="w-3 h-3 mr-1" />}
									{variant === "completed" ? "Completed" : variant === "active" ? "Continue" : "Start Course"}
								</Badge>

								{isRecent && variant !== "completed" && (
									<Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
										Recent
									</Badge>
								)}
							</div>
						</div>

						{/* Progress overlay for active courses */}
						{variant === "active" && course.progress > 0 && (
							<div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
								<motion.div className="h-full bg-gradient-to-r from-blue-400 to-purple-500" initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
							</div>
						)}

						{/* Completion badge for completed courses */}
						{variant === "completed" && (
							<div className="absolute top-4 right-4">
								<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
									<Trophy className="w-5 h-5 text-white" />
								</div>
							</div>
						)}
					</div>

					<CardContent className="p-6 space-y-4">
						{/* Header */}
						<div className="space-y-3">
							<div className="flex items-start justify-between gap-3">
								<h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
								<Badge variant="outline" className={difficultyConfig.className}>
									{course.level}
								</Badge>
							</div>

							<p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
						</div>

						{/* Progress Section */}
						{variant !== "not-started" && (
							<div className="space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Progress</span>
									<span className="font-medium text-foreground">{Math.round(course.progress)}%</span>
								</div>
								<Progress value={course.progress} className="h-2" />
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span>
										{course.completedChapters.length} of {course.totalChapters} chapters
									</span>
									{variant === "active" && course.estimatedTimeLeft && <span>{course.estimatedTimeLeft}h remaining</span>}
								</div>
							</div>
						)}

						{/* Course Metadata */}
						<div className="flex items-center gap-4 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<BookOpen className="w-3 h-3" />
								<span>{course.totalChapters} chapters</span>
							</div>
							<div className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								<span>{course.totalChapters * 2}h total</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="w-3 h-3" />
								<span>{course.category}</span>
							</div>
						</div>

						{/* Last Accessed (for active courses) */}
						{variant === "active" && (
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								<Calendar className="w-3 h-3" />
								<span>Last accessed {lastAccessedDate.toLocaleDateString()}</span>
							</div>
						)}

						{/* Action Button */}
						<div className="pt-2">
							<Link href={`/student/courses/${course._id}`}>
								<EnhancedButton variant="adaptive" className="w-full group" withGlow={variant === "active"}>
									{variant === "completed" && (
										<>
											<Award className="w-4 h-4 mr-2" />
											Review Course
										</>
									)}
									{variant === "active" && (
										<>
											<PlayCircle className="w-4 h-4 mr-2" />
											Continue Learning
										</>
									)}
									{variant === "not-started" && (
										<>
											<Eye className="w-4 h-4 mr-2" />
											Start Course
										</>
									)}
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</EnhancedButton>
							</Link>
						</div>

						{/* Completion Certificate (for completed courses) */}
						{variant === "completed" && (
							<div className="pt-3 border-t border-border/50">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
											<Award className="w-4 h-4 text-white" />
										</div>
										<div>
											<p className="text-sm font-medium text-foreground">Certificate Earned</p>
											<p className="text-xs text-muted-foreground">Completed {lastAccessedDate.toLocaleDateString()}</p>
										</div>
									</div>
									<EnhancedButton variant="ghost" size="sm" className="text-xs">
										Download
									</EnhancedButton>
								</div>
							</div>
						)}

						{/* Next Chapter Preview (for active courses) */}
						{variant === "active" && course.progress > 0 && course.progress < 100 && (
							<div className="pt-3 border-t border-border/50">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
										<Target className="w-4 h-4 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">Next Up</p>
										<p className="text-xs text-muted-foreground truncate">Chapter {course.completedChapters.length + 1}: Continue your journey</p>
									</div>
								</div>
							</div>
						)}

						{/* Course Features (for not-started courses) */}
						{variant === "not-started" && (
							<div className="pt-3 border-t border-border/50">
								<div className="space-y-2">
									<p className="text-xs font-medium text-muted-foreground">What you'll learn:</p>
									<div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<CheckCircle2 className="w-3 h-3 text-green-500" />
											<span>Core concepts</span>
										</div>
										<div className="flex items-center gap-1">
											<CheckCircle2 className="w-3 h-3 text-green-500" />
											<span>Practical skills</span>
										</div>
										<div className="flex items-center gap-1">
											<CheckCircle2 className="w-3 h-3 text-green-500" />
											<span>Real projects</span>
										</div>
										<div className="flex items-center gap-1">
											<CheckCircle2 className="w-3 h-3 text-green-500" />
											<span>AI guidance</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</div>
			</Card>
		</motion.div>
	);
};

export default EnhancedCourseCard;
