"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertCircle, Clock, Search, Eye, ThumbsUp, ThumbsDown, Filter } from "lucide-react";
import { getAllCoursesWithStatus, toggleCoursePublish } from "@/actions/course";
import { useToast } from "@/hooks/use-toast";
import { CourseData } from "@/models/Course";

export default function AdminCoursesPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [filter, setFilter] = useState<string>("all");
	const [search, setSearch] = useState("");
	const [courses, setCourses] = useState<CourseData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch courses on initial load or when filter changes
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setIsLoading(true);
				const result = await getAllCoursesWithStatus(filter !== "all" ? (filter as any) : undefined);

				if (result.success && result.courses) {
					setCourses(result.courses);
				} else {
					setError(result.error || "Failed to load courses");
					toast({
						title: "Error",
						description: result.error || "Failed to load courses",
						variant: "destructive",
					});
				}
			} catch (error) {
				setError("An unexpected error occurred");
				toast({
					title: "Error",
					description: "An unexpected error occurred",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchCourses();
	}, [filter, toast]);

	// Filter courses based on search
	const filteredCourses = courses.filter((course) => {
		const searchTerm = search.toLowerCase();
		return course.title.toLowerCase().includes(searchTerm) || course.category?.toLowerCase().includes(searchTerm);
	});

	// Handle course approval or rejection
	const handleTogglePublish = async (courseId: string, isPublished: boolean) => {
		try {
			setIsLoading(true);
			const result = await toggleCoursePublish(courseId, isPublished);

			if (result.success) {
				// Update the course in the list
				setCourses(courses.map((course) => (course._id === courseId ? { ...course, isPublished, reviewStatus: isPublished ? "approved" : "draft" } : course)));

				toast({
					title: "Success",
					description: isPublished ? "Course published successfully" : "Course unpublished successfully",
				});
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to update course status",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Get badge color based on review status
	const getStatusBadge = (status: string) => {
		switch (status) {
			case "approved":
				return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
			case "pending":
				return <Badge className="bg-amber-100 text-amber-800">Pending Review</Badge>;
			case "rejected":
				return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
			default:
				return <Badge variant="outline">Draft</Badge>;
		}
	};

	// Status icon component
	const StatusIcon = ({ status }: { status: string }) => {
		switch (status) {
			case "approved":
				return <CheckCircle className="h-5 w-5 text-green-500" />;
			case "pending":
				return <Clock className="h-5 w-5 text-amber-500" />;
			case "rejected":
				return <XCircle className="h-5 w-5 text-red-500" />;
			default:
				return <AlertCircle className="h-5 w-5 text-gray-400" />;
		}
	};

	if (isLoading && courses.length === 0) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">All Courses</h2>
				</div>
				<div className="flex justify-center items-center h-64">
					<div className="text-center">
						<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
						<p className="text-muted-foreground">Loading courses...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">All Courses</h2>
					<p className="text-sm text-muted-foreground">Manage and moderate all platform courses</p>
				</div>
				<div className="flex space-x-4">
					<Button variant="outline" onClick={() => router.push("/admin/courses/review")}>
						<Clock className="h-4 w-4 mr-2 text-amber-500" />
						Review Queue
					</Button>
				</div>
			</div>

			{/* Filter tabs */}
			<div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
				<Tabs defaultValue={filter} value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
					<TabsList className="w-full sm:w-auto grid sm:grid-flow-col grid-cols-4">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="approved">Approved</TabsTrigger>
						<TabsTrigger value="pending">Pending</TabsTrigger>
						<TabsTrigger value="rejected">Rejected</TabsTrigger>
					</TabsList>
				</Tabs>

				<div className="flex w-full sm:w-auto items-center space-x-2">
					<Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-auto" />
					<Button size="icon" className="shrink-0">
						<Search className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="grid gap-4">
				{filteredCourses.length === 0 ? (
					<div className="text-center p-8 border rounded-lg">
						<Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No courses found</h3>
						<p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
						<Button
							variant="outline"
							onClick={() => {
								setFilter("all");
								setSearch("");
							}}
						>
							Reset Filters
						</Button>
					</div>
				) : (
					filteredCourses.map((course) => (
						<Card key={course._id}>
							<CardContent className="p-0">
								<div className="flex flex-col sm:flex-row items-stretch">
									{/* Course info */}
									<div className="p-6 flex-1">
										<div className="flex items-center gap-2 mb-2">
											<StatusIcon status={course.reviewStatus} />
											{getStatusBadge(course.reviewStatus)}
											<Badge variant={course.isPublished ? "default" : "outline"}>{course.isPublished ? "Published" : "Unpublished"}</Badge>
										</div>

										<h3 className="text-lg font-medium mb-1">{course.title}</h3>
										{/* <p className="text-sm text-muted-foreground mb-2">By {course.instructorName || "Unknown Instructor"}</p> */}

										<div className="text-sm flex flex-wrap gap-4 mt-2">
											<span>Level: {course.level || "Not specified"}</span>
											<span>Price: ${course.price || "0.00"}</span>
											{/* <span>Students: {course.totalStudents || 0}</span> */}
											{/* <span>Rating: {course.rating || "No ratings"}</span> */}
										</div>
									</div>

									{/* Actions */}
									<div className="flex sm:flex-col justify-around items-stretch p-4 sm:p-6 gap-2 sm:min-w-[180px] sm:border-l">
										<Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => router.push(`/courses/${course._id}`)}>
											<Eye className="h-4 w-4 mr-2" />
											Preview
										</Button>

										{course.isPublished ? (
											<Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => handleTogglePublish(course._id, false)}>
												<XCircle className="h-4 w-4 mr-2" />
												Unpublish
											</Button>
										) : (
											<Button variant="default" size="sm" className="flex-1 sm:flex-initial" onClick={() => handleTogglePublish(course._id, true)}>
												<CheckCircle className="h-4 w-4 mr-2" />
												Publish
											</Button>
										)}

										{course.reviewStatus === "pending" && (
											<Button
												variant="default"
												size="sm"
												className="hidden sm:flex" // Only show on larger screens
												onClick={() => router.push(`/admin/courses/review?courseId=${course._id}`)}
											>
												Review
											</Button>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
}
