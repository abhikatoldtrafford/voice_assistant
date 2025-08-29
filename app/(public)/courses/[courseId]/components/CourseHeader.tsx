"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, Globe, Award, BookOpen } from "lucide-react";

interface CourseHeaderProps {
	course: any;
	isEnrolled: boolean;
}

export default function CourseHeader({ course, isEnrolled }: CourseHeaderProps) {
	const stats = [
		{ icon: Star, value: course.rating, label: "Rating", format: (val: number) => `${val}/5` },
		{ icon: Users, value: course.totalStudents, label: "Students", format: (val: number) => `${(val / 1000).toFixed(1)}K` },
		{ icon: Clock, value: course.duration, label: "Duration" },
		{ icon: BookOpen, value: course.chapters.length, label: "Lessons" },
	];

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

	return (
		<section className="border-b border-border bg-background">
			<div className="container-custom py-12">
				<motion.div className="max-w-4xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
					{/* Breadcrumb */}
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
						<span>Courses</span>
						<span>/</span>
						<span className="text-foreground">{course.category}</span>
					</div>

					{/* Course Meta */}
					<div className="flex flex-wrap items-center gap-3 mb-6">
						<Badge className={getLevelColor(course.level)}>{course.level}</Badge>
						<Badge variant="outline" className="border-accent/30 text-accent">
							{course.category}
						</Badge>
						{isEnrolled && (
							<Badge className="bg-success text-white">
								<Award className="w-3 h-3 mr-1" />
								Enrolled
							</Badge>
						)}
					</div>

					{/* Title */}
					<h1 className="heading-2 text-foreground mb-4 leading-tight">{course.title}</h1>

					{/* Description */}
					<p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">{course.description}</p>

					{/* Stats */}
					<div className="flex flex-wrap items-center gap-8">
						{stats.map((stat, index) => (
							<motion.div key={stat.label} className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
								<stat.icon className="w-4 h-4 text-muted-foreground" />
								<span className="font-medium text-foreground">{typeof stat.value === "number" && stat.format ? stat.format(stat.value) : stat.value}</span>
								<span className="text-muted-foreground">{stat.label}</span>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
