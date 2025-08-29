"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { CourseCompletionStatus } from "../types";

interface PublishWarningDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	courseCompletionStatus: CourseCompletionStatus;
	handlePublish: () => Promise<void>;
}

export default function PublishWarningDialog({ open, setOpen, courseCompletionStatus, handlePublish }: PublishWarningDialogProps) {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Course Not Ready to Publish</DialogTitle>
					<DialogDescription>Before publishing your course, make sure you have:</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 my-4">
					<div className="flex items-center gap-2">
						<div className={courseCompletionStatus.hasTitle ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasTitle ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
						<p>Course title and basic information</p>
					</div>

					<div className="flex items-center gap-2">
						<div className={courseCompletionStatus.hasDescription ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasDescription ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
						<p>Course description (at least 20 characters)</p>
					</div>

					<div className="flex items-center gap-2">
						<div className={courseCompletionStatus.hasChapters ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasChapters ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
						<p>At least one chapter</p>
					</div>

					<div className="flex items-center gap-2">
						<div className={courseCompletionStatus.hasContent ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasContent ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
						<p>Chapter content (at least one chapter with substantial content)</p>
					</div>

					<div className="flex items-center gap-2 opacity-70">
						<div className={courseCompletionStatus.hasVideo ? "text-green-500" : "text-amber-500"}>{courseCompletionStatus.hasVideo ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>
						<p>Video content (recommended but not required)</p>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Continue Editing
					</Button>
					<Button
						onClick={() => {
							setOpen(false);
							handlePublish();
						}}
						disabled={courseCompletionStatus.totalCompleted < courseCompletionStatus.totalRequired}
					>
						Publish Anyway
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
