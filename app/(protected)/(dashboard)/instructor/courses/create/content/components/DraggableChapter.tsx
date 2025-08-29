"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, EyeOff, MoveHorizontal, Trash, Video } from "lucide-react";
import { useState } from "react";

// Component for draggable chapters in the sidebar
interface Chapter {
	id: string;
	title: string;
	content: string;
	videoUrl?: string | null;
	videoName?: string;
	position: number;
	isPublished: boolean;
}

interface DraggableChapterProps {
	chapter: Chapter;
	isSelected: boolean;
	onSelect: (id: string) => void;
	onDelete: (id: string) => void;
	onTogglePublish: (id: string, isPublished: boolean) => void;
	isDragging: boolean;
}

export default function DraggableChapter({ chapter, isSelected, onSelect, onDelete, onTogglePublish, isDragging }: DraggableChapterProps) {
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
}
