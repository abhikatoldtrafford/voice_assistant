import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BookOpen, Users, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { getInstructorCourses } from "@/actions/course";
import { Badge } from "@/components/ui/badge";
import CourseControls from "./components/CourseControls";
import { getUserProfile } from "@/lib/utils";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
	// Fetch courses from the database
	const { success, courses = [], error } = await getInstructorCourses();

	// Helper function to get status icon
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "rejected":
				return <XCircle className="h-4 w-4 text-red-500" />;
			case "pending":
				return <Clock className="h-4 w-4 text-amber-500" />;
			default:
				return <AlertTriangle className="h-4 w-4 text-gray-400" />;
		}
	};

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Your Courses</h2>
					<p className="text-sm text-muted-foreground">Manage and create your courses</p>
				</div>
				<Link href="/instructor/courses/create">
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Create Course
					</Button>
				</Link>
			</div>

			{!success ? (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">Error loading courses: {error}</div>
			) : courses.length === 0 ? (
				<div className="text-center py-12">
					<h3 className="text-lg font-medium text-gray-500 mb-4">You don't have any courses yet</h3>
					<Link href="/instructor/courses/create">
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Create your first course
						</Button>
					</Link>
				</div>
			) : (
				<>
					{/* Review status summary */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<Card className="">
							<CardContent className="p-6">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Total Courses</p>
										<p className="text-2xl font-bold">{courses.length}</p>
									</div>
									<BookOpen className="h-8 w-8 text-primary opacity-80" />
								</div>
							</CardContent>
						</Card>

						<Card className="">
							<CardContent className="p-6">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Published</p>
										<p className="text-2xl font-bold">{courses.filter((c) => c.isPublished).length}</p>
									</div>
									<CheckCircle className="h-8 w-8 text-green-500" />
								</div>
							</CardContent>
						</Card>

						<Card className="">
							<CardContent className="p-6">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Pending Review</p>
										<p className="text-2xl font-bold">{courses.filter((c) => c.reviewStatus === "pending").length}</p>
									</div>
									<Clock className="h-8 w-8 text-amber-500" />
								</div>
							</CardContent>
						</Card>

						<Card className="">
							<CardContent className="p-6">
								<div className="flex justify-between items-center">
									<div>
										<p className="text-sm font-medium text-muted-foreground">Rejected</p>
										<p className="text-2xl font-bold">{courses.filter((c) => c.reviewStatus === "rejected").length}</p>
									</div>
									<XCircle className="h-8 w-8 text-red-500" />
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{courses.map((course) => (
							<Card key={course._id}>
								<CardHeader>
									<div className="flex items-center justify-between mb-2">
										<Badge variant={course.isPublished ? "default" : "outline"}>{course.isPublished ? "Published" : "Draft"}</Badge>
										<div className="flex items-center">
											{getStatusIcon(course.reviewStatus)}
											<Badge
												variant="outline"
												className={`ml-2 ${
													course.reviewStatus === "approved"
														? "bg-green-100 text-green-800"
														: course.reviewStatus === "rejected"
														? "bg-red-100 text-red-800"
														: course.reviewStatus === "pending"
														? "bg-amber-100 text-amber-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{course.reviewStatus === "approved" ? "Approved" : course.reviewStatus === "rejected" ? "Rejected" : course.reviewStatus === "pending" ? "Pending Review" : "Draft"}
											</Badge>
										</div>
									</div>
									<CardTitle className="truncate">{course.title}</CardTitle>
									{course.reviewDate && <p className="text-xs text-muted-foreground mt-1">Review date: {format(new Date(course.reviewDate), "MMM d, yyyy")}</p>}
								</CardHeader>
								<CardContent>
									<div className="flex space-x-4 text-sm text-muted-foreground">
										<div className="flex items-center">
											<Users className="h-4 w-4 mr-1" />
											{course.students || 0} students
										</div>
										<div className="flex items-center">
											<BookOpen className="h-4 w-4 mr-1" />
											{course.chapters || 0} chapters
										</div>
									</div>
									<div className="mt-2">
										<p className="text-md font-medium">${typeof course.price === "number" ? course.price.toFixed(2) : course.price}</p>
									</div>
								</CardContent>
								<CardFooter>
									<CourseControls courseId={course._id.toString()} reviewStatus={course.reviewStatus} reviewComment={course.reviewComment} isPublished={course.isPublished} />
								</CardFooter>
							</Card>
						))}
					</div>
				</>
			)}
		</div>
	);
}
