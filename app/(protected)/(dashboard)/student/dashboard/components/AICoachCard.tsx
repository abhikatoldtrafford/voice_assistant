"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { MessageCircle, Brain, Sparkles, Heart, Lightbulb, Target, TrendingUp, Star, Coffee, Book, Zap, ArrowRight, Volume2, VolumeX } from "lucide-react";

const AICoachCard: React.FC = () => {
	const [currentMessage, setCurrentMessage] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const [isSoundEnabled, setIsSoundEnabled] = useState(true);

	const coachMessages = [
		{
			text: "Ready to dive into your next chapter? I've prepared some personalized exercises based on your learning style!",
			mood: "encouraging" as const,
			personality: "warm" as const,
			icon: Book,
			actionText: "Start Learning",
			actionIcon: ArrowRight,
		},
		{
			text: "I noticed you're doing great with visual concepts! Want me to create some interactive diagrams for today's lesson?",
			mood: "happy" as const,
			personality: "energetic" as const,
			icon: Lightbulb,
			actionText: "Show Diagrams",
			actionIcon: Sparkles,
		},
		{
			text: "You've been consistent with your learning streak! How about we tackle something a bit more challenging today?",
			mood: "celebrating" as const,
			personality: "energetic" as const,
			icon: TrendingUp,
			actionText: "Accept Challenge",
			actionIcon: Target,
		},
		{
			text: "I sense you might be feeling a bit overwhelmed. Let's break this down into smaller, manageable steps together.",
			mood: "thinking" as const,
			personality: "warm" as const,
			icon: Heart,
			actionText: "Get Help",
			actionIcon: Brain,
		},
		{
			text: "Your progress in data structures is impressive! Ready to apply what you've learned to a real-world project?",
			mood: "encouraging" as const,
			personality: "focused" as const,
			icon: Star,
			actionText: "Start Project",
			actionIcon: Zap,
		},
	];

	// Rotate messages every 8 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			setIsTyping(true);
			setTimeout(() => {
				setCurrentMessage((prev) => (prev + 1) % coachMessages.length);
				setIsTyping(false);
			}, 1000);
		}, 8000);

		return () => clearInterval(interval);
	}, [coachMessages.length]);

	const currentCoachMessage = coachMessages[currentMessage];
	const MessageIcon = currentCoachMessage.icon;

	const handleVoiceChat = () => {
		// Navigate to voice chat or trigger voice interaction
		console.log("Starting voice chat with AI coach");
	};

	const handleQuickAction = () => {
		// Handle the quick action based on current message
		console.log("Quick action:", currentCoachMessage.actionText);
	};

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
			<Card className="adaptive-card intelligence-glow border-0 overflow-hidden">
				<CardContent className="p-6 space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-ai rounded-xl flex items-center justify-center">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Your AI Learning Coach</h3>
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
									<span className="text-xs text-muted-foreground">Online & Ready</span>
								</div>
							</div>
						</div>

						<Badge className="ai-badge text-xs">
							<Sparkles className="w-3 h-3" />
							<span>AI Powered</span>
						</Badge>
					</div>

					{/* AI Coach Avatar & Message */}
					<div className="space-y-4">
						<div className="text-center">
							<motion.div
								animate={{
									y: [0, -5, 0],
									scale: isTyping ? [1, 1.05, 1] : 1,
								}}
								transition={{
									y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
									scale: { duration: 0.5, repeat: isTyping ? Infinity : 0 },
								}}
							>
								<AICoachAvatar size="lg" mood={currentCoachMessage.mood} personality={currentCoachMessage.personality} isActive={true} isTyping={isTyping} className="mx-auto" />
							</motion.div>
						</div>

						{/* Message Bubble */}
						<motion.div className="relative p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30" layout>
							{/* Speech bubble arrow */}
							<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-50 dark:bg-blue-950/20 border-l border-t border-blue-200/30 rotate-45" />

							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
									<MessageIcon className="w-4 h-4 text-blue-600" />
								</div>

								<div className="flex-1 min-w-0">
									<AnimatePresence mode="wait">
										<motion.div key={currentMessage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
											{isTyping ? (
												<div className="flex items-center gap-1">
													<span className="text-sm text-blue-800 dark:text-blue-200">Thinking</span>
													{[0, 1, 2].map((i) => (
														<motion.div
															key={i}
															className="w-1.5 h-1.5 bg-blue-600 rounded-full"
															animate={{
																scale: [1, 1.5, 1],
																opacity: [0.5, 1, 0.5],
															}}
															transition={{
																duration: 1,
																repeat: Infinity,
																delay: i * 0.2,
															}}
														/>
													))}
												</div>
											) : (
												<p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{currentCoachMessage.text}</p>
											)}
										</motion.div>
									</AnimatePresence>
								</div>
							</div>
						</motion.div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<EnhancedButton variant="ai-primary" className="w-full group" withGlow aiPersonality={currentCoachMessage.personality} onClick={handleQuickAction} disabled={isTyping}>
							<currentCoachMessage.actionIcon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
							{currentCoachMessage.actionText}
						</EnhancedButton>

						<div className="grid grid-cols-2 gap-3">
							<EnhancedButton variant="adaptive" className="group" onClick={handleVoiceChat}>
								<MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
								Voice Chat
							</EnhancedButton>

							<EnhancedButton variant="adaptive" className="group" onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
								{isSoundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
								{isSoundEnabled ? "Sound On" : "Sound Off"}
							</EnhancedButton>
						</div>
					</div>

					{/* Coach Stats */}
					<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
						<div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
							<div className="text-lg font-bold text-green-600">127</div>
							<div className="text-xs text-green-600/80">Sessions Together</div>
						</div>
						<div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
							<div className="text-lg font-bold text-purple-600">98%</div>
							<div className="text-xs text-purple-600/80">Success Rate</div>
						</div>
					</div>

					{/* Tip of the Day */}
					<motion.div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200/30" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}>
						<div className="flex items-start gap-2">
							<Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
							<div>
								<p className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">💡 Today's Learning Tip</p>
								<p className="text-xs text-yellow-700 dark:text-yellow-300">Try the Feynman Technique: explain concepts in simple terms to deepen your understanding!</p>
							</div>
						</div>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default AICoachCard;
