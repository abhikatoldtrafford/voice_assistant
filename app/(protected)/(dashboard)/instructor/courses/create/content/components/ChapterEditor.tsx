"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Video, Trash, Save, Upload } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
// import EditorJSComponent from "@/components/EditorJS"; // Import our new component

import { updateChapter } from "@/actions/instructor/chapter";
import { Chapter, CourseCompletionStatus, ToastInterface } from "../types";
import dynamic from "next/dynamic";

let Editor = dynamic(() => import("@/components/EditorJS"), {
	ssr: false,
});

interface ChapterEditorProps {
	currentChapter: Chapter | undefined;
	chapters: Chapter[];
	setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
	selectedChapter: string;
	courseId: string;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	isSaving: boolean;
	setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
	previewMode: boolean;
	toast: ToastInterface["toast"];
	courseCompletionStatus: CourseCompletionStatus;
	setCourseCompletionStatus: React.Dispatch<React.SetStateAction<CourseCompletionStatus>>;
}

export default function ChapterEditor({ currentChapter, chapters, setChapters, selectedChapter, courseId, isLoading, setIsLoading, isSaving, setIsSaving, previewMode, toast, courseCompletionStatus, setCourseCompletionStatus }: ChapterEditorProps) {
	// Handle video upload
	const handleVideoUploadComplete = async (chapterId: string, url: string, name: string) => {
		try {
			setChapters((prev) =>
				prev.map((chapter) =>
					chapter.id === chapterId
						? {
								...chapter,
								videoUrl: url,
								videoName: name,
						  }
						: chapter
				)
			);
			toast({
				title: "Success",
				description: "Video uploaded successfully",
				variant: "default",
			});
		} catch (error) {
			console.error("Error uploading video:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred while uploading video",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle removing a video
	const handleRemoveVideo = async (chapterId: string) => {
		try {
			setIsLoading(true);

			setChapters((prev) => prev.map((chapter) => (chapter.id === chapterId ? { ...chapter, videoUrl: undefined, videoName: undefined } : chapter)));

			const result = await updateChapter(courseId, chapterId, {
				videoUrl: null,
			});

			if (result.success) {
				const anyChapterHasVideo = chapters.some((ch) => ch.id !== chapterId && ch.videoUrl);

				if (!anyChapterHasVideo) {
					const updatedCompletionStatus = { ...courseCompletionStatus };
					updatedCompletionStatus.hasVideo = false;
					setCourseCompletionStatus(updatedCompletionStatus);
				}

				toast({
					title: "Success",
					description: "Video removed successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to remove video",
					variant: "destructive",
				});

				const originalChapter = chapters.find((c) => c.id === chapterId);
				if (originalChapter) {
					setChapters((prev) => prev.map((chapter) => (chapter.id === chapterId ? originalChapter : chapter)));
				}
			}
		} catch (error) {
			console.error("Error removing video:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle saving a chapter
	const handleSaveChapter = useCallback(async () => {
		if (!selectedChapter) return;

		try {
			setIsSaving(true);

			const chapter = chapters.find((c) => c.id === selectedChapter);
			if (!chapter) return;

			const result = await updateChapter(courseId, selectedChapter, {
				title: chapter.title,
				content: chapter.content,
				videoUrl: chapter.videoUrl,
			});

			if (result.success) {
				// Update course completion status if needed
				if (chapter.content && chapter.content.length > 30 && !courseCompletionStatus.hasContent) {
					const updatedCompletionStatus = { ...courseCompletionStatus };
					updatedCompletionStatus.hasContent = true;
					updatedCompletionStatus.totalCompleted += 1;
					setCourseCompletionStatus(updatedCompletionStatus);
				}

				toast({
					title: "Success",
					description: "Chapter saved successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to save chapter",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error saving chapter:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsSaving(false);
		}
	}, [selectedChapter, setIsSaving, setCourseCompletionStatus, chapters, updateChapter]);

	// Handle content change from EditorJS
	const handleEditorChange = (data: any) => {
		if (!selectedChapter) return;

		setChapters((prev) => prev.map((chapter) => (chapter.id === selectedChapter ? { ...chapter, content: JSON.stringify(data), editorData: JSON.stringify(data) } : chapter)));
	};

	// Parse HTML content to EditorJS data for loading
	const parseHtmlToEditorData = (htmlContent: string) => {
		// This is a simplified conversion - in production you'd need a more robust parser
		if (!htmlContent) return { blocks: [] };

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, "text/html");
		const blocks: any[] = [];

		Array.from(doc.body.children).forEach((element) => {
			switch (element.tagName.toLowerCase()) {
				case "h1":
				case "h2":
				case "h3":
				case "h4":
					blocks.push({
						type: "header",
						data: {
							text: element.innerHTML,
							level: parseInt(element.tagName.charAt(1)),
						},
					});
					break;
				case "p":
					blocks.push({
						type: "paragraph",
						data: {
							text: element.innerHTML,
						},
					});
					break;
				case "ul":
				case "ol":
					const items = Array.from(element.querySelectorAll("li")).map((li) => li.innerHTML);
					blocks.push({
						type: "list",
						data: {
							style: element.tagName.toLowerCase() === "ol" ? "ordered" : "unordered",
							items,
						},
					});
					break;
				case "blockquote":
					blocks.push({
						type: "quote",
						data: {
							text: element.innerHTML,
							caption: "",
						},
					});
					break;
				case "pre":
					const code = element.querySelector("code");
					blocks.push({
						type: "code",
						data: {
							code: code?.innerHTML || element.innerHTML,
						},
					});
					break;
				case "img":
					const img = element as HTMLImageElement;
					blocks.push({
						type: "image",
						data: {
							url: img.src,
							caption: img.alt || "",
						},
					});
					break;
				default:
					// Try to handle custom editor.js blocks
					const dataType = element.getAttribute("data-editorjs-block");
					if (dataType) {
						try {
							const data = JSON.parse(element.innerHTML);
							blocks.push({
								type: dataType,
								data,
							});
						} catch (e) {
							// Fall back to paragraph if JSON parsing fails
							blocks.push({
								type: "paragraph",
								data: {
									text: element.innerHTML,
								},
							});
						}
					} else {
						// Default to paragraph for unknown elements
						blocks.push({
							type: "paragraph",
							data: {
								text: element.innerHTML,
							},
						});
					}
			}
		});

		return { blocks };
	};

	if (!currentChapter) {
		return (
			<Card className="lg:col-span-2 xl:col-span-3">
				<CardContent className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">No Chapter Selected</h3>
						<p className="text-muted-foreground mb-4">{chapters.length === 0 ? "Create your first chapter to get started" : "Select a chapter from the sidebar to edit its content"}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Current chapter's editor data
	let editorData;
	try {
		editorData = JSON.parse(currentChapter?.content || "");
	} catch (e) {
		// For backward compatibility with HTML content
		editorData = {
			blocks: [
				{
					type: "paragraph",
					data: {
						text: currentChapter?.content || "",
					},
				},
			],
		};
	}

	return (
		<Card className="lg:col-span-2 xl:col-span-3">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<Input
						value={currentChapter.title || ""}
						onChange={(e) => {
							setChapters((prev) => prev.map((chapter) => (chapter.id === selectedChapter ? { ...chapter, title: e.target.value } : chapter)));
						}}
						className="text-lg font-bold border-none focus-visible:ring-0 h-auto px-0 text-xl"
						placeholder="Chapter title"
					/>
					<Badge variant={currentChapter.isPublished ? "default" : "outline"} className="ml-2">
						{currentChapter.isPublished ? "Published" : "Draft"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="content" className="w-full">
					<TabsList className="mb-4">
						<TabsTrigger value="content" className="gap-2">
							<FileText className="h-4 w-4" />
							Content
						</TabsTrigger>
						<TabsTrigger value="video" className="gap-2">
							<Video className="h-4 w-4" />
							Video
						</TabsTrigger>
					</TabsList>

					<TabsContent value="content">
						<div className="border rounded-md">
							<Editor data={editorData} contentId={selectedChapter} onChange={handleEditorChange} placeholder="Start writing your chapter content..." autofocus={true} readOnly={false} />
						</div>
					</TabsContent>

					<TabsContent value="video" className="space-y-4">
						{currentChapter?.videoUrl ? (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Video className="h-5 w-5 text-primary" />
										<span className="font-medium">{currentChapter.videoName || "Video"}</span>
									</div>

									<Button variant="outline" size="sm" className="text-destructive" onClick={() => handleRemoveVideo(selectedChapter)} disabled={isLoading}>
										<Trash className="h-4 w-4 mr-2" />
										Remove Video
									</Button>
								</div>

								<div className="aspect-video border rounded-lg overflow-hidden">
									<video src={`/api/files/${currentChapter.videoUrl}`} controls className="w-full h-full" />
								</div>

								<div className="text-sm text-muted-foreground">
									<p>Videos enhance the learning experience. The video above will be shown to enrolled students.</p>
								</div>
							</div>
						) : (
							<div className="border-2 border-dashed rounded-lg p-12 text-center">
								<div className="mx-auto w-fit p-4 bg-primary/10 rounded-full mb-4">
									<Upload className="h-8 w-8 text-primary" />
								</div>

								<h3 className="text-lg font-medium mb-2">Upload Chapter Video</h3>
								<p className="text-muted-foreground mb-4 max-w-md mx-auto">Add a video to enhance this chapter. Supported formats: MP4, WebM.</p>

								<FileUpload
									accept="video/*"
									maxSizeMB={100}
									buttonText="Upload Video"
									directory={`/courses/${courseId}/videos`}
									visibility="restricted"
									resourceId={courseId}
									resourceType="course"
									onUploadComplete={(data) => {
										console.log("upload complete", data);
										handleVideoUploadComplete(selectedChapter, data.fileKey, data.fileName);
									}}
									onUploadError={(error) =>
										toast({
											title: "Upload Error",
											description: error,
											variant: "destructive",
										})
									}
									className="max-w-md mx-auto"
								/>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
			<CardFooter className="flex justify-between border-t pt-4">
				<div className="text-sm text-muted-foreground">{isSaving ? <span>Saving changes...</span> : <span>Last edited: {new Date().toLocaleString()}</span>}</div>
				<Button id="save-chapter-button" variant="outline" size="sm" onClick={handleSaveChapter} disabled={isSaving}>
					<Save className="h-4 w-4 mr-2" />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
