"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createCourse } from "@/actions/course";
import { FileUpload } from "@/components/FileUpload";

const categories = ["Programming", "Design", "Business", "Marketing", "Personal Development", "Music", "Photography", "Health & Fitness"];

const levels = [
	{ value: "beginner", label: "Beginner" },
	{ value: "intermediate", label: "Intermediate" },
	{ value: "advanced", label: "Advanced" },
];

export default function CreateCoursePage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		level: "",
		price: "",
		imageUrl: "",
	});

	const updateForm = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Handle successful image upload
	const handleImageUpload = (fileData: { filePath: string; fileName: string; fileSize: number; fileType: string }) => {
		// Set the image URL to the file path
		// Note: The actual URL to access the file would be /api/files/{filePath}
		updateForm("imageUrl", fileData.filePath);
	};

	// Handle image upload error
	const handleImageUploadError = (error: string) => {
		toast({
			title: "Upload Error",
			description: error,
			variant: "destructive",
		});
	};

	// Validate current step
	const validateStep = () => {
		if (step === 1) {
			return formData.title.trim() !== "" && formData.description.trim() !== "";
		} else if (step === 2) {
			return formData.category !== "" && formData.level !== "";
		} else if (step === 3) {
			return formData.price !== "";
		}
		return true;
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			const result = await createCourse({
				...formData,
				chapters: [],
				isPublished: false,
				reviewStatus: "draft",
				price: parseFloat(formData.price),
			});

			if (result.success) {
				// Show success message
				toast({
					title: "Course created",
					description: "Your course has been created successfully.",
				});

				// Redirect to course content page
				router.push(`/instructor/courses/create/content?courseId=${result.courseId}`);
			} else {
				// Show error message
				toast({
					title: "Error",
					description: result.error || "Failed to create course",
					variant: "destructive",
				});
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error creating course:", error);
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto py-8">
			<Button variant="ghost" onClick={() => router.push("/instructor/courses")} className="mb-6">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Courses
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>Create New Course</CardTitle>
				</CardHeader>
				<CardContent>
					{step === 1 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title">Course Title</Label>
								<Input id="title" value={formData.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="e.g., Complete Web Development Bootcamp" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="description">Course Description</Label>
								<Textarea id="description" value={formData.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Describe your course..." rows={4} />
							</div>
						</div>
					)}

					{step === 2 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Select value={formData.category} onValueChange={(value) => updateForm("category", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem key={category} value={category.toLowerCase()}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="level">Level</Label>
								<Select value={formData.level} onValueChange={(value) => updateForm("level", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select course level" />
									</SelectTrigger>
									<SelectContent>
										{levels.map((level) => (
											<SelectItem key={level.value} value={level.value}>
												{level.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					)}

					{step === 3 && (
						<div className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="price">Price (USD)</Label>
								<Input id="price" type="number" value={formData.price} onChange={(e) => updateForm("price", e.target.value)} placeholder="29.99" min="0" step="0.01" />
							</div>
							<div className="space-y-2">
								<Label htmlFor="image">Course Image</Label>
								{formData.imageUrl ? (
									<div className="mt-2">
										<div className="relative rounded-lg border overflow-hidden">
											<img src={`/api/files/${formData.imageUrl}`} alt="Course cover" className="w-full aspect-video object-cover" />
											<Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => updateForm("imageUrl", "")}>
												Remove
											</Button>
										</div>
										<p className="text-sm text-muted-foreground mt-2">Image uploaded successfully</p>
									</div>
								) : (
									<div className="border-2 border-dashed rounded-lg p-6">
										<div className="flex flex-col items-center justify-center space-y-4">
											<ImageIcon className="h-8 w-8 text-muted-foreground" />
											<div className="text-center">
												<p className="text-sm text-muted-foreground">Upload a cover image for your course</p>
												<p className="text-xs text-muted-foreground mt-1">Recommended size: 1280x720 (16:9 ratio)</p>
											</div>
											<FileUpload
												accept="image/*"
												maxSizeMB={5}
												buttonText="Upload Course Image"
												directory={`/public/courses/images`}
												visibility="public"
												resourceType="thumbnail"
												onUploadComplete={(data) =>
													handleImageUpload({
														filePath: data.fileKey,
														fileName: data.fileName,
														fileSize: data.fileSize,
														fileType: data.fileType,
													})
												}
												onUploadError={handleImageUploadError}
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
						Previous
					</Button>
					<Button
						onClick={() => {
							if (step === 3) {
								handleSubmit();
							} else if (validateStep()) {
								setStep(step + 1);
							} else {
								// Show validation error
								toast({
									title: "Please complete all fields",
									description: "All required fields must be filled out before proceeding.",
									variant: "destructive",
								});
							}
						}}
						disabled={isLoading}
					>
						{step === 3 ? (
							isLoading ? (
								"Creating..."
							) : (
								"Create Course"
							)
						) : (
							<>
								Next
								<ArrowRight className="h-4 w-4 ml-2" />
							</>
						)}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
