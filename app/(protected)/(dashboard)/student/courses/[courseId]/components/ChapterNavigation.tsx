"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface ChapterNavigationProps {
	prevChapterId: string | null;
	nextChapterId: string | null;
	isCompleted: boolean;
	onPrevious: () => void;
	onNext: () => void;
	onComplete: () => void;
}

export function ChapterNavigation({ prevChapterId, nextChapterId, isCompleted, onPrevious, onNext, onComplete }: ChapterNavigationProps) {
	return (
		<div className="flex items-center justify-between border-t pt-4 mt-8">
			<Button variant="outline" size="sm" onClick={onPrevious} disabled={!prevChapterId}>
				<ChevronLeft className="h-4 w-4 mr-2" />
				Previous
			</Button>

			<div>
				{!isCompleted ? (
					<Button size="sm" onClick={onComplete}>
						Mark as Completed
					</Button>
				) : (
					<Button size="sm" variant="outline" disabled>
						<CheckCircle className="h-4 w-4 mr-2 text-green-500" />
						Completed
					</Button>
				)}
			</div>

			<Button variant={nextChapterId ? "default" : "outline"} size="sm" onClick={onNext} disabled={!nextChapterId}>
				Next
				<ChevronRight className="h-4 w-4 ml-2" />
			</Button>
		</div>
	);
}
