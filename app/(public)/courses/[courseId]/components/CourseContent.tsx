"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle, Lock, Clock, FileText, Users, Award, BookOpen, ChevronDown, ChevronRight } from "lucide-react";

interface CourseContentProps {
	course: any;
	isEnrolled: boolean;
}

export default function CourseContent({ course, isEnrolled }: CourseContentProps) {
	const [activeTab, setActiveTab] = useState("overview");
	const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "curriculum", label: "Curriculum" },
		{ id: "instructor", label: "Instructor" },
		{ id: "reviews", label: "Reviews" },
	];

	const learningOutcomes = [
		`Master core concepts in ${course.category}`,
		"Build practical projects and portfolio pieces",
		`Apply ${course.level}-level techniques and best practices`,
		"Gain hands-on experience with industry tools",
		"Receive personalized feedback on your progress",
	];

	const requirements = ["Basic computer skills", "Reliable internet connection", "Willingness to learn and practice", "4-6 hours per week for study"];

	const courseIncludes = [
		{ icon: PlayCircle, text: `${course.chapters.length} video lessons` },
		{ icon: FileText, text: "Downloadable resources" },
		{ icon: Award, text: "Certificate of completion" },
		{ icon: Users, text: "Community access" },
		{ icon: Clock, text: "Lifetime access" },
	];

	// Group chapters into modules
	const modules = [];
	const moduleSize = 4;
	for (let i = 0; i < course.chapters.length; i += moduleSize) {
		const moduleChapters = course.chapters.slice(i, i + moduleSize);
		modules.push({
			title: `Module ${Math.floor(i / moduleSize) + 1}`,
			chapters: moduleChapters,
		});
	}

	const toggleModule = (moduleIndex: number) => {
		const newExpanded = new Set(expandedModules);
		if (newExpanded.has(moduleIndex)) {
			newExpanded.delete(moduleIndex);
		} else {
			newExpanded.add(moduleIndex);
		}
		setExpandedModules(newExpanded);
	};

	return (
		<div className="space-y-8">
			{/* Tab Navigation */}
			<div className="border-b border-border">
				<div className="flex space-x-8">
					{tabs.map((tab) => (
						<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative py-4 px-1 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}>
							{tab.label}
							{activeTab === tab.id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" layoutId="activeTab" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content */}
			<AnimatePresence mode="wait">
				<motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
					{activeTab === "overview" && (
						<>
							{/* What you'll learn */}
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">What you'll learn</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid md:grid-cols-2 gap-4">
										{learningOutcomes.map((outcome, index) => (
											<motion.div key={index} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
												<CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
												<span className="text-sm text-foreground">{outcome}</span>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Course includes */}
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">This course includes</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid md:grid-cols-2 gap-4">
										{courseIncludes.map((item, index) => (
											<motion.div key={index} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
												<div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
													<item.icon className="w-4 h-4 text-accent" />
												</div>
												<span className="text-sm text-foreground">{item.text}</span>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Requirements */}
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Requirements</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										{requirements.map((requirement, index) => (
											<motion.div key={index} className="flex items-start gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
												<div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
												<span className="text-sm text-foreground">{requirement}</span>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</>
					)}

					{activeTab === "curriculum" && (
						<Card className="border-border">
							<CardHeader>
								<CardTitle className="text-lg">Course Curriculum</CardTitle>
								<p className="text-sm text-muted-foreground">
									{course.chapters.length} lessons • {course.duration}
								</p>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{modules.map((module, moduleIndex) => (
										<div key={moduleIndex} className="border border-border rounded-lg overflow-hidden">
											<button onClick={() => toggleModule(moduleIndex)} className="w-full p-4 bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between">
												<div className="flex items-center gap-3">
													<ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedModules.has(moduleIndex) ? "rotate-90" : ""}`} />
													<h4 className="font-medium text-foreground">{module.title}</h4>
												</div>
												<span className="text-xs text-muted-foreground">{module.chapters.length} lessons</span>
											</button>
											<AnimatePresence>
												{expandedModules.has(moduleIndex) && (
													<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="divide-y divide-border">
														{module.chapters.map((chapter: any, chapterIndex: number) => (
															<div key={chapter._id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
																<div className="flex items-center gap-3">
																	{isEnrolled ? <PlayCircle className="w-4 h-4 text-accent" /> : chapterIndex === 0 ? <PlayCircle className="w-4 h-4 text-success" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
																	<div>
																		<p className="font-medium text-sm text-foreground">{chapter.title}</p>
																		<p className="text-xs text-muted-foreground">{chapter.videoUrl ? "Video" : "Reading"} • 15 min</p>
																	</div>
																</div>
																{!isEnrolled && chapterIndex === 0 && (
																	<Badge variant="outline" className="text-xs border-success/30 text-success">
																		Preview
																	</Badge>
																)}
																{!isEnrolled && chapterIndex > 0 && (
																	<Badge variant="outline" className="text-xs">
																		Locked
																	</Badge>
																)}
															</div>
														))}
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "instructor" && (
						<Card className="border-border">
							<CardHeader>
								<CardTitle className="text-lg">About the Instructor</CardTitle>
							</CardHeader>
							<CardContent>
								{course.instructor ? (
									<div className="flex items-start gap-6">
										<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
											<Users className="w-8 h-8 text-muted-foreground" />
										</div>
										<div className="flex-1">
											<h4 className="text-lg font-semibold text-foreground mb-1">{course.instructor.name}</h4>
											<p className="text-sm text-muted-foreground mb-4">Expert Instructor</p>
											<p className="text-sm text-foreground leading-relaxed mb-6">{course.instructor.bio || `${course.instructor.name} is a passionate educator with years of experience in ${course.category}.`}</p>
											<div className="grid grid-cols-3 gap-6 text-center">
												<div>
													<div className="text-lg font-bold text-foreground">4.9★</div>
													<div className="text-xs text-muted-foreground">Rating</div>
												</div>
												<div>
													<div className="text-lg font-bold text-foreground">12K</div>
													<div className="text-xs text-muted-foreground">Students</div>
												</div>
												<div>
													<div className="text-lg font-bold text-foreground">8</div>
													<div className="text-xs text-muted-foreground">Courses</div>
												</div>
											</div>
										</div>
									</div>
								) : (
									<p className="text-sm text-muted-foreground">Instructor information not available.</p>
								)}
							</CardContent>
						</Card>
					)}

					{activeTab === "reviews" && (
						<Card className="border-border">
							<CardHeader>
								<CardTitle className="text-lg">Student Reviews</CardTitle>
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-2">
										<span className="text-2xl font-bold">{course.rating}</span>
										<div className="flex">
											{[...Array(5)].map((_, i) => (
												<CheckCircle2 key={i} className="w-4 h-4 text-warning" />
											))}
										</div>
									</div>
									<span className="text-sm text-muted-foreground">({course.totalStudents.toLocaleString()} reviews)</span>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{[
										{
											name: "Alex Johnson",
											rating: 5,
											comment: "Excellent course! The content is well-structured and easy to follow.",
											date: "2 weeks ago",
										},
										{
											name: "Sarah Wilson",
											rating: 5,
											comment: "Great instructor and practical examples. Highly recommend this course.",
											date: "1 month ago",
										},
										{
											name: "Mike Chen",
											rating: 4,
											comment: "Very comprehensive course. The projects were challenging but rewarding.",
											date: "1 month ago",
										},
									].map((review, index) => (
										<motion.div key={index} className="border-b border-border pb-6 last:border-b-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
											<div className="flex items-start gap-4">
												<div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
													<span className="text-sm font-semibold">{review.name.charAt(0)}</span>
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<span className="font-medium text-sm">{review.name}</span>
														<div className="flex">
															{[...Array(review.rating)].map((_, i) => (
																<CheckCircle2 key={i} className="w-3 h-3 text-warning" />
															))}
														</div>
														<span className="text-xs text-muted-foreground">{review.date}</span>
													</div>
													<p className="text-sm text-foreground">{review.comment}</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
