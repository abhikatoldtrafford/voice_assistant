"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import VoiceActivityDetector from "./VoiceActivityDetector";
import AnimatedFace from "./AnimatedFace";
import AudioAnalyzer from "./AudioAnalyzer";
import { addMessageToSession } from "@/actions/ai/actions";
import { captureKeyInsights } from "@/actions/ai/agent";
import { toolRegistry } from "@/lib/ai/ToolRegistry";
import { QuizOption, QuizWidget, QuizWidgetProps } from "@/components/StudyTools/QuizWidget";
import { GenerateQuizParams } from "@/lib/ai/tools/CourseControl/GenerateQuiz";
import { AINotesWidget } from "@/components/StudyTools/AINotesWidget";
import { AIWidgetStack, StackableWidget } from "@/components/StudyTools/AIWidgetStack";
import { GenerateNotesParams } from "@/lib/ai/tools/CourseControl/GenerateNotes";

// Import the behavior tracking system
import { StudentBehaviorTracker, StudentBehaviorPattern, StudentProfile } from "@/lib/core/behavior/StudentBehaviorTracker";
import { getLiveUserStateAnalysis } from "@/actions/ai/analysis";
import { AIBehaviorDetectionOutput, DetectedBehaviorPattern } from "@/lib/core/behavior/types";
import { generateResponseGuidance } from "@/lib/core/behavior/AIGuigance";

interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: Date;
	responseTime?: number;
}

interface RealtimeAICoachProps {
	chapterId: string;
	chapterTitle: string;
	chapterContent: string;
	userId: string;
	courseId: string;
	onComplete: (coachingSessionId: string) => void;
	userName: string;
	className?: string;
	onConnectionChange?: (isConnected: boolean) => void;
}

