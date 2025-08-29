"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Play, ChevronRight, ChevronLeft, Menu, X, Clock, Brain, Minimize2, Maximize2 } from "lucide-react";
import { CourseData, IChapterData } from "@/models/Course";
import { markChapterCompleted } from "@/actions/enrollment";
import { useToast } from "@/hooks/use-toast";
import VideoPlayer from "./VideoPlayer";
import RealtimeAICoach from "./RealtimeAICoach";
import { endCoachingSession } from "@/actions/ai/coach";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

let Editor = dynamic(() => import("@/components/EditorJS"), {
	ssr: false,
});

interface CourseProgress {
	progressPercentage: number;
	completedChapters: string[];
	totalChapters: number;
	isCompleted: boolean;
}

interface ModernCourseContentProps {
	course: CourseData;
	progress: CourseProgress;
	userId: string;
	userName: string;
}

export function ModernCourseContent({ course, progress, userId, userName }: ModernCourseContentProps) {
	// Content states
	const [selectedChapter, setSelectedChapter] = useState<IChapterData | null>(null);
	const [completedChapters, setCompletedChapters] = useState<string[]>(progress.completedChapters || []);
	const [currentProgress, setCurrentProgress] = useState(progress.progressPercentage);
	const [readingProgress, setReadingProgress] = useState(0);
	const [showSidebar, setShowSidebar] = useState(false);
	const [showContent, setShowContent] = useState(true);
	const [contentMinimized, setContentMinimized] = useState(false);

	const contentRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	// Initialize content
	useEffect(() => {
		const publishedChapters = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);
		if (publishedChapters.length > 0) {
			const nextChapter = publishedChapters.find((ch) => !completedChapters.includes(ch._id)) || publishedChapters[0];
			setSelectedChapter(nextChapter);
		}
	}, [course.chapters, completedChapters]);

	// Monitor reading progress
	useEffect(() => {
		const handleScroll = () => {
			if (contentRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
				const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
				setReadingProgress(Math.min(Math.round(scrollPercentage), 100));
			}
		};

		if (contentRef.current) {
			contentRef.current.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (contentRef.current) {
				contentRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, []);

	const handleChapterSelect = (chapterId: string) => {
		const chapter = course.chapters.find((ch) => ch._id === chapterId);
		if (chapter) {
			setSelectedChapter(chapter);
			setShowSidebar(false);
		}
	};

	const handleMarkCompleted = async () => {
		if (!selectedChapter) return;

		try {
			const result = await markChapterCompleted(course._id, selectedChapter._id);

			if (result.success) {
				if (!completedChapters.includes(selectedChapter._id)) {
					const newCompleted = [...completedChapters, selectedChapter._id];
					setCompletedChapters(newCompleted);

					const publishedChapters = course.chapters.filter((ch) => ch.isPublished).length;
					const newProgress = Math.round((newCompleted.length / publishedChapters) * 100);
					setCurrentProgress(newProgress);

					toast({
						title: "Progress updated!",
						description: "This chapter has been marked as completed",
					});

					// Auto-advance to next chapter
					const publishedChaptersList = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);
					const currentIndex = publishedChaptersList.findIndex((ch) => ch._id === selectedChapter._id);
					if (currentIndex < publishedChaptersList.length - 1) {
						const nextChapter = publishedChaptersList[currentIndex + 1];
						setSelectedChapter(nextChapter);
					}
				}
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to update progress",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
	};

	const onComplete = (sessionId: string) => {
		endCoachingSession(sessionId, userId).then(() => {
			toast({
				title: "Coaching Session Completed",
				description: "Your coaching session has been completed.",
			});
		});
	};

	const isChapterCompleted = (chapterId: string) => {
		return completedChapters.includes(chapterId);
	};

	const getCurrentChapterIndex = () => {
		const publishedChapters = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);
		return publishedChapters.findIndex((ch) => ch._id === selectedChapter?._id);
	};

	const navigateChapter = (direction: "prev" | "next") => {
		const publishedChapters = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);
		const currentIndex = getCurrentChapterIndex();

		if (direction === "prev" && currentIndex > 0) {
			setSelectedChapter(publishedChapters[currentIndex - 1]);
		} else if (direction === "next" && currentIndex < publishedChapters.length - 1) {
			setSelectedChapter(publishedChapters[currentIndex + 1]);
		}
	};

	const publishedChapters = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);
	const completedCount = completedChapters.length;
	const totalCount = publishedChapters.length;
	const currentIndex = getCurrentChapterIndex();

	if (!selectedChapter) {
		return (
			<div className="flex items-center justify-center h-80 bg-background">
				<div className="text-center">
					<div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading course content...</p>
				</div>
			</div>
		);
	}

	let editorData;
	try {
		editorData = JSON.parse(selectedChapter.content);
	} catch (e) {
		editorData = {
			blocks: [
				{
					type: "paragraph",
					data: {
						text: selectedChapter.content || "",
					},
				},
			],
		};
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="bg-card border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-4">
							<button onClick={() => setShowSidebar(!showSidebar)} className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted rounded-lg transition-colors">
								<Menu className="w-4 h-4" />
							</button>
							<div>
								<h1 className="text-lg font-semibold text-foreground">{course.title}</h1>
								<p className="text-sm text-muted-foreground">{selectedChapter?.title}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Badge variant="secondary" className="text-xs">
								{completedCount} / {totalCount} completed
							</Badge>
							<button onClick={() => setShowContent(!showContent)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors">
								<BookOpen className="w-4 h-4" />
								{showContent ? "Hide" : "Show"} Content
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="flex max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
				{/* Sidebar */}
				<AnimatePresence>
					{showSidebar && (
						<motion.div
							initial={{ x: -300, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: -300, opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed lg:static inset-y-0 left-0 z-50 w-80 bg-card border-r border-border lg:translate-x-0"
						>
							{/* Mobile backdrop */}
							{showSidebar && <div className="fixed inset-0 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setShowSidebar(false)} />}

							<div className="relative h-full flex flex-col">
								<div className="flex items-center justify-between p-4 border-b border-border">
									<h2 className="font-medium text-foreground">Course Content</h2>
									<button onClick={() => setShowSidebar(false)} className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted rounded-lg transition-colors">
										<X className="w-4 h-4" />
									</button>
								</div>

								{/* Progress Overview */}
								<div className="p-4 border-b border-border">
									<div className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-sm font-medium text-foreground">Course Progress</span>
											<span className="text-sm text-muted-foreground">{currentProgress}%</span>
										</div>
										<Progress value={currentProgress} className="h-2" />
									</div>
								</div>

								{/* Chapter List */}
								<div className="flex-1 overflow-y-auto">
									<div className="p-4 space-y-2">
										{publishedChapters.map((chapter, index) => (
											<button
												key={chapter._id}
												onClick={() => handleChapterSelect(chapter._id)}
												className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${selectedChapter._id === chapter._id ? "border-accent bg-accent/10" : "border-border hover:border-accent/50 hover:bg-muted/50"}`}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<span className="text-xs text-muted-foreground font-mono">{String(index + 1).padStart(2, "0")}</span>
														<div>
															<h3 className="font-medium text-sm text-foreground line-clamp-1">{chapter.title}</h3>
															<p className="text-xs text-muted-foreground">{chapter.videoUrl ? "Video" : "Reading"} • 15 min</p>
														</div>
													</div>
													{isChapterCompleted(chapter._id) && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
												</div>
											</button>
										))}
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Main Layout - AI Coach takes center stage */}
				<div className="flex-1 flex">
					{/* AI Coach - Primary Column */}
					<div className="flex-1 bg-card border-r border-border min-h-full">
						<div className="h-full flex flex-col min-h-[calc(100vh-8rem)]">
							<div className="flex items-center justify-between p-4 border-b border-border">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
										<Brain className="w-5 h-5 text-accent" />
									</div>
									<div>
										<h3 className="font-medium text-foreground">AI Tutor</h3>
										<p className="text-xs text-muted-foreground">Ready to help you learn</p>
									</div>
								</div>
								<Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
									Active
								</Badge>
							</div>
							<div className="flex-1 overflow-hidden content-center">
								<RealtimeAICoach
									chapterId={selectedChapter._id}
									chapterTitle={selectedChapter.title}
									chapterContent={selectedChapter.content}
									userId={userId}
									courseId={course._id}
									onComplete={onComplete}
									userName={userName}
									className="h-full w-full"
									onConnectionChange={() => {}}
								/>
							</div>
						</div>
					</div>

					{/* Content Panel - Secondary Column */}
					<AnimatePresence>
						{showContent && (
							<motion.div
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: contentMinimized ? "320px" : "600px", opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="bg-background border-r border-border overflow-hidden"
							>
								<div className="h-full flex flex-col">
									{/* Content Header */}
									<div className="flex items-center justify-between p-4 border-b border-border bg-card">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
												<BookOpen className="w-4 h-4 text-muted-foreground" />
											</div>
											<div>
												<h3 className="font-medium text-foreground text-sm">Course Material</h3>
												{!contentMinimized && (
													<p className="text-xs text-muted-foreground">
														Chapter {currentIndex + 1} of {totalCount}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button onClick={() => setContentMinimized(!contentMinimized)} className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted rounded-lg transition-colors">
												{contentMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
											</button>
											<button onClick={() => setShowContent(false)} className="flex items-center justify-center w-8 h-8 text-foreground hover:bg-muted rounded-lg transition-colors">
												<X className="w-4 h-4" />
											</button>
										</div>
									</div>

									{!contentMinimized && (
										<>
											{/* Chapter Navigation */}
											<div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
												<button
													onClick={() => navigateChapter("prev")}
													disabled={currentIndex === 0}
													className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<ChevronLeft className="w-4 h-4" />
													Previous
												</button>

												<div className="text-center">
													<h4 className="text-sm font-medium text-foreground">{selectedChapter.title}</h4>
												</div>

												<button
													onClick={() => navigateChapter("next")}
													disabled={currentIndex === totalCount - 1}
													className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Next
													<ChevronRight className="w-4 h-4" />
												</button>
											</div>

											{/* Content */}
											<div className="flex-1 overflow-hidden">
												<Card className=" border-0 rounded-none">
													<CardContent className="p-0">
														{/* Video Player */}
														{selectedChapter.videoUrl && (
															<div className="p-4 border-b border-border">
																<VideoPlayer videoUrl={`/api/files/${selectedChapter.videoUrl}`} title={selectedChapter.title} onComplete={() => {}} />
															</div>
														)}

														{/* Text Content */}
														<div ref={contentRef} className="flex-1 max-h-[calc(100vh-25rem)] overflow-y-auto p-4">
															<Editor data={editorData || { blocks: [] }} contentId={selectedChapter._id} readOnly={true} className="prose max-w-none text-sm" />
														</div>

														{/* Progress Footer */}
														<div className="p-4 border-t border-border bg-muted/30">
															<div className="space-y-3">
																<div className="flex justify-between text-sm">
																	<span className="text-muted-foreground">Reading Progress</span>
																	<span className="text-foreground">{readingProgress}%</span>
																</div>
																<Progress value={readingProgress} className="h-1.5" />
																<button
																	onClick={handleMarkCompleted}
																	disabled={isChapterCompleted(selectedChapter._id)}
																	className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
																>
																	{isChapterCompleted(selectedChapter._id) ? (
																		<>
																			<CheckCircle className="w-4 h-4" />
																			Completed
																		</>
																	) : (
																		"Mark as Complete"
																	)}
																</button>
															</div>
														</div>
													</CardContent>
												</Card>
											</div>
										</>
									)}

									{/* Minimized state */}
									{contentMinimized && (
										<div className="flex-1 p-4">
											<div className="space-y-3">
												<div className="text-xs text-muted-foreground">Current chapter:</div>
												<div className="text-sm font-medium text-foreground line-clamp-2">{selectedChapter.title}</div>
												<Progress value={readingProgress} className="h-1" />
												<div className="text-xs text-muted-foreground">{readingProgress}% read</div>
											</div>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
