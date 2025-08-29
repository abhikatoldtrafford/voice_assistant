"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RealtimeAICoach, { AssistantResponse } from "@/components/RealtimeVoiceAgent/RealtimeAgent";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { Brain, MessageCircle, Mic, VolumeX, ArrowRight, User, CheckCircle } from "lucide-react";
import { toolRegistry } from "@/lib/ai/ToolRegistry";
import { IUserProfileData } from "@/models/UserProfile";
import { completeOnboardingSession } from "@/actions/ai/onboarding";
import { useToast } from "@/hooks/use-toast";

interface AICoachIntroductionProps {
	onNext: (data?: any) => void;
	onPrevious: () => void;
	canGoBack: boolean;
	isVoiceEnabled: boolean;
	userData: IUserProfileData;
	onboardingData: any;
}

interface AIPersonalityOption {
	type: "warm" | "energetic" | "focused" | "wise";
	name: string;
	description: string;
	traits: string[];
}

const personalityOptions: AIPersonalityOption[] = [
	{
		type: "warm",
		name: "Alex",
		description: "Encouraging and patient, celebrates your progress",
		traits: ["Supportive", "Patient", "Encouraging"],
	},
	{
		type: "energetic",
		name: "Zara",
		description: "High-energy and motivating, keeps you engaged",
		traits: ["Energetic", "Motivating", "Fun"],
	},
	{
		type: "focused",
		name: "Morgan",
		description: "Direct and efficient, goal-oriented approach",
		traits: ["Direct", "Efficient", "Goal-oriented"],
	},
	{
		type: "wise",
		name: "Sage",
		description: "Thoughtful guidance with deep insights",
		traits: ["Thoughtful", "Insightful", "Wise"],
	},
];