export default function RealtimeAICoach({ chapterId, chapterTitle, chapterContent, userId, courseId, onComplete, userName, className, onConnectionChange }: RealtimeAICoachProps) {
	// Connection states
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [widgets, setWidgets] = useState<StackableWidget[]>([]);

	// Audio states
	const [isUserSpeaking, setIsUserSpeaking] = useState(false);
	const [isAITalking, setIsAITalking] = useState(false);
	const [userAudioLevel, setUserAudioLevel] = useState(0);
	const [aiAudioLevel, setAiAudioLevel] = useState(0);

	// Session refs
	const coachingSessionIdRef = useRef<string | null>(null);
	const [sessionConfigured, setSessionConfigured] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const lastUserMessageTimeRef = useRef<number>(0);

	// WebRTC refs
	const dataChannelRef = useRef<RTCDataChannel | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);

	// Tool states
	const [currentTool, setCurrentTool] = useState<string | null>(null);
	const [currentQuiz, setCurrentQuiz] = useState<QuizWidgetProps | null>(null);
	const [currentNote, setCurrentNote] = useState<GenerateNotesParams | null>(null);

	// Student Behavior Tracking
	const behaviorTrackerRef = useRef<StudentBehaviorTracker>(new StudentBehaviorTracker());
	const [currentStudentProfile, setCurrentStudentProfile] = useState<StudentProfile | null>(null);
	const [detectedBehaviors, setDetectedBehaviors] = useState<DetectedBehaviorPattern[]>([]);

	const { toast } = useToast();

	useEffect(() => {
		onConnectionChange?.(isConnected);
	}, [isConnected, onConnectionChange]);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			disconnectFromOpenAI();
		};
	}, []);

	// Analyze student behavior when new user message arrives
	const analyzeStudentBehavior = useCallback(
		async (userMessage: string, responseTime: number, context: any = {}) => {
			try {
				const { analysis, success }: { analysis: AIBehaviorDetectionOutput; success: boolean } = await getLiveUserStateAnalysis(userMessage, {
					responseTime,
					previousMessages: messages.slice(-5), // Last 5 messages for context
					currentTopic: chapterTitle,
					...context,
				});
				if (!success) {
					return;
				}

				// Update states with behavior analysis
				setDetectedBehaviors(analysis.detected_patterns);
				let responseGuidance = generateResponseGuidance(analysis.detected_patterns);
				// Log behavior patterns for debugging
				if (analysis.detected_patterns.length > 0) {
					console.log("Detected behaviors:", analysis.detected_patterns);
					console.log("Response guidance:", responseGuidance);
				}

				// Send behavior guidance to OpenAI session
				await updateAIWithBehaviorGuidance(responseGuidance);

				return analysis;
			} catch (error) {
				console.error("Error analyzing student behavior:", error);
				return null;
			}
		},
		[userId, messages, chapterTitle]
	);

	// Update AI session with behavior-based guidance
	// Update AI session with behavior-based guidance
	const updateAIWithBehaviorGuidance = async (guidance: any) => {
		if (!dataChannelRef.current || !guidance?.primary_strategy) return;

		try {
			// Build dynamic instructions based on detected behaviors
			let behaviorInstructions = "STUDENT BEHAVIOR ANALYSIS REPORT:\n\n";

			// Primary Strategy Section
			if (guidance.primary_strategy) {
				behaviorInstructions += `🎯 PRIMARY STRATEGY: ${guidance.primary_strategy.approach}\n`;
				behaviorInstructions += `Priority Level: ${guidance.primary_strategy.priority_level || "medium"}\n`;
				behaviorInstructions += `Recommended Tone: ${guidance.primary_strategy.tone || "supportive"}\n\n`;
			}

			// Tone Adjustments
			if (guidance.tone_adjustments?.length > 0) {
				behaviorInstructions += `🗣️ TONE ADJUSTMENTS:\n`;
				behaviorInstructions += `- Adopt these tones: ${guidance.tone_adjustments.join(", ")}\n`;
				// behaviorInstructions += `- Maintain consistency in your communication style\n\n`;
			}

			// Content Priorities
			if (guidance.content_priorities?.length > 0) {
				behaviorInstructions += `📚 CONTENT PRIORITIES (in order):\n`;
				guidance.content_priorities.forEach((priority: string, index: number) => {
					behaviorInstructions += `${index + 1}. ${priority.replace(/_/g, " ")}\n`;
				});
				behaviorInstructions += `\n`;
			}

			// Primary Strategy Content Adjustments
			if (guidance.primary_strategy?.content_adjustments?.length > 0) {
				behaviorInstructions += `🔧 CONTENT ADJUSTMENTS:\n`;
				guidance.primary_strategy.content_adjustments.forEach((adjustment: string) => {
					behaviorInstructions += `- ${adjustment.replace(/_/g, " ")}\n`;
				});
				behaviorInstructions += `\n`;
			}

			// Example Phrases to Use
			if (guidance.primary_strategy?.example_phrases?.length > 0) {
				behaviorInstructions += `💬 USE THESE EXAMPLE PHRASES:\n`;
				guidance.primary_strategy.example_phrases.forEach((phrase: string) => {
					behaviorInstructions += `- "${phrase}"\n`;
				});
				behaviorInstructions += `\n`;
			}

			// Immediate Actions
			if (guidance.immediate_actions?.length > 0) {
				behaviorInstructions += `⚡ IMMEDIATE ACTIONS:\n`;
				guidance.immediate_actions.forEach((action: string) => {
					behaviorInstructions += `- ${action.replace(/_/g, " ")}\n`;
				});
				behaviorInstructions += `\n`;
			}

			// Follow-up Actions
			if (guidance.primary_strategy?.followup_actions?.length > 0) {
				behaviorInstructions += `🔄 FOLLOW-UP ACTIONS:\n`;
				guidance.primary_strategy.followup_actions.forEach((action: string) => {
					behaviorInstructions += `- ${action.replace(/_/g, " ")}\n`;
				});
				behaviorInstructions += `\n`;
			}

			// // Additional Context
			// behaviorInstructions += `📋 IMPLEMENTATION NOTES:\n`;
			// behaviorInstructions += `- This guidance is based on real-time analysis of student behavior patterns\n`;
			// behaviorInstructions += `- Prioritize relationship building alongside learning objectives\n`;
			// behaviorInstructions += `- Adapt your response style to match the student's current emotional and learning state\n`;
			// behaviorInstructions += `- Monitor for changes in student behavior and be ready to adjust approach\n\n`;

			// behaviorInstructions += `🎯 REMEMBER: Your primary goal is to respond in a way that strengthens the student relationship while supporting their learning journey.`;

			// Send behavioral context to AI
			sendSystemMessage({
				type: "conversation.item.create",
				item: {
					type: "message",
					role: "system",
					content: [
						{
							type: "input_text",
							text: behaviorInstructions,
						},
					],
				},
			});

			// Optional: Log the guidance for debugging
			console.log("AI Behavior Guidance Applied:", {
				primary_strategy: guidance.primary_strategy?.approach,
				priority_level: guidance.primary_strategy?.priority_level,
				tone_adjustments: guidance.tone_adjustments,
				content_priorities: guidance.content_priorities,
				immediate_actions: guidance.immediate_actions,
			});
		} catch (error) {
			console.error("Error updating AI with behavior guidance:", error);
		}
	};

	// Process voice activity data
	const handleVoiceActivityUpdate = useCallback(
		(activityData: number[]) => {
			const sum = activityData.reduce((total, value) => total + value, 0);
			const average = sum / activityData.length;
			const normalizedLevel = Math.min(1, Math.max(0, average / 100));

			if (!isAITalking) {
				setUserAudioLevel(normalizedLevel);
			}
		},
		[isAITalking]
	);

	// Handle AI audio level changes
	const handleAiAudioLevelChange = useCallback(
		(level: number) => {
			if (isAITalking) {
				setAiAudioLevel(level);
			}
		},
		[isAITalking]
	);

	// Handle speaking status changes
	const handleSpeakingChange = (isSpeaking: boolean) => {
		setIsUserSpeaking(isSpeaking);

		if (isSpeaking) {
			// Record when user starts speaking for response time calculation
			lastUserMessageTimeRef.current = Date.now();

			if (userAudioLevel < 0.3) {
				setUserAudioLevel((prev) => Math.max(prev, 0.3));
			}
		} else {
			setUserAudioLevel(0.1);
		}
	};

	// Toggle connection to OpenAI
	const toggleConnection = async () => {
		if (isConnected) {
			disconnectFromOpenAI();
		} else if (!isLoading) {
			connectToOpenAI();
		}
	};

	// Connect to OpenAI's Realtime API using WebRTC
	const connectToOpenAI = async () => {
		try {
			rtcCleanup();
			setIsLoading(true);

			// Send context to server
			const tokenResponse = await fetch("/api/ai/realtime-token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chapterId,
					courseId,
					chapterTitle,
					chapterContent: chapterContent.slice(0, 3000),
					userId, // Include userId for behavior tracking
				}),
			});

			const data = await tokenResponse.json();

			if (!data.success || !data.client_secret?.value) {
				throw new Error("Failed to get OpenAI session token");
			}

			const EPHEMERAL_KEY = data.client_secret.value;
			setSessionId(data.sessionId);

			if (data.coachingSessionId) {
				coachingSessionIdRef.current = data.coachingSessionId;
			} else {
				toast({
					title: "Warning",
					description: "Failed To Create Coaching Session",
					variant: "destructive",
				});
			}

			// WebRTC setup
			const pc = new RTCPeerConnection();
			peerConnectionRef.current = pc;

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						sampleRate: 48000,
						channelCount: 1,
					},
				});
				mediaStreamRef.current = stream;
				await new Promise((resolve) => setTimeout(resolve, 300));

				stream.getAudioTracks().forEach((track) => {
					pc.addTrack(track, stream);
				});
			} catch (audioError) {
				console.error("Error accessing microphone:", audioError);
				toast({
					title: "Microphone Access Required",
					description: "This feature requires microphone access. Please allow access and try again.",
					variant: "destructive",
				});
				setIsLoading(false);
				return;
			}

			// Audio setup
			audioElementRef.current = new Audio();
			audioElementRef.current.autoplay = true;

			pc.ontrack = (e) => {
				if (audioElementRef.current && e.streams && e.streams[0]) {
					audioElementRef.current.srcObject = e.streams[0];
				}
			};

			// Data channel setup
			const dc = pc.createDataChannel("oai-events", {
				ordered: true,
				maxRetransmits: 3,
			});
			dataChannelRef.current = dc;

			// Connection monitoring
			pc.oniceconnectionstatechange = () => {
				console.log("ICE Connection State:", pc.iceConnectionState);
			};

			dc.onopen = async () => {
				await updateOpenAISession(dc, {
					voice: "sage",
					// instructions: initialInstructions,
					input_audio_transcription: {
						model: "gpt-4o-transcribe",
					},
					turn_detection: {
						type: "server_vad",
						threshold: 0.7,
						prefix_padding_ms: 300,
						silence_duration_ms: 500,
						create_response: true,
					},
				});

				await new Promise((resolve) => setTimeout(resolve, 1000));

				setIsConnected(true);
				setIsLoading(false);

				toast({
					title: "AI Coach Connected",
					description: "Your personalized learning assistant is ready to help.",
				});

				// Send initial greeting
				sendSystemMessage({
					type: "conversation.item.create",
					item: {
						type: "message",
						role: "user",
						content: [
							{
								type: "input_text",
								text: `Hi`,
							},
						],
					},
				});

				sendSystemMessage({
					type: "conversation.item.create",
					item: {
						type: "message",
						role: "system",
						content: [
							{
								type: "input_text",
								text: `
IMMEDIATE ACTION: This is a start of a conversation with a student. 
You should start with a personalized ICEBREAKER strategy, do not start with a generic greetings
you SHOULD use HOBBIES / INTERESTS of the student to spice up the Ice Breaker, 
you SHOULD use the time reference to how long it has been since the last call.
`,
							},
						],
					},
				});

				// Request AI response
				sendSystemMessage({
					type: "response.create",
				});

				setIsAITalking(true);
			};

			dc.onclose = () => {
				setIsConnected(false);
			};

			dc.onmessage = (e) => {
				try {
					const event = JSON.parse(e.data);
					handleServerEvent(event);
				} catch (error) {
					console.error("Error parsing server message:", error);
				}
			};

			// SDP setup
			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);

			const baseUrl = "https://api.openai.com/v1/realtime";
			const model = "gpt-4o-realtime-preview";
			const voice = "sage";

			const sdpResponse = await fetch(`${baseUrl}?model=${model}&voice=${voice}`, {
				method: "POST",
				body: offer.sdp,
				headers: {
					Authorization: `Bearer ${EPHEMERAL_KEY}`,
					"Content-Type": "application/sdp",
				},
			});

			if (!sdpResponse.ok) {
				let errorBody = await sdpResponse.text();
				console.error("OpenAI API error response:", errorBody);
				throw new Error(`OpenAI API error: ${sdpResponse.status}`);
			}

			const answer: RTCSessionDescriptionInit = {
				type: "answer",
				sdp: await sdpResponse.text(),
			};

			await pc.setRemoteDescription(answer);
		} catch (error) {
			console.error("Error connecting to OpenAI:", error);
			setIsLoading(false);

			toast({
				title: "Connection Failed",
				description: "Could not connect to AI Coach. Please try again.",
				variant: "destructive",
			});
		}
	};

	const updateOpenAISession = async (dataChannel: RTCDataChannel, session: any) => {
		try {
			const message = {
				type: "session.update",
				session,
			};
			dataChannel.send(JSON.stringify(message));
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	const rtcCleanup = () => {
		if (dataChannelRef.current) {
			dataChannelRef.current.close();
			dataChannelRef.current = null;
		}

		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			mediaStreamRef.current = null;
		}

		if (peerConnectionRef.current) {
			peerConnectionRef.current.getSenders().forEach((sender) => {
				if (sender.track) {
					sender.track.stop();
				}
			});
			peerConnectionRef.current.close();
			peerConnectionRef.current = null;
		}

		setIsConnected(false);
		setIsAITalking(false);
		setIsUserSpeaking(false);
		setUserAudioLevel(0);
		setAiAudioLevel(0);
	};

	// Disconnect from OpenAI's Realtime API
	const disconnectFromOpenAI = () => {
		rtcCleanup();

		if (coachingSessionIdRef.current) {
			onComplete?.(coachingSessionIdRef.current);
			toast({
				title: "AI Coach Disconnected",
				description: "Your coaching session has ended.",
			});
		}
	};

	// Send system message to OpenAI
	const sendSystemMessage = (message: any) => {
		if (!dataChannelRef.current || dataChannelRef.current.readyState !== "open") return;

		message.event_id = message.event_id || crypto.randomUUID();
		dataChannelRef.current.send(JSON.stringify(message));
	};

	// Handle server events from OpenAI
	const handleServerEvent = async (event: any) => {
		console.log("Server event:", event.type);

		if (event.type === "output_audio_buffer.stopped") {
			setIsAITalking(false);
			setAiAudioLevel(0);
		} else if (event.type === "output_audio_buffer.started") {
			setIsAITalking(true);
			setAiAudioLevel(0.3);
		} else if (event.type === "response.delta" && event.delta?.output) {
			setIsAITalking(true);
			if (aiAudioLevel < 0.3) {
				setAiAudioLevel(0.3);
			}
		}

		// Handle user message transcription - this is where we analyze behavior
		if (event.type === "conversation.item.input_audio_transcription.completed") {
			const responseTime = Date.now() - lastUserMessageTimeRef.current;

			const message: Message = {
				id: event.item_id,
				role: "user",
				content: event.transcript as string,
				timestamp: new Date(),
				responseTime,
			};

			if (coachingSessionIdRef.current) {
				// Add message to session
				await addMessageToSession(coachingSessionIdRef.current, message.role, message.content);
				setMessages((prev) => [...prev, message]);
				// Analyze student behavior
				if ((messages.length + 1) % 10 == 0) {
					await analyzeStudentBehavior(message.content, responseTime);
				}
				// Capture key insights
				captureKeyInsights({
					sessionId: coachingSessionIdRef.current,
					userMessage: message.content,
					courseContent: chapterContent,
					conversationHistory: messages,
					userId: userId,
				});
			}
		}
		// Handle AI response completion
		else if (event.type === "response.done" && event.response?.output) {
			const output = event.response.output;

			if (output.length <= 0) return;

			let assistantMessage = "";

			// Process all output items
			for (const item of output) {
				if (item.type === "message") {
					const text = item.content[0].transcript;
					assistantMessage += text;
				} else if (item.type === "function_call") {
					console.log("Function call:", item);
					await handleFunctionCall(item);
				}
			}

			// Add assistant message to chat
			if (assistantMessage) {
				const newMessage: Message = {
					id: Date.now().toString(),
					role: "assistant",
					content: assistantMessage,
					timestamp: new Date(),
				};

				if (coachingSessionIdRef.current) {
					await addMessageToSession(coachingSessionIdRef.current, newMessage.role, newMessage.content);
					setMessages((prev) => [...prev, newMessage]);
				}
			}
		}
	};

	// Handle function calls from AI
	const handleFunctionCall = async (item: any) => {
		const name = item.name;
		const call_id = item.call_id;

		setCurrentTool(name);

		try {
			if (name === "GENERATE_QUIZ") {
				const args: GenerateQuizParams = JSON.parse(item.arguments);
				const quizOptions = args.options.map((opt: any) => ({
					id: opt.optionText,
					text: opt.optionText,
					isCorrect: opt.correct,
					explanation: opt.explanation,
				}));

				const quizWidget: QuizWidgetProps = {
					question: args.question,
					options: quizOptions,
					onSubmit: async (selectedOptions: QuizOption[]) => {
						const selectedOptionsText = selectedOptions.map((opt) => opt.text).join(",\n");
						const result = await toolRegistry.executeTool(name, args, {
							userId: userId,
							selectedOption: selectedOptionsText,
						});

						sendSystemMessage({
							type: "conversation.item.create",
							item: {
								type: "function_call_output",
								call_id,
								output: JSON.stringify(result),
							},
						});

						setCurrentQuiz(null);
						sendSystemMessage({ type: "response.create" });
					},
					showCorrectAnswer: true,
					aiPersonality: "warm",
					variant: "quiz",
					className: "",
					multiSelect: args.options.filter((opt) => opt.correct).length > 1,
				};

				setCurrentQuiz(quizWidget);
			} else if (name === "GENERATE_NOTES") {
				const args: GenerateNotesParams = JSON.parse(item.arguments);
				setCurrentNote(args);

				const result = await toolRegistry.executeTool(name, args, { userId: userId });

				sendSystemMessage({
					type: "conversation.item.create",
					item: {
						type: "function_call_output",
						call_id,
						output: JSON.stringify(result),
					},
				});

				sendSystemMessage({ type: "response.create" });
			} else {
				// Handle other function calls
				const args = JSON.parse(item.arguments);
				const result = await toolRegistry.executeTool(name, args, { userId: userId });

				sendSystemMessage({
					type: "conversation.item.create",
					item: {
						type: "function_call_output",
						call_id,
						output: JSON.stringify(result),
					},
				});

				sendSystemMessage({ type: "response.create" });
			}
		} catch (error) {
			console.error("Error handling function call:", error);
		} finally {
			setCurrentTool(null);
		}
	};

	return (
		<div className="flex flex-row w-full items-center justify-center relative">
			<div className={cn("flex flex-col items-center justify-center relative", className)}>
				{/* Animated Face with enhanced behavior-based activity indicator */}
				<motion.div className="relative" initial="hidden" whileHover="visible">
					<AnimatedFace
						isActive={isConnected}
						isAITalking={isAITalking}
						audioLevel={isAITalking ? aiAudioLevel : userAudioLevel}
						onClick={toggleConnection}
						isLoading={isLoading}
						className="w-full max-w-md"
						activity={currentTool || (detectedBehaviors.length > 0 ? "analyzing" : undefined)}
					/>

					{/* Enhanced status indicator with behavior insights */}
					<motion.div
						className="absolute bottom-[-10px] whitespace-nowrap text-sm text-center"
						variants={{
							hidden: { opacity: 0, y: -10, x: "-50%", left: "50%" },
							visible: { opacity: 1, y: 0, x: "-50%", left: "50%" },
						}}
						transition={{ duration: 0.2 }}
					>
						{isLoading ? (
							<span className="text-yellow-400">Connecting to AI Coach...</span>
						) : isConnected ? (
							<div className="flex flex-col items-center gap-1">
								<span className="text-green-400 flex items-center justify-center gap-2">
									<span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
									End Coaching Session
								</span>
								{/* Show current behavioral focus if detected */}
								{detectedBehaviors.length > 0 && <span className="text-xs text-blue-300">Focus: {detectedBehaviors[0].concept}</span>}
							</div>
						) : (
							<span className="text-blue-400">Start Coaching Session</span>
						)}
					</motion.div>
				</motion.div>

				{/* Voice Activity Detector */}
				<VoiceActivityDetector isActive={isConnected} onVoiceActivityChange={handleVoiceActivityUpdate} onSpeakingChange={handleSpeakingChange} speakingThreshold={25} />

				{/* AI AudioAnalyzer component */}
				{isConnected && <AudioAnalyzer audioElement={audioElementRef.current} isActive={isAITalking} onLevelChange={handleAiAudioLevelChange} />}

				{/* Quiz Widget */}
				<div className="flex flex-row gap-4 mt-6">{currentQuiz && <QuizWidget {...currentQuiz} />}</div>

				{/* Debug: Show current behavior patterns (remove in production) */}
				{process.env.NODE_ENV === "development" && detectedBehaviors.length > 0 && (
					<div className="mt-4 p-2 bg-gray-800 rounded text-xs max-w-md">
						<div className="text-yellow-400 mb-2">Detected Behaviors:</div>
						{detectedBehaviors.slice(0, 3).map((behavior, index) => (
							<div key={index} className="text-gray-300">
								{behavior.concept}: {behavior.behavior} ({Math.round(behavior.weight * 100)}%)
							</div>
						))}
					</div>
				)}
			</div>

			{/* Notes Widget */}
			{currentNote && (
				<AINotesWidget
					{...currentNote}
					interactive={true}
					onNoteInteraction={(note, action) => {
						console.log(`Student ${action}ed:`, note.content);
					}}
				/>
			)}
		</div>
	);
}
