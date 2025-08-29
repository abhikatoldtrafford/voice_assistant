"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play, ArrowRight, Star, Users, Award, ChevronRight, PlayCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Course {
	_id: string;
	title: string;
	description: string;
	imageUrl?: string;
	level: string;
	progress: number;
	totalChapters: number;
	completedChapters: string[];
	isCompleted: boolean;
	lastAccessed: string;
	category: string;
	instructorName?: string;
}

interface ActiveCoursesProps {
	courses: Course[];
	recommendedCourses: Course[];
	isEmpty: boolean;
}

const ActiveCourses: React.FC<ActiveCoursesProps> = ({ courses, recommendedCourses, isEmpty }) => {
	if (isEmpty) {
		return (
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<div className="space-y-6">
					<div>
						<h2 className="text-2xl font-semibold text-foreground mb-2">Your Learning Journey</h2>
						<p className="text-muted-foreground">Start your personalized learning adventure today</p>
					</div>

					<div className="bg-card border border-border rounded-lg p-12 text-center">
						<div className="max-w-md mx-auto space-y-6">
							<div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
								<BookOpen className="w-8 h-8 text-muted-foreground" />
							</div>

							<div>
								<h3 className="text-xl font-medium mb-2">Ready to Start Learning?</h3>
								<p className="text-muted-foreground">Discover amazing courses tailored to your interests and goals. Your AI tutor is waiting to guide you!</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 justify-center">
								<Link href="/courses">
									<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
										<BookOpen className="w-4 h-4 mr-2" />
										Explore Courses
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</Link>
								<Button variant="outline" className="border-border hover:bg-muted/50">
									Take Assessment
								</Button>
							</div>

							<div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
								<div className="text-center">
									<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
										<Users className="w-4 h-4 text-muted-foreground" />
									</div>
									<p className="text-xs text-muted-foreground">50K+ Students</p>
								</div>
								<div className="text-center">
									<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
										<Award className="w-4 h-4 text-muted-foreground" />
									</div>
									<p className="text-xs text-muted-foreground">1000+ Courses</p>
								</div>
								<div className="text-center">
									<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
										<Star className="w-4 h-4 text-muted-foreground" />
									</div>
									<p className="text-xs text-muted-foreground">4.9★ Rating</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		);
	}

	const getDifficultyColor = (level: string) => {
		switch (level.toLowerCase()) {
			case "beginner":
				return "difficulty-beginner";
			case "intermediate":
				return "difficulty-intermediate";
			case "advanced":
				return "difficulty-advanced";
			default:
				return "badge-outline";
		}
	};

	const getLastAccessedText = (lastAccessed: string) => {
		try {
			return formatDistanceToNow(new Date(lastAccessed), { addSuffix: true });
		} catch {
			return "Recently";
		}
	};

	return (
		<div className="space-y-8">
			{/* Continue Learning Section */}
			{courses.length > 0 && (
				<motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-semibold text-foreground mb-2">Continue Learning</h2>
							<p className="text-muted-foreground">Pick up where you left off</p>
						</div>

						{courses.length > 3 && (
							<Link href="/student/courses">
								<Button variant="outline" className="border-border hover:bg-muted/50">
									View All Courses
									<ChevronRight className="w-4 h-4 ml-1" />
								</Button>
							</Link>
						)}
					</div>

					<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{courses.slice(0, 3).map((course, index) => (
							<motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
								<Card className="bg-card border border-border rounded-lg h-full group hover:shadow-md transition-all duration-300">
									<CardContent className="p-0">
										{/* Course Image */}
										<div className="relative aspect-video overflow-hidden rounded-t-lg">
											<div className="w-full h-full bg-muted flex items-center justify-center">
												{course.imageUrl ? <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" /> : <BookOpen className="w-8 h-8 text-muted-foreground" />}
											</div>

											{/* Progress Overlay */}
											<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
												<div className="flex items-center justify-between text-foreground mb-2">
													<span className="text-sm font-medium">{Math.round(course.progress)}% Complete</span>
													<div className="flex items-center gap-1">
														<Clock className="w-3 h-3" />
														<span className="text-xs">{getLastAccessedText(course.lastAccessed)}</span>
													</div>
												</div>
												<div className="w-full bg-muted rounded-full h-1.5">
													<div className="h-1.5 rounded-full bg-primary transition-all duration-700" style={{ width: `${course.progress}%` }} />
												</div>
											</div>

											{/* Continue Button Overlay */}
											<div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
												<div className="w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border">
													<PlayCircle className="w-6 h-6 text-foreground" />
												</div>
											</div>
										</div>

										{/* Course Content */}
										<div className="p-6 space-y-4">
											<div>
												<h3 className="font-medium text-foreground mb-2 line-clamp-2">{course.title}</h3>
												<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
											</div>

											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Badge variant="secondary" className={getDifficultyColor(course.level)}>
														{course.level}
													</Badge>
													<span className="text-xs text-muted-foreground">
														{course.completedChapters.length} / {course.totalChapters} chapters
													</span>
												</div>
											</div>

											<Link href={`/student/courses/${course._id}`}>
												<Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
													<Play className="w-4 h-4 mr-2" />
													Continue Learning
												</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}

			{/* Recommended Courses Section */}
			{recommendedCourses.length > 0 && (
				<motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
					<div>
						<h2 className="text-2xl font-semibold text-foreground mb-2">Start Something New</h2>
						<p className="text-muted-foreground">Courses you enrolled in but haven't started yet</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						{recommendedCourses.slice(0, 3).map((course, index) => (
							<motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}>
								<Card className="bg-card border-2 border-dashed border-border hover:border-accent/50 hover:bg-muted/30 transition-all duration-300 group">
									<CardContent className="p-6 text-center space-y-4">
										<div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto">
											<BookOpen className="w-6 h-6 text-muted-foreground" />
										</div>

										<div>
											<h3 className="font-medium text-foreground mb-2">{course.title}</h3>
											<p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
											<Badge variant="secondary" className={getDifficultyColor(course.level)}>
												{course.level}
											</Badge>
										</div>

										<Link href={`/student/courses/${course._id}`}>
											<Button variant="outline" className="w-full border-border hover:bg-accent/90">
												<PlayCircle className="w-4 h-4 mr-2" />
												Start Course
											</Button>
										</Link>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default ActiveCourses;
