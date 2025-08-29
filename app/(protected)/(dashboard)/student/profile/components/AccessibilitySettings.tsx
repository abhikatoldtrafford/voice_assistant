// app/(protected)/(dashboard)/student/profile/components/AccessibilitySettings.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Accessibility,
	Eye,
	EyeOff,
	Type,
	Volume2,
	VolumeX,
	Keyboard,
	Mouse,
	Palette,
	Monitor,
	Move,
	Zap,
	Heart,
	Settings,
	Save,
	RotateCcw,
	TestTube,
	CheckCircle2,
	AlertCircle,
	Info,
	Play,
	Pause,
	Speaker,
	Headphones,
	Contrast,
	Minus,
	Plus,
	Sun,
	Moon,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface AccessibilitySettingsProps {
	userData: IUserProfileData;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	isLoading: boolean;
}

export default function AccessibilitySettings({ userData, onUpdate, isLoading }: AccessibilitySettingsProps) {
	const [settings, setSettings] = useState(userData.accessibilitySettings);
	const [previewMode, setPreviewMode] = useState(false);

	const fontSizeOptions = [
		{ value: "small", label: "Small", size: "text-sm", description: "Compact text for more content" },
		{ value: "medium", label: "Medium", size: "text-base", description: "Standard reading size" },
		{ value: "large", label: "Large", size: "text-lg", description: "Easier reading experience" },
		{ value: "extra-large", label: "Extra Large", size: "text-xl", description: "Maximum readability" },
	];

	const colorBlindnessOptions = [
		{
			value: "none",
			label: "No Support Needed",
			description: "Standard color palette",
			preview: "bg-gradient-to-r from-blue-500 to-green-500",
		},
		{
			value: "deuteranopia",
			label: "Deuteranopia",
			description: "Green color blindness support",
			preview: "bg-gradient-to-r from-blue-500 to-yellow-500",
		},
		{
			value: "protanopia",
			label: "Protanopia",
			description: "Red color blindness support",
			preview: "bg-gradient-to-r from-blue-500 to-cyan-500",
		},
		{
			value: "tritanopia",
			label: "Tritanopia",
			description: "Blue color blindness support",
			preview: "bg-gradient-to-r from-orange-500 to-pink-500",
		},
	];

	const accessibilityFeatures = [
		{
			id: "highContrast",
			title: "High Contrast Mode",
			description: "Increase contrast between text and background for better visibility",
			icon: Contrast,
			category: "visual",
			impact: "high",
		},
		{
			id: "reducedMotion",
			title: "Reduced Motion",
			description: "Minimize animations and transitions that can cause discomfort",
			icon: Move,
			category: "motion",
			impact: "medium",
		},
		{
			id: "screenReader",
			title: "Screen Reader Support",
			description: "Enhanced compatibility with screen reading software",
			icon: Volume2,
			category: "audio",
			impact: "high",
		},
		{
			id: "keyboardNavigation",
			title: "Keyboard Navigation",
			description: "Full keyboard accessibility for all interface elements",
			icon: Keyboard,
			category: "input",
			impact: "high",
		},
		{
			id: "audioDescriptions",
			title: "Audio Descriptions",
			description: "Spoken descriptions for visual content and videos",
			icon: Speaker,
			category: "audio",
			impact: "medium",
		},
		{
			id: "captionsEnabled",
			title: "Captions & Subtitles",
			description: "Text captions for all audio and video content",
			icon: Type,
			category: "audio",
			impact: "high",
		},
	];

	const handleSettingChange = (key: string, value: any) => {
		const newSettings = { ...settings, [key]: value };
		setSettings(newSettings);
	};

	const handleSave = () => {
		onUpdate({
			accessibilitySettings: settings,
		});
	};

	const handleReset = () => {
		const defaultSettings: any = {
			fontSize: "medium",
			highContrast: false,
			reducedMotion: false,
			screenReader: false,
			keyboardNavigation: false,
			colorBlindnessSupport: "none",
			audioDescriptions: false,
			captionsEnabled: false,
		};
		setSettings(defaultSettings);
	};

	const testAccessibility = () => {
		setPreviewMode(!previewMode);
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case "high":
				return "text-red-600 bg-red-100 dark:bg-red-900/20";
			case "medium":
				return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
			case "low":
				return "text-green-600 bg-green-100 dark:bg-green-900/20";
			default:
				return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
		}
	};

	const getCategoryIcon = (category: string) => {
		switch (category) {
			case "visual":
				return Eye;
			case "audio":
				return Volume2;
			case "motion":
				return Move;
			case "input":
				return Keyboard;
			default:
				return Settings;
		}
	};

	const getActiveFeatureCount = () => {
		return Object.values(settings).filter((value) => value === true).length;
	};

	return (
		<div className="space-y-6">
			{/* Accessibility Overview */}
			<Card className="adaptive-card">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-2">
							<Accessibility className="w-5 h-5 text-primary" />
							Accessibility Settings
						</CardTitle>
						<div className="flex items-center gap-2">
							<Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
								{getActiveFeatureCount()} features enabled
							</Badge>
							<EnhancedButton variant="outline" size="sm" onClick={testAccessibility}>
								{previewMode ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
								{previewMode ? "Exit Preview" : "Test Mode"}
							</EnhancedButton>
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Quick Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30">
							<Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
							<p className="text-lg font-bold text-blue-800 dark:text-blue-200">{["highContrast", "colorBlindnessSupport"].some((key) => (key === "colorBlindnessSupport" ? settings[key] !== "none" : (settings as any)[key])) ? "✓" : "○"}</p>
							<p className="text-xs text-blue-600 dark:text-blue-300">Visual</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
							<Volume2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
							<p className="text-lg font-bold text-green-800 dark:text-green-200">{["screenReader", "audioDescriptions", "captionsEnabled"].some((key) => (settings as any)[key]) ? "✓" : "○"}</p>
							<p className="text-xs text-green-600 dark:text-green-300">Audio</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
							<Keyboard className="w-8 h-8 mx-auto mb-2 text-purple-600" />
							<p className="text-lg font-bold text-purple-800 dark:text-purple-200">{settings.keyboardNavigation ? "✓" : "○"}</p>
							<p className="text-xs text-purple-600 dark:text-purple-300">Navigation</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200/30">
							<Move className="w-8 h-8 mx-auto mb-2 text-orange-600" />
							<p className="text-lg font-bold text-orange-800 dark:text-orange-200">{settings.reducedMotion ? "✓" : "○"}</p>
							<p className="text-xs text-orange-600 dark:text-orange-300">Motion</p>
						</div>
					</div>

					{/* Accessibility Impact Notice */}
					<motion.div
						className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/30"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<div className="flex items-start gap-3">
							<Info className="w-5 h-5 text-indigo-600 mt-0.5" />
							<div>
								<h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">Accessibility Impact</h4>
								<p className="text-sm text-indigo-600 dark:text-indigo-300">
									These settings will be applied across the entire learning platform to ensure the best possible experience for your needs. Your AI coach will also adapt its teaching methods based on your accessibility preferences.
								</p>
							</div>
						</div>
					</motion.div>
				</CardContent>
			</Card>

			{/* Font Size Settings */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Type className="w-5 h-5 text-primary" />
						Text & Display
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Font Size Selection */}
					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Font Size</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
							{fontSizeOptions.map((option, index) => (
								<motion.div
									key={option.value}
									className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.fontSize === option.value ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.1 }}
									onClick={() => handleSettingChange("fontSize", option.value)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="text-center space-y-2">
										<div className={`font-semibold ${option.size}`}>Aa</div>
										<p className="text-sm font-medium text-foreground">{option.label}</p>
										<p className="text-xs text-muted-foreground">{option.description}</p>
										{settings.fontSize === option.value && (
											<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center">
												<CheckCircle2 className="w-5 h-5 text-primary" />
											</motion.div>
										)}
									</div>
								</motion.div>
							))}
						</div>

						{/* Font Size Preview */}
						<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
							<h5 className="text-sm font-medium text-foreground mb-2">Preview:</h5>
							<p className={`${fontSizeOptions.find((o) => o.value === settings.fontSize)?.size} text-foreground leading-relaxed`}>
								This is how your text will appear with the selected font size. Your AI coach will present information clearly and comfortably for your reading preferences.
							</p>
						</div>
					</div>

					{/* Color Blindness Support */}
					<div className="space-y-4">
						<h4 className="font-semibold text-foreground">Color Vision Support</h4>
						<div className="grid gap-3">
							{colorBlindnessOptions.map((option, index) => (
								<motion.div
									key={option.value}
									className={`p-4 rounded-xl border cursor-pointer transition-all ${settings.colorBlindnessSupport === option.value ? "border-primary bg-primary/5 shadow-lg" : "border-border hover:border-border/80 hover:shadow-md"}`}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 + index * 0.1 }}
									onClick={() => handleSettingChange("colorBlindnessSupport", option.value)}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<div className="flex items-center gap-4">
										<div className={`w-12 h-12 rounded-xl ${option.preview} flex items-center justify-center`}>
											<Palette className="w-6 h-6 text-white" />
										</div>
										<div className="flex-1">
											<h5 className="font-medium text-foreground">{option.label}</h5>
											<p className="text-sm text-muted-foreground">{option.description}</p>
										</div>
										{settings.colorBlindnessSupport === option.value && <CheckCircle2 className="w-5 h-5 text-primary" />}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Accessibility Features */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Heart className="w-5 h-5 text-primary" />
						Accessibility Features
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{accessibilityFeatures.map((feature, index) => {
						const CategoryIcon = getCategoryIcon(feature.category);

						return (
							<motion.div
								key={feature.id}
								className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 + index * 0.1 }}
							>
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center relative">
										<feature.icon className="w-6 h-6 text-white" />
										<CategoryIcon className="w-3 h-3 text-white absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-0.5" />
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h4 className="font-medium text-foreground">{feature.title}</h4>
											<Badge variant="secondary" className={`text-xs px-2 py-0.5 ${getImpactColor(feature.impact)}`}>
												{feature.impact} impact
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
									</div>
								</div>

								<motion.button
									className={`w-14 h-7 rounded-full transition-colors ${settings[feature.id as keyof typeof settings] ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
									onClick={() => handleSettingChange(feature.id, !settings[feature.id as keyof typeof settings])}
									whileTap={{ scale: 0.95 }}
								>
									<motion.div
										className="w-6 h-6 bg-white rounded-full shadow-md"
										animate={{
											x: settings[feature.id as keyof typeof settings] ? 30 : 2,
										}}
										transition={{ type: "spring", stiffness: 500, damping: 30 }}
									/>
								</motion.button>
							</motion.div>
						);
					})}
				</CardContent>
			</Card>

			{/* AI Accessibility Integration */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="w-5 h-5 text-primary" />
						AI Coach Accessibility
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<motion.div
						className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.8 }}
					>
						<div className="flex items-start gap-3">
							<div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
								<Heart className="w-5 h-5 text-white" />
							</div>
							<div>
								<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">How Your AI Coach Adapts</h4>
								<ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
									<li>• Adjusts communication style based on your accessibility needs</li>
									<li>• Provides alternative content formats (audio, visual, text)</li>
									<li>• Paces learning sessions according to your preferences</li>
									<li>• Uses clear, simple language when screen readers are enabled</li>
									<li>• Offers keyboard shortcuts and voice commands</li>
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Accessibility Support Resources */}
					<div className="grid md:grid-cols-2 gap-4">
						<div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
							<div className="flex items-center gap-2 mb-2">
								<Headphones className="w-5 h-5 text-green-600" />
								<h5 className="font-semibold text-green-800 dark:text-green-200">Audio Support</h5>
							</div>
							<p className="text-sm text-green-600 dark:text-green-300">Screen reader compatibility, audio descriptions, and voice navigation available.</p>
						</div>

						<div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
							<div className="flex items-center gap-2 mb-2">
								<Keyboard className="w-5 h-5 text-purple-600" />
								<h5 className="font-semibold text-purple-800 dark:text-purple-200">Keyboard Support</h5>
							</div>
							<p className="text-sm text-purple-600 dark:text-purple-300">Full keyboard navigation with custom shortcuts and tab sequences.</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
				<EnhancedButton variant="ai-primary" className="flex-1" onClick={handleSave} disabled={isLoading} withGlow>
					<Save className="w-4 h-4 mr-2" />
					{isLoading ? "Saving..." : "Save Accessibility Settings"}
				</EnhancedButton>

				<EnhancedButton variant="outline" className="flex-1" onClick={handleReset}>
					<RotateCcw className="w-4 h-4 mr-2" />
					Reset to Defaults
				</EnhancedButton>
			</motion.div>

			{/* Accessibility Testing Panel */}
			{previewMode && (
				<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<Card className="adaptive-card max-w-2xl w-full">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TestTube className="w-5 h-5 text-primary" />
								Accessibility Preview Mode
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className={`p-4 rounded-xl ${settings.highContrast ? "bg-black text-white" : "bg-white text-black"}`}>
								<h3 className={`font-bold mb-2 ${settings.fontSize === "small" ? "text-sm" : settings.fontSize === "large" ? "text-lg" : settings.fontSize === "extra-large" ? "text-xl" : "text-base"}`}>Sample Learning Content</h3>
								<p className={`${settings.fontSize === "small" ? "text-sm" : settings.fontSize === "large" ? "text-lg" : settings.fontSize === "extra-large" ? "text-xl" : "text-base"}`}>
									This is how your learning content will appear with your current accessibility settings. The AI coach will adapt its presentation style to match these preferences.
								</p>
							</div>

							<div className="flex gap-3">
								<EnhancedButton variant="ai-primary" onClick={() => setPreviewMode(false)}>
									<CheckCircle2 className="w-4 h-4 mr-2" />
									Looks Good
								</EnhancedButton>
								<EnhancedButton variant="outline" onClick={() => setPreviewMode(false)}>
									Close Preview
								</EnhancedButton>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}
		</div>
	);
}
