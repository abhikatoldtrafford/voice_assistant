"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { CourseCompletionStatus } from "../types";

interface SubmitReviewDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	courseCompletionStatus: CourseCompletionStatus;
	handleSubmit: () => Promise<void>;
	isResubmission: boolean;
}

export default function SubmitReviewDialog({ open, setOpen, courseCompletionStatus, handleSubmit, isResubmission }: SubmitReviewDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async () => {
		setIsSubmitting(true);
		await handleSubmit();
		setIsSubmitting(false);
	};

	const allRequirementsMet = courseCompletionStatus.totalCompleted >= courseCompletionStatus.totalRequired;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isResubmission ? "Submit Course Updates for Review" : "Submit Course for Review"}</DialogTitle>
					<DialogDescription>
						{isResubmission
							? "Your updates will be reviewed by our team before being published. The current published version will remain available to students until the new version is approved."
							: "Your course will be reviewed by our team before being published. Make sure all content is complete and ready for review."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<h4 className="font-medium">Review Checklist:</h4>
						<ul className="space-y-2">
							<li className="flex items-start gap-2">
								<div className={courseCompletionStatus.hasTitle ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasTitle ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
								<div>
									<p className="font-medium">Course Title</p>
									<p className="text-sm text-muted-foreground">Your course should have a clear, descriptive title</p>
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className={courseCompletionStatus.hasDescription ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasDescription ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
								<div>
									<p className="font-medium">Course Description</p>
									<p className="text-sm text-muted-foreground">Your course should have a detailed description (at least 20 characters)</p>
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className={courseCompletionStatus.hasChapters ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasChapters ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
								<div>
									<p className="font-medium">Course Chapters</p>
									<p className="text-sm text-muted-foreground">Your course should have at least one chapter</p>
								</div>
							</li>
							<li className="flex items-start gap-2">
								<div className={courseCompletionStatus.hasContent ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasContent ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
								<div>
									<p className="font-medium">Chapter Content</p>
									<p className="text-sm text-muted-foreground">At least one chapter should have substantial content</p>
								</div>
							</li>
							<li className="flex items-start gap-2 opacity-70">
								<div className={courseCompletionStatus.hasVideo ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasVideo ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
								<div>
									<p className="font-medium">Video Content (Optional)</p>
									<p className="text-sm text-muted-foreground">Including video content is recommended but not required</p>
								</div>
							</li>
						</ul>
					</div>
					<div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
						<p className="font-medium mb-1">Review Process:</p>
						<p>The review process typically takes 1-3 business days. You'll be notified when your course is approved or if any changes are needed.</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button onClick={onSubmit} disabled={isSubmitting || !allRequirementsMet} className={isResubmission ? "bg-blue-600 hover:bg-blue-700" : ""}>
						{isSubmitting ? (
							<>
								<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
								Submitting...
							</>
						) : (
							<>{isResubmission ? "Submit Updates for Review" : "Submit for Review"}</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
