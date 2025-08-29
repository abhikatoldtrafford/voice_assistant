"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, BookOpen, Clock, TrendingUp, Star, Brain, BarChart3, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseFiltersProps {
	totalCourses: number;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ totalCourses }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState("recent");

	const filterCategories = [
		{
			title: "Status",
			filters: [
				{ id: "in-progress", label: "In Progress", count: 3 },
				{ id: "completed", label: "Completed", count: 2 },
				{ id: "not-started", label: "Not Started", count: 1 },
			],
		},
		{
			title: "Category",
			filters: [
				{ id: "programming", label: "Programming", count: 4, icon: Brain },
				{ id: "design", label: "Design", count: 2, icon: Palette },
				{ id: "business", label: "Business", count: 1, icon: BarChart3 },
			],
		},
		{
			title: "Difficulty",
			filters: [
				{ id: "beginner", label: "Beginner", count: 3 },
				{ id: "intermediate", label: "Intermediate", count: 2 },
				{ id: "advanced", label: "Advanced", count: 1 },
			],
		},
	];

	const sortOptions = [
		{ id: "recent", label: "Recently Accessed", icon: Clock },
		{ id: "progress", label: "Progress", icon: TrendingUp },
		{ id: "alphabetical", label: "A to Z", icon: BookOpen },
		{ id: "rating", label: "Highest Rated", icon: Star },
	];

	const toggleFilter = (filterId: string) => {
		setSelectedFilters((prev) => (prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]));
	};

	const clearAllFilters = () => {
		setSelectedFilters([]);
		setSearchQuery("");
	};

	const activeFiltersCount = selectedFilters.length + (searchQuery ? 1 : 0);

	return (
		<motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			{/* Main Search and Filter Bar */}
			<div className="bg-card border border-border rounded-lg p-6">
				<div className="flex flex-col lg:flex-row gap-4">
					{/* Search Input */}
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input placeholder="Search your courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-border bg-background" />
						{searchQuery && (
							<button className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setSearchQuery("")}>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>

					{/* Filter Controls */}
					<div className="flex items-center gap-3">
						<Button variant={isFilterOpen ? "default" : "outline"} onClick={() => setIsFilterOpen(!isFilterOpen)} className="relative">
							<Filter className="w-4 h-4 mr-2" />
							Filters
							{activeFiltersCount > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs text-accent-foreground font-medium">{activeFiltersCount}</span>}
						</Button>

						{/* Sort Select */}
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-48 border-border">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.id} value={option.id}>
										<div className="flex items-center gap-2">
											<option.icon className="w-4 h-4" />
											{option.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Results Count */}
						<Badge variant="secondary" className="text-xs">
							{totalCourses} courses
						</Badge>
					</div>
				</div>

				{/* Active Filters Display */}
				<AnimatePresence>
					{(selectedFilters.length > 0 || searchQuery) && (
						<motion.div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
							<span className="text-sm font-medium text-muted-foreground">Active filters:</span>

							{searchQuery && (
								<Badge variant="outline" className="gap-1">
									<Search className="w-3 h-3" />"{searchQuery}"
									<button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-muted rounded-full p-0.5">
										<X className="w-3 h-3" />
									</button>
								</Badge>
							)}

							{selectedFilters.map((filterId) => {
								const filter = filterCategories.flatMap((cat) => cat.filters).find((f) => f.id === filterId);

								if (!filter) return null;

								return (
									<Badge key={filterId} variant="outline" className="gap-1">
										{filter.label}
										<button onClick={() => toggleFilter(filterId)} className="ml-1 hover:bg-muted rounded-full p-0.5">
											<X className="w-3 h-3" />
										</button>
									</Badge>
								);
							})}

							<Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6">
								Clear all
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Expanded Filter Panel */}
			<AnimatePresence>
				{isFilterOpen && (
					<motion.div className="bg-card border border-border rounded-lg p-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-foreground">Filter Options</h3>
								<Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
									<X className="w-4 h-4" />
								</Button>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								{filterCategories.map((category, categoryIndex) => (
									<motion.div key={category.title} className="space-y-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: categoryIndex * 0.1 }}>
										<h4 className="font-medium text-foreground text-sm">{category.title}</h4>
										<div className="space-y-2">
											{category.filters.map((filter) => (
												<button
													key={filter.id}
													onClick={() => toggleFilter(filter.id)}
													className={cn(
														"w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 text-left",
														selectedFilters.includes(filter.id) ? "border-accent bg-accent/10" : "border-border hover:border-accent/50 hover:bg-muted/50"
													)}
												>
													<div className="flex items-center gap-2">
														{/* {filter.icon && <filter.icon className="w-4 h-4 text-muted-foreground" />} */}
														<span className="text-sm font-medium text-foreground">{filter.label}</span>
													</div>
													<Badge variant="secondary" className="text-xs">
														{filter.count}
													</Badge>
												</button>
											))}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default CourseFilters;
