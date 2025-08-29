// app/(protected)/(dashboard)/student/profile/components/AICoachRelationship.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Brain,
	Heart,
	MessageCircle,
	Sparkles,
	TrendingUp,
	Clock,
	Smile,
	Star,
	Zap,
	Target,
	Award,
	Calendar,
	Settings,
	Volume2,
	Eye,
	ThumbsUp,
	Bot,
	Activity,
	BarChart3,
	Users,
	Lightbulb,
	Coffee,
	BookOpen,
	Trophy,
	CheckCircle2,
	ArrowRight,
	Mic,
	Video,
	Headphones,
	Send,
	MoreHorizontal,
	Bookmark,
	Share2,
	Shield,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import AICoachAvatar from "@/components/ai/AICoachAvatar";

interface AICoachRelationshipProps {
	userData: IUserProfileData;
	detailed?: boolean;
	onUpdate?: (updates: Partial<IUserProfileData>) => void;
}
type IPersonality = "warm" | "energetic" | "focused" | "wise";
export default function AICoachRelationship({ userData, detailed = false, onUpdate }: AICoachRelationshipProps) {
	const [selectedPersonality, setSelectedPersonality] = useState<IPersonality>(userData.learningPreferences.aiPersonality);
	const [showConversationHistory, setShowConversationHistory] = useState(false);

	const coachData = userData.aiCoachRelationship;
	const daysTogether = Math.floor((new Date().getTime() - new Date(coachData.relationshipStartDate).getTime()) / (1000 * 60 * 60 * 24));

	const personalityOptions = [
		{
			type: "warm",
			name: "Warm & Supportive",
			description: "Encouraging, patient, celebrates your wins",
			icon: Heart,
			color: "from-pink-500 to-rose-500",
			traits: ["Patient", "Encouraging", "Empathetic", "Nurturing"],
			sample: "Great job on completing that lesson! I'm so proud of your progress. Let's tackle the next challenge together - I believe in you! 💪",
		},
		{
			type: "energetic",
			name: "Energetic & Motivating",
			description: "High-energy, challenging, keeps you moving",
			icon: Zap,
			color: "from-orange-500 to-yellow-500",
			traits: ["Enthusiastic", "Motivating", "Dynamic", "Inspiring"],
			sample: "WOW! You're on fire today! 🔥 That was an awesome solution! Ready to level up even more? Let's push those boundaries!",
		},
		{
			type: "focused",
			name: "Focused & Analytical",
			description: "Direct, data-driven, efficiency-focused",
			icon: Target,
			color: "from-blue-500 to-indigo-500",
			traits: ["Analytical", "Efficient", "Goal-oriented", "Precise"],
			sample: "Excellent work. Your accuracy improved by 15% this session. Based on your performance data, I recommend focusing on advanced algorithms next.",
		},
		{
			type: "wise",
			name: "Wise Mentor",
			description: "Thoughtful, insightful, philosophical approach",
			icon: Lightbulb,
			color: "from-purple-500 to-indigo-500",
			traits: ["Thoughtful", "Wise", "Philosophical", "Insightful"],
			sample: "Learning is like tending a garden - it requires patience, care, and trust in the process. Your growth this week shows deep understanding is taking root.",
		},
	];

	const interactionStats = [
		{
			icon: MessageCircle,
			label: "Conversations",
			value: coachData.totalInteractions,
			description: "Total chats",
			trend: "+12 this week",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: ThumbsUp,
			label: "Satisfaction",
			value: `${coachData.satisfactionScore.toFixed(1)}★`,
			description: "Your rating",
			trend: "+0.3 this month",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: Clock,
			label: "Response Time",
			value: "< 1s",
			description: "Average",
			trend: "Instant",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Calendar,
			label: "Together",
			value: daysTogether,
			description: "Days",
			trend: "Growing stronger",
			color: "from-orange-500 to-red-500",
			suffix: "days",
		},
	];

	const recentMessages = userData.aiCoachRelationship.conversationHistory.slice(0, detailed ? 10 : 3).map((conv, index) => ({
		id: index,
		time: conv.date.toLocaleDateString(),
		message: getConversationMessage(conv.topic, selectedPersonality),
		type: getConversationType(conv.topic),
		satisfaction: conv.satisfaction,
		duration: conv.duration,
		topic: conv.topic,
	}));

	function getConversationMessage(topic: string, personality: IPersonality) {
		const messages: any = {
			warm: {
				"Python Data Structures": "I noticed you're working with Python data structures! 😊 Lists and dictionaries can be tricky at first, but you're doing great. Want me to show you a visual way to understand them?",
				"Machine Learning Basics": "Machine learning is such an exciting field! 🌟 I love how curious you are about it. Let's break down these concepts step by step - we have all the time in the world.",
				"JavaScript Functions": "Functions are like little helpers in your code! 💡 You're getting the hang of this. I'm here whenever you need help understanding how they work.",
			},
			energetic: {
				"Python Data Structures": "YES! Data structures are the building blocks of awesome code! 🚀 Let's master these lists and dictionaries and unlock your programming superpowers!",
				"Machine Learning Basics": "ML is AMAZING! 🤯 You're diving into the future of technology! Ready to train some neural networks and create AI magic?",
				"JavaScript Functions": "Functions are your coding superpower! ⚡ Let's write some incredible functions that will blow your mind!",
			},
			focused: {
				"Python Data Structures": "Data structures: lists O(1) access, dictionaries O(1) lookup. Efficient implementation requires understanding time complexity. Shall we optimize your algorithms?",
				"Machine Learning Basics": "ML fundamentals: supervised learning for labeled data, unsupervised for pattern discovery. Your next milestone: implement a classification algorithm.",
				"JavaScript Functions": "Functions: reusable code blocks with parameters and return values. Best practices: pure functions, proper naming conventions, error handling.",
			},
			wise: {
				"Python Data Structures": "Data structures are like organizing thoughts in your mind - each has its place and purpose. Understanding when to use each one comes with experience and reflection.",
				"Machine Learning Basics": "Machine learning is teaching computers to see patterns, much like how we learn from experience. The journey of understanding algorithms mirrors our own learning process.",
				"JavaScript Functions": "Functions in programming are like skills in life - once learned, they can be applied in countless situations. Master the fundamentals, and complexity becomes simple.",
			},
		};

		return messages[personality]?.[topic] || `Let's explore ${topic} together! I'm here to help you understand every concept.`;
	}

	function getConversationType(topic: string) {
		if (topic.includes("Python") || topic.includes("JavaScript")) return "coding";
		if (topic.includes("Machine Learning") || topic.includes("AI")) return "ai";
		if (topic.includes("Data")) return "data";
		return "general";
	}

	const handlePersonalityChange = (newPersonality: IPersonality) => {
		setSelectedPersonality(newPersonality);
		if (onUpdate) {
			onUpdate({
				learningPreferences: {
					...userData.learningPreferences,
					aiPersonality: newPersonality as any,
				},
			});
		}
	};

	const selectedPersonalityData = personalityOptions.find((p) => p.type === selectedPersonality);

	const relationshipMilestones = [
		{
			title: "First Meeting",
			date: coachData.relationshipStartDate,
			description: "Started your AI learning journey",
			icon: Heart,
			achieved: true,
		},
		{
			title: "100 Conversations",
			date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
			description: "Built a strong connection",
			icon: MessageCircle,
			achieved: coachData.totalInteractions >= 100,
		},
		{
			title: "Trust Established",
			date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
			description: "High satisfaction rating maintained",
			icon: Shield,
			achieved: coachData.satisfactionScore >= 4.5,
		},
		{
			title: "Learning Partnership",
			date: new Date(),
			description: "Perfect personality match found",
			icon: Brain,
			achieved: true,
		},
	];

	return (
		<div className="space-y-6">
			{/* Main AI Coach Card */}
			<Card className="adaptive-card intelligence-glow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Brain className="w-5 h-5 text-primary" />
						Your AI Learning Coach
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Coach Profile */}
					<div className="text-center space-y-4">
						<motion.div
							className="mx-auto"
							animate={{
								scale: [1, 1.05, 1],
								rotate: [0, 2, -2, 0],
							}}
							transition={{
								duration: 4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						>
							<AICoachAvatar size="xl" personality={selectedPersonality as any} mood="encouraging" isActive={true} />
						</motion.div>

						<div className="space-y-2">
							<div className="flex items-center justify-center gap-2">
								<h3 className="text-xl font-bold text-foreground">{coachData.coachName}</h3>
								<Badge className="ai-badge">
									<Activity className="w-3 h-3 mr-1" />
									Online
								</Badge>
							</div>
							<p className="text-muted-foreground capitalize">{selectedPersonalityData?.name}</p>

							{/* Quick personality traits */}
							<div className="flex flex-wrap justify-center gap-1 mt-2">
								{selectedPersonalityData?.traits.map((trait, index) => (
									<Badge key={trait} variant="secondary" className="text-xs">
										{trait}
									</Badge>
								))}
							</div>
						</div>
					</div>

					{/* Relationship Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{interactionStats.map((stat, index) => (
							<motion.div
								key={stat.label}
								className="text-center p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.1 + index * 0.1 }}
								whileHover={{ scale: 1.02 }}
							>
								<div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
									<stat.icon className="w-6 h-6 text-white" />
								</div>
								<p className="text-lg font-bold text-foreground">{stat.value}</p>
								<p className="text-xs font-medium text-foreground">{stat.label}</p>
								<p className="text-xs text-muted-foreground">{stat.description}</p>
								<p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.trend}</p>
							</motion.div>
						))}
					</div>

					{/* Latest Coach Message */}
					<motion.div
						className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<div className="flex items-start gap-3">
							<AICoachAvatar size="sm" personality={selectedPersonality as any} mood="happy" />
							<div className="flex-1">
								<div className="flex items-center gap-2 mb-1">
									<p className="text-sm font-medium text-blue-800 dark:text-blue-200">{coachData.coachName}</p>
									<Badge variant="secondary" className="text-xs">
										Just now
									</Badge>
								</div>
								<p className="text-sm text-blue-600 dark:text-blue-300">{getConversationMessage("Current Session", selectedPersonality)}</p>
							</div>
						</div>
						<div className="mt-4 flex gap-2">
							<EnhancedButton variant="adaptive" size="sm" className="text-xs flex-1">
								<MessageCircle className="w-3 h-3 mr-1" />
								Start Chat
							</EnhancedButton>
							<EnhancedButton variant="outline" size="sm" className="text-xs flex-1">
								<Video className="w-3 h-3 mr-1" />
								Video Call
							</EnhancedButton>
						</div>
					</motion.div>

					{/* Quick Actions */}
					{!detailed && (
						<div className="grid grid-cols-2 gap-3">
							<EnhancedButton variant="outline" className="text-sm" onClick={() => setShowConversationHistory(!showConversationHistory)}>
								<Eye className="w-4 h-4 mr-2" />
								View History
							</EnhancedButton>
							<EnhancedButton variant="outline" className="text-sm">
								<Settings className="w-4 h-4 mr-2" />
								Customize
							</EnhancedButton>
						</div>
					)}
				</CardContent>
			</Card>

			{detailed && (
				<>
					{/* Personality Customization */}
					<Card className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="w-5 h-5 text-primary" />
								Customize AI Personality
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{personalityOptions.map((option, index) => (
								<motion.div
									key={option.type}
									className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPersonality === option.type ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80"}`}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									onClick={() => handlePersonalityChange(option.type as IPersonality)}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<div className="space-y-3">
										<div className="flex items-center gap-4">
											<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center`}>
												<option.icon className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-foreground">{option.name}</h4>
												<p className="text-sm text-muted-foreground">{option.description}</p>
											</div>
											{selectedPersonality === option.type && (
												<motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
													<CheckCircle2 className="w-4 h-4 text-white" />
												</motion.div>
											)}
										</div>

										{/* Sample message */}
										<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-border/30">
											<p className="text-xs text-muted-foreground mb-1">Sample message:</p>
											<p className="text-sm text-foreground italic">"{option.sample}"</p>
										</div>

										{/* Personality traits */}
										<div className="flex flex-wrap gap-1">
											{option.traits.map((trait) => (
												<Badge key={trait} variant="secondary" className="text-xs">
													{trait}
												</Badge>
											))}
										</div>
									</div>
								</motion.div>
							))}

							<div className="pt-4">
								<EnhancedButton variant="ai-primary" className="w-full" withGlow>
									<Bot className="w-4 h-4 mr-2" />
									Apply Personality Changes
								</EnhancedButton>
							</div>
						</CardContent>
					</Card>

					{/* Conversation History */}
					<Card className="adaptive-card">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<MessageCircle className="w-5 h-5 text-primary" />
									Recent Conversations
								</CardTitle>
								<div className="flex gap-2">
									<EnhancedButton variant="outline" size="sm">
										<Bookmark className="w-3 h-3 mr-1" />
										Bookmarks
									</EnhancedButton>
									<EnhancedButton variant="outline" size="sm">
										<Share2 className="w-3 h-3 mr-1" />
										Export
									</EnhancedButton>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{recentMessages.map((message, index) => (
								<motion.div
									key={message.id}
									className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all group"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<div className="flex items-start gap-3">
										<AICoachAvatar size="sm" personality={selectedPersonality as any} mood="encouraging" />
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<span className="text-sm font-medium text-foreground">{coachData.coachName}</span>
												<Badge
													variant="secondary"
													className={`text-xs ${
														message.type === "coding"
															? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
															: message.type === "ai"
															? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
															: message.type === "data"
															? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
															: "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
													}`}
												>
													{message.topic}
												</Badge>
												<span className="text-xs text-muted-foreground ml-auto">{message.time}</span>
											</div>
											<p className="text-sm text-muted-foreground leading-relaxed mb-3">{message.message}</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													<span>{message.duration}min</span>
												</div>
												<div className="flex items-center gap-1">
													<Star className="w-3 h-3 text-yellow-500" />
													<span>{message.satisfaction}/5</span>
												</div>
												<div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
													<button className="hover:text-primary">
														<Bookmark className="w-3 h-3" />
													</button>
													<button className="hover:text-primary">
														<Share2 className="w-3 h-3" />
													</button>
													<button className="hover:text-primary">
														<MoreHorizontal className="w-3 h-3" />
													</button>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							))}

							<div className="pt-2">
								<EnhancedButton variant="outline" className="w-full">
									<Eye className="w-4 h-4 mr-2" />
									View All Conversations ({coachData.totalInteractions} total)
								</EnhancedButton>
							</div>
						</CardContent>
					</Card>

					{/* Relationship Milestones */}
					<Card className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Trophy className="w-5 h-5 text-primary" />
								Relationship Milestones
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{relationshipMilestones.map((milestone, index) => (
									<motion.div
										key={index}
										className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-border/80 transition-colors"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
									>
										<div className={`w-10 h-10 rounded-full flex items-center justify-center ${milestone.achieved ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}>
											<milestone.icon className={`w-5 h-5 ${milestone.achieved ? "text-white" : "text-gray-500"}`} />
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-foreground">{milestone.title}</h4>
											<p className="text-sm text-muted-foreground">{milestone.description}</p>
											<p className="text-xs text-muted-foreground">{milestone.date.toLocaleDateString()}</p>
										</div>
										{milestone.achieved && <CheckCircle2 className="w-5 h-5 text-green-500" />}
									</motion.div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* AI Insights */}
					<Card className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="w-5 h-5 text-primary" />
								AI Insights About Your Learning
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
									<h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
										<Brain className="w-4 h-4" />
										Learning Style Analysis
									</h4>
									<p className="text-sm text-green-600 dark:text-green-300">
										You're a {userData.learningPreferences.learningStyle} learner who thrives with interactive examples. I've adapted my explanations to include more diagrams and visual aids based on our conversations.
									</p>
								</div>

								<div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl border border-blue-200/30">
									<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
										<Clock className="w-4 h-4" />
										Optimal Learning Times
									</h4>
									<p className="text-sm text-blue-600 dark:text-blue-300">Your peak performance is during {userData.learningPreferences.studyTime} sessions. I've noticed 23% higher engagement rates during these times.</p>
								</div>
							</div>

							<div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
								<h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
									<Lightbulb className="w-4 h-4" />
									Personalized Growth Areas
								</h4>
								<div className="text-sm text-purple-600 dark:text-purple-300 space-y-1">
									<p>
										• <strong>Strengths:</strong> Quick concept grasping, excellent question-asking, consistent practice
									</p>
									<p>
										• <strong>Growth Areas:</strong> Algorithm optimization, debugging patience, code documentation
									</p>
									<p>
										• <strong>Recommendations:</strong> More hands-on projects, peer code reviews, structured problem-solving
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}
