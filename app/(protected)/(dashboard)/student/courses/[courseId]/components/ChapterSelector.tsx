"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, BookOpen, CheckCircle, Lock, PlayCircle, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { IChapterData } from "@/models/Course";

interface ChapterSelectorProps {
	chapters: IChapterData[];
	currentChapterId: string;
	onSelectChapter: (chapterId: string) => void;
	completedChapters: string[];
}

export default function ChapterSelector({ chapters, currentChapterId, onSelectChapter, completedChapters }: ChapterSelectorProps) {
	const [isOpen, setIsOpen] = useState(true);

	// Sort chapters by position
	const sortedChapters = [...chapters].filter((chapter) => chapter.isPublished).sort((a, b) => a.position - b.position);

	// Calculate progress
	const progress = sortedChapters.length > 0 ? Math.round((completedChapters.length / sortedChapters.length) * 100) : 0;

	return (
		<Card className="mb-6">
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<div className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50">
					<div className="flex items-center gap-2">
						<BookOpen className="h-5 w-5" />
						<h3 className="font-medium">Chapter Selection</h3>
						<Badge variant="outline">{progress}% Complete</Badge>
					</div>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
						</Button>
					</CollapsibleTrigger>
				</div>

				<CollapsibleContent>
					<CardContent className="p-0">
						<ScrollArea className="h-[300px]">
							<div className="p-2">
								{sortedChapters.map((chapter) => {
									const isComplete = completedChapters.includes(chapter._id);
									const isCurrent = chapter._id === currentChapterId;

									return (
										<div
											key={chapter._id}
											className={`
                        p-3 mb-1 rounded-md flex items-center justify-between 
                        ${isCurrent ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-muted/50"} 
                        cursor-pointer transition-colors
                      `}
											onClick={() => onSelectChapter(chapter._id)}
										>
											<div className="flex items-center gap-3">
												{isComplete ? (
													<CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
												) : isCurrent ? (
													<BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
												) : (
													<FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
												)}

												<div className="overflow-hidden">
													<p className={`truncate ${isCurrent ? "font-medium" : ""}`}>{chapter.title}</p>
													<div className="flex items-center text-xs text-muted-foreground mt-1">
														{chapter.videoUrl ? (
															<div className="flex items-center mr-2">
																<PlayCircle className="h-3 w-3 mr-1" />
																<span>Video</span>
															</div>
														) : (
															<div className="flex items-center mr-2">
																<FileText className="h-3 w-3 mr-1" />
																<span>Reading</span>
															</div>
														)}

														{isComplete && (
															<Badge variant="outline" className="text-xs h-5 bg-green-100 text-green-800 border-green-200">
																Completed
															</Badge>
														)}
													</div>
												</div>
											</div>

											{isCurrent && (
												<Badge variant="secondary" className="ml-2">
													Current
												</Badge>
											)}
										</div>
									);
								})}
							</div>
						</ScrollArea>
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
