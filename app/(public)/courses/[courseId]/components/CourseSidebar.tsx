"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Clock, Users, Award, Calendar, Download, Shield, Heart, Share2, CheckCircle, DollarSign } from "lucide-react";
import EnrollButton from "./EnrollButton";

interface CourseSidebarProps {
	course: any;
	isEnrolled: boolean;
	courseId: string;
}

export default function CourseSidebar({ course, isEnrolled, courseId }: CourseSidebarProps) {
	const [isWishlisted, setIsWishlisted] = useState(false);

	const courseFeatures = [
		{ icon: PlayCircle, text: `${course.chapters.length} lessons`, highlight: false },
		{ icon: Clock, text: course.duration, highlight: false },
		{ icon: Users, text: `${course.totalStudents.toLocaleString()} students`, highlight: false },
		{ icon: Award, text: "Certificate included", highlight: true },
		{ icon: Download, text: "Downloadable resources", highlight: false },
		{ icon: Calendar, text: "Lifetime access", highlight: true },
	];

	const stats = [
		{ label: "Rating", value: course.rating, icon: "⭐" },
		{ label: "Completion", value: `${course.completionRate}%`, icon: "📈" },
	];

	return (
		<div className="space-y-6">
			{/* Main Enrollment Card */}
			<Card className="border-border shadow-sm hover:shadow-md transition-shadow duration-300">
				{/* Course Preview */}
				<div className="relative aspect-video group cursor-pointer">
					{course.imageUrl ? (
						<Image src={`/api/files/${course.imageUrl}`} alt={course.title} fill className="object-cover rounded-t-lg" sizes="400px" />
					) : (
						<div className="w-full h-full bg-muted/50 flex items-center justify-center rounded-t-lg">
							<PlayCircle className="w-16 h-16 text-muted-foreground" />
						</div>
					)}

					{/* Preview overlay */}
					<div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-lg">
						<div className="text-center text-primary-foreground">
							<PlayCircle className="w-8 h-8 mx-auto mb-2" />
							<span className="text-sm font-medium">Preview Course</span>
						</div>
					</div>
				</div>

				<CardContent className="p-6 space-y-6">
					{/* Price */}
					<div className="text-center">
						{course.price === 0 ? (
							<div className="text-2xl font-bold text-success">Free</div>
						) : (
							<div>
								<div className="text-3xl font-bold text-foreground">${course.price}</div>
								<div className="text-sm text-muted-foreground">One-time payment</div>
							</div>
						)}
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<EnrollButton courseId={courseId} isEnrolled={isEnrolled} price={course.price} isFree={course.price === 0} />

						<div className="flex gap-2">
							<Button variant="outline" className="flex-1 border-border hover:bg-muted/50" onClick={() => setIsWishlisted(!isWishlisted)}>
								<Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
								{isWishlisted ? "Saved" : "Save"}
							</Button>
							<Button variant="outline" size="icon" className="border-border hover:bg-muted/50">
								<Share2 className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{/* Course Features */}
					<div className="space-y-4">
						<h4 className="font-medium text-foreground">What's included:</h4>
						<div className="space-y-3">
							{courseFeatures.map((feature, index) => (
								<motion.div key={index} className="flex items-center gap-3 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2, delay: index * 0.05 }}>
									<div className="w-6 h-6 bg-accent/10 rounded-md flex items-center justify-center flex-shrink-0">
										<feature.icon className="w-3.5 h-3.5 text-accent" />
									</div>
									<span className={`${feature.highlight ? "font-medium text-foreground" : "text-muted-foreground"}`}>{feature.text}</span>
									{feature.highlight && <CheckCircle className="w-3 h-3 text-success ml-auto" />}
								</motion.div>
							))}
						</div>
					</div>

					{/* Trust Indicators */}
					<div className="pt-4 border-t border-border">
						<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
							<Shield className="w-3 h-3" />
							<span>30-day money-back guarantee</span>
						</div>
						<div className="text-xs text-muted-foreground text-center">Secure payment • Cancel anytime</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<Card className="border-border">
				<CardContent className="p-6">
					<h4 className="font-medium text-foreground mb-4">Course Stats</h4>
					<div className="grid grid-cols-2 gap-4">
						{stats.map((stat, index) => (
							<motion.div key={stat.label} className="text-center p-3 bg-muted/30 rounded-lg" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
								<div className="text-lg font-bold text-foreground">{stat.value}</div>
								<div className="text-xs text-muted-foreground">{stat.label}</div>
							</motion.div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Level Info */}
			<Card className="border-border">
				<CardContent className="p-6">
					<h4 className="font-medium text-foreground mb-4">Difficulty Level</h4>
					<Badge className={`w-full justify-center py-2 ${course.level === "Beginner" ? "difficulty-beginner" : course.level === "Intermediate" ? "difficulty-intermediate" : "difficulty-advanced"}`}>{course.level}</Badge>
					<p className="text-sm text-muted-foreground mt-3 leading-relaxed">
						{course.level === "Beginner" && "Perfect for those starting their learning journey"}
						{course.level === "Intermediate" && "For learners with some basic knowledge"}
						{course.level === "Advanced" && "For experienced learners ready for complex topics"}
					</p>
				</CardContent>
			</Card>

			{/* Additional Info */}
			<div className="p-4 bg-muted/20 rounded-lg border border-border">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<DollarSign className="w-4 h-4" />
					<span>Questions about pricing? Contact our support team.</span>
				</div>
			</div>
		</div>
	);
}
