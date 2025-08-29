"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import VoiceActivityDetector from "./VoiceActivityDetector";
import AnimatedFace from "./AnimatedFace";
import AudioAnalyzer from "./AudioAnalyzer";
import { addMessageToSession } from "@/actions/ai/actions";
import { captureKeyInsights } from "@/actions/ai/agent";
import { motion } from "framer-motion";
import { toolRegistry } from "@/lib/ai/ToolRegistry";

interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: Date;
}

export interface AssistantResponse {
	conversation_id: string;
	id: string;
	output: (
		| {
				id: string;
				type: "message";
				status: string;
				object: string;
				role: string;
				content: { type: string; text: string; transcript: string }[];
		  }
		| {
				id: string;
				type: "function_call";
				name: string;
				arguments: string;
				call_id: string;
		  }
	)[];
}

interface RealtimeAICoachProps {
	onSessionTokenRequest: () => Promise<{ key: string; sessionId: string }>;
	onUserMessage?: (message: string) => Promise<void>;
	className?: string;
	onConnectionChange?: (isConnected: boolean) => void;
	onConnectionEnd?: (sessionId: string) => Promise<void>;
	onAssistantMessage?: (response: AssistantResponse) => Promise<void>;
	canConnect: boolean;
	onAIEvent?: (event: { type: string; event: any }) => Promise<void>;
}

