"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, Clock, XCircle, Search, Eye, ThumbsUp, ThumbsDown, Inbox, BookOpen, RefreshCw, Filter } from "lucide-react";
import { getPendingReviewCourses, approveCourse, rejectCourse } from "@/actions/course";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CourseData } from "@/models/Course";

export default function AdminCourseReviewPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [filter, setFilter] = useState("pending");
	const [search, setSearch] = useState("");
	const [courses, setCourses] = useState<CourseData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
	const [rejectReason, setRejectReason] = useState("");
	const [showApproveDialog, setShowApproveDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch courses on initial load
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				setIsLoading(true);
				const result = await getPendingReviewCourses();

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
	}, [toast]);

	// Filter courses based on search and filter criteria
	const filteredCourses = courses.filter((course) => {
		const matchesFilter = filter === "all" || course.reviewStatus === filter;

		const searchTerm = search.toLowerCase();
		const matchesSearch = course.title.toLowerCase().includes(searchTerm);

		return matchesFilter && matchesSearch;
	});

	// Handle course approval
	const handleApprove = async () => {
		if (!selectedCourse) return;

		try {
			setIsSubmitting(true);
			const comment = ""; // Optionally add approval comment
			const result = await approveCourse(selectedCourse._id, comment);

			if (result.success) {
				// Remove the approved course from the list
				setCourses(courses.filter((course) => course._id !== selectedCourse._id));

				toast({
					title: "Success",
					description: "Course approved successfully",
				});
				setShowApproveDialog(false);
				setSelectedCourse(null);
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to approve course",
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
			setIsSubmitting(false);
		}
	};

	// Handle course rejection
	const handleReject = async () => {
		if (!selectedCourse || !rejectReason.trim()) return;

		try {
			setIsSubmitting(true);
			const result = await rejectCourse(selectedCourse._id, rejectReason);

			if (result.success) {
				// Remove the rejected course from the list
				setCourses(courses.filter((course) => course._id !== selectedCourse._id));

				toast({
					title: "Success",
					description: "Course rejected successfully",
				});
				setShowRejectDialog(false);
				setSelectedCourse(null);
				setRejectReason("");
			} else {
				toast({
					title: "Error",
					description: result.error || "Failed to reject course",
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
			setIsSubmitting(false);
		}
	};

	// Status icon component
	const StatusIcon = ({ status }: { status: string }) => {
		if (status === "approved") return <CheckCircle className="h-8 w-8 text-green-500" />;
		if (status === "rejected") return <XCircle className="h-8 w-8 text-red-500" />;
		if (status === "pending") return <Clock className="h-8 w-8 text-amber-500" />;
		return <AlertTriangle className="h-8 w-8 text-gray-400" />;
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold">Course Review</h2>
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
					<h2 className="text-2xl font-bold">Course Review Queue</h2>
					<p className="text-sm text-muted-foreground">Review and approve instructor course submissions</p>
				</div>
				<div className="flex space-x-4">
					<div className="w-[200px]">
						<Select value={filter} onValueChange={setFilter}>
							<SelectTrigger>
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Submissions</SelectItem>
								<SelectItem value="pending">Pending Review</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex w-full max-w-sm items-center space-x-2">
						<Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
						<Button size="icon">
							<Search className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Review statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="">
					<CardContent className="p-6">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Pending Review</p>
								<p className="text-2xl font-bold">{filteredCourses.length}</p>
							</div>
							<Clock className="h-8 w-8 text-amber-500" />
						</div>
					</CardContent>
				</Card>

				{/* Additional stats would go here in a real implementation */}
			</div>

			<div className="space-y-4">
				{filteredCourses.length === 0 ? (
					<div className="text-center p-8 border rounded-lg">
						<Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No courses to review</h3>
						<p className="text-muted-foreground mb-4">There are no courses waiting for review at this time.</p>
					</div>
				) : (
					filteredCourses.map((course) => (
						<Card key={course._id} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row">
									{/* Left side - Course info */}
									<div className="flex-1 p-6">
										<div className="flex items-center space-x-2 mb-2">
											<StatusIcon status={course.reviewStatus} />
											<Badge variant="outline" className="bg-amber-100 text-amber-800">
												Pending Review
											</Badge>
											<span className="text-xs text-muted-foreground">Submitted {course.updatedAt ? format(new Date(course.updatedAt), "MMM d, yyyy") : "recently"}</span>
										</div>

										<h3 className="text-xl font-semibold mb-2">{course.title}</h3>

										<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
											<div className="flex items-center">
												<BookOpen className="h-4 w-4 mr-1" />
												{course.chapters?.length || 0} chapters
											</div>
											{/* <div className="flex items-center">By {course.instructorName || "Unknown Instructor"}</div> */}
											<div>Price: ${course.price || "0.00"}</div>
											<div>Level: {course.level || "Not specified"}</div>
										</div>

										<p className="text-sm line-clamp-2 mb-4">{course.description || "No description provided."}</p>
									</div>

									{/* Right side - Actions */}
									<div className=" p-6 flex flex-col justify-center space-y-3 min-w-[200px]">
										<Button variant="outline" className="w-full" onClick={() => router.push(`/courses/${course._id}`)}>
											<Eye className="h-4 w-4 mr-2" />
											Preview
										</Button>

										<Button
											variant="default"
											className="w-full bg-green-600 hover:bg-green-700"
											onClick={() => {
												setSelectedCourse(course);
												setShowApproveDialog(true);
											}}
										>
											<ThumbsUp className="h-4 w-4 mr-2" />
											Approve
										</Button>

										<Button
											variant="destructive"
											className="w-full"
											onClick={() => {
												setSelectedCourse(course);
												setShowRejectDialog(true);
											}}
										>
											<ThumbsDown className="h-4 w-4 mr-2" />
											Reject
										</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Approval confirmation dialog */}
			<Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Approve Course</DialogTitle>
						<DialogDescription>Are you sure you want to approve this course? It will be published and made available to students.</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<h3 className="font-medium mb-2">{selectedCourse?.title}</h3>
						{/* <p className="text-sm text-muted-foreground">By {selectedCourse?.instructorName || "Unknown Instructor"}</p> */}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowApproveDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleApprove} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
							{isSubmitting ? (
								<>
									<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
									Approving...
								</>
							) : (
								<>
									<CheckCircle className="h-4 w-4 mr-2" />
									Approve Course
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Rejection dialog */}
			<Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Reject Course</DialogTitle>
						<DialogDescription>Please provide feedback to help the instructor improve their course.</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<h3 className="font-medium mb-2">{selectedCourse?.title}</h3>
						{/* <p className="text-sm text-muted-foreground mb-4">By {selectedCourse?.instructorName || "Unknown Instructor"}</p> */}

						<div className="space-y-2">
							<h4 className="text-sm font-medium">Rejection Reason</h4>
							<Textarea placeholder="Explain why this course is being rejected and what changes are needed..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={5} required />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setShowRejectDialog(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleReject} disabled={isSubmitting || !rejectReason.trim()}>
							{isSubmitting ? (
								<>
									<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
									Rejecting...
								</>
							) : (
								<>
									<XCircle className="h-4 w-4 mr-2" />
									Reject Course
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
