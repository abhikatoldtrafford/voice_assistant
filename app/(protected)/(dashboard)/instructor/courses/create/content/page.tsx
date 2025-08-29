"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, Save, CheckCircle, FileText, Rocket, SendHorizonal, AlertCircle, Clock } from "lucide-react";

import { getCourseById } from "@/actions/course";
import { submitCourseForReview } from "@/actions/course";

import ChapterSidebar from "./components/ChapterSidebar";
import ChapterEditor from "./components/ChapterEditor";
import CourseDetailsDialog from "./components/CourseDetailsDialog";
import SubmitReviewDialog from "./components/SubmitReviewDialog";

// Define interfaces
import { Chapter, CourseCompletionStatus } from "./types";
import { CourseData } from "@/models/Course";

export default function CourseContentPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	// State variables
	const [chapters, setChapters] = useState<Chapter[]>([]);
	const [selectedChapter, setSelectedChapter] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [coursePublished, setCoursePublished] = useState(false);
	const [reviewStatus, setReviewStatus] = useState<"draft" | "pending" | "approved" | "rejected">("draft");
	const [reviewComment, setReviewComment] = useState<string | undefined>(undefined);
	const [courseTitle, setCourseTitle] = useState("");
	const [showSubmitReviewDialog, setShowSubmitReviewDialog] = useState(false);
	const [showReviewFeedbackDialog, setShowReviewFeedbackDialog] = useState(false);
	const [previewMode, setPreviewMode] = useState(false);
	const [courseInfoOpen, setCourseInfoOpen] = useState(false);
	const [courseData, setCourseData] = useState<Omit<CourseData, "instructorId" | "_id"> | CourseData>({
		title: "",
		description: "",
		category: "",
		level: "",
		price: 0,
		imageUrl: "",
		isPublished: false,
		chapters: [],
		reviewStatus: "draft",
	});
	const [courseCompletionStatus, setCourseCompletionStatus] = useState<CourseCompletionStatus>({
		hasTitle: false,
		hasDescription: false,
		hasChapters: false,
		hasContent: false,
		hasVideo: false,
		isPublished: false,
		totalCompleted: 0,
		totalRequired: 4, // title, description, chapters, content
	});

	const courseId = searchParams.get("courseId");
	if (!courseId) {
		router.push("/instructor/courses");
		return null;
	}

	// Fetch course data on mount
	useEffect(() => {
		const fetchCourse = async () => {
			if (!courseId) return;

			try {
				setIsLoading(true);
				const { success, course, error } = await getCourseById(courseId);

				if (success && course) {
					setCourseTitle(course.title);
					setReviewStatus(course.reviewStatus || "draft");
					setReviewComment(course.reviewComment);
					setCoursePublished(course.isPublished);

					// Set course data for editing
					setCourseData({
						_id: course._id,
						title: course.title,
						description: course.description || "",
						category: course.category || "",
						level: course.level || "",
						price: course.price || 0,
						imageUrl: course.imageUrl || "",
						isPublished: course.isPublished,
						chapters: course.chapters || [],
						reviewStatus: course.reviewStatus || "draft",
					});

					// Transform chapters to the format expected by the component
					const formattedChapters = course.chapters
						.map((chapter: any) => ({
							id: chapter._id.toString(),
							title: chapter.title,
							content: chapter.content,
							videoUrl: chapter.videoUrl,
							videoName: chapter.videoUrl ? getFileNameFromUrl(chapter.videoUrl) : undefined,
							position: chapter.position,
							isPublished: chapter.isPublished,
						}))
						.sort((a: Chapter, b: Chapter) => a.position - b.position);

					setChapters(formattedChapters);

					if (formattedChapters.length > 0) {
						setSelectedChapter(formattedChapters[0].id);
					}

					// Update course completion status
					const hasChapters = formattedChapters.length > 0;
					const hasContent = formattedChapters.some((ch) => ch.content && ch.content.length > 30);
					const hasVideo = formattedChapters.some((ch) => ch.videoUrl);

					setCourseCompletionStatus({
						hasTitle: !!course.title,
						hasDescription: !!course.description && course.description.length > 20,
						hasChapters,
						hasContent,
						hasVideo,
						isPublished: course.isPublished,
						totalCompleted: [!!course.title, !!course.description && course.description.length > 20, hasChapters, hasContent].filter(Boolean).length,
						totalRequired: 4,
					});
				} else {
					toast({
						title: "Error",
						description: error || "Failed to load course",
						variant: "destructive",
					});
				}
			} catch (error) {
				console.error("Error fetching course:", error);
				toast({
					title: "Error",
					description: "An unexpected error occurred",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchCourse();
	}, [courseId, toast]);

	// Helper function to extract filename from URL
	const getFileNameFromUrl = (url: string) => {
		const parts = url.split("/");
		return parts[parts.length - 1];
	};

	// Handle submitting course for review
	const handleSubmitForReview = async () => {
		try {
			setIsLoading(true);

			const result = await submitCourseForReview(courseId);

			if (result.success) {
				setReviewStatus("pending");

				toast({
					title: "Success",
					description: "Course submitted for review successfully",
				});

				setShowSubmitReviewDialog(false);
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to submit course for review",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error submitting course for review:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Get review status message
	const getReviewStatusMessage = () => {
		switch (reviewStatus) {
			case "draft":
				return "Draft - Not yet submitted for review";
			case "pending":
				return "Pending - Awaiting admin review";
			case "approved":
				return "Approved - Published and available to students";
			case "rejected":
				return "Rejected - Changes needed before resubmitting";
			default:
				return "Draft";
		}
	};

	// Get current chapter
	const currentChapter = chapters.find((c) => c.id === selectedChapter);

	// Get review status badge
	const getReviewBadge = () => {
		switch (reviewStatus) {
			case "draft":
				return (
					<Badge variant="outline" className="text-gray-500">
						Draft
					</Badge>
				);
			case "pending":
				return (
					<Badge variant="secondary" className="bg-amber-100 text-amber-800">
						Pending Review
					</Badge>
				);
			case "approved":
				return (
					<Badge variant="default" className="bg-green-100 text-green-800">
						Approved
					</Badge>
				);
			case "rejected":
				return <Badge variant="destructive">Rejected</Badge>;
			default:
				return <Badge variant="outline">Draft</Badge>;
		}
	};

	// Get primary action button
	const getPrimaryActionButton = () => {
		switch (reviewStatus) {
			case "draft":
				return (
					<Button onClick={() => setShowSubmitReviewDialog(true)} disabled={isLoading || chapters.length === 0} className="gap-2">
						<SendHorizonal className="h-4 w-4" />
						Submit for Review
					</Button>
				);
			case "pending":
				return (
					<Button variant="outline" disabled={true} className="gap-2">
						<Clock className="h-4 w-4" />
						Under Review
					</Button>
				);
			case "approved":
				if (coursePublished) {
					return (
						<Button variant="outline" onClick={() => setShowSubmitReviewDialog(true)} disabled={isLoading} className="gap-2">
							<Rocket className="h-4 w-4" />
							Submit Updates for Review
						</Button>
					);
				} else {
					return (
						<Button onClick={() => setShowSubmitReviewDialog(true)} disabled={isLoading} className="gap-2">
							<SendHorizonal className="h-4 w-4" />
							Submit for Review
						</Button>
					);
				}
			case "rejected":
				return (
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setShowReviewFeedbackDialog(true)} className="gap-2">
							<AlertCircle className="h-4 w-4" />
							View Feedback
						</Button>
						<Button onClick={() => setShowSubmitReviewDialog(true)} disabled={isLoading} className="gap-2">
							<SendHorizonal className="h-4 w-4" />
							Submit Again
						</Button>
					</div>
				);
			default:
				return (
					<Button onClick={() => setShowSubmitReviewDialog(true)} disabled={isLoading} className="gap-2">
						<SendHorizonal className="h-4 w-4" />
						Submit for Review
					</Button>
				);
		}
	};

	return (
		<div className="max-w-7xl mx-auto py-6 px-4">
			{/* Header with navigation and actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
				<div>
					<Button variant="ghost" onClick={() => router.push("/instructor/courses")} className="mb-2">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Courses
					</Button>
					<h1 className="text-2xl font-bold">{courseTitle}</h1>

					{/* Course info button */}
					<Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setCourseInfoOpen(true)}>
						Edit course details
					</Button>
				</div>

				<div className="flex items-center gap-2">
					{/* Course completion indicator */}
					<div className="hidden md:flex items-center mr-2">
						<div className="flex flex-col mr-3">
							<span className="text-sm font-medium mb-1">Course completion</span>
							<Progress value={(courseCompletionStatus.totalCompleted / courseCompletionStatus.totalRequired) * 100} className="h-2 w-32" />
						</div>
						{getReviewBadge()}
					</div>

					<Button variant="outline" onClick={() => setPreviewMode(!previewMode)} className="gap-2">
						{previewMode ? (
							<>
								<FileText className="h-4 w-4" />
								Edit Mode
							</>
						) : (
							<>
								<Eye className="h-4 w-4" />
								Preview
							</>
						)}
					</Button>

					<Button
						variant="outline"
						onClick={() => {
							if (currentChapter) {
								const element = document.getElementById("save-chapter-button");
								if (element) element.click();
							}
						}}
						disabled={isSaving || !selectedChapter}
						className="gap-2"
					>
						<Save className="h-4 w-4" />
						{isSaving ? "Saving..." : "Save"}
					</Button>

					{getPrimaryActionButton()}
				</div>
			</div>

			{/* Status information */}
			<div className="mb-6 p-4 rounded-lg  border flex flex-col sm:flex-row sm:items-center justify-between">
				<div>
					<h3 className="font-medium">Review Status: {getReviewStatusMessage()}</h3>
					{reviewStatus === "rejected" && <p className="text-sm text-muted-foreground mt-1">This course was rejected. View feedback and make changes before resubmitting.</p>}
					{reviewStatus === "pending" && <p className="text-sm text-muted-foreground mt-1">Your course is currently under review. You will be notified when it's approved or if changes are needed.</p>}
					{reviewStatus === "approved" && coursePublished && <p className="text-sm text-muted-foreground mt-1">Your course is published. Any changes you make will need to be reviewed before being published.</p>}
				</div>
				<div className="mt-2 sm:mt-0">
					{reviewStatus === "rejected" && (
						<Button variant="outline" size="sm" onClick={() => setShowReviewFeedbackDialog(true)} className="gap-2">
							<AlertCircle className="h-4 w-4" />
							View Feedback
						</Button>
					)}
				</div>
			</div>

			{/* Main content area with grid layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{/* Sidebar for chapters */}
				<ChapterSidebar
					chapters={chapters}
					setChapters={setChapters}
					selectedChapter={selectedChapter}
					setSelectedChapter={setSelectedChapter}
					courseId={courseId}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					toast={toast}
					courseCompletionStatus={courseCompletionStatus}
					setCourseCompletionStatus={setCourseCompletionStatus}
				/>

				{/* Content editor */}
				<ChapterEditor
					currentChapter={currentChapter}
					chapters={chapters}
					setChapters={setChapters}
					selectedChapter={selectedChapter}
					courseId={courseId}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					isSaving={isSaving}
					setIsSaving={setIsSaving}
					previewMode={previewMode}
					toast={toast}
					courseCompletionStatus={courseCompletionStatus}
					setCourseCompletionStatus={setCourseCompletionStatus}
				/>
			</div>

			{/* Course Details Dialog */}
			<CourseDetailsDialog
				open={courseInfoOpen}
				setOpen={setCourseInfoOpen}
				courseData={courseData}
				setCourseData={setCourseData}
				courseId={courseId}
				setCourseTitle={setCourseTitle}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				toast={toast}
				courseCompletionStatus={courseCompletionStatus}
				setCourseCompletionStatus={setCourseCompletionStatus}
			/>

			{/* Submit for Review dialog */}
			<SubmitReviewDialog
				open={showSubmitReviewDialog}
				setOpen={setShowSubmitReviewDialog}
				courseCompletionStatus={courseCompletionStatus}
				handleSubmit={handleSubmitForReview}
				isResubmission={reviewStatus === "rejected" || (reviewStatus === "approved" && coursePublished)}
			/>

			{/* Review Feedback dialog */}
			{reviewComment && (
				<Dialog open={showReviewFeedbackDialog} onOpenChange={setShowReviewFeedbackDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Review Feedback</DialogTitle>
							<DialogDescription>Please address the following feedback before resubmitting your course.</DialogDescription>
						</DialogHeader>
						<div className="py-4">
							<div className="border p-4 rounded-md bg-red-50">
								<h4 className="font-medium mb-2">Admin Feedback:</h4>
								<p>{reviewComment}</p>
							</div>
						</div>
						<DialogFooter>
							<Button onClick={() => setShowReviewFeedbackDialog(false)}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
