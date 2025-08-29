"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Eye, Headphones, Target, BookOpen, Sun, Moon, Coffee, Clock, Zap, Heart, Brain, Star, ArrowRight, ArrowLeft, Lightbulb, Music, Volume1, VolumeX, TreePine, Waves, CheckCircle2, Sparkles, Activity, Calendar, Settings } from "lucide-react";

interface PreferencesSetupProps {
	onNext: (data: any) => void;
	onPrevious: () => void;
	canGoBack: boolean;
	isVoiceEnabled: boolean;
	userData: any;
	onboardingData: any;
}

export default function PreferencesSetup({ onNext, onPrevious, canGoBack, isVoiceEnabled, userData, onboardingData }: PreferencesSetupProps) {
	const [preferences, setPreferences] = useState({
		learningStyle: "",
		studyTime: "",
		sessionLength: "45",
		difficulty: "adaptive",
		background: "ambient",
		motivationStyle: "encouragement",
		progressCelebration: "moderate",
	});

	const [currentSection, setCurrentSection] = useState(0);

	const learningStyles = [
		{
			id: "visual",
			name: "Visual Learner",
			description: "I learn best with diagrams, charts, and visual aids",
			icon: Eye,
			color: "from-blue-500 to-cyan-500",
			percentage: 65,
		},
		{
			id: "auditory",
			name: "Auditory Learner",
			description: "I prefer listening and verbal explanations",
			icon: Headphones,
			color: "from-green-500 to-emerald-500",
			percentage: 30,
		},
		{
			id: "kinesthetic",
			name: "Hands-on Learner",
			description: "I learn through practice and experimentation",
			icon: Target,
			color: "from-purple-500 to-pink-500",
			percentage: 25,
		},
		{
			id: "reading",
			name: "Reading/Writing",
			description: "I prefer text-based learning and note-taking",
			icon: BookOpen,
			color: "from-orange-500 to-red-500",
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
			productivity: 95,
		},
		{
			id: "morning",
			label: "Morning Person",
			icon: Coffee,
			time: "8AM - 12PM",
			description: "Fresh mind and high energy",
			productivity: 90,
		},
		{
			id: "afternoon",
			label: "Afternoon Focus",
			icon: Activity,
			time: "1PM - 5PM",
			description: "Steady concentration after lunch",
			productivity: 75,
		},
		{
			id: "evening",
			label: "Evening Owl",
			icon: Moon,
			time: "6PM - 10PM",
			description: "Quiet hours for deep thinking",
			productivity: 80,
		},
		{
			id: "flexible",
			label: "Flexible Schedule",
			icon: Clock,
			time: "Anytime",
			description: "Adapts to available time slots",
			productivity: 85,
		},
	];

	const sessionLengths = [
		{ value: "15", label: "Quick Sprint", subtitle: "15 minutes", icon: Zap, efficiency: 75 },
		{ value: "25", label: "Pomodoro", subtitle: "25 minutes", icon: Clock, efficiency: 90 },
		{ value: "45", label: "Deep Focus", subtitle: "45 minutes", icon: Brain, efficiency: 95 },
		{ value: "60", label: "Full Hour", subtitle: "60 minutes", icon: Target, efficiency: 88 },
		{ value: "90", label: "Extended", subtitle: "90 minutes", icon: Star, efficiency: 80 },
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

	const sections = [
		{
			title: "How Do You Learn Best?",
			subtitle: "Choose your primary learning style",
			component: "learningStyle",
		},
		{
			title: "When Are You Most Focused?",
			subtitle: "Select your optimal study time",
			component: "studyTime",
		},
		{
			title: "Study Session Preferences",
			subtitle: "Customize your learning environment",
			component: "sessionPrefs",
		},
	];

	const handlePreferenceChange = (key: string, value: string) => {
		setPreferences((prev) => ({ ...prev, [key]: value }));
	};

	const handleNext = () => {
		if (currentSection < sections.length - 1) {
			setCurrentSection(currentSection + 1);
		} else {
			onNext(preferences);
		}
	};

	const handlePrevious = () => {
		if (currentSection > 0) {
			setCurrentSection(currentSection - 1);
		} else if (canGoBack) {
			onPrevious();
		}
	};

	const isCurrentSectionComplete = () => {
		switch (currentSection) {
			case 0:
				return preferences.learningStyle !== "";
			case 1:
				return preferences.studyTime !== "";
			case 2:
				return preferences.sessionLength !== "" && preferences.background !== "";
			default:
				return false;
		}
	};

	const getOverallProgress = () => {
		const completedFields = Object.values(preferences).filter((val) => val !== "").length;
		const totalFields = Object.keys(preferences).length;
		return Math.round((completedFields / totalFields) * 100);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Header */}
			<motion.div className="text-center space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
				<div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
					<Settings className="w-8 h-8 text-white" />
				</div>

				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-foreground">{sections[currentSection].title}</h1>
					<p className="text-xl text-muted-foreground">{sections[currentSection].subtitle}</p>
				</div>

				<div className="flex justify-center gap-2">
					<Badge className="ai-badge">
						<Lightbulb className="w-3 h-3 mr-1" />
						Personalized
					</Badge>
					<Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
						{getOverallProgress()}% Complete
					</Badge>
				</div>
			</motion.div>

			{/* Section Progress */}
			<div className="flex justify-center">
				<div className="flex items-center gap-3">
					{sections.map((_, index) => (
						<motion.div
							key={index}
							className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSection ? "bg-gradient-primary scale-125" : index < currentSection ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
							animate={
								index === currentSection
									? {
											scale: [1.25, 1.5, 1.25],
									  }
									: {}
							}
							transition={{
								duration: 2,
								repeat: index === currentSection ? Infinity : 0,
							}}
						/>
					))}
				</div>
			</div>

			{/* Dynamic Content */}
			<AnimatePresence mode="wait">
				<motion.div key={currentSection} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }}>
					{/* Learning Style Section */}
					{currentSection === 0 && (
						<Card className="adaptive-card">
							<CardContent className="p-8">
								<div className="grid md:grid-cols-2 gap-6">
									{learningStyles.map((style, index) => (
										<motion.div
											key={style.id}
											className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
												preferences.learningStyle === style.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"
											}`}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											onClick={() => handlePreferenceChange("learningStyle", style.id)}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="space-y-4">
												<div className="flex items-center gap-4">
													<div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${style.color} flex items-center justify-center shadow-lg`}>
														<style.icon className="w-8 h-8 text-white" />
													</div>
													<div className="flex-1">
														<h3 className="font-semibold text-foreground text-lg">{style.name}</h3>
														<p className="text-sm text-muted-foreground">{style.description}</p>
													</div>
													{preferences.learningStyle === style.id && (
														<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
															<CheckCircle2 className="w-4 h-4 text-white" />
														</motion.div>
													)}
												</div>

												{/* Effectiveness indicator */}
												<div>
													<div className="flex items-center justify-between text-xs mb-1">
														<span className="text-muted-foreground">Effectiveness</span>
														<span className="font-medium">{style.percentage}%</span>
													</div>
													<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
														<motion.div className={`h-2 rounded-full bg-gradient-to-r ${style.color}`} initial={{ width: 0 }} animate={{ width: `${style.percentage}%` }} transition={{ duration: 1, delay: 0.5 + index * 0.1 }} />
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Study Time Section */}
					{currentSection === 1 && (
						<Card className="adaptive-card">
							<CardContent className="p-8">
								<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
									{studyTimes.map((time, index) => (
										<motion.div
											key={time.id}
											className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${preferences.studyTime === time.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: index * 0.1 }}
											onClick={() => handlePreferenceChange("studyTime", time.id)}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<div className="space-y-3">
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
														<time.icon className="w-6 h-6 text-white" />
													</div>
													<div className="flex-1 min-w-0">
														<h4 className="font-medium text-foreground">{time.label}</h4>
														<p className="text-xs text-muted-foreground">{time.time}</p>
													</div>
													{preferences.studyTime === time.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
												</div>
												<p className="text-sm text-muted-foreground">{time.description}</p>
												<div className="flex items-center justify-between text-xs">
													<span className="text-muted-foreground">Productivity</span>
													<span className="font-medium text-green-600 dark:text-green-400">{time.productivity}%</span>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Session Preferences Section */}
					{currentSection === 2 && (
						<div className="space-y-6">
							{/* Session Length */}
							<Card className="adaptive-card">
								<CardContent className="p-6">
									<h3 className="text-xl font-semibold text-foreground mb-4">Session Length</h3>
									<div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
										{sessionLengths.map((session, index) => (
											<motion.div
												key={session.value}
												className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 text-center ${
													preferences.sessionLength === session.value ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"
												}`}
												initial={{ opacity: 0, scale: 0.95 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{ delay: index * 0.1 }}
												onClick={() => handlePreferenceChange("sessionLength", session.value)}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<session.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
												<p className="font-medium text-foreground text-sm">{session.label}</p>
												<p className="text-xs text-muted-foreground">{session.subtitle}</p>
												<p className="text-xs text-green-600 dark:text-green-400 mt-1">{session.efficiency}% efficiency</p>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Background Sounds */}
							<Card className="adaptive-card">
								<CardContent className="p-6">
									<h3 className="text-xl font-semibold text-foreground mb-4">Background Environment</h3>
									<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
										{backgroundSounds.map((sound, index) => (
											<motion.div
												key={sound.id}
												className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
													preferences.background === sound.id ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"
												}`}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 + index * 0.1 }}
												onClick={() => handlePreferenceChange("background", sound.id)}
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
											>
												<div className="space-y-3">
													<div className="flex items-center gap-3">
														<sound.icon className="w-6 h-6 text-primary" />
														<div className="flex-1">
															<h4 className="font-medium text-foreground text-sm">{sound.label}</h4>
															<p className="text-xs text-muted-foreground">{sound.description}</p>
														</div>
														{preferences.background === sound.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
													</div>
													<div className="flex items-center justify-between text-xs">
														<span className="text-muted-foreground">Focus boost</span>
														<span className="font-medium text-blue-600 dark:text-blue-400">{sound.focus}%</span>
													</div>
												</div>
											</motion.div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</motion.div>
			</AnimatePresence>

			{/* AI Insights */}
			{isCurrentSectionComplete() && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
					<Card className="adaptive-card border-blue-200 dark:border-blue-800">
						<CardContent className="p-6">
							<div className="flex items-start gap-4">
								<div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
									<Brain className="w-5 h-5 text-white" />
								</div>
								<div className="flex-1">
									<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">AI Insight</h4>
									<p className="text-sm text-blue-600 dark:text-blue-300">
										{currentSection === 0 && preferences.learningStyle === "visual" && "Perfect! As a visual learner, I'll make sure to include plenty of diagrams, mind maps, and visual aids in our sessions."}
										{currentSection === 0 && preferences.learningStyle === "auditory" && "Excellent choice! I'll focus on clear explanations, discussions, and audio-based learning materials for you."}
										{currentSection === 0 && preferences.learningStyle === "kinesthetic" && "Great! I'll design hands-on exercises, practical projects, and interactive learning experiences for you."}
										{currentSection === 0 && preferences.learningStyle === "reading" && "Wonderful! I'll provide well-structured text materials, comprehensive notes, and reading-based learning paths."}
										{currentSection === 1 &&
											`Based on your ${studyTimes.find((t) => t.id === preferences.studyTime)?.label.toLowerCase()} preference, I'll schedule our sessions and send reminders at your optimal time for maximum productivity.`}
										{currentSection === 2 &&
											`Your ${sessionLengths.find((s) => s.value === preferences.sessionLength)?.label} sessions with ${backgroundSounds
												.find((b) => b.id === preferences.background)
												?.label.toLowerCase()} will create the perfect learning environment for you.`}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Navigation */}
			<motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-between">
				<EnhancedButton variant="outline" onClick={handlePrevious} disabled={!canGoBack && currentSection === 0}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					{currentSection === 0 ? "Back to Coach" : "Previous"}
				</EnhancedButton>

				<div className="flex-1 flex justify-center">
					{isCurrentSectionComplete() && (
						<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
							<CheckCircle2 className="w-4 h-4" />
							<span className="text-sm font-medium">Section Complete!</span>
						</motion.div>
					)}
				</div>

				<EnhancedButton variant="ai-primary" onClick={handleNext} disabled={!isCurrentSectionComplete()} withGlow={isCurrentSectionComplete()}>
					{currentSection === sections.length - 1 ? (
						<>
							Continue to Goals
							<Sparkles className="w-4 h-4 ml-2" />
						</>
					) : (
						<>
							Next Section
							<ArrowRight className="w-4 h-4 ml-2" />
						</>
					)}
				</EnhancedButton>
			</motion.div>

			{/* Progress Summary */}
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
				<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
					<div className="w-4 h-4 rounded-full bg-gradient-primary flex items-center justify-center">
						<span className="text-xs font-bold text-white">{Math.round(((currentSection + 1) / sections.length) * 100)}%</span>
					</div>
					<span className="text-sm text-muted-foreground">Preferences Setup Progress</span>
				</div>
			</motion.div>

			{/* Quick Preview */}
			{getOverallProgress() > 50 && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
					<Card className="adaptive-card max-w-md mx-auto">
						<CardContent className="p-4">
							<div className="text-center space-y-3">
								<h5 className="font-medium text-foreground">Your Learning Profile</h5>
								<div className="space-y-2 text-sm">
									{preferences.learningStyle && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Style:</span>
											<span className="font-medium capitalize">{preferences.learningStyle}</span>
										</div>
									)}
									{preferences.studyTime && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Best Time:</span>
											<span className="font-medium">{studyTimes.find((t) => t.id === preferences.studyTime)?.label}</span>
										</div>
									)}
									{preferences.sessionLength && (
										<div className="flex justify-between">
											<span className="text-muted-foreground">Sessions:</span>
											<span className="font-medium">{preferences.sessionLength} minutes</span>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</div>
	);
}
