// components/FileUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, FileText, File, Check } from "lucide-react";
import { toast } from "sonner";

interface FileUploadResponse {
	fileKey: string;
	fileUrl: string;
	fileName: string;
	fileSize: number;
	fileType: string;
	directory: string;
	visibility?: string;
}

interface FileUploadProps {
	onUploadComplete: (fileData: FileUploadResponse) => void;
	onUploadError?: (error: string) => void;
	accept?: string;
	maxSizeMB?: number;
	buttonText?: string;
	directory?: string;
	className?: string;
	variant?: "default" | "outline" | "ghost";
	icon?: boolean;
	// New file access control parameters
	visibility?: "public" | "private" | "restricted";
	resourceId?: string; // ID of the related resource (course, assignment, etc.)
	resourceType?: string; // Type of the resource (course, assignment, user, etc.)
}

export function FileUpload({
	onUploadComplete,
	onUploadError,
	accept = "image/*",
	maxSizeMB = 10,
	buttonText = "Upload File",
	directory,
	className = "",
	variant = "outline",
	icon = true,
	// Add defaults for new parameters
	visibility = "private",
	resourceId,
	resourceType,
}: FileUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Get the appropriate icon based on accept type
	const getIcon = () => {
		if (!icon) return null;

		if (accept.includes("image")) return <ImageIcon className="h-4 w-4 mr-2" />;
		if (accept.includes("video")) return <FileText className="h-4 w-4 mr-2" />;
		return <File className="h-4 w-4 mr-2" />;
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Check file size
		const maxSizeBytes = maxSizeMB * 1024 * 1024;
		if (file.size > maxSizeBytes) {
			const errorMsg = `File size exceeds the maximum allowed size of ${maxSizeMB}MB`;
			setError(errorMsg);
			if (onUploadError) onUploadError(errorMsg);
			toast.error(errorMsg);
			return;
		}

		// Check file type
		if (accept !== "*" && !accept.includes("*")) {
			const fileType = file.type;
			const acceptTypes = accept.split(",").map((t) => t.trim());

			const isAccepted = acceptTypes.some((type) => {
				if (type.endsWith("/*")) {
					const typeGroup = type.split("/")[0];
					return fileType.startsWith(`${typeGroup}/`);
				}
				return type === fileType;
			});

			if (!isAccepted) {
				const errorMsg = `File type ${fileType} is not accepted. Please upload a file with type: ${accept}`;
				setError(errorMsg);
				if (onUploadError) onUploadError(errorMsg);
				toast.error(errorMsg);
				return;
			}
		}

		setUploading(true);
		setProgress(10);
		setError(null);

		try {
			// Create form data
			const formData = new FormData();
			formData.append("file", file);

			// Add the directory if provided
			if (directory) {
				formData.append("directory", directory);
			}

			// Add the new access control parameters
			formData.append("visibility", visibility);

			if (resourceId) {
				formData.append("resourceId", resourceId);
			}

			if (resourceType) {
				formData.append("resourceType", resourceType);
			}

			setProgress(30);

			// Upload file
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			setProgress(80);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to upload file");
			}

			const data: FileUploadResponse = await response.json();
			setProgress(100);

			// Call onUploadComplete with file data
			onUploadComplete(data);

			// Clear the file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}

			toast.success("File uploaded successfully");
		} catch (err: any) {
			const errorMsg = err.message || "An error occurred while uploading the file";
			setError(errorMsg);
			if (onUploadError) onUploadError(errorMsg);
			toast.error(errorMsg);
		} finally {
			setUploading(false);
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div className={`${className}`}>
			<input type="file" accept={accept} onChange={handleFileChange} className="hidden" ref={fileInputRef} />

			<div className="flex flex-col gap-2">
				<Button type="button" onClick={handleButtonClick} disabled={uploading} variant={variant} className="w-full">
					{uploading ? (
						<span className="flex items-center">
							<Upload className="animate-bounce h-4 w-4 mr-2" />
							Uploading...
						</span>
					) : (
						<span className="flex items-center">
							{getIcon()}
							{buttonText}
						</span>
					)}
				</Button>

				{uploading && (
					<div className="w-full space-y-1">
						<Progress value={progress} className="h-2" />
						<p className="text-xs text-muted-foreground text-right">{progress}%</p>
					</div>
				)}

				{error && (
					<p className="text-sm text-red-500 flex items-center mt-1">
						<X className="h-3 w-3 mr-1" /> {error}
					</p>
				)}
			</div>
		</div>
	);
}
