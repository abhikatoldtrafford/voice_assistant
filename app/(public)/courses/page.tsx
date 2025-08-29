// app/(public)/courses/page.tsx
import React from "react";
import { getAllCourses } from "@/actions/course";
import EnhancedCoursesClient from "./components/courses-client";
import { CourseData } from "@/models/Course";

// Define course categories that will be used for filtering
const CATEGORIES = [
	{ name: "All Courses", value: "all", icon: "BookOpen", count: 0 },
	{ name: "Programming", value: "programming", icon: "Code", count: 0 },
	{ name: "Design", value: "design", icon: "Palette", count: 0 },
	{ name: "Business", value: "business", icon: "Briefcase", count: 0 },
	{ name: "Marketing", value: "marketing", icon: "TrendingUp", count: 0 },
	{ name: "Data Science", value: "data-science", icon: "Database", count: 0 },
	{ name: "Artificial Intelligence", value: "ai", icon: "Brain", count: 0 },
	{ name: "Mobile Development", value: "mobile", icon: "Smartphone", count: 0 },
	{ name: "Music", value: "music", icon: "Music", count: 0 },
	{ name: "Photography", value: "photography", icon: "Camera", count: 0 },
];

// Define experience levels
const LEVELS = [
	{ name: "All Levels", value: "all" },
	{ name: "Beginner", value: "beginner" },
	{ name: "Intermediate", value: "intermediate" },
	{ name: "Advanced", value: "advanced" },
];

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	// Extract search parameters for filtering
	const searchParamsData = await searchParams;
	const category = typeof searchParamsData.category === "string" ? searchParamsData.category : "all";
	const level = typeof searchParamsData.level === "string" ? searchParamsData.level : "all";
	const search = typeof searchParamsData.search === "string" ? searchParamsData.search : "";
	const sort = typeof searchParamsData.sort === "string" ? searchParamsData.sort : "popular";
	const price = typeof searchParamsData.price === "string" ? searchParamsData.price : "all";

	// Fetch all published courses from the database
	const result = await getAllCourses();

	if (!result.success) {
		return (
			<div className="container-custom py-12">
				<div className="text-center">
					<h2 className="text-2xl font-bold">Error loading courses</h2>
					<p className="text-red-500 mt-2">{result.error}</p>
				</div>
			</div>
		);
	}

	const allCourses = result.courses || [];

	// Update category counts
	const categoriesWithCounts = CATEGORIES.map((cat) => ({
		...cat,
		count: cat.value === "all" ? allCourses.length : allCourses.filter((course) => course.category?.toLowerCase() === cat.value.toLowerCase()).length,
	}));

	return (
		<EnhancedCoursesClient
			initialCourses={allCourses}
			categories={categoriesWithCounts}
			levels={LEVELS}
			initialFilters={{
				category,
				level,
				search,
				sort,
				price,
			}}
		/>
	);
}
