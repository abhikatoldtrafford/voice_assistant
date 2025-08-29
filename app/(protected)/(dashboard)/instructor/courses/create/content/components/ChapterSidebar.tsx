"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MoveHorizontal, Plus, Trash, Video, Eye, EyeOff, FileText } from "lucide-react";

import { addChapter, deleteChapter, toggleChapterPublish, reorderChapters } from "@/actions/instructor/chapter";
import { Chapter, CourseCompletionStatus, ToastInterface } from "../types";

interface ChapterSidebarProps {
	chapters: Chapter[];
	setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
	selectedChapter: string;
	setSelectedChapter: React.Dispatch<React.SetStateAction<string>>;
	courseId: string;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	toast: ToastInterface["toast"];
	courseCompletionStatus: CourseCompletionStatus;
	setCourseCompletionStatus: React.Dispatch<React.SetStateAction<CourseCompletionStatus>>;
}

interface DraggableChapterProps {
	chapter: Chapter;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
	onTogglePublish: (id: string, isPublished: boolean) => void;
	isDragging: boolean;
}

// Component for draggable chapters in the sidebar
const DraggableChapter = ({ chapter, isSelected, onSelect, onDelete, onTogglePublish, isDragging }: DraggableChapterProps) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	return (
		<>
			<div
				className={`p-3 rounded-lg cursor-pointer mb-2 transition-all flex items-center justify-between group
          ${isSelected ? "bg-primary/15 border-primary/30" : "hover:bg-secondary border-transparent"} 
          ${isDragging ? "opacity-50 border-2 border-dashed" : "border"}
        `}
				onClick={() => onSelect(chapter.id)}
				draggable
				onDragStart={(e) => {
					e.dataTransfer.setData("text/plain", chapter.id);
				}}
			>
				<div className="flex items-center gap-2 overflow-hidden flex-1">
					<MoveHorizontal className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 cursor-grab" />
					<div className="overflow-hidden">
						<p className="truncate font-medium">{chapter.title}</p>
						<div className="flex items-center mt-1">
							{chapter.videoUrl && (
								<Badge variant="secondary" className="mr-2 text-xs">
									<Video className="h-3 w-3 mr-1" />
									Video
								</Badge>
							)}
							<Badge variant={chapter.isPublished ? "default" : "outline"} className="text-xs">
								{chapter.isPublished ? "Published" : "Draft"}
							</Badge>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7"
									onClick={(e) => {
										e.stopPropagation();
										onTogglePublish(chapter.id, !chapter.isPublished);
									}}
								>
									{chapter.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>{chapter.isPublished ? "Unpublish chapter" : "Publish chapter"}</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="ghost"
									className="h-7 w-7 text-destructive"
									onClick={(e) => {
										e.stopPropagation();
										setShowConfirmDelete(true);
									}}
								>
									<Trash className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>Delete chapter</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Delete confirmation dialog */}
			<Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Chapter</DialogTitle>
						<DialogDescription>Are you sure you want to delete "{chapter.title}"? This action cannot be undone.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								onDelete(chapter.id);
								setShowConfirmDelete(false);
							}}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default function ChapterSidebar({ chapters, setChapters, selectedChapter, setSelectedChapter, courseId, isLoading, setIsLoading, toast, courseCompletionStatus, setCourseCompletionStatus }: ChapterSidebarProps) {
	const [draggedChapterId, setDraggedChapterId] = useState<string | null>(null);

	// Handle adding a new chapter
	const handleAddChapter = async () => {
		try {
			setIsLoading(true);

			const newPosition = chapters.length > 0 ? Math.max(...chapters.map((c) => c.position)) + 1 : 1;

			const newChapterData = {
				title: `Chapter ${newPosition}`,
				content: "",
			};

			const result = await addChapter(courseId, newChapterData);

			if (result.success && result.chapterId) {
				const newChapter: Chapter = {
					id: result.chapterId.toString(),
					title: newChapterData.title,
					content: newChapterData.content,
					position: newPosition,
					isPublished: false,
				};

				setChapters([...chapters, newChapter]);
				setSelectedChapter(newChapter.id);

				// Update course completion status
				const updatedCompletionStatus = { ...courseCompletionStatus };
				if (!courseCompletionStatus.hasChapters) {
					updatedCompletionStatus.hasChapters = true;
					updatedCompletionStatus.totalCompleted += 1;
				}
				setCourseCompletionStatus(updatedCompletionStatus);

				toast({
					title: "Success",
					description: "Chapter added successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to add chapter",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error adding chapter:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle removing a chapter
	const handleRemoveChapter = async (id: string) => {
		if (chapters.length <= 1) {
			toast({
				title: "Cannot delete chapter",
				description: "You need at least one chapter in the course",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);

			const result = await deleteChapter(courseId, id);

			if (result.success) {
				const newChapters = chapters.filter((chapter) => chapter.id !== id);
				setChapters(newChapters);

				if (selectedChapter === id) {
					setSelectedChapter(chapters[0].id === id ? chapters[1].id : chapters[0].id);
				}

				// Update course completion status
				if (newChapters.length === 0) {
					const updatedCompletionStatus = { ...courseCompletionStatus };
					updatedCompletionStatus.hasChapters = false;
					updatedCompletionStatus.totalCompleted -= 1;
					setCourseCompletionStatus(updatedCompletionStatus);
				}

				toast({
					title: "Success",
					description: "Chapter deleted successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to delete chapter",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error deleting chapter:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle toggling chapter publish status
	const handleToggleChapterPublish = async (chapterId: string, isPublished: boolean) => {
		try {
			setIsLoading(true);

			const result = await toggleChapterPublish(courseId, chapterId, isPublished);

			if (result.success) {
				setChapters((prev) => prev.map((chapter) => (chapter.id === chapterId ? { ...chapter, isPublished } : chapter)));

				toast({
					title: "Success",
					description: isPublished ? "Chapter published successfully" : "Chapter unpublished successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to toggle chapter publish status",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error toggling chapter publish status:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle reordering chapters with drag and drop
	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const droppedChapterId = e.dataTransfer.getData("text/plain");
		const draggedIndex = chapters.findIndex((ch) => ch.id === droppedChapterId);

		if (draggedIndex === -1) return;

		// Find the target index
		const dropTarget = e.target as HTMLElement;
		const dropTargetChapterEl = dropTarget.closest("[data-chapter-id]") as HTMLElement;

		if (!dropTargetChapterEl) return;

		const dropTargetId = dropTargetChapterEl.dataset.chapterId;
		const dropTargetIndex = chapters.findIndex((ch) => ch.id === dropTargetId);

		if (dropTargetIndex === -1 || draggedIndex === dropTargetIndex) return;

		// Create new array with reordered chapters
		const newChapters = [...chapters];
		const [draggedChapter] = newChapters.splice(draggedIndex, 1);
		newChapters.splice(dropTargetIndex, 0, draggedChapter);

		// Update positions
		const reorderedChapters = newChapters.map((chapter, index) => ({
			...chapter,
			position: index + 1,
		}));

		setChapters(reorderedChapters);
		setDraggedChapterId(null);

		// Save to database
		try {
			const chapterIds = reorderedChapters.map((ch) => ch.id);
			await reorderChapters(courseId, chapterIds);
		} catch (error) {
			console.error("Error reordering chapters:", error);
			toast({
				title: "Error",
				description: "Failed to save chapter order",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="lg:col-span-1">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
				<CardTitle className="text-lg">Chapters</CardTitle>
				<Button size="sm" onClick={handleAddChapter} disabled={isLoading} className="gap-1">
					<Plus className="h-4 w-4" />
					Add
				</Button>
			</CardHeader>
			<CardContent>
				{chapters.length === 0 ? (
					<div className="text-center py-8 border-2 border-dashed rounded-lg">
						<FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
						<p className="text-sm text-muted-foreground">No chapters yet</p>
						<Button variant="outline" size="sm" className="mt-4" onClick={handleAddChapter}>
							Add your first chapter
						</Button>
					</div>
				) : (
					<ScrollArea className="h-[calc(100vh-300px)] pr-4">
						<div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
							{chapters
								.sort((a, b) => a.position - b.position)
								.map((chapter) => (
									<div key={chapter.id} data-chapter-id={chapter.id}>
										<DraggableChapter
											chapter={chapter}
											isSelected={selectedChapter === chapter.id}
											onSelect={setSelectedChapter}
											onDelete={handleRemoveChapter}
											onTogglePublish={handleToggleChapterPublish}
											isDragging={draggedChapterId === chapter.id}
										/>
									</div>
								))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
