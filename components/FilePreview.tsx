// components/FilePreview.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash, Download, ExternalLink, FileText, Video as VideoIcon, Image } from "lucide-react";

interface FilePreviewProps {
	filePath: string;
	fileName?: string;
	fileType?: string;
	showControls?: boolean;
	onDelete?: () => void;
	className?: string;
}

export function FilePreview({ filePath, fileName, fileType, showControls = true, onDelete, className = "" }: FilePreviewProps) {
	const [fileUrl, setFileUrl] = useState<string>(`/api/files/${filePath}`);
	const [error, setError] = useState<string | null>(null);

	// Determine file type from path if not provided
	const detectFileType = () => {
		if (fileType) return fileType;

		const extension = filePath.split(".").pop()?.toLowerCase();
		if (!extension) return "application/octet-stream";

		const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi"];
		const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
		const documentExtensions = ["pdf", "doc", "docx", "txt", "rtf"];

		if (videoExtensions.includes(extension)) return "video";
		if (imageExtensions.includes(extension)) return "image";
		if (documentExtensions.includes(extension)) return "document";

		return "application/octet-stream";
	};

	const type = detectFileType();
	const displayName = fileName || filePath.split("/").pop() || "File";

	// Check if file exists on mount
	useEffect(() => {
		const checkFile = async () => {
			try {
				const response = await fetch(fileUrl, { method: "HEAD" });
				if (!response.ok) {
					setError("File not available");
				}
			} catch (error) {
				setError("Error loading file");
			}
		};

		checkFile();
	}, [fileUrl]);

	// Handle file download
	const handleDownload = () => {
		// Create an anchor element and set download attribute
		const a = document.createElement("a");
		a.href = `${fileUrl}?download=true`;
		a.download = displayName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	// Handle viewing file in new tab
	const handleViewInNewTab = () => {
		window.open(fileUrl, "_blank");
	};

	// Render preview based on file type
	const renderPreview = () => {
		if (error) {
			return (
				<div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
					<FileText className="h-12 w-12 mb-2" />
					<p>{error}</p>
				</div>
			);
		}

		if (type.includes("video")) {
			return (
				<video src={fileUrl} controls className="w-full h-full object-contain" poster="/api/placeholder/640/360">
					Your browser does not support video playback.
				</video>
			);
		}

		if (type.includes("image")) {
			return <img src={fileUrl} alt={displayName} className="w-full h-full object-contain" onError={() => setError("Error loading image")} />;
		}

		// For documents and other files
		return (
			<div className="flex flex-col items-center justify-center p-6">
				<FileText className="h-12 w-12 mb-2 text-primary" />
				<p className="text-center">{displayName}</p>
				<Button variant="outline" size="sm" className="mt-4" onClick={handleViewInNewTab}>
					<ExternalLink className="h-4 w-4 mr-2" />
					View File
				</Button>
			</div>
		);
	};

	// File type icon
	const getFileIcon = () => {
		if (type.includes("video")) return <VideoIcon className="h-4 w-4" />;
		if (type.includes("image")) return <Image className="h-4 w-4" />;
		return <FileText className="h-4 w-4" />;
	};

	return (
		<Card className={`overflow-hidden ${className}`}>
			<div className="relative">
				<div className="aspect-video bg-muted/25 flex items-center justify-center">{renderPreview()}</div>

				{showControls && (
					<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
						<div className="flex items-center space-x-2 text-white">
							{getFileIcon()}
							<span className="text-sm font-medium truncate max-w-[150px]">{displayName}</span>
						</div>

						<div className="flex space-x-1">
							<Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={handleDownload}>
								<Download className="h-4 w-4" />
							</Button>

							{onDelete && (
								<Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-white/20" onClick={onDelete}>
									<Trash className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
