// app/(protected)/(dashboard)/student/dashboard/page.tsx
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, Trophy, Brain, Target, Sparkles, TrendingUp, Award, Star, Zap, Heart, ChevronRight, Bot, Calendar, Eye, ArrowRight } from "lucide-react";
import { getEnrolledCourses, getCourseProgress } from "@/actions/enrollment";
import { getCurrentUser } from "@/actions/user";
import EmptyState from "@/components/EmptyState";
import CourseCard from "../components/CourseCard";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { motion } from "framer-motion";
import WelcomeHero from "./components/WelcomeHero";
import ProgressOverview from "./components/ProgressOverview";
import ActiveCourses from "./components/ActiveCourses";
import LearningStreak from "./components/LearningStreak";
import AICoachCard from "./components/AICoachCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import LearningGoals from "./components/LearningGoals";

async function DashboardContent() {
	// Fetch enrolled courses
	const enrollmentResult = await getEnrolledCourses();

	if (!enrollmentResult.success) {
		return (
			<div className="adaptive-card p-8 text-center">
				<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
					<Trophy className="w-8 h-8 text-red-500" />
				</div>
				<h3 className="text-lg font-semibold mb-2">Unable to Load Courses</h3>
				<p className="text-muted-foreground mb-4">We're having trouble loading your dashboard. Please try again.</p>
				<EnhancedButton variant="ai-primary" withGlow>
					<ArrowRight className="w-4 h-4 mr-2" />
					Refresh Dashboard
				</EnhancedButton>
			</div>
		);
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
			};
		})
	);

	// Calculate achievements and stats
	const completedCourses = coursesWithProgress.filter((course) => course.isCompleted).length;
	const totalCompletedChapters = coursesWithProgress.reduce((total, course) => total + course.completedChapters.length, 0);
	const estimatedLearningHours = totalCompletedChapters * 2;
	const averageProgress = coursesWithProgress.length > 0 ? coursesWithProgress.reduce((sum, course) => sum + course.progress, 0) / coursesWithProgress.length : 0;

	// Get active courses (not completed, has progress)
	const activeCourses = coursesWithProgress.filter((course) => !course.isCompleted && course.progress > 0);
	const recommendedCourses = coursesWithProgress.filter((course) => course.progress === 0);

	const stats = {
		completedCourses,
		totalCompletedChapters,
		estimatedLearningHours,
		averageProgress,
		activeCourses: activeCourses.length,
		totalCourses: coursesWithProgress.length,
	};

	return (
		<div className="space-y-8">
			{/* Active Courses Section */}
			<ActiveCourses courses={activeCourses} recommendedCourses={recommendedCourses} isEmpty={coursesWithProgress.length === 0} />
			{false && (
				<>
					{/* Progress Overview */}
					<ProgressOverview stats={stats} />

					{/* AI Coach & Quick Actions Row */}
					<div className="grid lg:grid-cols-3 gap-6">
						<div className="lg:col-span-2">
							<RecentActivity courses={coursesWithProgress.slice(0, 3)} />
						</div>
						<div className="space-y-6">
							<AICoachCard />
							<QuickActions />
						</div>
					</div>

					{/* Learning Goals & Streak */}
					<div className="grid lg:grid-cols-2 gap-6">
						<LearningGoals />
						<LearningStreak />
					</div>
				</>
			)}
		</div>
	);
}

export default async function StudentDashboard() {
	// Get current user information
	const user = await getCurrentUser();
	const userName = user?.name || "Student";
	const userImage = user?.picture;

	return (
		<div className="min-h-screen relative overflow-hidden">
			<div className="container-custom relative z-10 py-8">
				{/* Welcome Hero Section */}
				<WelcomeHero userName={userName} userImage={userImage} />

				{/* Main Dashboard Content */}
				<DashboardContent />
			</div>
		</div>
	);
}
