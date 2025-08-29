// app/(protected)/(dashboard)/student/profile/components/PersonalPreferences.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Settings,
	Eye,
	Headphones,
	Clock,
	Palette,
	Globe,
	Brain,
	Target,
	Volume2,
	Moon,
	Sun,
	Monitor,
	Smartphone,
	Bell,
	Heart,
	Zap,
	BookOpen,
	MessageCircle,
	Calendar,
	Star,
	CheckCircle2,
	Save,
	Users,
	Activity,
	Coffee,
	Music,
	Pause,
	Play,
	RotateCcw,
	Lightbulb,
	Gamepad2,
	Mountain,
	Waves,
	TreePine,
	Volume1,
	VolumeX,
	Trophy,
	TrendingUp,
	Loader2,
	Sparkles,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import AICoachAvatar from "@/components/ai/AICoachAvatar";

interface PersonalPreferencesProps {
	userData: IUserProfileData;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	isLoading?: boolean;
}

export default function PersonalPreferences({ userData, onUpdate, isLoading = false }: PersonalPreferencesProps) {
	const [preferences, setPreferences] = useState(userData.learningPreferences);
	const [hasChanges, setHasChanges] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	// Track changes
	useEffect(() => {
		const hasChanged = JSON.stringify(preferences) !== JSON.stringify(userData.learningPreferences);
		setHasChanges(hasChanged);
	}, [preferences, userData.learningPreferences]);

	const learningStyles = [
		{
			id: "visual",
			name: "Visual Learner",
			description: "Learn best with diagrams, charts, and visual aids",
			icon: Eye,
			color: "from-blue-500 to-cyan-500",
			tips: "Prefers infographics, mind maps, and color-coded notes",
			percentage: 65,
		},
		{
			id: "auditory",
			name: "Auditory Learner",
			description: "Prefer listening and verbal explanations",
			icon: Headphones,
			color: "from-green-500 to-emerald-500",
			tips: "Benefits from discussions, podcasts, and verbal instructions",
			percentage: 30,
		},
		{
			id: "kinesthetic",
			name: "Hands-on Learner",
			description: "Learn through practice and experimentation",
			icon: Target,
			color: "from-purple-500 to-pink-500",
			tips: "Needs interactive exercises and real-world applications",
			percentage: 25,
		},
		{
			id: "reading",
			name: "Reading/Writing",
			description: "Prefer text-based learning and note-taking",
			icon: BookOpen,
			color: "from-orange-500 to-red-500",
			tips: "Excels with written materials and structured notes",
			percentage: 40,
		},
	];

	const studyTimes = [
		{
			id: "early-morning",
			label: "Early Bird",
			icon: Sun,
			time: "5AM - 8AM",
			description: "Peak focus before the world wakes up",
			energy: "high",
			productivity: 95,
		},
		{
			id: "morning",
			label: "Morning Person",
			icon: Coffee,
			time: "8AM - 12PM",
			description: "Fresh mind and high energy",
			energy: "high",
			productivity: 90,
		},
		{
			id: "afternoon",
			label: "Afternoon Focus",
			icon: Monitor,
			time: "1PM - 5PM",
			description: "Steady concentration after lunch",
			energy: "medium",
			productivity: 75,
		},
		{
			id: "evening",
			label: "Evening Owl",
			icon: Moon,
			time: "6PM - 10PM",
			description: "Quiet hours for deep thinking",
			energy: "medium",
			productivity: 80,
		},
		{
			id: "night",
			label: "Night Warrior",
			icon: Star,
			time: "10PM - 2AM",
			description: "Late-night productivity bursts",
			energy: "variable",
			productivity: 70,
		},
		{
			id: "flexible",
			label: "Flexible Schedule",
			icon: Clock,
			time: "Anytime",
			description: "Adapts to available time slots",
			energy: "adaptive",
			productivity: 85,
		},
	];

	const difficultySettings = [
		{
			id: "gentle",
			label: "Gentle Journey",
			description: "Take your time, focus on deep understanding",
			icon: Heart,
			color: "text-green-600",
			pace: "Slow & Steady",
			success: 95,
		},
		{
			id: "adaptive",
			label: "Smart Challenge",
			description: "AI adjusts difficulty based on your performance",
			icon: Brain,
			color: "text-blue-600",
			pace: "Dynamic",
			success: 87,
		},
		{
			id: "challenging",
			label: "Push My Limits",
			description: "Maximum challenge for accelerated growth",
			icon: Zap,
			color: "text-orange-600",
			pace: "Fast Track",
			success: 78,
		},
		{
			id: "expert",
			label: "Expert Mode",
			description: "Advanced concepts and complex problems",
			icon: Star,
			color: "text-purple-600",
			pace: "Advanced",
			success: 65,
		},
	];

	const aiPersonalities = [
		{
			id: "warm",
			name: "Warm & Supportive",
			icon: Heart,
			color: "text-pink-600",
			description: "Encouraging, patient, celebrates every win",
			traits: ["Patient", "Encouraging", "Supportive"],
		},
		{
			id: "energetic",
			name: "Energetic & Fun",
			icon: Zap,
			color: "text-orange-600",
			description: "High-energy, motivating, keeps you engaged",
			traits: ["Motivating", "Dynamic", "Fun"],
		},
		{
			id: "focused",
			name: "Direct & Focused",
			icon: Target,
			color: "text-blue-600",
			description: "Efficient, goal-oriented, no-nonsense approach",
			traits: ["Efficient", "Direct", "Results-oriented"],
		},
		{
			id: "wise",
			name: "Wise Mentor",
			icon: Lightbulb,
			color: "text-indigo-600",
			description: "Thoughtful guidance with deep insights",
			traits: ["Insightful", "Thoughtful", "Experienced"],
		},
	];

	const motivationStyles = [
		{
			id: "encouragement",
			label: "Positive Reinforcement",
			icon: Heart,
			description: "Celebrate progress and achievements",
		},
		{
			id: "achievement",
			label: "Achievement Hunter",
			icon: Trophy,
			description: "Unlock badges and collect rewards",
		},
		{
			id: "competition",
			label: "Friendly Competition",
			icon: Users,
			description: "Compare progress with peers",
		},
		{
			id: "progress",
			label: "Progress Tracking",
			icon: TrendingUp,
			description: "Visualize learning journey and growth",
		},
	];

	const backgroundSounds = [
		{
			id: "silent",
			label: "Complete Silence",
			icon: VolumeX,
			description: "No background sounds",
			focus: 85,
		},
		{
			id: "ambient",
			label: "Ambient Sounds",
			icon: Volume1,
			description: "Soft, non-distracting tones",
			focus: 90,
		},
		{
			id: "nature",
			label: "Nature Sounds",
			icon: TreePine,
			description: "Rain, ocean waves, forest sounds",
			focus: 88,
		},
		{
			id: "focus",
			label: "Focus Music",
			icon: Music,
			description: "Instrumental music for concentration",
			focus: 82,
		},
		{
			id: "binaural",
			label: "Binaural Beats",
			icon: Waves,
			description: "Scientifically designed for focus",
			focus: 92,
		},
	];

	const sessionLengths = [
		{ value: "15", label: "Quick Sprint", subtitle: "15 minutes", icon: Zap, efficiency: 75 },
		{ value: "25", label: "Pomodoro", subtitle: "25 minutes", icon: Clock, efficiency: 90 },
		{ value: "45", label: "Deep Focus", subtitle: "45 minutes", icon: Brain, efficiency: 95 },
		{ value: "60", label: "Full Hour", subtitle: "60 minutes", icon: Target, efficiency: 88 },
		{ value: "90", label: "Extended", subtitle: "90 minutes", icon: Mountain, efficiency: 80 },
	];

	const celebrationLevels = [
		{
			id: "minimal",
			label: "Subtle",
			description: "Quiet celebrations",
			example: "Simple checkmarks and gentle notifications",
		},
		{
			id: "moderate",
			label: "Moderate",
			description: "Balanced feedback",
			example: "Visual effects and encouraging messages",
		},
		{
			id: "enthusiastic",
			label: "Enthusiastic",
			description: "Full celebrations",
			example: "Animations, confetti, and achievement fanfare",
		},
	];

	const handleSave = async () => {
		const updates: Partial<IUserProfileData> = {
			learningPreferences: preferences,
		};
		await onUpdate(updates);
		setHasChanges(false);
	};

	const handleReset = () => {
		setPreferences(userData.learningPreferences);
		setHasChanges(false);
	};

	const selectedLearningStyle = learningStyles.find((style) => style.id === preferences.learningStyle);
	const selectedStudyTime = studyTimes.find((time) => time.id === preferences.studyTime);
	const selectedDifficulty = difficultySettings.find((diff) => diff.id === preferences.difficulty);
	const selectedPersonality = aiPersonalities.find((personality) => personality.id === preferences.aiPersonality);

	// Calculate AI compatibility score
	const getCompatibilityScore = () => {
		let score = 85; // Base score

		// Boost for optimal study time
		if (preferences.studyTime === "morning" || preferences.studyTime === "early-morning") score += 5;

		// Boost for adaptive difficulty
		if (preferences.difficulty === "adaptive") score += 10;

		// Ensure score is within bounds
		return Math.min(100, Math.max(0, score));
	};

	return (
		<Card className="adaptive-card">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Settings className="w-5 h-5 text-primary" />
						Learning Preferences
						{hasChanges && (
							<Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
								Unsaved Changes
							</Badge>
						)}
					</CardTitle>
					<div className="flex gap-2">
						{hasChanges && (
							<EnhancedButton variant="outline" size="sm" onClick={handleReset}>
								<RotateCcw className="w-4 h-4 mr-1" />
								Reset
							</EnhancedButton>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-8">
				{/* AI Compatibility Score */}
				<motion.div
					className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1 }}
				>
					<div className="flex items-center gap-4">
						<div className="relative">
							<div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-800 flex items-center justify-center">
								<span className="text-xl font-bold text-blue-600">{getCompatibilityScore()}%</span>
							</div>
							<motion.div
								className="absolute inset-0 rounded-full border-4 border-blue-500"
								style={{
									background: `conic-gradient(#3b82f6 ${getCompatibilityScore() * 3.6}deg, transparent 0deg)`,
								}}
								initial={{ rotate: 0 }}
								animate={{ rotate: 360 }}
								transition={{ duration: 2, delay: 0.5 }}
							/>
						</div>
						<div>
							<h4 className="font-semibold text-blue-800 dark:text-blue-200">AI Compatibility</h4>
							<p className="text-sm text-blue-600 dark:text-blue-300">Your preferences create an optimal learning environment</p>
							<div className="flex items-center gap-1 mt-1">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className={`w-3 h-3 ${i < Math.floor(getCompatibilityScore() / 20) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
								))}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Learning Style */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-foreground flex items-center gap-2">
							<Brain className="w-4 h-4" />
							Learning Style
						</h3>
						{selectedLearningStyle && (
							<Badge className="ai-badge text-xs">
								<selectedLearningStyle.icon className="w-3 h-3 mr-1" />
								{selectedLearningStyle.name}
							</Badge>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{learningStyles.map((style, index) => (
							<motion.div
								key={style.id}
								className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${preferences.learningStyle === style.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: index * 0.1 }}
								onClick={() => setPreferences({ ...preferences, learningStyle: style.id as any })}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-start gap-3">
									<div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${style.color} flex items-center justify-center shadow-lg`}>
										<style.icon className="w-6 h-6 text-white" />
									</div>
									<div className="flex-1">
										<h4 className="font-medium text-foreground">{style.name}</h4>
										<p className="text-xs text-muted-foreground mt-1">{style.description}</p>
										<p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">{style.tips}</p>

										{/* Effectiveness indicator */}
										<div className="mt-2">
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">Effectiveness</span>
												<span className="font-medium">{style.percentage}%</span>
											</div>
											<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
												<motion.div className={`h-1.5 rounded-full bg-gradient-to-r ${style.color}`} initial={{ width: 0 }} animate={{ width: `${style.percentage}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.1 }} />
											</div>
										</div>
									</div>
									{preferences.learningStyle === style.id && (
										<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
											<CheckCircle2 className="w-4 h-4 text-white" />
										</motion.div>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Study Time Preference */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Clock className="w-4 h-4" />
						Optimal Study Time
						{selectedStudyTime && (
							<Badge variant="secondary" className="text-xs ml-2">
								{selectedStudyTime.productivity}% productivity
							</Badge>
						)}
					</h3>
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
						{studyTimes.map((time, index) => (
							<motion.div
								key={time.id}
								className={`p-3 rounded-lg border cursor-pointer transition-all ${preferences.studyTime === time.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 + index * 0.05 }}
								onClick={() => setPreferences({ ...preferences, studyTime: time.id as any })}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-3">
									<div
										className={`w-10 h-10 rounded-xl flex items-center justify-center ${
											time.energy === "high"
												? "bg-gradient-to-r from-green-500 to-emerald-500"
												: time.energy === "medium"
												? "bg-gradient-to-r from-blue-500 to-cyan-500"
												: time.energy === "variable"
												? "bg-gradient-to-r from-purple-500 to-pink-500"
												: "bg-gradient-to-r from-gray-500 to-gray-600"
										}`}
									>
										<time.icon className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground">{time.label}</p>
										<p className="text-xs text-muted-foreground">{time.time}</p>
										<p className="text-xs text-blue-600 dark:text-blue-400 truncate">{time.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Challenge Level */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Target className="w-4 h-4" />
						Challenge Level
						{selectedDifficulty && (
							<Badge variant="secondary" className="text-xs ml-2">
								{selectedDifficulty.success}% success rate
							</Badge>
						)}
					</h3>
					<div className="space-y-3">
						{difficultySettings.map((setting, index) => (
							<motion.div
								key={setting.id}
								className={`p-4 rounded-lg border cursor-pointer transition-all ${preferences.difficulty === setting.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + index * 0.1 }}
								onClick={() => setPreferences({ ...preferences, difficulty: setting.id as any })}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<setting.icon className={`w-5 h-5 ${setting.color}`} />
										<div>
											<p className="font-medium text-foreground">{setting.label}</p>
											<p className="text-sm text-muted-foreground">{setting.description}</p>
											<div className="flex items-center gap-4 mt-1">
												<span className="text-xs text-blue-600 dark:text-blue-400">Pace: {setting.pace}</span>
												<span className="text-xs text-green-600 dark:text-green-400">Success: {setting.success}%</span>
											</div>
										</div>
									</div>
									{preferences.difficulty === setting.id && (
										<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
											<CheckCircle2 className="w-4 h-4 text-white" />
										</motion.div>
									)}
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* AI Coach Personality */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<MessageCircle className="w-4 h-4" />
						AI Coach Personality
						{selectedPersonality && (
							<Badge className="ai-badge text-xs ml-2">
								<selectedPersonality.icon className="w-3 h-3 mr-1" />
								{selectedPersonality.name}
							</Badge>
						)}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{aiPersonalities.map((personality, index) => (
							<motion.div
								key={personality.id}
								className={`p-4 rounded-lg border cursor-pointer transition-all ${preferences.aiPersonality === personality.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.7 + index * 0.1 }}
								onClick={() => setPreferences({ ...preferences, aiPersonality: personality.id as any })}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
							>
								<div className="flex items-start gap-3">
									<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
										<personality.icon className={`w-6 h-6 text-white`} />
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">{personality.name}</p>
										<p className="text-xs text-muted-foreground mb-2">{personality.description}</p>
										<div className="flex flex-wrap gap-1">
											{personality.traits.map((trait, i) => (
												<Badge key={i} variant="secondary" className="text-xs">
													{trait}
												</Badge>
											))}
										</div>
									</div>
									{preferences.aiPersonality === personality.id && (
										<motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
											<CheckCircle2 className="w-4 h-4 text-white" />
										</motion.div>
									)}
								</div>
							</motion.div>
						))}
					</div>

					{/* AI Preview */}
					{selectedPersonality && (
						<motion.div
							className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9 }}
						>
							<div className="flex items-start gap-3">
								<AICoachAvatar size="sm" personality={preferences.aiPersonality as any} mood="encouraging" isActive={true} />
								<div className="flex-1">
									<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
										{selectedPersonality.name === "Warm & Supportive" && "Hi! I'm excited to learn alongside you. Remember, every small step counts! 🌟"}
										{selectedPersonality.name === "Energetic & Fun" && "Hey there! Ready to crush some learning goals today? Let's make this awesome! ⚡"}
										{selectedPersonality.name === "Direct & Focused" && "Let's get started. I'll help you reach your goals efficiently. What's our priority today?"}
										{selectedPersonality.name === "Wise Mentor" && "Welcome. I'm here to guide you with thoughtful insights. What would you like to explore?"}
									</p>
									<p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Preview of your AI coach's communication style</p>
								</div>
							</div>
						</motion.div>
					)}
				</div>

				{/* Session Length & Background */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* Session Length */}
					<div className="space-y-4">
						<h3 className="font-semibold text-foreground flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							Session Length
						</h3>
						<div className="space-y-2">
							{sessionLengths.map((session, index) => (
								<motion.div
									key={session.value}
									className={`p-3 rounded-lg border cursor-pointer transition-all ${preferences.sessionLength === session.value ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.9 + index * 0.05 }}
									onClick={() => setPreferences({ ...preferences, sessionLength: session.value as any })}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-center gap-3">
										<session.icon className="w-5 h-5 text-primary" />
										<div className="flex-1">
											<p className="text-sm font-medium text-foreground">{session.label}</p>
											<p className="text-xs text-muted-foreground">{session.subtitle}</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-green-600 dark:text-green-400 font-medium">{session.efficiency}% efficiency</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>

					{/* Background Sounds */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-foreground flex items-center gap-2">
								<Volume2 className="w-4 h-4" />
								Background Sounds
							</h3>
							<motion.button
								className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${isPlaying ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"}`}
								onClick={() => setIsPlaying(!isPlaying)}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
								{isPlaying ? "Stop Preview" : "Preview"}
							</motion.button>
						</div>

						<div className="space-y-2">
							{backgroundSounds.map((sound, index) => (
								<motion.div
									key={sound.id}
									className={`p-3 rounded-lg border cursor-pointer transition-all ${preferences.background === sound.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 1.1 + index * 0.1 }}
									onClick={() => setPreferences({ ...preferences, background: sound.id as any })}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-center gap-3">
										<sound.icon className="w-5 h-5 text-primary" />
										<div className="flex-1">
											<p className="text-sm font-medium text-foreground">{sound.label}</p>
											<p className="text-xs text-muted-foreground">{sound.description}</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{sound.focus}% focus</p>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Advanced Settings */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Gamepad2 className="w-4 h-4" />
						Advanced Preferences
					</h3>

					<div className="grid gap-4">
						{/* Motivation Style */}
						<div>
							<label className="text-sm font-medium text-foreground mb-3 block">Motivation Style</label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{motivationStyles.map((style, index) => (
									<motion.button
										key={style.id}
										className={`p-3 text-left rounded-lg border transition-all ${preferences.motivationStyle === style.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-border/80"}`}
										onClick={() => setPreferences({ ...preferences, motivationStyle: style.id as any })}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.3 + index * 0.1 }}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
									>
										<div className="flex items-center gap-3">
											<style.icon className="w-5 h-5" />
											<div>
												<div className="font-medium text-sm">{style.label}</div>
												<div className="text-xs text-muted-foreground">{style.description}</div>
											</div>
										</div>
									</motion.button>
								))}
							</div>
						</div>

						{/* Progress Celebration */}
						<div>
							<label className="text-sm font-medium text-foreground mb-3 block">Progress Celebrations</label>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
								{celebrationLevels.map((level, index) => (
									<motion.button
										key={level.id}
										className={`p-3 text-center rounded-lg border transition-all ${preferences.progressCelebration === level.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-border/80"}`}
										onClick={() => setPreferences({ ...preferences, progressCelebration: level.id as any })}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.5 + index * 0.1 }}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<div className="font-medium text-sm">{level.label}</div>
										<div className="text-xs text-muted-foreground mt-1">{level.description}</div>
										<div className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">{level.example}</div>
									</motion.button>
								))}
							</div>
						</div>

						{/* Toggle Settings */}
						<div className="space-y-3">
							{[
								{
									key: "breakReminders",
									label: "Break Reminders",
									description: "Get reminded to take breaks during long sessions",
									icon: Clock,
								},
								{
									key: "focusMode",
									label: "Focus Mode",
									description: "Hide distracting elements during study sessions",
									icon: Target,
								},
							].map((setting, index) => (
								<motion.div
									key={setting.key}
									className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 1.7 + index * 0.1 }}
								>
									<div className="flex items-center gap-3">
										<setting.icon className="w-5 h-5 text-primary" />
										<div>
											<p className="font-medium text-foreground">{setting.label}</p>
											<p className="text-sm text-muted-foreground">{setting.description}</p>
										</div>
									</div>
									<motion.button
										className={`w-12 h-6 rounded-full transition-colors ${preferences[setting.key as keyof typeof preferences] ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
										onClick={() =>
											setPreferences({
												...preferences,
												[setting.key]: !preferences[setting.key as keyof typeof preferences],
											})
										}
										whileTap={{ scale: 0.95 }}
									>
										<motion.div
											className="w-5 h-5 bg-white rounded-full shadow-md"
											animate={{
												x: preferences[setting.key as keyof typeof preferences] ? 26 : 2,
											}}
											transition={{ type: "spring", stiffness: 500, damping: 30 }}
										/>
									</motion.button>
								</motion.div>
							))}
						</div>
					</div>
				</div>

				{/* Current Preferences Summary */}
				<motion.div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }}>
					<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
						<Star className="w-5 h-5" />
						Your Personalized Learning Profile
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">Learning Style:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200 capitalize">{selectedLearningStyle?.name || preferences.learningStyle}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">Best Time:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200 capitalize">{selectedStudyTime?.label || preferences.studyTime}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">Challenge:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200 capitalize">{selectedDifficulty?.label || preferences.difficulty}</span>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">AI Coach:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200 capitalize">{selectedPersonality?.name || preferences.aiPersonality}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">Session Length:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200">{sessionLengths.find((s) => s.value === preferences.sessionLength)?.label || `${preferences.sessionLength} min`}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-blue-600 dark:text-blue-300">Background:</span>
								<span className="font-medium text-blue-800 dark:text-blue-200 capitalize">{backgroundSounds.find((b) => b.id === preferences.background)?.label || preferences.background}</span>
							</div>
						</div>
					</div>

					{/* AI Insight */}
					<div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-blue-300/20">
						<p className="text-sm text-blue-700 dark:text-blue-300 italic">
							<Brain className="w-4 h-4 inline mr-1" />
							Based on your preferences, I'll adapt my teaching style to be {preferences.aiPersonality} and focus on {selectedLearningStyle?.name.toLowerCase()} learning methods during your {selectedStudyTime?.label.toLowerCase()} sessions.
						</p>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div className="flex flex-col sm:flex-row gap-3 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }}>
					<EnhancedButton variant="ai-primary" className="flex-1" onClick={handleSave} disabled={!hasChanges || isLoading} withGlow aiPersonality="energetic">
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Save className="w-4 h-4 mr-2" />
								Save My Preferences
								<Sparkles className="w-4 h-4 ml-2" />
							</>
						)}
					</EnhancedButton>

					<EnhancedButton
						variant="outline"
						className="flex-1"
						onClick={() => {
							// Preview changes logic
							console.log("Previewing preferences...");
						}}
						disabled={isLoading}
					>
						<Eye className="w-4 h-4 mr-2" />
						Preview Changes
					</EnhancedButton>
				</motion.div>

				{/* Tips & Recommendations */}
				<motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.3 }}>
					<h4 className="font-semibold text-foreground flex items-center gap-2">
						<Lightbulb className="w-4 h-4 text-yellow-500" />
						Personalized Tips
					</h4>

					<div className="grid gap-3">
						{selectedLearningStyle && (
							<div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/30">
								<p className="text-sm text-green-800 dark:text-green-200">
									<CheckCircle2 className="w-4 h-4 inline mr-1" />
									As a {selectedLearningStyle.name.toLowerCase()}, try using mind maps and diagrams to organize complex concepts.
								</p>
							</div>
						)}

						{(preferences.studyTime === "morning" || preferences.studyTime === "early-morning") && (
							<div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/30">
								<p className="text-sm text-blue-800 dark:text-blue-200">
									<Coffee className="w-4 h-4 inline mr-1" />
									Morning learners often benefit from tackling the most challenging topics first when mental energy is highest.
								</p>
							</div>
						)}

						{(preferences.difficulty === "challenging" || preferences.difficulty === "expert") && (
							<div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border border-orange-200/30">
								<p className="text-sm text-orange-800 dark:text-orange-200">
									<Zap className="w-4 h-4 inline mr-1" />
									With challenging mode enabled, don't forget to take breaks when needed. Learning is a marathon, not a sprint!
								</p>
							</div>
						)}

						{preferences.background !== "silent" && (
							<div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/30">
								<p className="text-sm text-purple-800 dark:text-purple-200">
									<Music className="w-4 h-4 inline mr-1" />
									Background sounds can enhance focus, but experiment with volume levels to find what works best for you.
								</p>
							</div>
						)}
					</div>
				</motion.div>

				{/* Preference Change Impact */}
				<motion.div
					className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/30"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 2.5 }}
				>
					<div className="flex items-start gap-3">
						<Activity className="w-5 h-5 text-indigo-600 mt-0.5" />
						<div>
							<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">How This Affects Your Learning</h4>
							<ul className="text-sm text-indigo-600 dark:text-indigo-300 space-y-1">
								<li>• Your AI coach will adapt its communication style to match your preferences</li>
								<li>• Content will be presented in formats that align with your learning style</li>
								<li>• Study reminders will be scheduled for your optimal learning times</li>
								<li>• Challenge levels will automatically adjust based on your difficulty setting</li>
								<li>• Background environments will be customized for your focus needs</li>
							</ul>
						</div>
					</div>
				</motion.div>
			</CardContent>
		</Card>
	);
}
