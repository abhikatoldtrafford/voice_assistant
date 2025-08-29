"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, Target, Zap, ArrowRight, PlayCircle } from "lucide-react";
import CourseCard from "./CourseCard";

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

interface ActiveCoursesGridProps {
	courses: Course[];
}

const ActiveCoursesGrid: React.FC<ActiveCoursesGridProps> = ({ courses }) => {
	// Sort courses by recent activity and progress
	const sortedCourses = [...courses].sort((a, b) => {
		// Prioritize recently accessed courses
		const aDate = new Date(a.lastAccessed).getTime();
		const bDate = new Date(b.lastAccessed).getTime();
		return bDate - aDate;
	});

	// Get the most recently accessed course for highlight
	const featuredCourse = sortedCourses[0];
	const otherCourses = sortedCourses.slice(1);

	// Calculate overall progress
	const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length;
	const totalTimeRemaining = courses.reduce((sum, course) => sum + (course.estimatedTimeLeft || 0), 0);

	return (
		<motion.div className="space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
			{/* Section Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
						<div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
							<TrendingUp className="w-4 h-4 text-white" />
						</div>
						Continue Learning
					</h2>
					<p className="text-muted-foreground mt-1">Pick up where you left off</p>
				</div>

				<div className="flex items-center gap-4">
					<Badge variant="secondary" className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800">
						<PlayCircle className="w-3 h-3 mr-1" />
						{courses.length} active
					</Badge>

					{totalTimeRemaining > 0 && (
						<Badge variant="outline" className="hidden sm:inline-flex">
							<Clock className="w-3 h-3 mr-1" />
							{Math.round(totalTimeRemaining)}h remaining
						</Badge>
					)}
				</div>
			</div>

			{/* Progress Overview */}
			<motion.div className="adaptive-card p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
				<div className="grid md:grid-cols-3 gap-6">
					{/* Overall Progress */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
								<Target className="w-4 h-4 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Overall Progress</h3>
								<p className="text-xs text-muted-foreground">Across all active courses</p>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Average completion</span>
								<span className="font-medium text-foreground">{Math.round(totalProgress)}%</span>
							</div>
							<Progress value={totalProgress} className="h-2" />
						</div>
					</div>

					{/* Study Velocity */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
								<Zap className="w-4 h-4 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Study Velocity</h3>
								<p className="text-xs text-muted-foreground">Learning momentum</p>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">This week</span>
								<span className="font-medium text-green-600">+15%</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<motion.div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1, delay: 0.5 }} />
								</div>
								<span className="text-xs text-muted-foreground">Great!</span>
							</div>
						</div>
					</div>

					{/* Time Investment */}
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
								<Clock className="w-4 h-4 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Time Investment</h3>
								<p className="text-xs text-muted-foreground">Weekly learning hours</p>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">This week</span>
								<span className="font-medium text-foreground">12.5h</span>
							</div>
							<div className="text-xs text-purple-600">Goal: 15h/week</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Featured Course (Most Recent) */}
			{featuredCourse && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<ArrowRight className="w-5 h-5 text-blue-600" />
							Continue Where You Left Off
						</h3>
						<p className="text-sm text-muted-foreground">Recently accessed course</p>
					</div>
					<div className="grid lg:grid-cols-1">
						<CourseCard course={featuredCourse} variant="active" />
					</div>
				</motion.div>
			)}

			{/* Other Active Courses */}
			{otherCourses.length > 0 && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
					<div className="mb-4">
						<h3 className="text-lg font-semibold text-foreground">Other Active Courses</h3>
						<p className="text-sm text-muted-foreground">Your ongoing learning journey</p>
					</div>
					<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
						{otherCourses.map((course, index) => (
							<motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
								<CourseCard course={course} variant="active" />
							</motion.div>
						))}
					</div>
				</motion.div>
			)}
		</motion.div>
	);
};

export default ActiveCoursesGrid;
