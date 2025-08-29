"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourseData } from "@/models/Course";
import { BookOpen, Users, Clock, Star, User, Play, ChevronRight, Award, TrendingUp, Zap } from "lucide-react";

interface CourseCardProps {
	course: CourseData;
	index: number;
	viewMode?: "grid" | "list";
}

function getLevelColor(level: string) {
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
}

function getCategoryIcon(category: string) {
	const categoryLower = category.toLowerCase();
	if (categoryLower.includes("programming") || categoryLower.includes("code")) return BookOpen;
	if (categoryLower.includes("design")) return Star;
	if (categoryLower.includes("business")) return TrendingUp;
	if (categoryLower.includes("ai") || categoryLower.includes("machine")) return Zap;
	return BookOpen;
}

export default function CourseCard({ course, index, viewMode = "grid" }: CourseCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false);

	const chapterCount = course.chapters.filter((ch) => ch.isPublished).length;
	const displayPrice = course.price === 0 ? "Free" : `$${course.price}`;
	const displayImage = course.imageUrl ? `/api/files/${course.imageUrl}` : null;
	const mockRating = (4.2 + Math.random() * 0.8).toFixed(1);
	const mockStudentCount = Math.floor(Math.random() * 50000) + 1000;
	const estimatedDuration = Math.ceil(chapterCount * 1.5); // Estimate hours
	const CategoryIcon = getCategoryIcon(course.category);

	if (viewMode === "list") {
		return (
			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
				<Card className="adaptive-card overflow-hidden group hover:shadow-floating transition-all duration-500">
					<div className="flex flex-col lg:flex-row">
						{/* Course Image */}
						<div className="relative w-full lg:w-80 h-48 lg:h-auto overflow-hidden bg-muted/30">
							{displayImage ? (
								<div className="relative w-full h-full">
									<Image
										src={displayImage}
										alt={course.title}
										fill
										className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
										sizes="(max-width: 1024px) 100vw, 320px"
										onLoad={() => setImageLoaded(true)}
									/>
									{!imageLoaded && (
										<div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
											<BookOpen className="w-12 h-12 text-muted-foreground" />
										</div>
									)}
								</div>
							) : (
								<div className="w-full h-full bg-gradient-surface flex items-center justify-center">
									<CategoryIcon className="w-16 h-16 text-muted-foreground" />
								</div>
							)}

							{/* Overlay on hover */}
							<motion.div className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" initial={false} animate={{ opacity: isHovered ? 1 : 0 }}>
								<div className="text-center text-primary-foreground">
									<Play className="w-12 h-12 mx-auto mb-2" />
									<span className="font-medium">Preview Course</span>
								</div>
							</motion.div>

							{/* Price Badge */}
							<div className="absolute top-4 right-4">
								<Badge className={`${course.price === 0 ? "bg-success text-white" : "bg-card text-foreground"} shadow-md`}>{displayPrice}</Badge>
							</div>
						</div>

						{/* Content */}
						<div className="flex-1 p-8">
							<div className="h-full flex flex-col">
								{/* Header */}
								<div className="mb-4">
									<div className="flex items-center gap-3 mb-3">
										<Badge className={getLevelColor(course.level)}>{course.level}</Badge>
										<Badge variant="outline" className="border-accent/30 text-accent">
											<CategoryIcon className="w-3 h-3 mr-1" />
											{course.category}
										</Badge>
									</div>
									<h3 className="text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">{course.title}</h3>
									<p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">{course.description}</p>
								</div>

								{/* Instructor */}
								<div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
									<User className="w-4 h-4" />
									<span>Expert Instructor</span>
								</div>

								{/* Stats */}
								<div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
									<div className="flex items-center gap-1">
										<Star className="w-4 h-4 text-warning fill-warning" />
										<span className="font-medium">{mockRating}</span>
									</div>
									<div className="flex items-center gap-1">
										<Users className="w-4 h-4" />
										<span>{(mockStudentCount / 1000).toFixed(1)}K students</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="w-4 h-4" />
										<span>{estimatedDuration}h total</span>
									</div>
									<div className="flex items-center gap-1">
										<BookOpen className="w-4 h-4" />
										<span>{chapterCount} lessons</span>
									</div>
								</div>

								{/* Footer */}
								<div className="flex items-center justify-between mt-auto">
									<div className="text-2xl font-bold text-foreground">{displayPrice}</div>
									<Link href={`/courses/${course._id}`}>
										<Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300 group/btn">
											View Course
											<ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</motion.div>
		);
	}

	// Grid View
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
			<Card className="adaptive-card h-full overflow-hidden group hover:shadow-floating transition-all duration-500 hover:-translate-y-1">
				{/* Course Image */}
				<div className="relative aspect-video overflow-hidden bg-muted/30">
					{displayImage ? (
						<div className="relative w-full h-full">
							<Image
								src={displayImage}
								alt={course.title}
								fill
								className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								onLoad={() => setImageLoaded(true)}
							/>
							{!imageLoaded && (
								<div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
									<BookOpen className="w-12 h-12 text-muted-foreground" />
								</div>
							)}
						</div>
					) : (
						<div className="w-full h-full bg-gradient-surface flex items-center justify-center">
							<CategoryIcon className="w-16 h-16 text-muted-foreground" />
						</div>
					)}

					{/* Overlay on hover */}
					<motion.div className="absolute inset-0 bg-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" initial={false} animate={{ opacity: isHovered ? 1 : 0 }}>
						<div className="text-center text-primary-foreground">
							<Play className="w-8 h-8 mx-auto mb-1" />
							<span className="text-sm font-medium">Preview</span>
						</div>
					</motion.div>

					{/* Price Badge */}
					<div className="absolute top-3 right-3">
						<Badge className={`${course.price === 0 ? "bg-success text-white" : "bg-card text-foreground"} shadow-md`}>{displayPrice}</Badge>
					</div>

					{/* Level Badge */}
					<div className="absolute top-3 left-3">
						<Badge className={getLevelColor(course.level)}>{course.level}</Badge>
					</div>
				</div>

				<CardContent className="p-6 flex-1 flex flex-col">
					{/* Category */}
					<div className="mb-3">
						<Badge variant="outline" className="border-accent/30 text-accent">
							<CategoryIcon className="w-3 h-3 mr-1" />
							{course.category}
						</Badge>
					</div>

					{/* Title and Description */}
					<h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">{course.title}</h3>
					<p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4 flex-1">{course.description}</p>

					{/* Instructor */}
					<div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
						<User className="w-4 h-4" />
						<span>Expert Instructor</span>
					</div>

					{/* Stats Grid */}
					<div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-6">
						<div className="flex items-center gap-1">
							<Star className="w-3 h-3 text-warning fill-warning" />
							<span className="font-medium">{mockRating}</span>
						</div>
						<div className="flex items-center gap-1">
							<Users className="w-3 h-3" />
							<span>{Math.round(mockStudentCount / 1000)}K</span>
						</div>
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							<span>{estimatedDuration}h</span>
						</div>
						<div className="flex items-center gap-1">
							<BookOpen className="w-3 h-3" />
							<span>{chapterCount} lessons</span>
						</div>
					</div>
				</CardContent>

				<CardFooter className="p-6 pt-0 mt-auto">
					<Link href={`/courses/${course._id}`} className="w-full">
						<Button className="w-full bg-primary text-accent-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 group/btn">
							View Course
							<ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
						</Button>
					</Link>
				</CardFooter>
			</Card>
		</motion.div>
	);
}
