// app/(protected)/(dashboard)/student/courses/page.tsx
import { getEnrolledCourses, getCourseProgress } from "@/actions/enrollment";
import { getCurrentUser } from "@/actions/user";
import CoursesHeader from "./components/CoursesHeader";
import CourseFilters from "./components/CourseFilters";
import ActiveCoursesGrid from "./components/ActiveCoursesGrid";
// import CompletedCourses from "./components/CompletedCourses";
import EmptyCoursesState from "./components/EmptyCoursesState";
// import LearningPathSuggestions from "./components/LearningPathSuggestions";
import StudyStreakCard from "./components/StudyStreakCard";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import CourseCard from "./components/CourseCard";
import { MessageCircleWarning } from "lucide-react";

async function getCoursesData() {
	// Fetch enrolled courses
	const enrollmentResult = await getEnrolledCourses();

	if (!enrollmentResult.success) {
		return {
			error: enrollmentResult.error,
			courses: {
				active: [],
				notStarted: [],
				completed: [],
				all: [],
			},
			stats: null,
		} as {
			error: string;
			courses: {
				active: any[];
				notStarted: any[];
				completed: any[];
				all: any[];
			};
			stats: any;
		};
	}

	const enrolledCourses = enrollmentResult.courses || [];

	// Get progress data for each course
	const coursesWithProgress = await Promise.all(
		enrolledCourses.map(async (course) => {
			const progressResult = await getCourseProgress(course._id);

			const progress =
				progressResult.success && progressResult.progress
					? progressResult.progress
					: {
							completedChapters: [],
							totalChapters: course.chapters.filter((ch) => ch.isPublished).length,
							progressPercentage: 0,
							isCompleted: false,
					  };

			return {
				...course,
				progress: progress.progressPercentage,
				totalChapters: progress.totalChapters,
				completedChapters: progress.completedChapters,
				isCompleted: progress.isCompleted,
				lastAccessed: course.updatedAt?.toISOString() || new Date().toISOString(),
				estimatedTimeLeft: Math.max(0, progress.totalChapters - progress.completedChapters.length) * 2, // 2 hours per chapter
			};
		})
	);

	// Organize courses by status
	const activeCourses = coursesWithProgress.filter((course) => !course.isCompleted && course.progress > 0);
	const notStartedCourses = coursesWithProgress.filter((course) => course.progress === 0);
	const completedCourses = coursesWithProgress.filter((course) => course.isCompleted);

	// Calculate stats
	const stats = {
		total: coursesWithProgress.length,
		active: activeCourses.length,
		completed: completedCourses.length,
		notStarted: notStartedCourses.length,
		totalHoursLearned: coursesWithProgress.reduce((sum, course) => sum + course.completedChapters.length * 2, 0),
		averageProgress: coursesWithProgress.length > 0 ? coursesWithProgress.reduce((sum, course) => sum + course.progress, 0) / coursesWithProgress.length : 0,
		weeklyGoalProgress: 75, // Mock data - would come from user goals
		currentStreak: 7, // Mock data
	};

	return {
		error: null,
		courses: {
			active: activeCourses,
			notStarted: notStartedCourses,
			completed: completedCourses,
			all: coursesWithProgress,
		},
		stats,
	};
}

export default async function StudentCoursesPage() {
	const user = await getCurrentUser();
	const { error, courses, stats } = await getCoursesData();

	if (error) {
		return (
			<div className="min-h-screen relative overflow-hidden">
				<div className="container-custom py-8 relative z-10">
					<div className="adaptive-card p-12 text-center">
						<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<MessageCircleWarning className="w-8 h-8 text-red-500" />
						</div>
						<h2 className="text-xl font-semibold mb-2">Unable to Load Courses</h2>
						<p className="text-muted-foreground mb-6">We're having trouble loading your courses. Please try refreshing the page.</p>
						<EnhancedButton variant="ai-primary" withGlow>
							Refresh Page
						</EnhancedButton>
					</div>
				</div>
			</div>
		);
	}

	const isEmpty = courses.all.length === 0;

	return (
		<div className="min-h-screen relative overflow-hidden">
			<div className="container-custom py-8 relative z-10">
				{isEmpty ? (
					<EmptyCoursesState />
				) : (
					<div className="space-y-8">
						{/* Filters and Search */}
						<CourseFilters totalCourses={courses.all.length} />

						{/* Main Content Grid */}
						<div className="grid lg:grid-cols-4 gap-8">
							{/* Main Courses Area */}
							<div className="lg:col-span-3 space-y-8">
								{/* Active Courses */}
								{courses.active.length > 0 && <ActiveCoursesGrid courses={courses.active} />}

								{/* Not Started Courses */}
								{courses.notStarted.length > 0 && (
									<div className="space-y-6">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-2xl font-bold text-foreground">Ready to Start</h2>
												<p className="text-muted-foreground">Courses you've enrolled in but haven't begun</p>
											</div>
											<Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
												{courses.notStarted.length} courses
											</Badge>
										</div>
										<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
											{courses.notStarted.map((course) => (
												<CourseCard key={course._id} course={course} variant="not-started" />
											))}
										</div>
									</div>
								)}

								{/* Completed Courses */}
								{/* {courses.completed.length > 0 && <CompletedCourses courses={courses.completed} />} */}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