export default function AICoachIntroduction({ onNext, onPrevious, canGoBack, isVoiceEnabled, userData, onboardingData }: AICoachIntroductionProps) {
	const [isConnected, setIsConnected] = useState(false);
	const [conversationStarted, setConversationStarted] = useState(false);
	const [messageHistory, setMessageHistory] = useState<string[]>([]);
	const [showContinue, setShowContinue] = useState(false);
	const [selectedPersonality, setSelectedPersonality] = useState<AIPersonalityOption>(personalityOptions[0]);
	const [onboardingSessionId, setOnboardingSessionId] = useState<string | undefined>(undefined);
	const conversationTimeout = useRef<NodeJS.Timeout>();
	const { toast } = useToast();

	useEffect(() => {
		// Show continue button after conversation starts or if voice is disabled
		if (!isVoiceEnabled) {
			setShowContinue(true);
		} else {
			conversationTimeout.current = setTimeout(() => {
				setShowContinue(true);
			}, 120000); // 2 minutes
		}

		return () => {
			if (conversationTimeout.current) {
				clearTimeout(conversationTimeout.current);
			}
		};
	}, [isVoiceEnabled, conversationStarted]);

	const handleSessionTokenRequest = async () => {
		const tokenResponse = await fetch("/api/ai/onboarding-token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});

		const data = await tokenResponse.json();

		if (!data.success || !data.client_secret?.value) {
			throw new Error("Failed to get OpenAI session token");
		}

		setOnboardingSessionId(data.onboardingSessionId);
		return {
			key: data.client_secret.value,
			sessionId: data.sessionId,
			onboardingSessionId: data.onboardingSessionId,
		};
	};

	const handleUserMessage = async (message: string) => {
		setMessageHistory((prev) => [...prev, `You: ${message}`]);
	};

	const handleAssistantMessage = async (response: AssistantResponse) => {
		const messageOutput = response.output.filter((x) => x.type === "message");
		const functionCall = response.output.filter((x) => x.type === "function_call");

		if (messageOutput.length === 0 && functionCall.length === 0) {
			return;
		}

		if (messageOutput.length > 0) {
			const assistantText = messageOutput[0].content.reduce((acc, curr) => acc + curr.transcript || curr.text || "", "");
			if (assistantText.length > 0) {
				setMessageHistory((prev) => [...prev, `${selectedPersonality.name}: ${assistantText}`]);
			}
		}

		if (functionCall.length > 0) {
			const functionName = functionCall[0].name;
			const args = functionCall[0].arguments;
			await toolRegistry.getTool(functionName)?.execute(args, {
				userId: userData.id,
				sessionId: onboardingSessionId,
			});

			if (functionName === "END_SESSION") {
				handleContinue();
			}
		}

		// Show continue button after first exchange
		if (messageHistory.length >= 2) {
			setShowContinue(true);
		}
	};

	const handleConnectionChange = (connected: boolean) => {
		setIsConnected(connected);
		if (connected && !conversationStarted) {
			setConversationStarted(true);
		}
	};

	const handleConnectionEnd = async () => {
		// Connection ended
	};

	const handleContinue = async () => {
		if (onboardingSessionId) {
			try {
				const result = await completeOnboardingSession(onboardingSessionId);
				if (result.success) {
					onNext({
						coachPersonality: selectedPersonality,
						hadVoiceConversation: conversationStarted && isConnected,
						messageCount: messageHistory.length,
					});
				}
			} catch (error) {
				console.error("Error completing onboarding session:", error);
				toast({
					title: "Error",
					description: "Failed to complete onboarding session. Please try again later.",
					variant: "destructive",
				});
			}
		} else {
			onNext({
				coachPersonality: selectedPersonality,
				hadVoiceConversation: conversationStarted && isConnected,
				messageCount: messageHistory.length,
			});
		}
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			{/* Header */}
			<motion.div className="text-center space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<div className="space-y-2">
					<h1 className="text-3xl font-semibold text-foreground">Meet Your AI Coach</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose your coaching style and start a conversation to personalize your learning experience</p>
				</div>
				<Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
					<Brain className="w-3 h-3 mr-1" />
					AI-Powered Learning
				</Badge>
			</motion.div>

			{/* Main Content */}
			<div className="grid lg:grid-cols-2 gap-8">
				{/* Coach Selection */}
				<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
					<Card className="h-full">
						<CardHeader className="pb-4">
							<CardTitle className="text-lg">Choose Your Coach Style</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{personalityOptions.map((option) => (
								<motion.div
									key={option.type}
									className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${selectedPersonality.type === option.type ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
									onClick={() => setSelectedPersonality(option)}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
								>
									<div className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
											<User className="w-4 h-4 text-accent" />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h4 className="font-medium text-foreground text-sm">{option.name}</h4>
												{selectedPersonality.type === option.type && <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />}
											</div>
											<p className="text-xs text-muted-foreground line-clamp-1">{option.description}</p>
										</div>
									</div>
								</motion.div>
							))}

							{/* Selected Preview */}
							<motion.div key={selectedPersonality.type} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-muted/30 rounded-lg border border-border mt-4">
								<div className="flex items-start gap-3">
									<AICoachAvatar size="sm" personality={selectedPersonality.type} mood="encouraging" isActive={true} />
									<div className="flex-1">
										<p className="text-xs font-medium text-foreground mb-1">{selectedPersonality.name} says:</p>
										<p className="text-xs text-muted-foreground italic leading-relaxed">
											{selectedPersonality.type === "warm" && "Hi! I'm excited to help you learn at your own pace."}
											{selectedPersonality.type === "energetic" && "Hey! Ready to make learning fun and engaging?"}
											{selectedPersonality.type === "focused" && "Let's achieve your learning goals efficiently."}
											{selectedPersonality.type === "wise" && "I'm here to provide thoughtful guidance on your journey."}
										</p>
									</div>
								</div>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Voice Interaction */}
				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
					<Card className="h-full">
						<CardHeader>
							<CardTitle className="text-xl">Start a Conversation</CardTitle>
							<p className="text-muted-foreground">{isVoiceEnabled ? "Click the avatar to start talking with your AI coach" : "Voice chat is disabled - you can continue with the selected personality"}</p>
						</CardHeader>
						<CardContent className="space-y-6 text-center">
							{/* Voice Component */}
							{isVoiceEnabled ? (
								<div className="space-y-6">
									<RealtimeAICoach
										onSessionTokenRequest={handleSessionTokenRequest}
										onUserMessage={handleUserMessage}
										onAssistantMessage={handleAssistantMessage}
										onConnectionChange={handleConnectionChange}
										onConnectionEnd={handleConnectionEnd}
										className="flex justify-center"
										canConnect={true}
									/>

									{/* Connection Status */}
									<div className="space-y-2">
										<div className={`text-sm ${isConnected ? "text-accent" : "text-muted-foreground"}`}>
											{isConnected ? (
												<div className="flex items-center justify-center gap-2">
													<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
													<span>Connected - Start talking!</span>
												</div>
											) : (
												<span>Click the avatar to connect</span>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<AICoachAvatar size="xl" personality={selectedPersonality.type} mood="happy" isActive={false} />
									<div className="space-y-2">
										<p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
											<VolumeX className="w-4 h-4" />
											Voice chat is currently disabled
										</p>
										<p className="text-xs text-muted-foreground">You can continue with your selected coach personality</p>
									</div>
								</div>
							)}

							{/* Conversation History */}
							{messageHistory.length > 0 && (
								<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-h-32 overflow-y-auto p-3 bg-muted/30 rounded-lg border border-border text-left">
									<div className="space-y-2">
										{messageHistory.slice(-3).map((message, index) => (
											<div key={index} className="text-xs">
												<span className={message.startsWith("You:") ? "text-accent font-medium" : "text-foreground"}>{message}</span>
											</div>
										))}
									</div>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Welcome Message for Non-Voice Users */}
			{!isVoiceEnabled && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
					<Card>
						<CardContent className="p-6">
							<div className="space-y-4">
								<h4 className="font-medium text-foreground text-center">A Message from {selectedPersonality.name}</h4>
								<div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
									<div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
										<MessageCircle className="w-5 h-5 text-accent" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-foreground leading-relaxed">
											Hi there! I'm {selectedPersonality.name}, your AI learning coach. I'm here to help you achieve your learning goals with a {selectedPersonality.type} approach. We'll work together to create a personalized learning
											experience that fits your style and pace. Ready to get started?
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Continue Button */}
			<AnimatePresence>
				{(showContinue || !isVoiceEnabled) && (
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex justify-center">
						<Button onClick={handleContinue} size="lg" className="px-8">
							Continue to Dashboard
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Conversation Status */}
			{!showContinue && isVoiceEnabled && (
				<motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-center">
					<Badge variant="secondary" className="bg-accent/10 text-accent">
						<Mic className="w-3 h-3 mr-1" />
						Having a conversation with {selectedPersonality.name}...
					</Badge>
				</motion.div>
			)}
		</div>
	);
}
