// Chapter interface
export interface Chapter {
    id: string;
    title: string;
    content: string;
    editorData?: string
    videoUrl?: string | null;
    videoName?: string;
    position: number;
    isPublished: boolean;
}


// Course completion status interface
export interface CourseCompletionStatus {
    hasTitle: boolean;
    hasDescription: boolean;
    hasChapters: boolean;
    hasContent: boolean;
    hasVideo: boolean;
    isPublished: boolean;
    totalCompleted: number;
    totalRequired: number;
}

// Toast interface
export interface ToastInterface {
    toast: (props: {
        title: string;
        description: string;
        variant?: "default" | "destructive";
    }) => void;
}