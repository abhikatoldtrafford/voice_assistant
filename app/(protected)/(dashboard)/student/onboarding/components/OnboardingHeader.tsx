"use client";

import { motion } from "framer-motion";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { GraduationCap, Volume2, VolumeX, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

interface OnboardingHeaderProps {
	currentStep: number;
	totalSteps: number;
	stepTitle: string;
	isVoiceEnabled: boolean;
	onToggleVoice: () => void;
}

export default function OnboardingHeader({ currentStep, totalSteps, stepTitle, isVoiceEnabled, onToggleVoice }: OnboardingHeaderProps) {
	const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

	return (
		<motion.header className="relative z-20 p-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between">
					{/* Logo & Brand */}
					<Link href="/" className="flex items-center gap-3 group">
						<motion.div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:shadow-ai-glow transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<GraduationCap className="w-7 h-7 text-white" />
						</motion.div>
						<div>
							<h1 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">EduMattor</h1>
							<p className="text-xs text-muted-foreground -mt-1">AI-Powered Learning</p>
						</div>
					</Link>

					{/* Progress Section */}
					<div className="hidden md:flex flex-col items-center flex-1 max-w-md mx-8">
						<div className="flex items-center gap-3 mb-2">
							<h2 className="font-semibold text-foreground text-lg">{stepTitle}</h2>
							<div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
								<span className="text-xs font-medium text-foreground">
									{currentStep + 1} of {totalSteps}
								</span>
							</div>
						</div>

						{/* Progress Bar */}
						<div className="w-full h-2 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
							<motion.div className="h-full bg-gradient-primary rounded-full relative overflow-hidden" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.6, ease: "easeOut" }}>
								{/* Shimmer effect */}
								<motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: [-100, 100] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
							</motion.div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center gap-3">
						{/* Voice Toggle */}
						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<EnhancedButton
								variant="adaptive"
								size="sm"
								onClick={onToggleVoice}
								className={`${isVoiceEnabled ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
							>
								{isVoiceEnabled ? (
									<>
										<Volume2 className="w-4 h-4 mr-1" />
										Voice On
									</>
								) : (
									<>
										<VolumeX className="w-4 h-4 mr-1" />
										Voice Off
									</>
								)}
							</EnhancedButton>
						</motion.div>

						{/* Help Button */}
						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<EnhancedButton variant="outline" size="sm">
								<HelpCircle className="w-4 h-4 mr-1" />
								Help
							</EnhancedButton>
						</motion.div>

						{/* Settings Button */}
						<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
							<EnhancedButton variant="outline" size="sm">
								<Settings className="w-4 h-4" />
							</EnhancedButton>
						</motion.div>
					</div>
				</div>

				{/* Mobile Progress */}
				<div className="md:hidden mt-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="font-semibold text-foreground">{stepTitle}</h2>
						<span className="text-sm text-muted-foreground">
							{currentStep + 1} of {totalSteps}
						</span>
					</div>
					<div className="w-full h-2 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden">
						<motion.div className="h-full bg-gradient-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
					</div>
				</div>
			</div>
		</motion.header>
	);
}
