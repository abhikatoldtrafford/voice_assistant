// app/(protected)/(dashboard)/student/profile/components/SkillsMatrix.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Brain,
	Code,
	Database,
	BarChart3,
	Cpu,
	Globe,
	Palette,
	Zap,
	TrendingUp,
	Star,
	Target,
	Award,
	CheckCircle2,
	Clock,
	Eye,
	Plus,
	ArrowRight,
	BookOpen,
	Users,
	Lightbulb,
	Activity,
	Calendar,
	Trophy,
	Flame,
	ChevronDown,
	Filter,
	Search,
	Briefcase,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import { Input } from "@/components/ui/input";

interface SkillsMatrixProps {
	userData: IUserProfileData;
	onUpdate?: (updates: Partial<IUserProfileData>) => void;
}

interface Skill {
	name: string;
	level: number;
	experience: string;
	projects: number;
	lastUsed: string;
	trending: boolean;
	certification: boolean;
	color: string;
	category: string;
	description: string;
	relatedSkills: string[];
	learningPath?: string[];
	industryDemand: "low" | "medium" | "high" | "very-high";
	timeToMaster: string;
	priority: "low" | "medium" | "high";
}

export default function SkillsMatrix({ userData, onUpdate }: SkillsMatrixProps) {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("level");
	const [showOnlyTrending, setShowOnlyTrending] = useState(false);

	const skillCategories = [
		{ id: "all", name: "All Skills", icon: Brain, count: 0 },
		{ id: "technical", name: "Technical", icon: Code, count: 0 },
		{ id: "data", name: "Data Science", icon: BarChart3, count: 0 },
		{ id: "ai", name: "AI & ML", icon: Cpu, count: 0 },
		{ id: "soft", name: "Soft Skills", icon: Users, count: 0 },
		{ id: "business", name: "Business", icon: Briefcase, count: 0 },
	];

	// Enhanced skills data based on user's learning history and goals
	const skills: Skill[] = [
		// Technical Skills
		{
			name: "Python",
			level: 85,
			experience: "Advanced",
			projects: 12,
			lastUsed: "Today",
			trending: true,
			certification: true,
			color: "from-blue-500 to-indigo-500",
			category: "technical",
			description: "Primary programming language for data science and AI",
			relatedSkills: ["NumPy", "Pandas", "Django"],
			learningPath: ["Variables & Data Types", "Functions", "OOP", "Libraries"],
			industryDemand: "very-high",
			timeToMaster: "6-12 months",
			priority: "high",
		},
		{
			name: "JavaScript",
			level: 70,
			experience: "Intermediate",
			projects: 8,
			lastUsed: "3 days ago",
			trending: false,
			certification: false,
			color: "from-yellow-500 to-orange-500",
			category: "technical",
			description: "Essential for web development and frontend interactions",
			relatedSkills: ["React", "Node.js", "TypeScript"],
			learningPath: ["ES6+", "Async Programming", "Frameworks", "Testing"],
			industryDemand: "very-high",
			timeToMaster: "4-8 months",
			priority: "medium",
		},
		{
			name: "SQL",
			level: 75,
			experience: "Intermediate+",
			projects: 15,
			lastUsed: "1 week ago",
			trending: false,
			certification: true,
			color: "from-green-500 to-emerald-500",
			category: "data",
			description: "Database querying and data manipulation",
			relatedSkills: ["PostgreSQL", "MySQL", "Data Warehousing"],
			learningPath: ["Basic Queries", "Joins", "Advanced Functions", "Optimization"],
			industryDemand: "high",
			timeToMaster: "3-6 months",
			priority: "high",
		},
		{
			name: "React",
			level: 60,
			experience: "Intermediate",
			projects: 4,
			lastUsed: "2 weeks ago",
			trending: true,
			certification: false,
			color: "from-cyan-500 to-blue-500",
			category: "technical",
			description: "Modern frontend library for building user interfaces",
			relatedSkills: ["JavaScript", "Redux", "Next.js"],
			learningPath: ["Components", "Hooks", "State Management", "Performance"],
			industryDemand: "very-high",
			timeToMaster: "4-8 months",
			priority: "medium",
		},

		// Data Science Skills
		{
			name: "Pandas",
			level: 85,
			experience: "Advanced",
			projects: 15,
			lastUsed: "Today",
			trending: true,
			certification: false,
			color: "from-indigo-500 to-purple-500",
			category: "data",
			description: "Data manipulation and analysis library for Python",
			relatedSkills: ["NumPy", "Python", "Jupyter"],
			learningPath: ["DataFrames", "Data Cleaning", "Aggregation", "Advanced Operations"],
			industryDemand: "high",
			timeToMaster: "2-4 months",
			priority: "high",
		},
		{
			name: "Data Visualization",
			level: 80,
			experience: "Advanced",
			projects: 10,
			lastUsed: "Yesterday",
			trending: true,
			certification: true,
			color: "from-purple-500 to-pink-500",
			category: "data",
			description: "Creating insights through visual representation of data",
			relatedSkills: ["Matplotlib", "Seaborn", "Plotly", "Tableau"],
			learningPath: ["Chart Types", "Design Principles", "Interactive Viz", "Dashboards"],
			industryDemand: "high",
			timeToMaster: "3-6 months",
			priority: "medium",
		},
		{
			name: "Statistical Analysis",
			level: 65,
			experience: "Intermediate",
			projects: 6,
			lastUsed: "1 week ago",
			trending: true,
			certification: true,
			color: "from-teal-500 to-cyan-500",
			category: "data",
			description: "Understanding data patterns and making data-driven decisions",
			relatedSkills: ["Python", "R", "Hypothesis Testing"],
			learningPath: ["Descriptive Stats", "Probability", "Inference", "Regression"],
			industryDemand: "high",
			timeToMaster: "6-12 months",
			priority: "high",
		},

		// AI & ML Skills
		{
			name: "Machine Learning",
			level: 55,
			experience: "Beginner+",
			projects: 3,
			lastUsed: "Today",
			trending: true,
			certification: false,
			color: "from-pink-500 to-rose-500",
			category: "ai",
			description: "Building predictive models and intelligent systems",
			relatedSkills: ["Python", "Scikit-learn", "Statistics"],
			learningPath: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation", "Deep Learning"],
			industryDemand: "very-high",
			timeToMaster: "8-18 months",
			priority: "high",
		},
		{
			name: "Neural Networks",
			level: 35,
			experience: "Beginner",
			projects: 2,
			lastUsed: "2 days ago",
			trending: true,
			certification: false,
			color: "from-violet-500 to-purple-500",
			category: "ai",
			description: "Deep learning architectures for complex pattern recognition",
			relatedSkills: ["TensorFlow", "PyTorch", "Mathematics"],
			learningPath: ["Perceptrons", "Backpropagation", "CNNs", "RNNs"],
			industryDemand: "very-high",
			timeToMaster: "12-24 months",
			priority: "medium",
		},
		{
			name: "TensorFlow",
			level: 25,
			experience: "Beginner",
			projects: 1,
			lastUsed: "1 week ago",
			trending: true,
			certification: false,
			color: "from-amber-500 to-orange-500",
			category: "ai",
			description: "Google's machine learning framework for production",
			relatedSkills: ["Python", "Keras", "Machine Learning"],
			learningPath: ["Basics", "Model Building", "Training", "Deployment"],
			industryDemand: "high",
			timeToMaster: "6-12 months",
			priority: "medium",
		},

		// Soft Skills
		{
			name: "Problem Solving",
			level: 90,
			experience: "Expert",
			projects: 20,
			lastUsed: "Today",
			trending: false,
			certification: false,
			color: "from-emerald-500 to-teal-500",
			category: "soft",
			description: "Analytical thinking and creative solution development",
			relatedSkills: ["Critical Thinking", "Creativity", "Logic"],
			learningPath: ["Analytical Frameworks", "Creative Techniques", "Decision Making"],
			industryDemand: "very-high",
			timeToMaster: "Ongoing development",
			priority: "high",
		},
		{
			name: "Communication",
			level: 75,
			experience: "Advanced",
			projects: 15,
			lastUsed: "Today",
			trending: false,
			certification: true,
			color: "from-blue-500 to-cyan-500",
			category: "soft",
			description: "Effective verbal and written communication skills",
			relatedSkills: ["Presentation", "Writing", "Active Listening"],
			learningPath: ["Verbal Skills", "Written Communication", "Public Speaking"],
			industryDemand: "very-high",
			timeToMaster: "Ongoing development",
			priority: "high",
		},
		{
			name: "Project Management",
			level: 60,
			experience: "Intermediate",
			projects: 8,
			lastUsed: "1 week ago",
			trending: true,
			certification: false,
			color: "from-indigo-500 to-blue-500",
			category: "business",
			description: "Planning, executing, and delivering projects successfully",
			relatedSkills: ["Leadership", "Organization", "Time Management"],
			learningPath: ["Planning", "Execution", "Risk Management", "Agile Methods"],
			industryDemand: "high",
			timeToMaster: "6-12 months",
			priority: "medium",
		},
	];

	const getSkillLevel = (level: number) => {
		if (level >= 90) return { label: "Expert", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/20" };
		if (level >= 75) return { label: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" };
		if (level >= 50) return { label: "Intermediate", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20" };
		if (level >= 25) return { label: "Beginner+", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" };
		return { label: "Beginner", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-900/20" };
	};

	const getIndustryDemandColor = (demand: string) => {
		switch (demand) {
			case "very-high":
				return "text-red-600";
			case "high":
				return "text-orange-600";
			case "medium":
				return "text-yellow-600";
			case "low":
				return "text-gray-600";
			default:
				return "text-gray-600";
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "high":
				return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300";
			case "medium":
				return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300";
			case "low":
				return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
			default:
				return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
		}
	};

	// Filter and sort skills
	const filteredSkills = skills
		.filter((skill) => {
			const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
			const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || skill.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesTrending = !showOnlyTrending || skill.trending;
			return matchesCategory && matchesSearch && matchesTrending;
		})
		.sort((a, b) => {
			switch (sortBy) {
				case "level":
					return b.level - a.level;
				case "name":
					return a.name.localeCompare(b.name);
				case "projects":
					return b.projects - a.projects;
				case "demand":
					const demandOrder = { "very-high": 4, high: 3, medium: 2, low: 1 };
					return demandOrder[b.industryDemand] - demandOrder[a.industryDemand];
				default:
					return b.level - a.level;
			}
		});

	// Update category counts
	skillCategories.forEach((category) => {
		if (category.id === "all") {
			category.count = skills.length;
		} else {
			category.count = skills.filter((skill) => skill.category === category.id).length;
		}
	});

	const averageLevel = Math.round(filteredSkills.reduce((sum, skill) => sum + skill.level, 0) / filteredSkills.length || 0);
	const topSkills = skills.filter((skill) => skill.level >= 75).length;
	const trendingSkills = skills.filter((skill) => skill.trending).length;

	return (
		<Card className="adaptive-card">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Brain className="w-5 h-5 text-primary" />
						Skills Matrix
					</CardTitle>
					<div className="flex items-center gap-2">
						<Badge className="ai-badge">
							<TrendingUp className="w-3 h-3 mr-1" />
							AI Powered
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Skills Overview */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl">
						<p className="text-2xl font-bold text-foreground">{filteredSkills.length}</p>
						<p className="text-xs text-muted-foreground">Total Skills</p>
					</div>
					<div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl">
						<p className="text-2xl font-bold text-foreground">{averageLevel}%</p>
						<p className="text-xs text-muted-foreground">Avg Level</p>
					</div>
					<div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl">
						<p className="text-2xl font-bold text-foreground">{topSkills}</p>
						<p className="text-xs text-muted-foreground">Expert Level</p>
					</div>
					<div className="text-center p-3 bg-white/30 dark:bg-gray-800/30 rounded-xl">
						<p className="text-2xl font-bold text-foreground">{trendingSkills}</p>
						<p className="text-xs text-muted-foreground">Trending</p>
					</div>
				</div>

				{/* Search and Filters */}
				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input placeholder="Search skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
						</div>
						<div className="flex gap-2">
							<select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm">
								<option value="level">Sort by Level</option>
								<option value="name">Sort by Name</option>
								<option value="projects">Sort by Projects</option>
								<option value="demand">Sort by Demand</option>
							</select>
							<motion.button
								onClick={() => setShowOnlyTrending(!showOnlyTrending)}
								className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${showOnlyTrending ? "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300" : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<Flame className="w-4 h-4 mr-1 inline" />
								Trending
							</motion.button>
						</div>
					</div>

					{/* Category Selector */}
					<div className="flex flex-wrap gap-2">
						{skillCategories.map((category) => (
							<motion.button
								key={category.id}
								onClick={() => setSelectedCategory(category.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${selectedCategory === category.id ? "bg-gradient-primary text-white shadow-lg" : "hover:bg-white/50 dark:hover:bg-gray-800/30"}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<category.icon className="w-4 h-4" />
								<span className="text-sm font-medium">{category.name}</span>
								<Badge variant="secondary" className="text-xs">
									{category.count}
								</Badge>
							</motion.button>
						))}
					</div>
				</div>

				{/* Skills List */}
				<div className="space-y-4">
					{filteredSkills.map((skill, index) => {
						const skillLevelInfo = getSkillLevel(skill.level);

						return (
							<motion.div
								key={skill.name}
								className="p-6 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.05 }}
								whileHover={{ scale: 1.01 }}
							>
								<div className="space-y-4">
									{/* Skill Header */}
									<div className="flex items-start justify-between">
										<div className="flex items-start gap-4 flex-1">
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${skill.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
												<Code className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<h4 className="font-semibold text-foreground">{skill.name}</h4>
													{skill.trending && <TrendingUp className="w-4 h-4 text-orange-500" />}
													{skill.certification && <Award className="w-4 h-4 text-yellow-500" />}
													<Badge className={getPriorityColor(skill.priority)}>{skill.priority} priority</Badge>
												</div>
												<p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
												<div className="flex flex-wrap gap-2 text-xs">
													<span className="text-muted-foreground">Related:</span>
													{skill.relatedSkills.slice(0, 3).map((related) => (
														<Badge key={related} variant="outline" className="text-xs">
															{related}
														</Badge>
													))}
												</div>
											</div>
										</div>
										<div className="text-right flex-shrink-0">
											<p className="text-2xl font-bold text-foreground">{skill.level}%</p>
											<Badge className={`text-xs ${skillLevelInfo.bgColor} ${skillLevelInfo.color}`}>{skillLevelInfo.label}</Badge>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="relative">
										<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
											<motion.div
												className={`h-3 rounded-full bg-gradient-to-r ${skill.color} relative overflow-hidden`}
												initial={{ width: 0 }}
												animate={{ width: `${skill.level}%` }}
												transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
											>
												<motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" animate={{ x: [-100, 100] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} />
											</motion.div>
										</div>
									</div>

									{/* Skill Metadata */}
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
										<div className="flex items-center gap-2">
											<BookOpen className="w-4 h-4 text-blue-500" />
											<div>
												<p className="font-medium text-foreground">{skill.projects}</p>
												<p className="text-xs text-muted-foreground">Projects</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="w-4 h-4 text-green-500" />
											<div>
												<p className="font-medium text-foreground">{skill.lastUsed}</p>
												<p className="text-xs text-muted-foreground">Last Used</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<TrendingUp className={`w-4 h-4 ${getIndustryDemandColor(skill.industryDemand)}`} />
											<div>
												<p className={`font-medium capitalize ${getIndustryDemandColor(skill.industryDemand)}`}>{skill.industryDemand.replace("-", " ")}</p>
												<p className="text-xs text-muted-foreground">Demand</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Target className="w-4 h-4 text-purple-500" />
											<div>
												<p className="font-medium text-foreground">{skill.timeToMaster}</p>
												<p className="text-xs text-muted-foreground">To Master</p>
											</div>
										</div>
									</div>

									{/* Learning Path Preview */}
									{skill.learningPath && skill.level < 90 && (
										<div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200/30">
											<div className="flex items-center justify-between mb-2">
												<h5 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
													<Lightbulb className="w-4 h-4" />
													Next Learning Steps
												</h5>
												<EnhancedButton variant="adaptive" size="sm" className="text-xs">
													<ArrowRight className="w-3 h-3 mr-1" />
													Continue
												</EnhancedButton>
											</div>
											<div className="flex flex-wrap gap-1">
												{skill.learningPath.slice(0, 4).map((step, i) => (
													<Badge key={step} variant="secondary" className={`text-xs ${i === 0 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
														{i + 1}. {step}
													</Badge>
												))}
											</div>
										</div>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 pt-4">
					<EnhancedButton variant="ai-primary" className="flex-1" withGlow>
						<Plus className="w-4 h-4 mr-2" />
						Add New Skill
					</EnhancedButton>
					<EnhancedButton variant="outline" className="flex-1">
						<Eye className="w-4 h-4 mr-2" />
						Skill Assessment
					</EnhancedButton>
					<EnhancedButton variant="outline" className="flex-1">
						<Target className="w-4 h-4 mr-2" />
						Learning Plan
					</EnhancedButton>
				</div>

				{/* AI Recommendations */}
				<motion.div
					className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
				>
					<div className="flex items-start gap-4">
						<div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
							<Brain className="w-5 h-5 text-white" />
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">AI Skill Recommendations</h4>
							<p className="text-sm text-purple-600 dark:text-purple-300 mb-4">
								Based on your learning goals and current progress, I recommend focusing on <strong>TensorFlow</strong> and <strong>Advanced Statistics</strong> next. These skills will accelerate your path to becoming a Data Scientist.
							</p>
							<div className="flex flex-wrap gap-2">
								<Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">TensorFlow - High Priority</Badge>
								<Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Advanced Statistics - Medium Priority</Badge>
								<Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Docker - Low Priority</Badge>
							</div>
							<div className="mt-4">
								<EnhancedButton variant="adaptive" size="sm" className="text-xs">
									<ArrowRight className="w-3 h-3 mr-1" />
									View Detailed Plan
								</EnhancedButton>
							</div>
						</div>
					</div>
				</motion.div>
			</CardContent>
		</Card>
	);
}
