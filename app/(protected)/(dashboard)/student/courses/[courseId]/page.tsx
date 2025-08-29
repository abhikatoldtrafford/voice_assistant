import { notFound } from "next/navigation";
import { ModernCourseContent } from "./components/ModernCourseContent";
import { getLiveCourseById } from "@/actions/course";
import { getCourseProgress } from "@/actions/enrollment";
import { getCurrentUser } from "@/actions/user";

export default async function CoursePageWrapper({ params }: { params: Promise<{ courseId: string }> }) {
	// Fetch course data
	const { courseId } = await params;
	const courseResult = await getLiveCourseById(courseId);
	// console.log(courseResult);

	if (!courseResult.success || !courseResult.course) {
		notFound();
	}

	// Get course progress
	const progressResult = await getCourseProgress(courseId);

	// Get current user
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		// Redirect to login if not authenticated
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
				<p className="text-muted-foreground">Please log in to access this course.</p>
			</div>
		);
	}

	// Default progress data if not enrolled or error
	const progress =
		progressResult.success && progressResult.progress
			? progressResult.progress
			: {
					progressPercentage: 0,
					completedChapters: [],
					totalChapters: courseResult.course.chapters.filter((ch) => ch.isPublished).length,
					isCompleted: false,
			  };

	return <ModernCourseContent course={courseResult.course} progress={progress} userId={currentUser._id.toString()} userName={currentUser.name} />;
}
