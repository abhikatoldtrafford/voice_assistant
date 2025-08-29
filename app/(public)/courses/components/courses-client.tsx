"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseCard from "./course-card";
import CoursesHeader from "./courses-header";
import CoursesFilters from "./courses-filters";
import { CourseData } from "@/models/Course";
import { Search, ChevronDown, Bot, Sparkles, Filter, Grid3X3, List, BookOpen, TrendingUp, Clock, Award } from "lucide-react";

interface CategoryOption {
	name: string;
	value: string;
	icon: string;
	count: number;
}

interface LevelOption {
	name: string;
	value: string;
}

interface InitialFilters {
	category: string;
	level: string;
	search: string;
	sort: string;
	price: string;
}

interface CoursesClientProps {
	initialCourses: CourseData[];
	categories: CategoryOption[];
	levels: LevelOption[];
	initialFilters: InitialFilters;
}

const sortOptions = [
	{ name: "Most Popular", value: "popular" },
	{ name: "Highest Rated", value: "rating" },
	{ name: "Newest", value: "newest" },
	{ name: "Price: Low to High", value: "price-asc" },
	{ name: "Price: High to Low", value: "price-desc" },
	{ name: "Free Courses", value: "free" },
];

const priceRanges = [
	{ name: "All Prices", value: "all" },
	{ name: "Free", value: "free" },
	{ name: "$1 - $50", value: "1-50" },
	{ name: "$51 - $100", value: "51-100" },
	{ name: "$100+", value: "100+" },
];

