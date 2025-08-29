// app/(protected)/(dashboard)/instructor/students/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, MoreVertical, Filter } from "lucide-react";
import { getInstructorCourses, getCourseByIdWithStudents } from "@/actions/course";
import { getActiveStudentsCount, getAverageCompletionRate, getEnrolledStudents } from "@/actions/enrollment"; // We'll need to create this
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function InstructorStudentsPage() {
	// Fetch all courses for the instructor
	const coursesResult = await getInstructorCourses();

	if (!coursesResult.success) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">Error loading courses: {coursesResult.error}</div>
			</div>
		);
	}

	// Fetch enrolled students data
	const studentsResult = await getEnrolledStudents();

	if (!studentsResult.success) {
		return (
			<div className="p-6">
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">Error loading student data: {studentsResult.error}</div>
			</div>
		);
	}

	// Get completion rate
	const completionRateResult = await getAverageCompletionRate();
	const averageCompletionRate = completionRateResult.success ? completionRateResult.averageCompletionRate : 0;

	// Get active students count
	const activeStudentsResult = await getActiveStudentsCount();
	const activeStudents = activeStudentsResult.success ? activeStudentsResult.activeStudents : 0;

	const courses = coursesResult.courses || [];
	const { students = [], courseEnrollments = {} } = studentsResult;

	// Get courses with students
	const coursesWithStudents = courses.filter((course) => courseEnrollments[course._id] && courseEnrollments[course._id].length > 0);

	// Total unique students
	const totalStudents = students.length;

	return (
		<div className="space-y-6 p-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Students</h2>
				<div className="flex w-full max-w-sm items-center space-x-2">
					<Input placeholder="Search students..." />
					<Button size="icon">
						<Search className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Student stats cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Total Students</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalStudents}</div>
						<p className="text-xs text-muted-foreground mt-1">
							Across {coursesWithStudents.length} course{coursesWithStudents.length !== 1 ? "s" : ""}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{averageCompletionRate}%</div>
						<p className="text-xs text-muted-foreground mt-1">Average across all courses</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium">Active Learners</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{activeStudents}</div>
						<p className="text-xs text-muted-foreground mt-1">Last active within 30 days</p>
					</CardContent>
				</Card>
			</div>

			<Tabs defaultValue="all">
				<TabsList>
					<TabsTrigger value="all">All Students</TabsTrigger>
					<TabsTrigger value="courses">By Course</TabsTrigger>
				</TabsList>

				<TabsContent value="all" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Student List</CardTitle>
							<CardDescription>Manage all students enrolled in your courses</CardDescription>
						</CardHeader>
						<CardContent>
							{students.length === 0 ? (
								<div className="text-center p-6">
									<p className="text-muted-foreground">No students enrolled yet</p>
								</div>
							) : (
								<div className="space-y-4">
									{students.map((student) => (
										<div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
											<div className="flex items-center space-x-4">
												<Avatar>{student.picture ? <AvatarImage src={student.picture} alt={student.name} /> : <AvatarFallback>{student.name ? student.name.charAt(0).toUpperCase() : "S"}</AvatarFallback>}</Avatar>
												<div>
													<p className="font-medium">{student.name}</p>
													<p className="text-sm text-muted-foreground">
														{student.enrollments.length} course{student.enrollments.length !== 1 ? "s" : ""} enrolled
													</p>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<Button variant="ghost" size="icon" asChild>
													<a href={`mailto:${student.email}`}>
														<Mail className="h-4 w-4" />
													</a>
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="icon">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuItem>View Progress</DropdownMenuItem>
														<DropdownMenuItem>Send Message</DropdownMenuItem>
														<DropdownMenuItem>View Enrollments</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="courses" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Students by Course</CardTitle>
							<CardDescription>View student enrollment by course</CardDescription>
						</CardHeader>
						<CardContent>
							{coursesWithStudents.length === 0 ? (
								<div className="text-center p-6">
									<p className="text-muted-foreground">No courses with enrolled students</p>
								</div>
							) : (
								<div className="space-y-6">
									{coursesWithStudents.map((course) => {
										const courseStudents = courseEnrollments[course._id] || [];
										const totalCompletionPercent = courseStudents.reduce((sum, s) => sum + s.progress, 0);
										const avgCompletion = courseStudents.length > 0 ? Math.round(totalCompletionPercent / courseStudents.length) : 0;

										return (
											<div key={course._id} className="border rounded-lg p-4">
												<div className="flex justify-between items-start mb-4">
													<div>
														<h3 className="font-semibold text-lg">{course.title}</h3>
														<div className="flex items-center space-x-2 mt-1">
															<Badge variant={course.isPublished ? "default" : "outline"}>{course.isPublished ? "Published" : "Draft"}</Badge>
															<span className="text-sm text-muted-foreground">
																{courseStudents.length} student{courseStudents.length !== 1 ? "s" : ""}
															</span>
														</div>
													</div>
													<Button variant="outline" size="sm">
														View All
													</Button>
												</div>

												<div className="space-y-2">
													<div className="flex justify-between text-sm">
														<span>Average Completion Rate</span>
														<span>{avgCompletion}%</span>
													</div>
													<Progress value={avgCompletion} className="h-2" />
												</div>

												<ScrollArea className="h-48 mt-4">
													<div className="space-y-2">
														{courseStudents.map((student) => (
															<div key={student.studentId} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
																<div className="flex items-center space-x-2">
																	<Avatar className="h-8 w-8">
																		{student.picture ? (
																			<AvatarImage src={student.picture} alt={student.name} />
																		) : (
																			<AvatarFallback className="text-xs">{student.name ? student.name.charAt(0).toUpperCase() : "S"}</AvatarFallback>
																		)}
																	</Avatar>
																	<span className="text-sm">{student.name}</span>
																</div>
																<div className="flex items-center space-x-2">
																	<span className="text-xs text-muted-foreground">{student.progress}% complete</span>
																	<Button variant="ghost" size="icon" className="h-7 w-7" asChild>
																		<a href={`mailto:${student.email}`}>
																			<Mail className="h-3 w-3" />
																		</a>
																	</Button>
																</div>
															</div>
														))}
													</div>
												</ScrollArea>
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