export default function RealtimeAICoach({ onSessionTokenRequest, onConnectionChange, className, onConnectionEnd, onUserMessage, onAssistantMessage, canConnect, onAIEvent }: RealtimeAICoachProps) {
	// Connection states
	const [isLoading, setIsLoading] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(null);

	// Audio states
	const [isUserSpeaking, setIsUserSpeaking] = useState(false);
	const [isAITalking, setIsAITalking] = useState(false);
	const [userAudioLevel, setUserAudioLevel] = useState(0);
	const [aiAudioLevel, setAiAudioLevel] = useState(0);
	const coachingSessionIdRef = useRef<string | null>(null);
	const [sessionConfigured, setSessionConfigured] = useState(false);

	const [messages, setMessages] = useState<Message[]>([]);

	// WebRTC refs
	const dataChannelRef = useRef<RTCDataChannel | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const audioElementRef = useRef<HTMLAudioElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const [currentTool, setCurrentTool] = useState<string | null>(null);

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
	useEffect(() => {
		if (isConnected && !canConnect) {
			disconnectFromOpenAI();
		}
	}, [canConnect]);

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
		if (isSpeaking && userAudioLevel < 0.3) {
			setUserAudioLevel((prev) => Math.max(prev, 0.3));
		} else {
			setUserAudioLevel(0.1);
		}
	};

	// Toggle connection to OpenAI
	const toggleConnection = async () => {
		if (isConnected) {
			disconnectFromOpenAI();
		} else if (!isLoading && canConnect) {
			connectToOpenAI();
		}
	};

	// Connect to OpenAI's Realtime API using WebRTC
	const connectToOpenAI = async () => {
		try {
			rtcCleanup();
			setIsLoading(true);

			// Send context to server

			const { key, sessionId } = await onSessionTokenRequest();
			const EPHEMERAL_KEY = key;
			setSessionId(sessionId);
			// WebRTC setup
			const pc = new RTCPeerConnection();
			peerConnectionRef.current = pc;

			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						// autoGainControl: true,
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
				// First initialize session with transcription disabled
				await updateOpenAISession(dc, {
					voice: "sage",
					input_audio_transcription: {
						model: "gpt-4o-transcribe",
					},

					turn_detection: {
						type: "server_vad",
						threshold: 0.6,
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
					description: "You can now speak with your learning assistant.",
				});

				// Send initial greeting to start conversation
				sendSystemMessage({
					type: "conversation.item.create",
					item: {
						type: "message",
						role: "user",
						content: [
							{
								type: "input_text",
								text: `Hi, there`,
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
		// Close data channel
		if (dataChannelRef.current) {
			dataChannelRef.current.close();
			dataChannelRef.current = null;
		}

		// Stop all tracks and close peer connection
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

		// if (coachingSessionIdRef.current) onComplete?.(coachingSessionIdRef.current);

		setIsConnected(false);
		setIsAITalking(false);
		setIsUserSpeaking(false);
		setUserAudioLevel(0);
		setAiAudioLevel(0);
	};

	// Disconnect from OpenAI's Realtime API
	const disconnectFromOpenAI = () => {
		// Close data channel
		if (dataChannelRef.current) {
			dataChannelRef.current.close();
			dataChannelRef.current = null;
		}

		// Stop all tracks and close peer connection
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

		if (coachingSessionIdRef.current) onConnectionEnd?.(coachingSessionIdRef.current);

		setIsConnected(false);
		setIsAITalking(false);
		setIsUserSpeaking(false);
		setUserAudioLevel(0);
		setAiAudioLevel(0);

		toast({
			title: "AI Coach Disconnected",
			description: "Your coaching session has ended.",
		});
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
		if (event.type === "conversation.item.input_audio_transcription.completed") {
			let message: Message = {
				id: event.item_id,
				role: "user",
				content: event.transcript as string,
				timestamp: new Date(),
			};
			if (coachingSessionIdRef.current) {
				onUserMessage?.(message.content).then(() => {
					setMessages((prev) => [...prev, message]);
				});
			}
		} else if (event.type === "response.done" && event.response?.output) {
			const output = event.response.output;
			// Process final response
			if (output.length <= 0) {
				return;
			}

			let assistantMessage = "";

			// Extract text from all text outputs
			for (const item of output) {
				if (item.type === "message") {
					let text = item.content[0].transcript;
					assistantMessage += text;
				}
			}

			if (assistantMessage) {
				// Add assistant message to chat
				const newMessage: Message = {
					id: Date.now().toString(),
					role: "assistant",
					content: assistantMessage,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, newMessage]);
			}
			// setCurrentAssistantMessage(""); // Clear the partial message
			onAssistantMessage?.(event.response);
		}
		await onAIEvent?.(event);
	};

	return (
		<div className={cn("flex flex-col items-center justify-center relative", className)}>
			{/* Animated Face with loading state passed directly to it */}
			<motion.div className="relative" initial="hidden" whileHover="visible">
				<AnimatedFace isActive={isConnected} isAITalking={isAITalking} audioLevel={isAITalking ? aiAudioLevel : userAudioLevel} onClick={toggleConnection} isLoading={isLoading} className="w-full max-w-md" activity={currentTool} />

				{/* Status indicator text - only appears on hover */}
				<motion.div
					className="absolute bottom-[-10px]  whitespace-nowrap text-sm text-center"
					variants={{
						hidden: { opacity: 0, y: -10, x: "-50%", left: "50%" },
						visible: { opacity: 1, y: 0, x: "-50%", left: "50%" },
					}}
					transition={{ duration: 0.2 }}
				>
					{isLoading ? (
						<span className="text-yellow-400">Connecting to Coach...</span>
					) : isConnected ? (
						<span className="text-green-400 flex items-center justify-center gap-2">
							<span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
							End Coching Session
						</span>
					) : (
						<span className="text-blue-400">Start Session</span>
					)}
				</motion.div>
			</motion.div>

			{/* Voice Activity Detector (invisible component) */}
			<VoiceActivityDetector isActive={isConnected} onVoiceActivityChange={handleVoiceActivityUpdate} onSpeakingChange={handleSpeakingChange} speakingThreshold={25} />

			{/* AI AudioAnalyzer component */}
			{isConnected && <AudioAnalyzer audioElement={audioElementRef.current} isActive={isAITalking} onLevelChange={handleAiAudioLevelChange} />}
		</div>
	);
}