export default function CoursesClient({ initialCourses, categories, levels, initialFilters }: CoursesClientProps) {
	const [courses] = useState(initialCourses);
	const [filteredCourses, setFilteredCourses] = useState(initialCourses);
	const [searchQuery, setSearchQuery] = useState(initialFilters.search);
	const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
	const [selectedLevel, setSelectedLevel] = useState(initialFilters.level);
	const [selectedSort, setSelectedSort] = useState(initialFilters.sort);
	const [selectedPriceRange, setSelectedPriceRange] = useState(initialFilters.price);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [showFilters, setShowFilters] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [displayCount, setDisplayCount] = useState(12);

	// Filter and sort courses
	const processedCourses = useMemo(() => {
		let filtered = courses;

		// Search filter
		if (searchQuery) {
			filtered = filtered.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase()) || course.category.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		// Category filter
		if (selectedCategory !== "all") {
			filtered = filtered.filter((course) => course.category.toLowerCase() === selectedCategory.toLowerCase());
		}

		// Level filter
		if (selectedLevel !== "all") {
			filtered = filtered.filter((course) => course.level.toLowerCase() === selectedLevel.toLowerCase());
		}

		// Price range filter
		if (selectedPriceRange !== "all") {
			filtered = filtered.filter((course) => {
				switch (selectedPriceRange) {
					case "free":
						return course.price === 0;
					case "1-50":
						return course.price > 0 && course.price <= 50;
					case "51-100":
						return course.price > 50 && course.price <= 100;
					case "100+":
						return course.price > 100;
					default:
						return true;
				}
			});
		}

		// Sort courses
		filtered.sort((a, b) => {
			switch (selectedSort) {
				case "rating":
					return 0; // Since we don't have rating in CourseData
				case "newest":
					return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
				case "price-asc":
					return a.price - b.price;
				case "price-desc":
					return b.price - a.price;
				case "free":
					return a.price === 0 ? -1 : 1;
				case "popular":
				default:
					return b.chapters.length - a.chapters.length;
			}
		});

		return filtered;
	}, [courses, searchQuery, selectedCategory, selectedLevel, selectedSort, selectedPriceRange]);

	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => {
			setFilteredCourses(processedCourses);
			setIsLoading(false);
		}, 300);
		return () => clearTimeout(timer);
	}, [processedCourses]);

	const clearFilters = () => {
		setSearchQuery("");
		setSelectedCategory("all");
		setSelectedLevel("all");
		setSelectedPriceRange("all");
		setSelectedSort("popular");
	};

	const activeFiltersCount = [searchQuery, selectedCategory !== "all" ? selectedCategory : null, selectedLevel !== "all" ? selectedLevel : null, selectedPriceRange !== "all" ? selectedPriceRange : null].filter(Boolean).length;

	const displayedCourses = filteredCourses.slice(0, displayCount);
	const hasMoreCourses = filteredCourses.length > displayCount;

	const loadMore = () => {
		setDisplayCount((prev) => prev + 12);
	};

	// Course statistics
	const courseStats = useMemo(() => {
		const totalCourses = filteredCourses.length;
		const freeCourses = filteredCourses.filter((c) => c.price === 0).length;
		const paidCourses = totalCourses - freeCourses;
		const avgPrice = paidCourses > 0 ? filteredCourses.filter((c) => c.price > 0).reduce((sum, c) => sum + c.price, 0) / paidCourses : 0;

		return { totalCourses, freeCourses, paidCourses, avgPrice };
	}, [filteredCourses]);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<CoursesHeader />

			{/* Enhanced Search and Filters Section */}
			<section className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
				<div className="container-custom py-6">
					{/* Primary Search Bar */}
					<motion.div className="max-w-2xl mx-auto mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="text"
								placeholder="Search for courses, topics, or skills..."
								className="w-full h-14 pl-12 pr-16 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 text-lg shadow-sm hover:shadow-md"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<div className="absolute right-4 top-1/2 transform -translate-y-1/2">
								<div className="ai-badge">
									<Bot className="w-4 h-4" />
									<span>AI Search</span>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Filter Controls */}
					<CoursesFilters
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						selectedLevel={selectedLevel}
						setSelectedLevel={setSelectedLevel}
						selectedSort={selectedSort}
						setSelectedSort={setSelectedSort}
						selectedPriceRange={selectedPriceRange}
						setSelectedPriceRange={setSelectedPriceRange}
						viewMode={viewMode}
						setViewMode={setViewMode}
						showFilters={showFilters}
						setShowFilters={setShowFilters}
						activeFiltersCount={activeFiltersCount}
						clearFilters={clearFilters}
						categories={categories}
						levels={levels}
						sortOptions={sortOptions}
						priceRanges={priceRanges}
					/>
				</div>
			</section>

			{/* Enhanced Results Header with Statistics */}
			<section className="section-padding-sm bg-muted/30">
				<div className="container-custom">
					<motion.div className="grid lg:grid-cols-2 gap-8 items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
						{/* Results Info */}
						<div>
							<h2 className="heading-3 text-foreground mb-2">{filteredCourses.length.toLocaleString()} courses found</h2>
							{searchQuery && (
								<p className="text-lg text-muted-foreground mb-4">
									Results for <span className="font-medium text-foreground">"{searchQuery}"</span>
									{selectedCategory !== "all" && (
										<span>
											{" "}
											in <span className="font-medium text-accent">{selectedCategory}</span>
										</span>
									)}
								</p>
							)}
							<div className="flex items-center gap-6 text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4 text-accent" />
									<span>{courseStats.totalCourses} courses</span>
								</div>
								<div className="flex items-center gap-2">
									<Sparkles className="w-4 h-4 text-success" />
									<span>{courseStats.freeCourses} free</span>
								</div>
								{courseStats.avgPrice > 0 && (
									<div className="flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-warning" />
										<span>Avg ${courseStats.avgPrice.toFixed(0)}</span>
									</div>
								)}
							</div>
						</div>

						{/* Quick Category Pills */}
						<div className="flex flex-wrap items-center gap-3 justify-end">
							{categories.slice(1, 5).map((category) => (
								<motion.button
									key={category.value}
									onClick={() => setSelectedCategory(category.value)}
									className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
										selectedCategory === category.value ? "bg-accent text-accent-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border hover:border-accent/30"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{category.name}
									<span className="ml-1 text-xs opacity-70">({category.count})</span>
								</motion.button>
							))}
						</div>
					</motion.div>

					{/* Active Filters Display */}
					{activeFiltersCount > 0 && (
						<motion.div className="mt-6 flex flex-wrap items-center gap-3" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
							<span className="text-sm text-muted-foreground font-medium">Active filters:</span>
							{searchQuery && (
								<div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-sm">
									<Search className="w-3 h-3 text-accent" />
									<span className="text-accent font-medium">"{searchQuery}"</span>
								</div>
							)}
							{selectedCategory !== "all" && (
								<div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-sm">
									<Filter className="w-3 h-3 text-accent" />
									<span className="text-accent font-medium">{selectedCategory}</span>
								</div>
							)}
							{selectedLevel !== "all" && (
								<div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-sm">
									<Award className="w-3 h-3 text-accent" />
									<span className="text-accent font-medium">{selectedLevel}</span>
								</div>
							)}
							{selectedPriceRange !== "all" && (
								<div className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-sm">
									<TrendingUp className="w-3 h-3 text-accent" />
									<span className="text-accent font-medium">{priceRanges.find((p) => p.value === selectedPriceRange)?.name}</span>
								</div>
							)}
							<Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-3 text-muted-foreground hover:text-accent">
								Clear all
							</Button>
						</motion.div>
					)}
				</div>
			</section>

			{/* Courses Grid */}
			<section className="section-padding">
				<div className="container-custom">
					<AnimatePresence mode="wait">
						{isLoading ? (
							<motion.div key="loading" className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								{[...Array(6)].map((_, i) => (
									<motion.div key={i} className="adaptive-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
										<div className="aspect-video bg-muted animate-pulse" />
										<CardContent className="p-6 space-y-4">
											<div className="flex gap-2 mb-3">
												<div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
												<div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
											</div>
											<div className="h-6 bg-muted rounded animate-pulse" />
											<div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
											<div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
											<div className="flex justify-between items-center mt-6">
												<div className="h-8 w-16 bg-muted rounded animate-pulse" />
												<div className="h-10 w-24 bg-muted rounded animate-pulse" />
											</div>
										</CardContent>
									</motion.div>
								))}
							</motion.div>
						) : filteredCourses.length === 0 ? (
							<motion.div key="empty" className="text-center py-24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
								<motion.div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
									<Search className="w-10 h-10 text-muted-foreground" />
								</motion.div>
								<h3 className="heading-3 text-foreground mb-4">No courses found</h3>
								<p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.</p>
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Button onClick={clearFilters} variant="outline" size="lg">
										Clear All Filters
									</Button>
									<Button variant="ghost" size="lg" className="text-muted-foreground">
										Browse All Courses
									</Button>
								</div>
							</motion.div>
						) : (
							<motion.div key="courses" className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								{displayedCourses.map((course, index) => (
									<CourseCard key={course._id} course={course} index={index} viewMode={viewMode} />
								))}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Enhanced Load More Section */}
					{hasMoreCourses && !isLoading && (
						<motion.div className="text-center mt-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
							<div className="space-y-6">
								<div className="flex items-center justify-center gap-4 text-muted-foreground">
									<div className="h-px bg-border flex-1 max-w-24" />
									<span className="text-sm">Load more courses</span>
									<div className="h-px bg-border flex-1 max-w-24" />
								</div>

								<Button onClick={loadMore} variant="outline" size="lg" className="px-8 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent transition-all duration-300 hover:shadow-md">
									<ChevronDown className="w-4 h-4 mr-2" />
									Show More Courses
								</Button>

								<div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4" />
										<span>
											Showing {displayedCourses.length} of {filteredCourses.length}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Bot className="w-4 h-4 text-accent" />
										<span>AI-curated results</span>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{/* Course Discovery CTA */}
					{!isLoading && filteredCourses.length > 0 && (
						<motion.div className="mt-24 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
							<div className="max-w-2xl mx-auto p-8 bg-gradient-surface rounded-2xl border border-border">
								<div className="flex items-center justify-center mb-4">
									<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
										<Sparkles className="w-6 h-6 text-accent" />
									</div>
								</div>
								<h3 className="text-xl font-semibold text-foreground mb-3">Can't find what you're looking for?</h3>
								<p className="text-muted-foreground mb-6 leading-relaxed">Our AI-powered course recommendation engine can help you discover personalized learning paths based on your goals and interests.</p>
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Button className="bg-accent text-accent-foreground hover:bg-accent/90">
										<Bot className="w-4 h-4 mr-2" />
										Get AI Recommendations
									</Button>
									<Button variant="outline">Request a Course</Button>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</section>
		</div>
	);
}
