"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Send, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { deleteCourse, submitCourseForReview } from "@/actions/course";
import { useToast } from "@/hooks/use-toast";

interface CourseControlsProps {
	courseId: string;
	reviewStatus: "draft" | "pending" | "approved" | "rejected";
	reviewComment?: string;
	isPublished: boolean;
}

export default function CourseControls({ courseId, reviewStatus, reviewComment, isPublished }: CourseControlsProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showReviewDialog, setShowReviewDialog] = useState(false);
	const [showRejectionDetails, setShowRejectionDetails] = useState(false);

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
			try {
				setIsDeleting(true);
				const result = await deleteCourse(courseId);

				if (result.success) {
					toast({
						title: "Course deleted",
						description: "The course has been deleted successfully.",
					});
					router.refresh();
				} else {
					toast({
						title: "Error",
						description: result.error || "Failed to delete course",
						variant: "destructive",
					});
				}
			} catch (error) {
				toast({
					title: "Error",
					description: "An unexpected error occurred",
					variant: "destructive",
				});
			} finally {
				setIsDeleting(false);
			}
		}
	};

	const handleSubmitForReview = async () => {
		try {
			setIsSubmitting(true);
			const result = await submitCourseForReview(courseId);

			if (result.success) {
				toast({
					title: "Course submitted for review",
					description: "Your course has been submitted for review. You'll be notified once it's approved.",
				});
				setShowReviewDialog(false);
				router.refresh();
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to submit course for review",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Render status badge
	const renderStatusBadge = () => {
		switch (reviewStatus) {
			case "draft":
				return <Badge variant="outline">Draft</Badge>;
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

	// Render appropriate action button based on status
	const renderActionButton = () => {
		switch (reviewStatus) {
			case "draft":
				return (
					<Button variant="outline" size="sm" className="gap-2" onClick={() => setShowReviewDialog(true)}>
						<Send className="h-4 w-4" />
						Submit for Review
					</Button>
				);
			case "pending":
				return (
					<Button variant="outline" size="sm" className="gap-2" disabled>
						<Clock className="h-4 w-4" />
						Under Review
					</Button>
				);
			case "approved":
				return (
					<Button variant="outline" size="sm" className="gap-2" onClick={() => router.push(`/instructor/courses/create/content?courseId=${courseId}`)}>
						<Pencil className="h-4 w-4" />
						Edit Course
					</Button>
				);
			case "rejected":
				return (
					<div className="flex gap-2">
						<Button variant="outline" size="sm" onClick={() => setShowRejectionDetails(true)}>
							<AlertCircle className="h-4 w-4 mr-1" />
							View Feedback
						</Button>
						<Button variant="outline" size="sm" onClick={() => router.push(`/instructor/courses/create/content?courseId=${courseId}`)}>
							<Pencil className="h-4 w-4 mr-1" />
							Make Changes
						</Button>
					</div>
				);
			default:
				return (
					<Button variant="outline" size="sm" onClick={() => router.push(`/instructor/courses/create/content?courseId=${courseId}`)}>
						<Pencil className="h-4 w-4 mr-1" />
						Edit Course
					</Button>
				);
		}
	};

	return (
		<div className="flex justify-between w-full">
			<div className="flex items-center gap-2">
				{renderStatusBadge()}
				{renderActionButton()}
			</div>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => router.push(`/instructor/courses/create/content?courseId=${courseId}`)}>
						<Pencil className="h-4 w-4 mr-2" />
						Edit Content
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push(`/instructor/courses/${courseId}/chapters`)}>Manage chapters</DropdownMenuItem>
					{reviewStatus === "rejected" && (
						<DropdownMenuItem onClick={() => setShowRejectionDetails(true)}>
							<AlertCircle className="h-4 w-4 mr-2" />
							View Rejection Details
						</DropdownMenuItem>
					)}
					{reviewStatus === "draft" && (
						<DropdownMenuItem onClick={() => setShowReviewDialog(true)}>
							<Send className="h-4 w-4 mr-2" />
							Submit for Review
						</DropdownMenuItem>
					)}
					{reviewStatus === "approved" && isPublished && (
						<DropdownMenuItem onClick={() => setShowReviewDialog(true)}>
							<RefreshCw className="h-4 w-4 mr-2" />
							Submit Updates for Review
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleDelete} disabled={isDeleting} className="text-red-600 focus:text-red-600">
						<Trash2 className="h-4 w-4 mr-2" />
						{isDeleting ? "Deleting..." : "Delete course"}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Submit for review dialog */}
			<Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Submit Course for Review</DialogTitle>
						<DialogDescription>Your course will be reviewed by our team before being published. Make sure all content is complete and ready for review.</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<h4 className="font-medium">Review Checklist:</h4>
							<ul className="list-disc pl-5 space-y-1 text-sm">
								<li>Course title and description are complete</li>
								<li>Category and pricing information are set</li>
								<li>Course has at least one chapter with content</li>
								<li>All content adheres to our community guidelines</li>
							</ul>
						</div>
						<p className="text-sm text-muted-foreground">The review process typically takes 1-3 business days. You'll be notified when your course is approved or if any changes are needed.</p>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowReviewDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleSubmitForReview} disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<span className="animate-spin mr-2">⟳</span>
									Submitting...
								</>
							) : (
								<>Submit for Review</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Rejection details dialog */}
			<Dialog open={showRejectionDetails} onOpenChange={setShowRejectionDetails}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Review Feedback</DialogTitle>
						<DialogDescription>Your course was not approved. Please review the feedback below and make the necessary changes before resubmitting.</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="border rounded-md p-4 bg-red-50">
							<h4 className="font-medium mb-2 text-red-800">Feedback from Reviewer:</h4>
							<p className="text-sm text-gray-800">{reviewComment || "No specific feedback provided. Please ensure your course meets our content guidelines."}</p>
						</div>
						<p className="text-sm text-muted-foreground">After making the necessary changes, you can resubmit your course for review.</p>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowRejectionDetails(false)}>
							Close
						</Button>
						<Button
							onClick={() => {
								setShowRejectionDetails(false);
								router.push(`/instructor/courses/create/content?courseId=${courseId}`);
							}}
						>
							Edit Course
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
