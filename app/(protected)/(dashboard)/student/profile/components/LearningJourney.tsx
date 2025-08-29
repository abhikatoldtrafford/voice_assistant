"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Map,
	Calendar,
	Trophy,
	Star,
	BookOpen,
	Brain,
	Target,
	Zap,
	CheckCircle2,
	Clock,
	Award,
	TrendingUp,
	Heart,
	ArrowRight,
	Play,
	Lock,
	Sparkles,
	Eye,
	BarChart3,
	Users,
	Code,
	Database,
	Cpu,
	Globe,
	Rocket,
	Shield,
	Crown,
	Lightbulb,
	Coffee,
	Moon,
	Sunrise,
	Activity,
	MessageCircle,
	Flame,
	Medal,
	Briefcase,
	Settings,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface LearningJourneyProps {
	userData: IUserProfileData;
}
interface LearningJourneyMilestone {
	id: string;
	title: string;
	description: string;
	date: Date;
	type: string;
	icon: any;
	completed: boolean;
	color: string;
	details: string;
	inProgress?: boolean;
	progress?: number;
	locked?: boolean;
}

export default function LearningJourney({ userData }: LearningJourneyProps) {
	const [selectedTimeframe, setSelectedTimeframe] = useState("all");

	// Calculate journey milestones based on real user data
	const generateJourneyMilestones = () => {
		const joinDate = new Date(userData.createdAt);
		const daysSinceJoin = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));

		const milestones: LearningJourneyMilestone[] = [
			{
				id: "joined",
				title: "Learning Journey Begins",
				description: `Joined EduMattor and met your AI coach ${userData.aiCoachRelationship.coachName}`,
				date: userData.createdAt,
				type: "milestone",
				icon: Heart,
				completed: true,
				color: "from-pink-500 to-rose-500",
				details: `Welcome to your personalized learning adventure! Your ${userData.learningPreferences.aiPersonality} AI coach is ready to help.`,
			},
			{
				id: "preferences-set",
				title: "Learning Preferences Set",
				description: `Configured your ${userData.learningPreferences.learningStyle} learning style`,
				date: new Date(joinDate.getTime() + 86400000), // 1 day after joining
				type: "customization",
				icon: Settings,
				completed: true,
				color: "from-blue-500 to-cyan-500",
				details: `Set up ${userData.learningPreferences.learningStyle} learning with ${userData.learningPreferences.studyTime} study sessions`,
			},
			{
				id: "first-session",
				title: "First Learning Session",
				description: "Completed your inaugural study session",
				date: new Date(joinDate.getTime() + 172800000), // 2 days after joining
				type: "achievement",
				icon: Play,
				completed: true,
				color: "from-green-500 to-emerald-500",
				details: `Started with ${userData.learningPreferences.sessionLength}-minute sessions in ${userData.learningPreferences.studyTime} time slot`,
			},
		];

		// Add milestone for first course completion
		if (userData.learningStats.coursesCompleted > 0) {
			milestones.push({
				id: "first-course",
				title: "First Course Completed",
				description: "Achieved your first major learning milestone",
				date: new Date(joinDate.getTime() + 1209600000), // 2 weeks after joining
				type: "achievement",
				icon: Trophy,
				completed: true,
				color: "from-yellow-500 to-orange-500",
				details: `Completed your first course! Building momentum with ${userData.learningPreferences.motivationStyle} motivation style.`,
			});
		}

		// Add streak milestone
		if (userData.learningStats.longestStreak >= 7) {
			milestones.push({
				id: "streak-week",
				title: "First Learning Streak",
				description: `Maintained ${userData.learningStats.longestStreak}-day consecutive learning streak`,
				date: new Date(joinDate.getTime() + 2419200000), // 4 weeks after joining
				type: "habit",
				icon: Flame,
				completed: true,
				color: "from-orange-500 to-red-500",
				details: "Consistency is key! You're building excellent learning habits.",
			});
		}

		// Add AI interaction milestone
		if (userData.aiCoachRelationship.totalInteractions >= 50) {
			milestones.push({
				id: "ai-bond",
				title: "AI Coach Connection",
				description: `Completed ${userData.aiCoachRelationship.totalInteractions} conversations with ${userData.aiCoachRelationship.coachName}`,
				date: new Date(joinDate.getTime() + 3628800000), // 6 weeks after joining
				type: "social",
				icon: Brain,
				completed: true,
				color: "from-purple-500 to-indigo-500",
				details: `Your AI coach is learning your style with ${userData.aiCoachRelationship.satisfactionScore}/5 satisfaction rating`,
			});
		}

		// Add skill acquisition milestones
		if (userData.learningStats.skillsAcquired >= 10) {
			milestones.push({
				id: "skill-collector",
				title: "Skill Collector",
				description: `Acquired ${userData.learningStats.skillsAcquired} new skills`,
				date: new Date(joinDate.getTime() + 5184000000), // 8 weeks after joining
				type: "progression",
				icon: Star,
				completed: true,
				color: "from-indigo-500 to-purple-500",
				details: "Building a diverse skill portfolio across multiple domains",
			});
		}

		// Add hours milestone
		if (userData.learningStats.totalLearningHours >= 100) {
			milestones.push({
				id: "century-hours",
				title: "Century Learner",
				description: `Invested ${userData.learningStats.totalLearningHours} hours in learning`,
				date: new Date(joinDate.getTime() + 6048000000), // 10 weeks after joining
				type: "dedication",
				icon: Clock,
				completed: true,
				color: "from-blue-500 to-cyan-500",
				details: "Serious commitment to your learning journey!",
			});
		}

		// Add current goals as in-progress milestones
		userData.learningGoals.shortTerm.forEach((goal, index) => {
			milestones.push({
				id: `current-goal-${index}`,
				title: `Goal: ${goal}`,
				description: `Working towards: ${goal}`,
				date: new Date(Date.now() + index * 2592000000), // Spread over coming months
				type: "current",
				icon: Target,
				completed: false,
				inProgress: true,
				progress: Math.floor(Math.random() * 80) + 10, // Random progress 10-90%
				color: "from-teal-500 to-cyan-500",
				details: `Part of your short-term learning objectives`,
			});
		});

		// Add long-term goals as future milestones
		userData.learningGoals.longTerm.forEach((goal, index) => {
			milestones.push({
				id: `future-goal-${index}`,
				title: `Vision: ${goal}`,
				description: `Long-term aspiration: ${goal}`,
				date: new Date(Date.now() + (6 + index * 3) * 2592000000), // 6+ months from now
				type: "vision",
				icon: Rocket,
				completed: false,
				locked: true,
				color: "from-gray-400 to-gray-500",
				details: `Ambitious long-term goal requiring multiple learning paths`,
			});
		});

		// Add certification goals
		userData.learningGoals.certificationGoals.forEach((cert, index) => {
			milestones.push({
				id: `cert-goal-${index}`,
				title: `Certification: ${cert}`,
				description: `Pursuing professional certification`,
				date: new Date(Date.now() + (4 + index * 2) * 2592000000), // 4+ months from now
				type: "certification",
				icon: Award,
				completed: false,
				locked: true,
				color: "from-yellow-400 to-orange-500",
				details: `Professional credential to boost your career prospects`,
			});
		});

		// Add career objectives
		userData.learningGoals.careerObjectives.forEach((career, index) => {
			milestones.push({
				id: `career-goal-${index}`,
				title: `Career: ${career}`,
				description: `Career milestone achievement`,
				date: new Date(Date.now() + (8 + index * 4) * 2592000000), // 8+ months from now
				type: "career",
				icon: Briefcase,
				completed: false,
				locked: true,
				color: "from-indigo-400 to-purple-500",
				details: `Major career advancement requiring sustained learning effort`,
			});
		});

		return milestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	};

	const journeyMilestones = generateJourneyMilestones();

	const timeframes = [
		{ value: "all", label: "All Time" },
		{ value: "year", label: "This Year" },
		{ value: "month", label: "This Month" },
		{ value: "week", label: "This Week" },
	];

	const stats = {
		totalDays: Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
		completedMilestones: journeyMilestones.filter((m) => m.completed).length,
		currentStreak: userData.learningStats.currentStreak,
		nextGoal: journeyMilestones.find((m) => !m.completed && !m.locked),
	};

	const formatDate = (dateString: string | Date) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const getMilestoneTypeIcon = (type: string) => {
		switch (type) {
			case "milestone":
				return Heart;
			case "achievement":
				return Trophy;
			case "habit":
				return Flame;
			case "social":
				return Users;
			case "progression":
				return TrendingUp;
			case "customization":
				return Settings;
			case "dedication":
				return Clock;
			case "current":
				return Target;
			case "vision":
				return Rocket;
			case "certification":
				return Award;
			case "career":
				return Briefcase;
			default:
				return Star;
		}
	};

	const getMilestoneTypeColor = (type: string) => {
		switch (type) {
			case "milestone":
				return "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300";
			case "achievement":
				return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300";
			case "habit":
				return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300";
			case "social":
				return "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300";
			case "progression":
				return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300";
			case "current":
				return "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300";
			case "vision":
				return "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300";
			case "certification":
				return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300";
			case "career":
				return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
			default:
				return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300";
		}
	};

	return (
		<div className="space-y-6">
			{/* Journey Overview */}
			<Card className="adaptive-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Map className="w-5 h-5 text-primary" />
							Your Learning Journey
						</CardTitle>
						<div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
							{timeframes.map((timeframe) => (
								<motion.button
									key={timeframe.value}
									onClick={() => setSelectedTimeframe(timeframe.value)}
									className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${selectedTimeframe === timeframe.value ? "bg-white dark:bg-gray-700 shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									{timeframe.label}
								</motion.button>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Journey Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30">
							<Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
							<p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{stats.totalDays}</p>
							<p className="text-xs text-blue-600 dark:text-blue-300">Days Learning</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
							<CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
							<p className="text-2xl font-bold text-green-800 dark:text-green-200">{stats.completedMilestones}</p>
							<p className="text-xs text-green-600 dark:text-green-300">Milestones</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200/30">
							<Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
							<p className="text-2xl font-bold text-orange-800 dark:text-orange-200">{stats.currentStreak}</p>
							<p className="text-xs text-orange-600 dark:text-orange-300">Day Streak</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
							<Activity className="w-8 h-8 mx-auto mb-2 text-purple-600" />
							<p className="text-lg font-bold text-purple-800 dark:text-purple-200">{userData.learningStats.weeklyProgress}%</p>
							<p className="text-xs text-purple-600 dark:text-purple-300">Weekly Goal</p>
						</div>
					</div>

					{/* Learning Style & AI Coach Summary */}
					<div className="grid md:grid-cols-2 gap-4">
						<div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/30">
							<div className="flex items-center gap-3">
								<Brain className="w-8 h-8 text-blue-600" />
								<div>
									<p className="font-semibold text-blue-800 dark:text-blue-200">Learning Profile</p>
									<p className="text-sm text-blue-600 dark:text-blue-300">
										{userData.learningPreferences.learningStyle} learner • {userData.learningPreferences.studyTime} sessions
									</p>
								</div>
							</div>
						</div>

						<div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200/30">
							<div className="flex items-center gap-3">
								<Heart className="w-8 h-8 text-pink-600" />
								<div>
									<p className="font-semibold text-pink-800 dark:text-pink-200">AI Coach {userData.aiCoachRelationship.coachName}</p>
									<p className="text-sm text-pink-600 dark:text-pink-300">
										{userData.aiCoachRelationship.totalInteractions} conversations • {userData.aiCoachRelationship.satisfactionScore}/5 rating
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Next Goal Preview */}
					{stats.nextGoal && (
						<motion.div
							className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl border border-teal-200/30"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.02 }}
						>
							<div className="flex items-center gap-4">
								<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stats.nextGoal.color} flex items-center justify-center relative overflow-hidden`}>
									<stats.nextGoal.icon className="w-6 h-6 text-white" />
									{stats.nextGoal.inProgress && <motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0" animate={{ x: [-48, 48] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />}
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-teal-800 dark:text-teal-200">Next Milestone</h4>
									<p className="text-sm text-teal-600 dark:text-teal-300">{stats.nextGoal.title}</p>
									{stats.nextGoal.progress && (
										<div className="mt-2 w-full bg-teal-200 dark:bg-teal-800 rounded-full h-2">
											<motion.div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${stats.nextGoal.progress}%` }} transition={{ duration: 1, delay: 0.5 }} />
										</div>
									)}
								</div>
								<EnhancedButton variant="adaptive" size="sm">
									<Play className="w-3 h-3 mr-1" />
									Continue
								</EnhancedButton>
							</div>
						</motion.div>
					)}
				</CardContent>
			</Card>

			{/* Timeline */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-primary" />
						Learning Timeline
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						{/* Timeline Line */}
						<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-gray-300"></div>

						<div className="space-y-6">
							{journeyMilestones.map((milestone, index) => {
								const IconComponent = getMilestoneTypeIcon(milestone.type);

								return (
									<motion.div key={milestone.id} className="relative flex items-start gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
										{/* Timeline Node */}
										<div className="relative z-10">
											<motion.div
												className={`w-12 h-12 rounded-full bg-gradient-to-r ${milestone.color} flex items-center justify-center shadow-lg ${milestone.locked ? "opacity-50" : ""}`}
												whileHover={{ scale: 1.1 }}
												animate={
													milestone.inProgress
														? {
																scale: [1, 1.05, 1],
																boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0)"],
														  }
														: {}
												}
												transition={{
													duration: 2,
													repeat: milestone.inProgress ? Infinity : 0,
												}}
											>
												{milestone.locked ? <Lock className="w-5 h-5 text-white" /> : <IconComponent className="w-5 h-5 text-white" />}
											</motion.div>

											{/* Completion Indicator */}
											{milestone.completed && (
												<motion.div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
													<CheckCircle2 className="w-3 h-3 text-white" />
												</motion.div>
											)}
										</div>

										{/* Content */}
										<div className={`flex-1 pb-6 ${milestone.locked ? "opacity-50" : ""}`}>
											<div className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-4 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group">
												<div className="flex items-start justify-between mb-2">
													<div>
														<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{milestone.title}</h3>
														<p className="text-sm text-muted-foreground">{milestone.description}</p>
													</div>
													<div className="text-right">
														<Badge variant="secondary" className={`text-xs ${getMilestoneTypeColor(milestone.type)}`}>
															{milestone.type}
														</Badge>
														<p className="text-xs text-muted-foreground mt-1">{formatDate(milestone.date)}</p>
													</div>
												</div>

												<p className="text-xs text-muted-foreground mb-3">{milestone.details}</p>

												{/* Progress Bar for In-Progress Items */}
												{milestone.inProgress && milestone.progress && (
													<div className="mb-3">
														<div className="flex items-center justify-between mb-1">
															<span className="text-xs font-medium text-foreground">Progress</span>
															<span className="text-xs text-muted-foreground">{milestone.progress}%</span>
														</div>
														<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
															<motion.div
																className={`h-2 rounded-full bg-gradient-to-r ${milestone.color}`}
																initial={{ width: 0 }}
																animate={{ width: `${milestone.progress}%` }}
																transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
															/>
														</div>
													</div>
												)}

												{/* Action Button */}
												{milestone.inProgress && (
													<EnhancedButton variant="outline" size="sm" className="w-full text-xs">
														<ArrowRight className="w-3 h-3 mr-1" />
														Continue Journey
													</EnhancedButton>
												)}
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Journey Actions */}
			<motion.div className="flex gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
				<EnhancedButton variant="ai-primary" className="flex-1" withGlow>
					<Sparkles className="w-4 h-4 mr-2" />
					Set New Goal
				</EnhancedButton>
				<EnhancedButton variant="outline" className="flex-1">
					<Eye className="w-4 h-4 mr-2" />
					View Full History
				</EnhancedButton>
			</motion.div>
		</div>
	);
}
