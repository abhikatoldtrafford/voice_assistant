// hooks/use-file-upload.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";

interface FileData {
    filePath: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    url: string;
}

interface UseFileUploadOptions {
    directory?: string;
    maxSizeMB?: number;
    acceptedTypes?: string;
    onSuccess?: (fileData: FileData) => void;
    onError?: (error: string) => void;
}

export function useFileUpload({
    directory = "/uploads",
    maxSizeMB = 10,
    acceptedTypes = "*",
    onSuccess,
    onError,
}: UseFileUploadOptions = {}) {
    const [file, setFile] = useState<FileData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const upload = async (fileToUpload: File) => {
        // Reset state
        setError(null);
        setProgress(0);
        setIsUploading(true);

        try {
            // Check file size
            const maxSizeBytes = maxSizeMB * 1024 * 1024;
            if (fileToUpload.size > maxSizeBytes) {
                const errorMsg = `File size exceeds the maximum allowed size of ${maxSizeMB}MB`;
                setError(errorMsg);
                if (onError) onError(errorMsg);
                toast.error(errorMsg);
                setIsUploading(false);
                return null;
            }

            // Check file type
            if (acceptedTypes !== "*" && !acceptedTypes.includes("*")) {
                const fileType = fileToUpload.type;
                const acceptTypes = acceptedTypes.split(",").map((t) => t.trim());

                const isAccepted = acceptTypes.some((type) => {
                    if (type.endsWith("/*")) {
                        const typeGroup = type.split("/")[0];
                        return fileType.startsWith(`${typeGroup}/`);
                    }
                    return type === fileType;
                });

                if (!isAccepted) {
                    const errorMsg = `File type ${fileType} is not accepted`;
                    setError(errorMsg);
                    if (onError) onError(errorMsg);
                    toast.error(errorMsg);
                    setIsUploading(false);
                    return null;
                }
            }

            // Create form data
            const formData = new FormData();
            formData.append("file", fileToUpload);

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

            // Create result object
            const fileData: FileData = {
                filePath: data.filePath,
                fileName: data.fileName,
                fileSize: data.fileSize,
                fileType: data.fileType,
                url: `/api/files/${data.filePath}`,
            };

            // Update state
            setFile(fileData);

            // Call onSuccess callback
            if (onSuccess) {
                onSuccess(fileData);
            }

            toast.success("File uploaded successfully");
            return fileData;
        } catch (err: any) {
            const errorMsg = err.message || "An error occurred while uploading the file";
            setError(errorMsg);
            if (onError) onError(errorMsg);
            toast.error(errorMsg);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setError(null);
        setProgress(0);
    };

    const uploadFromInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileToUpload = e.target.files?.[0];
        if (!fileToUpload) return null;

        return await upload(fileToUpload);
    };

    return {
        file,
        isUploading,
        progress,
        error,
        upload,
        uploadFromInput,
        reset,
    };
}