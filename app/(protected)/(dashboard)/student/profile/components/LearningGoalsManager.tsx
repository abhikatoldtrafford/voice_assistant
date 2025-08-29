"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Target, Plus, X, Save, Star, Calendar, Clock, Award, TrendingUp, BookOpen, Brain, Briefcase, CheckCircle2, Edit3, Lightbulb, Zap, Heart, Flag, ArrowRight, BarChart3 } from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface LearningGoalsManagerProps {
	userData: IUserProfileData;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	isLoading: boolean;
}

export default function LearningGoalsManager({ userData, onUpdate, isLoading }: LearningGoalsManagerProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [shortTermGoals, setShortTermGoals] = useState(userData.learningGoals.shortTerm || []);
	const [longTermGoals, setLongTermGoals] = useState(userData.learningGoals.longTerm || []);
	const [skillsToLearn, setSkillsToLearn] = useState(userData.learningGoals.skillsToLearn || []);
	const [certificationGoals, setCertificationGoals] = useState(userData.learningGoals.certificationGoals || []);
	const [careerObjectives, setCareerObjectives] = useState(userData.learningGoals.careerObjectives || []);

	const [newGoal, setNewGoal] = useState("");
	const [newSkill, setNewSkill] = useState("");
	const [newCertification, setNewCertification] = useState("");
	const [newObjective, setNewObjective] = useState("");
	const [weeklyHoursGoal, setWeeklyHoursGoal] = useState(userData.learningGoals.weeklyHoursGoal || 10);
	const [targetDate, setTargetDate] = useState(userData.learningGoals.targetCompletionDate ? new Date(userData.learningGoals.targetCompletionDate).toISOString().split("T")[0] : "");

	const handleSave = () => {
		const updates: Partial<IUserProfileData> = {
			learningGoals: {
				...userData.learningGoals,
				shortTerm: shortTermGoals,
				longTerm: longTermGoals,
				skillsToLearn,
				certificationGoals,
				careerObjectives,
				weeklyHoursGoal,
				targetCompletionDate: targetDate ? new Date(targetDate) : undefined,
			},
		};
		onUpdate(updates);
		setIsEditing(false);
	};

	const addShortTermGoal = () => {
		if (newGoal.trim() && !shortTermGoals.includes(newGoal.trim())) {
			setShortTermGoals([...shortTermGoals, newGoal.trim()]);
			setNewGoal("");
		}
	};

	const addLongTermGoal = () => {
		if (newGoal.trim() && !longTermGoals.includes(newGoal.trim())) {
			setLongTermGoals([...longTermGoals, newGoal.trim()]);
			setNewGoal("");
		}
	};

	const addSkill = () => {
		if (newSkill.trim() && !skillsToLearn.includes(newSkill.trim())) {
			setSkillsToLearn([...skillsToLearn, newSkill.trim()]);
			setNewSkill("");
		}
	};

	const addCertification = () => {
		if (newCertification.trim() && !certificationGoals.includes(newCertification.trim())) {
			setCertificationGoals([...certificationGoals, newCertification.trim()]);
			setNewCertification("");
		}
	};

	const addObjective = () => {
		if (newObjective.trim() && !careerObjectives.includes(newObjective.trim())) {
			setCareerObjectives([...careerObjectives, newObjective.trim()]);
			setNewObjective("");
		}
	};

	const removeItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
		setArray(array.filter((i) => i !== item));
	};

	const goalCategories = [
		{
			title: "Short-term Goals",
			subtitle: "Next 3-6 months",
			icon: Target,
			color: "from-blue-500 to-cyan-500",
			items: shortTermGoals,
			setItems: setShortTermGoals,
			newItem: newGoal,
			setNewItem: setNewGoal,
			addItem: addShortTermGoal,
			placeholder: "e.g., Complete Python basics course",
		},
		{
			title: "Long-term Goals",
			subtitle: "6+ months ahead",
			icon: Star,
			color: "from-purple-500 to-pink-500",
			items: longTermGoals,
			setItems: setLongTermGoals,
			newItem: newGoal,
			setNewItem: setNewGoal,
			addItem: addLongTermGoal,
			placeholder: "e.g., Become a Data Scientist",
		},
	];

	const skillCategories = [
		{
			title: "Skills to Learn",
			subtitle: "Technical & soft skills",
			icon: Brain,
			color: "from-green-500 to-emerald-500",
			items: skillsToLearn,
			setItems: setSkillsToLearn,
			newItem: newSkill,
			setNewItem: setNewSkill,
			addItem: addSkill,
			placeholder: "e.g., TensorFlow, Leadership",
		},
		{
			title: "Certifications",
			subtitle: "Professional credentials",
			icon: Award,
			color: "from-orange-500 to-red-500",
			items: certificationGoals,
			setItems: setCertificationGoals,
			newItem: newCertification,
			setNewItem: setNewCertification,
			addItem: addCertification,
			placeholder: "e.g., AWS Cloud Practitioner",
		},
		{
			title: "Career Objectives",
			subtitle: "Professional aspirations",
			icon: Briefcase,
			color: "from-indigo-500 to-purple-500",
			items: careerObjectives,
			setItems: setCareerObjectives,
			newItem: newObjective,
			setNewItem: setNewObjective,
			addItem: addObjective,
			placeholder: "e.g., Land a tech job",
		},
	];

	const progressStats = [
		{
			label: "Weekly Goal",
			value: `${userData.learningStats.weeklyProgress}%`,
			target: `${weeklyHoursGoal}h target`,
			icon: Clock,
			color: "text-blue-600",
		},
		{
			label: "Skills Progress",
			value: `${userData.learningStats.skillsAcquired}`,
			target: `${skillsToLearn.length} to learn`,
			icon: Brain,
			color: "text-green-600",
		},
		{
			label: "Certifications",
			value: `${userData.learningStats.certificationsEarned}`,
			target: `${certificationGoals.length} planned`,
			icon: Award,
			color: "text-orange-600",
		},
	];

	return (
		<div className="space-y-6">
			{/* Goals Overview */}
			<Card className="adaptive-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Target className="w-5 h-5 text-primary" />
							Learning Goals & Objectives
						</CardTitle>
						<EnhancedButton variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
							<Edit3 className="w-4 h-4 mr-1" />
							{isEditing ? "Cancel" : "Edit Goals"}
						</EnhancedButton>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Progress Stats */}
					<div className="grid grid-cols-3 gap-4">
						{progressStats.map((stat, index) => (
							<motion.div
								key={stat.label}
								className="text-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								whileHover={{ scale: 1.02 }}
							>
								<div className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
									<stat.icon className={`w-5 h-5 ${stat.color}`} />
								</div>
								<p className="text-xl font-bold text-foreground">{stat.value}</p>
								<p className="text-xs font-medium text-foreground">{stat.label}</p>
								<p className="text-xs text-muted-foreground">{stat.target}</p>
							</motion.div>
						))}
					</div>

					{/* Weekly Hours Goal */}
					{isEditing && (
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-foreground mb-2 block">Weekly Learning Hours Goal</label>
									<Input type="number" value={weeklyHoursGoal} onChange={(e) => setWeeklyHoursGoal(parseInt(e.target.value) || 0)} min="1" max="40" placeholder="10" />
								</div>
								<div>
									<label className="text-sm font-medium text-foreground mb-2 block">Target Completion Date</label>
									<Input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Learning Goals */}
			<div className="grid lg:grid-cols-2 gap-6">
				{goalCategories.map((category, categoryIndex) => (
					<Card key={category.title} className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
									<category.icon className="w-4 h-4 text-white" />
								</div>
								<div>
									<span>{category.title}</span>
									<p className="text-xs text-muted-foreground font-normal">{category.subtitle}</p>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								{category.items.map((item, index) => (
									<motion.div
										key={item}
										className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
									>
										<div className="flex items-center gap-3 flex-1">
											<CheckCircle2 className="w-4 h-4 text-green-500" />
											<span className="text-sm text-foreground">{item}</span>
										</div>
										{isEditing && (
											<button onClick={() => removeItem(category.items, category.setItems, item)} className="text-red-500 hover:text-red-700 transition-colors">
												<X className="w-4 h-4" />
											</button>
										)}
									</motion.div>
								))}
							</div>

							{isEditing && (
								<div className="flex gap-2">
									<Input value={category.newItem} onChange={(e) => category.setNewItem(e.target.value)} placeholder={category.placeholder} onKeyPress={(e) => e.key === "Enter" && category.addItem()} />
									<EnhancedButton onClick={category.addItem} size="sm">
										<Plus className="w-4 h-4" />
									</EnhancedButton>
								</div>
							)}

							{!isEditing && category.items.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-4">No {category.title.toLowerCase()} set yet</p>}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Skills & Career Development */}
			<div className="grid lg:grid-cols-3 gap-6">
				{skillCategories.map((category, categoryIndex) => (
					<Card key={category.title} className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
									<category.icon className="w-4 h-4 text-white" />
								</div>
								<div>
									<span className="text-sm">{category.title}</span>
									<p className="text-xs text-muted-foreground font-normal">{category.subtitle}</p>
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								{category.items.map((item, index) => (
									<motion.div
										key={item}
										className="flex items-center justify-between p-2 bg-white/30 dark:bg-gray-800/30 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
									>
										<span className="text-sm text-foreground">{item}</span>
										{isEditing && (
											<button onClick={() => removeItem(category.items, category.setItems, item)} className="text-red-500 hover:text-red-700 transition-colors">
												<X className="w-3 h-3" />
											</button>
										)}
									</motion.div>
								))}
							</div>

							{isEditing && (
								<div className="flex gap-1">
									<Input value={category.newItem} onChange={(e) => category.setNewItem(e.target.value)} placeholder={category.placeholder} onKeyPress={(e) => e.key === "Enter" && category.addItem()} className="text-sm" />
									<EnhancedButton onClick={category.addItem} size="sm">
										<Plus className="w-3 h-3" />
									</EnhancedButton>
								</div>
							)}

							{!isEditing && category.items.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">None set</p>}
						</CardContent>
					</Card>
				))}
			</div>

			{/* AI Recommendations */}
			<motion.div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
						<Lightbulb className="w-6 h-6 text-white" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Goal Recommendations</h3>
						<div className="space-y-3">
							<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300/20">
								<div className="flex items-center gap-2 mb-1">
									<TrendingUp className="w-4 h-4 text-green-600" />
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Suggested Next Step</span>
								</div>
								<p className="text-sm text-blue-600 dark:text-blue-400">Based on your Python progress, consider learning pandas and numpy for data manipulation.</p>
							</div>

							<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300/20">
								<div className="flex items-center gap-2 mb-1">
									<BarChart3 className="w-4 h-4 text-purple-600" />
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Learning Path Optimization</span>
								</div>
								<p className="text-sm text-blue-600 dark:text-blue-400">Your current pace suggests you could achieve your data science goal 2 months earlier than planned.</p>
							</div>

							<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300/20">
								<div className="flex items-center gap-2 mb-1">
									<Heart className="w-4 h-4 text-pink-600" />
									<span className="text-sm font-medium text-blue-700 dark:text-blue-300">Motivation Boost</span>
								</div>
								<p className="text-sm text-blue-600 dark:text-blue-400">You're 68% closer to your career transition goal. Keep up the excellent momentum!</p>
							</div>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Goal Progress Tracker */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="w-5 h-5 text-primary" />
						Goal Progress Tracking
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4">
						{/* Weekly Learning Hours Progress */}
						<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-foreground">Weekly Learning Hours</span>
								<span className="text-sm text-muted-foreground">
									{Math.round(userData.learningStats.totalLearningHours * 0.1)} / {weeklyHoursGoal} hours
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<motion.div
									className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
									initial={{ width: 0 }}
									animate={{ width: `${Math.min(((userData.learningStats.totalLearningHours * 0.1) / weeklyHoursGoal) * 100, 100)}%` }}
									transition={{ duration: 1, delay: 0.3 }}
								/>
							</div>
						</div>

						{/* Skills Acquisition Progress */}
						<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-foreground">Skills Development</span>
								<span className="text-sm text-muted-foreground">
									{userData.learningStats.skillsAcquired} / {skillsToLearn.length + userData.learningStats.skillsAcquired} skills
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<motion.div
									className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
									initial={{ width: 0 }}
									animate={{
										width: `${Math.min((userData.learningStats.skillsAcquired / (skillsToLearn.length + userData.learningStats.skillsAcquired)) * 100, 100)}%`,
									}}
									transition={{ duration: 1, delay: 0.5 }}
								/>
							</div>
						</div>

						{/* Course Completion Progress */}
						<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
							<div className="flex items-center justify-between mb-2">
								<span className="text-sm font-medium text-foreground">Course Completion</span>
								<span className="text-sm text-muted-foreground">
									{userData.learningStats.coursesCompleted} completed, {userData.learningStats.coursesInProgress} in progress
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<motion.div
									className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
									initial={{ width: 0 }}
									animate={{
										width: `${Math.min((userData.learningStats.coursesCompleted / (userData.learningStats.coursesCompleted + userData.learningStats.coursesInProgress)) * 100, 100)}%`,
									}}
									transition={{ duration: 1, delay: 0.7 }}
								/>
							</div>
						</div>
					</div>

					{/* Goal Achievement Timeline */}
					{targetDate && (
						<div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/30">
							<div className="flex items-center gap-3">
								<Flag className="w-5 h-5 text-indigo-600" />
								<div>
									<p className="font-semibold text-indigo-800 dark:text-indigo-200">Target Completion</p>
									<p className="text-sm text-indigo-600 dark:text-indigo-300">
										Goal date: {new Date(targetDate).toLocaleDateString()}({Math.ceil((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining)
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Action Buttons */}
			{isEditing && (
				<motion.div className="flex gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
					<EnhancedButton onClick={handleSave} disabled={isLoading} variant="ai-primary" className="flex-1" withGlow>
						<Save className="w-4 h-4 mr-2" />
						Save Goals & Objectives
					</EnhancedButton>

					<EnhancedButton onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
						Cancel
					</EnhancedButton>
				</motion.div>
			)}

			{/* Quick Actions */}
			{!isEditing && (
				<motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
					<EnhancedButton variant="outline" size="sm" className="flex items-center gap-2">
						<Zap className="w-4 h-4" />
						Quick Goal
					</EnhancedButton>

					<EnhancedButton variant="outline" size="sm" className="flex items-center gap-2">
						<BookOpen className="w-4 h-4" />
						Course Plan
					</EnhancedButton>

					<EnhancedButton variant="outline" size="sm" className="flex items-center gap-2">
						<TrendingUp className="w-4 h-4" />
						Progress Report
					</EnhancedButton>

					<EnhancedButton variant="outline" size="sm" className="flex items-center gap-2">
						<ArrowRight className="w-4 h-4" />
						View Roadmap
					</EnhancedButton>
				</motion.div>
			)}
		</div>
	);
}
