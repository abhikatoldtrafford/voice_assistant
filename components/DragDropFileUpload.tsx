// components/DragDropFileUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, FileText, File, Check, ArrowUpToLine } from "lucide-react";
import { toast } from "sonner";

interface DragDropFileUploadProps {
	onUploadComplete: (fileData: { filePath: string; fileName: string; fileSize: number; fileType: string }) => void;
	onUploadError?: (error: string) => void;
	accept?: string;
	maxSizeMB?: number;
	directory?: string;
	className?: string;
	title?: string;
	description?: string;
	children?: React.ReactNode;
}

export function DragDropFileUpload({ onUploadComplete, onUploadError, accept = "image/*", maxSizeMB = 10, directory, className = "", title = "Upload File", description = "Drag and drop your file here, or click to browse", children }: DragDropFileUploadProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Get the appropriate icon based on accept type
	const getIcon = () => {
		if (accept.includes("image")) return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
		if (accept.includes("video")) return <FileText className="h-12 w-12 text-muted-foreground" />;
		return <File className="h-12 w-12 text-muted-foreground" />;
	};

	// Handle drag events
	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragging) setIsDragging(true);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (file) {
			uploadFile(file);
		}
	};

	// Handle file uploading
	const uploadFile = async (file: File) => {
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

			const data = await response.json();
			setProgress(100);

			// Call onUploadComplete with file data
			onUploadComplete({
				filePath: data.filePath,
				fileName: data.fileName,
				fileSize: data.fileSize,
				fileType: data.fileType,
			});

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

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			uploadFile(file);
		}
	};

	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Custom content or default content
	const renderContent = () => {
		if (children) {
			return children;
		}

		return (
			<div className="flex flex-col items-center text-center p-6">
				{uploading ? (
					<>
						<Upload className="h-12 w-12 text-primary animate-bounce" />
						<h3 className="text-lg font-medium mt-4">Uploading...</h3>
						<div className="w-full mt-4">
							<Progress value={progress} className="h-2" />
							<p className="text-xs text-muted-foreground mt-1">{progress}%</p>
						</div>
					</>
				) : (
					<>
						{getIcon()}
						<h3 className="text-lg font-medium mt-4">{title}</h3>
						<p className="text-sm text-muted-foreground mt-2 max-w-xs">{description}</p>
						<Button variant="outline" className="mt-4" onClick={handleButtonClick}>
							<ArrowUpToLine className="h-4 w-4 mr-2" />
							Select File
						</Button>
					</>
				)}

				{error && (
					<p className="text-sm text-red-500 flex items-center mt-4">
						<X className="h-4 w-4 mr-1" /> {error}
					</p>
				)}
			</div>
		);
	};

	return (
		<div className={`${className}`} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
			<input type="file" accept={accept} onChange={handleFileInputChange} className="hidden" ref={fileInputRef} />

			<div
				className={`
          border-2 border-dashed rounded-lg transition-colors
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          ${uploading ? "opacity-75" : ""}
        `}
			>
				{renderContent()}
			</div>
		</div>
	);
}
