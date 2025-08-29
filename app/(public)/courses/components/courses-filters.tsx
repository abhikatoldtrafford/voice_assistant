"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid3X3, List, X, ChevronDown, SlidersHorizontal, Bot, Sparkles, TrendingUp, DollarSign, Award, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryOption {
	name: string;
	value: string;
	count: number;
}

interface LevelOption {
	name: string;
	value: string;
}

interface SortOption {
	name: string;
	value: string;
}

interface PriceRange {
	name: string;
	value: string;
}

interface CoursesFiltersProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;
	selectedLevel: string;
	setSelectedLevel: (level: string) => void;
	selectedSort: string;
	setSelectedSort: (sort: string) => void;
	selectedPriceRange: string;
	setSelectedPriceRange: (price: string) => void;
	viewMode: "grid" | "list";
	setViewMode: (mode: "grid" | "list") => void;
	showFilters: boolean;
	setShowFilters: (show: boolean) => void;
	activeFiltersCount: number;
	clearFilters: () => void;
	categories: CategoryOption[];
	levels: LevelOption[];
	sortOptions: SortOption[];
	priceRanges: PriceRange[];
}

export default function CoursesFilters({
	searchQuery,
	setSearchQuery,
	selectedCategory,
	setSelectedCategory,
	selectedLevel,
	setSelectedLevel,
	selectedSort,
	setSelectedSort,
	selectedPriceRange,
	setSelectedPriceRange,
	viewMode,
	setViewMode,
	showFilters,
	setShowFilters,
	activeFiltersCount,
	clearFilters,
	categories,
	levels,
	sortOptions,
	priceRanges,
}: CoursesFiltersProps) {
	const getFilterIcon = (filterType: string) => {
		switch (filterType) {
			case "category":
				return BookOpen;
			case "level":
				return Award;
			case "price":
				return DollarSign;
			case "sort":
				return TrendingUp;
			default:
				return Filter;
		}
	};

	const FilterSelect = ({
		value,
		onValueChange,
		placeholder,
		options,
		width = "w-40",
		icon: Icon = Filter,
		showCount = false,
	}: {
		value: string;
		onValueChange: (value: string) => void;
		placeholder: string;
		options: any[];
		width?: string;
		icon?: any;
		showCount?: boolean;
	}) => (
		<motion.div className={`relative ${width}`} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger className="border-border hover:border-accent/50 bg-card/80 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-accent/20 hover:shadow-md">
					<div className="flex items-center gap-2">
						<Icon className="w-4 h-4 text-accent" />
						<SelectValue placeholder={placeholder} />
					</div>
				</SelectTrigger>
				<SelectContent className="bg-card/95 backdrop-blur-lg border-border shadow-floating animate-in slide-in-from-top-2">
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value} className="hover:bg-accent/10 focus:bg-accent/10 cursor-pointer transition-colors duration-200">
							<div className="flex items-center justify-between w-full">
								<span>{option.name}</span>
								{showCount && option.count !== undefined && <span className="text-xs text-muted-foreground ml-2 bg-muted/50 px-2 py-0.5 rounded-full">{option.count}</span>}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</motion.div>
	);

	return (
		<div className="space-y-4">
			{/* Main Filter Controls */}
			<motion.div className="flex flex-col lg:flex-row gap-4 items-center justify-between" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
				{/* Left Side - Filter Controls */}
				<div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
					{/* Mobile Filter Toggle */}
					<motion.div className="lg:hidden flex-shrink-0">
						<Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent transition-all duration-300 shadow-sm hover:shadow-md">
							<SlidersHorizontal className="w-4 h-4 mr-2" />
							Filters
							{activeFiltersCount > 0 && (
								<motion.span
									className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium shadow-md"
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
								>
									{activeFiltersCount}
								</motion.span>
							)}
						</Button>
					</motion.div>

					{/* Desktop Filters */}
					<div className="hidden lg:flex items-center gap-3">
						<FilterSelect value={selectedCategory} onValueChange={setSelectedCategory} placeholder="Category" options={categories} width="w-44" icon={BookOpen} showCount={true} />

						<FilterSelect value={selectedLevel} onValueChange={setSelectedLevel} placeholder="Level" options={levels} width="w-36" icon={Award} />

						<FilterSelect value={selectedPriceRange} onValueChange={setSelectedPriceRange} placeholder="Price" options={priceRanges} width="w-36" icon={DollarSign} />

						<FilterSelect value={selectedSort} onValueChange={setSelectedSort} placeholder="Sort by" options={sortOptions} width="w-44" icon={TrendingUp} />
					</div>

					{/* AI Enhancement Badge */}
					<motion.div className="hidden lg:block flex-shrink-0" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ scale: 1.05 }}>
						<div className="ai-badge shadow-sm">
							<Bot className="w-3 h-3" />
							<span>Smart Filters</span>
						</div>
					</motion.div>
				</div>

				{/* Right Side - View Controls */}
				<div className="flex items-center gap-3 flex-shrink-0">
					{/* View Mode Toggle */}
					<motion.div className="flex items-center bg-muted/50 rounded-lg p-1 border border-border shadow-sm" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
						<motion.button
							onClick={() => setViewMode("grid")}
							className={cn("p-2 rounded-md transition-all duration-300 relative", viewMode === "grid" ? "bg-card shadow-sm text-accent" : "text-muted-foreground hover:text-accent hover:bg-card/50")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Grid3X3 className="w-4 h-4" />
							{viewMode === "grid" && <motion.div className="absolute inset-0 bg-accent/10 rounded-md -z-10" layoutId="viewModeIndicator" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
						</motion.button>
						<motion.button
							onClick={() => setViewMode("list")}
							className={cn("p-2 rounded-md transition-all duration-300 relative", viewMode === "list" ? "bg-card shadow-sm text-accent" : "text-muted-foreground hover:text-accent hover:bg-card/50")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<List className="w-4 h-4" />
							{viewMode === "list" && <motion.div className="absolute inset-0 bg-accent/10 rounded-md -z-10" layoutId="viewModeIndicator" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
						</motion.button>
					</motion.div>

					{/* Clear Filters */}
					<AnimatePresence>
						{activeFiltersCount > 0 && (
							<motion.div initial={{ opacity: 0, scale: 0.8, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.8, x: 10 }} transition={{ duration: 0.3, type: "spring", stiffness: 400 }}>
								<Button variant="outline" onClick={clearFilters} size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all duration-300 shadow-sm hover:shadow-md">
									<X className="w-4 h-4 mr-2" />
									Clear ({activeFiltersCount})
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Mobile Filters Panel */}
			<AnimatePresence>
				{showFilters && (
					<motion.div className="lg:hidden overflow-hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
						<motion.div className="p-6 bg-card/80 backdrop-blur-sm border border-border rounded-xl shadow-lg" initial={{ y: -20 }} animate={{ y: 0 }} exit={{ y: -20 }} transition={{ duration: 0.4, ease: "easeOut" }}>
							{/* Header */}
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
										<SlidersHorizontal className="w-5 h-5 text-accent" />
									</div>
									<div>
										<h3 className="font-semibold text-foreground">Filter Courses</h3>
										<p className="text-sm text-muted-foreground">Refine your search</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg">
									<X className="w-4 h-4" />
								</Button>
							</div>

							{/* Filter Grid */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
								<motion.div className="space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
									<label className="text-sm font-medium text-foreground flex items-center gap-2">
										<BookOpen className="w-4 h-4 text-accent" />
										Category
									</label>
									<Select value={selectedCategory} onValueChange={setSelectedCategory}>
										<SelectTrigger className="border-border hover:border-accent/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-accent/20">
											<SelectValue placeholder="All Categories" />
										</SelectTrigger>
										<SelectContent className="bg-card/95 backdrop-blur-lg border-border shadow-floating">
											{categories.map((category) => (
												<SelectItem key={category.value} value={category.value} className="hover:bg-accent/10">
													<div className="flex items-center justify-between w-full">
														<span>{category.name}</span>
														<span className="text-xs text-muted-foreground ml-2 bg-muted/50 px-2 py-0.5 rounded-full">{category.count}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</motion.div>

								<motion.div className="space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
									<label className="text-sm font-medium text-foreground flex items-center gap-2">
										<Award className="w-4 h-4 text-accent" />
										Level
									</label>
									<Select value={selectedLevel} onValueChange={setSelectedLevel}>
										<SelectTrigger className="border-border hover:border-accent/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-accent/20">
											<SelectValue placeholder="All Levels" />
										</SelectTrigger>
										<SelectContent className="bg-card/95 backdrop-blur-lg border-border shadow-floating">
											{levels.map((level) => (
												<SelectItem key={level.value} value={level.value} className="hover:bg-accent/10">
													{level.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</motion.div>

								<motion.div className="space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
									<label className="text-sm font-medium text-foreground flex items-center gap-2">
										<DollarSign className="w-4 h-4 text-accent" />
										Price Range
									</label>
									<Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
										<SelectTrigger className="border-border hover:border-accent/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-accent/20">
											<SelectValue placeholder="All Prices" />
										</SelectTrigger>
										<SelectContent className="bg-card/95 backdrop-blur-lg border-border shadow-floating">
											{priceRanges.map((range) => (
												<SelectItem key={range.value} value={range.value} className="hover:bg-accent/10">
													{range.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</motion.div>

								<motion.div className="space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
									<label className="text-sm font-medium text-foreground flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-accent" />
										Sort By
									</label>
									<Select value={selectedSort} onValueChange={setSelectedSort}>
										<SelectTrigger className="border-border hover:border-accent/50 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-accent/20">
											<SelectValue placeholder="Most Popular" />
										</SelectTrigger>
										<SelectContent className="bg-card/95 backdrop-blur-lg border-border shadow-floating">
											{sortOptions.map((option) => (
												<SelectItem key={option.value} value={option.value} className="hover:bg-accent/10">
													{option.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</motion.div>
							</div>

							{/* AI Enhancement Info */}
							<motion.div
								className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-accent/5 to-neural-primary/5 border border-accent/20 rounded-lg mb-6"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: 0.5 }}
							>
								<div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
									<Sparkles className="w-4 h-4 text-accent" />
								</div>
								<div className="text-center">
									<p className="text-sm font-medium text-accent">AI-powered smart filtering active</p>
									<p className="text-xs text-muted-foreground">Get personalized course recommendations</p>
								</div>
							</motion.div>

							{/* Action Buttons */}
							<motion.div className="flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
								<Button onClick={() => setShowFilters(false)} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-all duration-300">
									<Filter className="w-4 h-4 mr-2" />
									Apply Filters
								</Button>
								{activeFiltersCount > 0 && (
									<Button variant="outline" onClick={clearFilters} className="border-destructive/30 text-destructive hover:bg-destructive/10">
										<X className="w-4 h-4" />
									</Button>
								)}
							</motion.div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
