"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { markChapterCompleted } from "@/actions/enrollment";
import { useToast } from "@/hooks/use-toast";
import { CourseData, IChapterData } from "@/models/Course";
import ImmersiveAICoach from "./AICoach";
import ChapterSelector from "./ChapterSelector";

interface CourseProgress {
	progressPercentage: number;
	completedChapters: string[];
	totalChapters: number;
	isCompleted: boolean;
}

interface CourseContentProps {
	course: CourseData;
	progress: CourseProgress;
	userId: string;
	userName: string; // Added for AI coach personalization
}

export function CourseContent({ course, progress, userId, userName }: CourseContentProps) {
	const publishedChapters = course.chapters.filter((ch) => ch.isPublished).sort((a, b) => a.position - b.position);

	const [selectedChapter, setSelectedChapter] = useState<IChapterData | null>(null);
	const [completedChapters, setCompletedChapters] = useState<string[]>(progress.completedChapters || []);
	const [currentProgress, setCurrentProgress] = useState(progress.progressPercentage);
	const { toast } = useToast();

	// Track whether initial selection has happened
	const [hasInitialized, setHasInitialized] = useState(false);

	// Set initial selected chapter only once on mount
	useEffect(() => {
		if (publishedChapters.length > 0 && !hasInitialized) {
			// Find the first incomplete chapter, or the first chapter if all are complete
			const nextChapter = publishedChapters.find((ch) => !completedChapters.includes(ch._id)) || publishedChapters[0];
			setSelectedChapter(nextChapter);
			setHasInitialized(true);
		}
	}, [publishedChapters, completedChapters, hasInitialized]);

	// Function to handle chapter selection from the selector
	const handleChapterSelect = (chapterId: string) => {
		const chapter = publishedChapters.find((ch) => ch._id === chapterId);
		if (chapter) {
			setSelectedChapter(chapter);
		}
	};

	// Function to mark chapter as completed
	const handleMarkCompleted = async () => {
		if (!selectedChapter) return;

		try {
			const result = await markChapterCompleted(course._id, selectedChapter._id);

			if (result.success) {
				// Update local state but preserve the current selected chapter
				const currentChapter = selectedChapter;

				if (!completedChapters.includes(currentChapter._id)) {
					const newCompleted = [...completedChapters, currentChapter._id];
					setCompletedChapters(newCompleted);

					// Calculate new progress percentage
					const newProgress = Math.round((newCompleted.length / publishedChapters.length) * 100);
					setCurrentProgress(newProgress);

					// Show success toast
					toast({
						title: "Progress updated!",
						description: "This chapter has been marked as completed",
					});

					// Auto-advance to next chapter if available
					const currentIndex = publishedChapters.findIndex((ch) => ch._id === currentChapter._id);
					if (currentIndex < publishedChapters.length - 1) {
						const nextChapter = publishedChapters[currentIndex + 1];
						setSelectedChapter(nextChapter);

						toast({
							title: "Moving to next chapter",
							description: `Now viewing: ${nextChapter.title}`,
						});
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

	if (!selectedChapter) {
		return <div className="flex items-center justify-center h-40">No chapters available</div>;
	}
	let editorData;
	try {
		editorData = JSON.parse(selectedChapter.content);
	} catch (e) {
		// For backward compatibility with HTML content
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
		<div className="container mx-auto py-8">
			{/* Course title and progress bar */}
			<div className="mb-8">
				<h1 className="text-2xl font-bold mb-2">{course.title}</h1>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Course Progress</span>
						<span>{currentProgress || 0}%</span>
					</div>
					<Progress value={currentProgress || 0} className="h-2" />
				</div>
			</div>
			<div className="flex gap-5">
				{/* Chapter selector */}
				<div className="flex flex-col gap-6">
					<div className="text pb-3">Chapters</div>
					<ChapterSelector chapters={course.chapters} currentChapterId={selectedChapter._id} onSelectChapter={handleChapterSelect} completedChapters={completedChapters} />
				</div>

				{/* Immersive AI Coach integrated with chapter content */}
				{selectedChapter && (
					<ImmersiveAICoach
						chapterId={selectedChapter._id}
						chapterTitle={selectedChapter.title}
						chapterContent={selectedChapter.content}
						userId={userId}
						courseId={course._id}
						onComplete={handleMarkCompleted}
						userName={userName}
						videoUrl={selectedChapter.videoUrl || null}
					/>
				)}
			</div>
		</div>
	);
}
