"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Info, Image as ImageIcon, Trash } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";

import { updateCourse } from "@/actions/course";
import { CourseCompletionStatus, ToastInterface } from "../types";
import { CourseData } from "@/models/Course";
import { use, useEffect, useState } from "react";

interface CourseDetailsDialogProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	courseData: Omit<CourseData, "_id" | "instructorId"> | CourseData;
	setCourseData: React.Dispatch<React.SetStateAction<Omit<CourseData, "_id" | "instructorId"> | CourseData>>;
	courseId: string;
	setCourseTitle: React.Dispatch<React.SetStateAction<string>>;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
	toast: ToastInterface["toast"];
	courseCompletionStatus: CourseCompletionStatus;
	setCourseCompletionStatus: React.Dispatch<React.SetStateAction<CourseCompletionStatus>>;
}

export default function CourseDetailsDialog({ open, setOpen, courseData, setCourseData, courseId, setCourseTitle, isLoading, setIsLoading, toast, courseCompletionStatus, setCourseCompletionStatus }: CourseDetailsDialogProps) {
	const [imageIsUploading, setImageIsUploading] = useState(false);
	const [previewImageUrl, setPreviewImageUrl] = useState(courseData.imageUrl ? `/api/files/${courseData.imageUrl}` : "");
	useEffect(() => {
		setPreviewImageUrl(courseData.imageUrl ? `/api/files/${courseData.imageUrl}` : "");
	}, [courseData.imageUrl]);

	const handleSaveCourseDetails = async () => {
		try {
			setIsLoading(true);
			const result = await updateCourse(courseId, {
				title: courseData.title,
				description: courseData.description,
				category: courseData.category,
				level: courseData.level,
				price: courseData.price,
				imageUrl: courseData.imageUrl,
			});

			if (result.success) {
				setCourseTitle(courseData.title);
				toast({
					title: "Success",
					description: "Course details updated successfully",
				});
				setOpen(false);

				// Update course completion status if needed
				const updatedCompletionStatus = { ...courseCompletionStatus };
				if (courseData.title && !courseCompletionStatus.hasTitle) {
					updatedCompletionStatus.hasTitle = true;
					updatedCompletionStatus.totalCompleted += 1;
				}
				if (courseData.description && courseData.description.length > 20 && !courseCompletionStatus.hasDescription) {
					updatedCompletionStatus.hasDescription = true;
					updatedCompletionStatus.totalCompleted += 1;
				}
				setCourseCompletionStatus(updatedCompletionStatus);
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to update course details",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error updating course details:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Handle image upload completion
	const handleImageUploadComplete = (fileData: { fileKey: string; fileName: string; fileSize: number; fileType: string }) => {
		setCourseData({
			...courseData,
			imageUrl: fileData.fileKey,
		});
		setPreviewImageUrl(`/api/files/${fileData.fileKey}`);
		setImageIsUploading(false);
		toast({
			title: "Image Uploaded",
			description: "Course thumbnail has been updated",
		});
	};

	// Handle image upload error
	const handleImageUploadError = (error: string) => {
		setImageIsUploading(false);
		toast({
			title: "Upload Failed",
			description: error,
			variant: "destructive",
		});
	};

	// Handle remove image
	const handleRemoveImage = () => {
		setCourseData({
			...courseData,
			imageUrl: "",
		});
		setPreviewImageUrl("");
		toast({
			title: "Image Removed",
			description: "Course thumbnail has been removed",
		});
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Pencil className="h-5 w-5" />
						Edit Course Details
					</DialogTitle>
					<DialogDescription>Update your course information. These details will be visible to potential students.</DialogDescription>
				</DialogHeader>

				<div className="grid gap-6 py-4">
					<div className="grid gap-3">
						<Label htmlFor="course-title">Course Title</Label>
						<Input id="course-title" value={courseData.title} onChange={(e) => setCourseData({ ...courseData, title: e.target.value })} placeholder="e.g., Complete Web Development Bootcamp" />
					</div>

					<div className="grid gap-3">
						<Label htmlFor="course-description">Course Description</Label>
						<Textarea id="course-description" value={courseData.description} onChange={(e) => setCourseData({ ...courseData, description: e.target.value })} placeholder="Write a detailed description of your course..." rows={6} />
						<p className="text-xs text-muted-foreground">A good description is at least 200 characters and explains what students will learn.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-3">
							<Label htmlFor="course-category">Category</Label>
							<Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
								<SelectTrigger id="course-category">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="programming">Programming</SelectItem>
									<SelectItem value="design">Design</SelectItem>
									<SelectItem value="business">Business</SelectItem>
									<SelectItem value="marketing">Marketing</SelectItem>
									<SelectItem value="photography">Photography</SelectItem>
									<SelectItem value="music">Music</SelectItem>
									<SelectItem value="health">Health & Fitness</SelectItem>
									<SelectItem value="personal-development">Personal Development</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-3">
							<Label htmlFor="course-level">Level</Label>
							<Select value={courseData.level} onValueChange={(value) => setCourseData({ ...courseData, level: value })}>
								<SelectTrigger id="course-level">
									<SelectValue placeholder="Select course level" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="beginner">Beginner</SelectItem>
									<SelectItem value="intermediate">Intermediate</SelectItem>
									<SelectItem value="advanced">Advanced</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="grid gap-3">
						<Label htmlFor="course-price">Price (USD)</Label>
						<Input
							id="course-price"
							type="number"
							value={courseData.price}
							onChange={(e) =>
								setCourseData({
									...courseData,
									price: parseFloat(e.target.value || "0"),
								})
							}
							placeholder="29.99"
							min="0"
							step="0.01"
						/>
					</div>

					{/* Course thumbnail image section */}
					<div className="grid gap-3">
						<Label>Course Thumbnail Image</Label>
						{previewImageUrl ? (
							<div className="relative border rounded-lg overflow-hidden">
								<img src={previewImageUrl} alt="Course thumbnail" className="w-full aspect-video object-cover" onError={() => setPreviewImageUrl("")} />
								<Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={handleRemoveImage}>
									<Trash className="h-4 w-4 mr-2" />
									Remove
								</Button>
							</div>
						) : (
							<div className="border-2 border-dashed rounded-lg p-8 text-center">
								<ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
								<h3 className="text-sm font-medium mb-2">Upload Course Thumbnail</h3>
								<p className="text-xs text-muted-foreground mb-4">Recommended size: 1280x720 (16:9 ratio)</p>
								<FileUpload
									accept="image/*"
									maxSizeMB={5}
									buttonText="Upload Thumbnail"
									directory="/public/courses/images"
									visibility="public"
									resourceType="thumbnail"
									onUploadComplete={handleImageUploadComplete}
									onUploadError={handleImageUploadError}
									className="max-w-xs mx-auto"
								/>
							</div>
						)}
						<p className="text-xs text-muted-foreground">A high-quality thumbnail helps your course stand out and attract students.</p>
					</div>
				</div>

				<DialogFooter className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						<Info className="h-4 w-4 inline mr-1" />
						Changes will be saved immediately
					</div>
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveCourseDetails} disabled={isLoading || imageIsUploading}>
							{isLoading ? "Saving..." : "Save Course Details"}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
