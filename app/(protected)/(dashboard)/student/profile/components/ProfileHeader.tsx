// app/(protected)/(dashboard)/student/profile/components/ProfileHeader.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Edit3, MapPin, Calendar, Globe, Clock, Star, Sparkles, Heart, Zap, Shield, Award, CheckCircle2, X, Save, Crown, Users, BookOpen, Target, TrendingUp, Mail, Phone, Briefcase, GraduationCap, Trophy } from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import AICoachAvatar from "@/components/ai/AICoachAvatar";

interface ProfileHeaderProps {
	userData: IUserProfileData;
	isEditing: boolean;
	onEditToggle: () => void;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	completionScore: number;
}

export default function ProfileHeader({ userData, isEditing, onEditToggle, onUpdate, completionScore }: ProfileHeaderProps) {
	const [formData, setFormData] = useState({
		name: userData.name,
		firstName: userData.personalInfo.firstName || "",
		lastName: userData.personalInfo.lastName || "",
		bio: userData.personalInfo.bio || "",
		occupation: userData.personalInfo.occupation || "",
		location: `${userData.personalInfo.address?.city || ""}, ${userData.personalInfo.address?.state || ""}`.trim().replace(/^,|,$/, ""),
	});

	const handleSave = () => {
		const updates: Partial<IUserProfileData> = {
			name: formData.name,
			personalInfo: {
				...userData.personalInfo,
				firstName: formData.firstName,
				lastName: formData.lastName,
				bio: formData.bio,
				occupation: formData.occupation,
				address: {
					...userData.personalInfo.address,
					city: formData.location.split(",")[0]?.trim() || "",
					state: formData.location.split(",")[1]?.trim() || "",
				},
			},
		};
		onUpdate(updates);
		onEditToggle();
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase();
	};

	const formatJoinDate = (dateString: Date) => {
		return dateString.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
		});
	};

	const getSubscriptionBadge = () => {
		switch (userData.subscriptionStatus) {
			case "premium":
				return { icon: Crown, text: "Premium Member", color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" };
			case "enterprise":
				return { icon: Shield, text: "Enterprise", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" };
			default:
				return { icon: Users, text: "Free Member", color: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300" };
		}
	};

	const subscriptionBadge = getSubscriptionBadge();

	const quickStats = [
		{
			icon: Clock,
			value: userData.learningStats.totalLearningHours,
			label: "Learning Hours",
			color: "from-blue-500 to-cyan-500",
			description: "Total time invested",
			suffix: "hrs",
		},
		{
			icon: Zap,
			value: userData.learningStats.currentStreak,
			label: "Day Streak",
			color: "from-orange-500 to-red-500",
			description: "Learning consistently",
			suffix: "days",
		},
		{
			icon: Trophy,
			value: userData.learningStats.coursesCompleted,
			label: "Completed",
			color: "from-green-500 to-emerald-500",
			description: "Courses finished",
			suffix: "courses",
		},
		{
			icon: Target,
			value: userData.learningStats.skillsAcquired,
			label: "Skills",
			color: "from-purple-500 to-pink-500",
			description: "Skills mastered",
			suffix: "acquired",
		},
	];

	const achievements = [
		{ icon: BookOpen, text: "Fast Learner", color: "text-blue-600" },
		{ icon: Heart, text: "AI Companion", color: "text-pink-600" },
		{ icon: Star, text: "High Achiever", color: "text-yellow-600" },
	];

	return (
		<Card className="adaptive-card intelligence-glow overflow-hidden">
			<CardContent className="p-0">
				{/* Cover Banner */}
				<div className="relative h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 overflow-hidden">
					{/* Animated background particles */}
					{[...Array(15)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-1 h-1 bg-white/30 rounded-full"
							animate={{
								x: [0, 400],
								y: [Math.random() * 160, Math.random() * 160],
								opacity: [0, 1, 0],
							}}
							transition={{
								duration: 10 + Math.random() * 5,
								repeat: Infinity,
								delay: Math.random() * 5,
							}}
						/>
					))}

					{/* Profile completion indicator */}
					<div className="absolute top-4 left-4">
						<div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
							<div className="w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center relative">
								<motion.div
									className="w-4 h-4 rounded-full border-2 border-white"
									style={{
										background: `conic-gradient(white ${completionScore * 3.6}deg, transparent 0deg)`,
									}}
								/>
								<span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{completionScore}</span>
							</div>
							<span className="text-xs font-medium text-white">Profile Complete</span>
						</div>
					</div>

					{/* Edit button */}
					<div className="absolute top-4 right-4">
						<EnhancedButton variant="adaptive" size="sm" onClick={onEditToggle} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">
							{isEditing ? (
								<>
									<X className="w-4 h-4 mr-1" />
									Cancel
								</>
							) : (
								<>
									<Edit3 className="w-4 h-4 mr-1" />
									Edit Profile
								</>
							)}
						</EnhancedButton>
					</div>
				</div>

				<div className="relative px-8 pb-8">
					{/* Profile Picture & Basic Info */}
					<div className="flex flex-col lg:flex-row gap-6 -mt-20">
						{/* Avatar */}
						<div className="relative z-10 flex-shrink-0">
							<motion.div
								className="w-32 h-32 rounded-3xl bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-floating relative overflow-hidden group cursor-pointer"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{userData.picture ? (
									<img src={userData.picture} alt={userData.name} className="w-full h-full object-cover" />
								) : (
									getInitials(userData.personalInfo.firstName && userData.personalInfo.lastName ? `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}` : userData.name)
								)}

								{/* Hover overlay */}
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
									<Camera className="w-8 h-8 text-white" />
								</div>

								{/* Online indicator */}
								<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
									<div className="w-3 h-3 bg-white rounded-full animate-pulse" />
								</div>

								{/* Subscription status indicator */}
								<div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-4 border-white flex items-center justify-center">
									<subscriptionBadge.icon className="w-4 h-4 text-white" />
								</div>
							</motion.div>
						</div>

						{/* Profile Info */}
						<div className="flex-1 space-y-4 pt-4">
							{isEditing ? (
								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="City, State" />
										<div className="flex gap-2">
											<EnhancedButton onClick={handleSave} variant="ai-primary" size="sm">
												<Save className="w-4 h-4 mr-1" />
												Save Changes
											</EnhancedButton>
										</div>
									</div>
								</div>
							) : (
								<>
									<div>
										<h1 className="text-3xl font-bold text-foreground">{userData.personalInfo.firstName && userData.personalInfo.lastName ? `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}` : userData.name}</h1>
										<div className="flex items-center gap-2 mt-1">
											<p className="text-muted-foreground">{userData.email}</p>
											<CheckCircle2 className="w-4 h-4 text-green-500" />
										</div>
										{userData.personalInfo.occupation && (
											<div className="flex items-center gap-1 mt-1">
												<Briefcase className="w-4 h-4 text-muted-foreground" />
												<p className="text-sm text-muted-foreground">{userData.personalInfo.occupation}</p>
											</div>
										)}
									</div>

									{userData.personalInfo.bio && <p className="text-muted-foreground leading-relaxed max-w-2xl">{userData.personalInfo.bio}</p>}

									{/* Meta Info */}
									<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
										{userData.personalInfo.address?.city && (
											<div className="flex items-center gap-1">
												<MapPin className="w-4 h-4" />
												<span>
													{userData.personalInfo.address.city}
													{userData.personalInfo.address.state && `, ${userData.personalInfo.address.state}`}
												</span>
											</div>
										)}
										<div className="flex items-center gap-1">
											<Calendar className="w-4 h-4" />
											<span>Joined {formatJoinDate(userData.createdAt)}</span>
										</div>
										<div className="flex items-center gap-1">
											<Globe className="w-4 h-4" />
											<span>{userData.personalInfo.timezone || "UTC"}</span>
										</div>
										{userData.personalInfo.education?.institution && (
											<div className="flex items-center gap-1">
												<GraduationCap className="w-4 h-4" />
												<span>{userData.personalInfo.education.institution}</span>
											</div>
										)}
									</div>

									{/* Badges */}
									<div className="flex flex-wrap gap-2">
										<Badge className="ai-badge">
											<Sparkles className="w-3 h-3 mr-1" />
											AI Enhanced Learner
										</Badge>
										<Badge className={subscriptionBadge.color}>
											<subscriptionBadge.icon className="w-3 h-3 mr-1" />
											{subscriptionBadge.text}
										</Badge>
										<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
											<CheckCircle2 className="w-3 h-3 mr-1" />
											Verified Profile
										</Badge>
										{achievements.map((achievement, index) => (
											<Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
												<achievement.icon className={`w-3 h-3 mr-1 ${achievement.color}`} />
												{achievement.text}
											</Badge>
										))}
									</div>
								</>
							)}
						</div>

						{/* AI Coach Preview */}
						<div className="flex-shrink-0">
							<motion.div
								className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/30"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3 }}
								whileHover={{ scale: 1.02 }}
							>
								<div className="text-center space-y-3">
									<AICoachAvatar size="lg" personality={userData.learningPreferences.aiPersonality as any} mood="encouraging" isActive={true} />
									<div>
										<p className="font-semibold text-blue-800 dark:text-blue-200">{userData.aiCoachRelationship.coachName}</p>
										<p className="text-xs text-blue-600 dark:text-blue-300">Your AI Coach</p>
										<div className="flex items-center justify-center gap-1 mt-1">
											{[...Array(5)].map((_, i) => (
												<Star key={i} className={`w-3 h-3 ${i < Math.floor(userData.aiCoachRelationship.satisfactionScore) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
											))}
											<span className="text-xs text-blue-600 dark:text-blue-300 ml-1">{userData.aiCoachRelationship.satisfactionScore.toFixed(1)}</span>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</div>

					{/* Quick Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
						{quickStats.map((stat, index) => (
							<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ scale: 1.02 }}>
								<Card className="card-elevated cursor-pointer group h-full">
									<CardContent className="p-4">
										<div className="flex items-center gap-4">
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
												<stat.icon className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-2xl font-bold text-foreground">
													{stat.value}
													<span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>
												</p>
												<p className="text-sm font-medium text-foreground">{stat.label}</p>
												<p className="text-xs text-muted-foreground truncate">{stat.description}</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					{/* Learning Insights */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
						<motion.div
							className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.8 }}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-semibold text-green-800 dark:text-green-200 text-sm">Learning Streak</p>
									<p className="text-green-600 dark:text-green-300 text-xs">{userData.learningStats.currentStreak} days strong! Keep it up!</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
									<Clock className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">Peak Learning Time</p>
									<p className="text-blue-600 dark:text-blue-300 text-xs">{userData.learningStats.mostProductiveHour}:00 AM - Your golden hour</p>
								</div>
							</div>
						</motion.div>

						<motion.div
							className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.0 }}
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
									<Heart className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-semibold text-purple-800 dark:text-purple-200 text-sm">AI Relationship</p>
									<p className="text-purple-600 dark:text-purple-300 text-xs">{userData.aiCoachRelationship.totalInteractions} conversations & counting</p>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Goals Progress */}
					{userData.learningGoals.shortTerm.length > 0 && (
						<motion.div
							className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/30"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 1.1 }}
						>
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
									<Target className="w-5 h-5" />
									Current Learning Goals
								</h3>
								<Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
									{userData.learningStats.weeklyProgress}% weekly progress
								</Badge>
							</div>
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">Short-term Goals</p>
									<ul className="space-y-1">
										{userData.learningGoals.shortTerm.slice(0, 3).map((goal, index) => (
											<li key={index} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
												<CheckCircle2 className="w-4 h-4 text-green-500" />
												{goal}
											</li>
										))}
									</ul>
								</div>
								{userData.learningGoals.longTerm.length > 0 && (
									<div>
										<p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">Long-term Vision</p>
										<ul className="space-y-1">
											{userData.learningGoals.longTerm.slice(0, 2).map((goal, index) => (
												<li key={index} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
													<Star className="w-4 h-4 text-yellow-500" />
													{goal}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</motion.div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
