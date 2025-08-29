import { Metadata } from "next";
import { getPublicCourseById } from "@/actions/course";
import { getCurrentUser } from "@/actions/user";
import { checkEnrollment } from "@/actions/enrollment";
import CourseHeader from "./components/CourseHeader";
import CourseContent from "./components/CourseContent";
import CourseSidebar from "./components/CourseSidebar";

interface CourseDetailPageProps {
	params: Promise<{
		courseId: string;
	}>;
}

export async function generateMetadata({ params }: CourseDetailPageProps): Promise<Metadata> {
	const { courseId } = await params;
	const courseResult = await getPublicCourseById(courseId);

	if (!courseResult.success) {
		return {
			title: "Course Not Found | EduMattor",
		};
	}

	const course = courseResult.course;

	return {
		title: `${course?.title} | EduMattor`,
		description: course?.description,
	};
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
	const { courseId } = await params;
	const courseResult = await getPublicCourseById(courseId);

	if (!courseResult.success || !courseResult.course) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="text-center space-y-4 max-w-md mx-auto px-6">
					<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
						<span className="text-2xl">📚</span>
					</div>
					<h1 className="heading-3 text-foreground">Course Not Found</h1>
					<p className="text-muted-foreground leading-relaxed">This course doesn't exist or isn't published yet. Please check the URL or browse our available courses.</p>
					<a href="/courses" className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors duration-300 font-medium">
						Browse Courses
					</a>
				</div>
			</div>
		);
	}

	const course = courseResult.course;
	const currentUser = await getCurrentUser().catch(() => null);
	const isEnrolled = currentUser ? await checkEnrollment(courseId, currentUser._id.toString()).catch(() => false) : false;

	const publishedChapters = course.chapters.filter((chapter: any) => chapter.isPublished);

	// Enhanced course data for UI components
	const enhancedCourse = {
		...course,
		rating: 4.8,
		totalStudents: 12547,
		duration: "8 weeks",
		completionRate: 94,
		chapters: publishedChapters,
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Course Header */}
			<CourseHeader course={enhancedCourse} isEnrolled={isEnrolled} />

			{/* Main Content */}
			<div className="container-custom py-12">
				<div className="grid lg:grid-cols-3 gap-12">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<CourseContent course={enhancedCourse} isEnrolled={isEnrolled} />
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-6">
							<CourseSidebar course={enhancedCourse} isEnrolled={isEnrolled} courseId={courseId} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
