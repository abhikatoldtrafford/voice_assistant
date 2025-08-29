"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, User, BookOpen, CheckCircle, HelpCircle, ThumbsUp, ThumbsDown, Send, PlayCircle, PauseCircle, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { sendMessageToCoach, getStudentSuggestions, endCoachingSession, generateChapterKeypoints } from "@/actions/ai/coach";
import VideoPlayer from "./VideoPlayer";
import { useToast } from "@/hooks/use-toast";
import RealtimeAICoach from "./RealtimeAICoach";
import { Switch } from "@/components/ui/switch";

// Interfaces
interface Message {
	id: string;
	role: "user" | "assistant" | "system";
	content: string;
	timestamp: Date;
}

interface Keypoint {
	id: string;
	title: string;
	description: string;
	isHighlighted: boolean;
}

interface Checkpoint {
	id: string;
	title: string;
	question: string;
	userAnswer?: string;
	aiResponse?: string;
	isCompleted: boolean;
}

interface LearningChallenges {
	id: string;
	title: string;
	description: string;
	completed: boolean;
}

interface ImmersiveAICoachProps {
	chapterId: string;
	chapterTitle: string;
	chapterContent: string;
	userId: string;
	courseId: string;
	onComplete: () => void;
	userName: string;
	videoUrl?: string | null;
}

export default function ImmersiveAICoach({ chapterId, chapterTitle, chapterContent, userId, courseId, onComplete, userName, videoUrl }: ImmersiveAICoachProps) {
	// States for different learning components
	const [activeTab, setActiveTab] = useState(videoUrl ? "video" : "content");
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
	const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
	const [learningChallenges, setLearningChallenges] = useState<LearningChallenges[]>([]);
	const [isIntroduced, setIsIntroduced] = useState(false);
	const [showAIInsights, setShowAIInsights] = useState(false);
	const [activeCheckpoint, setActiveCheckpoint] = useState<Checkpoint | null>(null);
	const [checkpointAnswer, setCheckpointAnswer] = useState("");
	const [readingProgress, setReadingProgress] = useState(0);
	const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
	const [videoWatched, setVideoWatched] = useState(false);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [isRealtimeAI, setIsRealtimeAI] = useState(false);

	const messagesEndRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	// Initialize AI coach on component load
	useEffect(() => {
		if (!courseId) return;
		const initAICoach = async () => {
			setIsLoading(true);

			// Fetch key points from the chapter
			const keypointsResult = await generateChapterKeypoints(chapterId, courseId, userId);
			console.log(keypointsResult);

			setKeypoints(keypointsResult);

			// Generate learning checkpoints
			generateLearningCheckpoints();

			// Generate learning challenges
			generateLearningChallenges();

			// Add introduction message
			const intro: Message = {
				id: Date.now().toString(),
				role: "assistant",
				content: `Hi ${userName}! I'm your AI learning coach for "${chapterTitle}". I'll help you understand key concepts as you read through this chapter. You can ask me questions anytime, and I'll check in periodically to make sure you're understanding the material. Let's get started!`,
				timestamp: new Date(),
			};

			setMessages([intro]);
			setIsIntroduced(true);
			setIsLoading(false);

			// Get personalized suggestions
			const suggestionsResult = await getStudentSuggestions(chapterId, userId, courseId);
			if (suggestionsResult.success) {
				setAiSuggestions(suggestionsResult.suggestions);
			}
		};

		if (!isIntroduced) {
			initAICoach();
		}

		// Monitor reading progress through scroll
		const handleScroll = () => {
			if (contentRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
				const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
				setReadingProgress(Math.min(Math.round(scrollPercentage), 100));

				// Trigger AI insights when user reaches specific scroll thresholds
				if ([25, 50, 75].includes(Math.round(scrollPercentage)) && !showAIInsights) {
					triggerAIInsight(Math.round(scrollPercentage));
				}
			}
		};

		if (contentRef.current) {
			contentRef.current.addEventListener("scroll", handleScroll);
		}

		return () => {
			if (contentRef.current) {
				contentRef.current.removeEventListener("scroll", handleScroll);
			}
		};
	}, [chapterId, chapterTitle, userId, courseId, userName, isIntroduced]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Generate learning checkpoints
	const generateLearningCheckpoints = () => {
		// In a real implementation, these would be dynamically generated based on chapter content
		const sampleCheckpoints: Checkpoint[] = [
			{
				id: "1",
				title: "Understanding the Basics",
				question: "What are the primary concepts covered in this chapter?",
				isCompleted: false,
			},
			{
				id: "2",
				title: "Application of Knowledge",
				question: "How might you apply these concepts in a real-world scenario?",
				isCompleted: false,
			},
			{
				id: "3",
				title: "Critical Thinking",
				question: "What potential challenges might you encounter when implementing these concepts?",
				isCompleted: false,
			},
		];

		setCheckpoints(sampleCheckpoints);
	};

	// Generate learning challenges
	const generateLearningChallenges = () => {
		// In a real implementation, these would be dynamically generated based on chapter content
		const sampleChallenges: LearningChallenges[] = [
			{
				id: "1",
				title: "Practice Exercise",
				description: "Complete a practical exercise applying the main concepts from this chapter.",
				completed: false,
			},
			{
				id: "2",
				title: "Teach Someone Else",
				description: "Explain one key concept from this chapter to someone who hasn't read it.",
				completed: false,
			},
			{
				id: "3",
				title: "Find Real-World Examples",
				description: "Identify 2-3 real-world examples where the principles from this chapter are applied.",
				completed: false,
			},
		];

		setLearningChallenges(sampleChallenges);
	};

	// Trigger AI insight based on reading progress
	const triggerAIInsight = (progress: number) => {
		setShowAIInsights(true);

		// Determine which key point to highlight based on progress
		const keyPointIndex = Math.floor((progress / 100) * keypoints.length);
		if (keypoints[keyPointIndex]) {
			const updatedKeypoints = keypoints.map((kp, idx) => ({
				...kp,
				isHighlighted: idx === keyPointIndex,
			}));
			setKeypoints(updatedKeypoints);

			// Add a proactive message from the AI
			const insightMessage: Message = {
				id: Date.now().toString(),
				role: "assistant",
				content: `I noticed you're making good progress! Here's an important concept to focus on: "${keypoints[keyPointIndex].title}". Would you like me to explain this in more detail?`,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, insightMessage]);
		}
	};

	// Handle sending a message to the AI coach
	const handleSendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;

		// Add user message to the chat
		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: inputValue,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsLoading(true);

		try {
			// Send the message to the server and get a response
			const response = await sendMessageToCoach({
				chapterId,
				userId,
				courseId,
				message: inputValue,
				conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
				chapterTitle,
				chapterContent,
			});

			if (response.success && response.reply) {
				// Save the session ID if provided
				if (response.sessionId) {
					setSessionId(response.sessionId);
				}

				// Add the assistant's response to the chat
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: response.reply,
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, assistantMessage]);
			} else {
				// Handle error
				const errorMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: "I'm sorry, I encountered an error processing your request. Please try again.",
					timestamp: new Date(),
				};
				setMessages((prev) => [...prev, errorMessage]);

				toast({
					title: "Error",
					description: response.error || "Something went wrong",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error sending message:", error);

			// Add error message
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: "I'm sorry, I encountered an error processing your request. Please try again.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);

			toast({
				title: "Error",
				description: "Failed to communicate with AI coach",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setActiveTab("chat");
		}
	};

	// Handle video completion
	const handleVideoComplete = () => {
		setVideoWatched(true);

		// Add a message from the AI coach about the video
		const videoCompletedMessage: Message = {
			id: Date.now().toString(),
			role: "assistant",
			content: `Great job watching the video for "${chapterTitle}"! Do you have any questions about what you just watched? I'm here to help clarify any concepts.`,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, videoCompletedMessage]);
		setActiveTab("chat");
	};

	// Handle submitting a checkpoint answer
	const handleCheckpointSubmit = async () => {
		if (!activeCheckpoint || !checkpointAnswer.trim()) return;

		setIsLoading(true);

		try {
			// In a real implementation, this would be sent to the AI Coach for evaluation
			// Here we're simulating the AI response
			const aiResponse = "Great answer! You've demonstrated a solid understanding of the concept. One additional point to consider is how these principles might evolve in different contexts.";

			// Update the checkpoint
			const updatedCheckpoints = checkpoints.map((cp) => (cp.id === activeCheckpoint.id ? { ...cp, userAnswer: checkpointAnswer, aiResponse, isCompleted: true } : cp));

			setCheckpoints(updatedCheckpoints);

			// Add to messages
			const userMessage: Message = {
				id: Date.now().toString(),
				role: "user",
				content: `**Checkpoint: ${activeCheckpoint.title}**\n${checkpointAnswer}`,
				timestamp: new Date(),
			};

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				role: "assistant",
				content: aiResponse,
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, userMessage, assistantMessage]);

			// Clear active checkpoint
			setActiveCheckpoint(null);
			setCheckpointAnswer("");

			// If all checkpoints completed, show congratulations
			if (updatedCheckpoints.every((cp) => cp.isCompleted)) {
				const congratsMessage: Message = {
					id: (Date.now() + 2).toString(),
					role: "assistant",
					content: "Congratulations! You've completed all the learning checkpoints for this chapter. You've demonstrated a solid understanding of the material!",
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, congratsMessage]);
			}
		} catch (error) {
			console.error("Error processing checkpoint:", error);
			toast({
				title: "Error",
				description: "Failed to process checkpoint answer",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setActiveTab("chat");
		}
	};

	// Handle completing a learning challenge
	const handleCompleteLearningChallenge = (id: string) => {
		const updatedChallenges = learningChallenges.map((challenge) => (challenge.id === id ? { ...challenge, completed: true } : challenge));

		setLearningChallenges(updatedChallenges);

		// Add a congratulatory message
		const challengeItem = learningChallenges.find((c) => c.id === id);
		const congratsMessage: Message = {
			id: Date.now().toString(),
			role: "assistant",
			content: `Great job completing the "${challengeItem?.title}" challenge! This practical application will help reinforce what you've learned.`,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, congratsMessage]);
		setActiveTab("chat");
	};

	// Handle marking chapter as complete
	const handleMarkComplete = async () => {
		if (sessionId) {
			try {
				// End the coaching session properly
				await endCoachingSession(sessionId, userId);

				// Call the onComplete function
				onComplete();

				toast({
					title: "Chapter Completed",
					description: "Your progress has been saved and you can continue to the next chapter.",
				});
			} catch (error) {
				console.error("Error completing session:", error);

				// Still call onComplete even if there's an error
				onComplete();

				toast({
					title: "Progress Saved",
					description: "Chapter marked as complete, but there was an issue saving session data.",
				});
			}
		} else {
			// No active session, just call onComplete
			onComplete();

			toast({
				title: "Chapter Completed",
				description: "Your progress has been saved.",
			});
		}
	};

	// Handle key down events in the input field
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Format message content with basic markdown-like formatting
	const formatMessageContent = (content: string) => {
		return content.split("\n").map((line, i) => {
			if (line.startsWith("**") && line.endsWith("**")) {
				return (
					<p key={i} className="font-bold">
						{line.slice(2, -2)}
					</p>
				);
			}
			if (line.startsWith("*") && line.endsWith("*")) {
				return (
					<p key={i} className="italic">
						{line.slice(1, -1)}
					</p>
				);
			}
			return <p key={i}>{line}</p>;
		});
	};

	// Highlighting for keypoints in the content
	const highlightKeypoints = (content: string) => {
		let highlightedContent = content;

		keypoints.forEach((keypoint) => {
			if (keypoint.isHighlighted && content.includes(keypoint.title)) {
				highlightedContent = highlightedContent.replace(new RegExp(`(${keypoint.title})`, "gi"), '<span class="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">$1</span>');
			}
		});

		return highlightedContent;
	};

	return (
		<div className="flex flex-col space-y-6">
			{/* Reading progress bar */}
			<div className="sticky top-0 z-10 bg-background pb-2">
				<div className="flex justify-between items-center text-sm mb-1">
					<span>{activeTab === "content" ? "Reading Progress" : activeTab === "video" ? "Learning Progress" : "Learning Progress"}</span>
					<span>{activeTab === "content" ? `${readingProgress}%` : activeTab === "video" ? (videoWatched ? "100%" : "In progress") : `${Math.round((checkpoints.filter((cp) => cp.isCompleted).length / checkpoints.length) * 100)}%`}</span>
				</div>
				<Progress value={activeTab === "content" ? readingProgress : activeTab === "video" ? (videoWatched ? 100 : 50) : (checkpoints.filter((cp) => cp.isCompleted).length / checkpoints.length) * 100} className="h-1" />
			</div>

			{/* Main content area */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left column: Chapter content */}
				<div className="lg:col-span-2">
					<Card className="h-full">
						<Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
							<TabsList className="w-full flex border-b rounded-none bg-transparent h-12">
								{videoUrl && (
									<TabsTrigger value="video" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
										<Video className="h-4 w-4 mr-2" />
										Video Lecture
										{videoWatched && <Badge className="ml-2 bg-green-100 text-green-800">Watched</Badge>}
									</TabsTrigger>
								)}
								<TabsTrigger value="content" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
									<BookOpen className="h-4 w-4 mr-2" />
									Chapter Content
								</TabsTrigger>
								<TabsTrigger value="chat" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
									<Bot className="h-4 w-4 mr-2" />
									AI Coach
									{messages.length > 1 && <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">{messages.length}</Badge>}
								</TabsTrigger>
								<TabsTrigger value="checkpoints" className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary">
									<CheckCircle className="h-4 w-4 mr-2" />
									Checkpoints
									<Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/30">
										{checkpoints.filter((cp) => cp.isCompleted).length}/{checkpoints.length}
									</Badge>
								</TabsTrigger>
							</TabsList>

							{/* Video Tab Content */}
							{videoUrl && (
								<TabsContent value="video" className="m-0 p-0 flex-1">
									<div className="p-6">
										<VideoPlayer videoUrl={`/api/files/${videoUrl}`} title={`${chapterTitle} - Video Lecture`} onComplete={handleVideoComplete} />

										<div className="mt-6 space-y-4">
											<h3 className="text-lg font-medium">Video Summary</h3>
											<p className="text-sm text-muted-foreground">
												This video lecture provides visual demonstrations and explanations of the key concepts covered in this chapter. Watching the complete video will help reinforce your understanding before completing the learning
												checkpoints.
											</p>

											<div className="flex items-center space-x-2 text-sm">
												<Button variant="outline" size="sm" onClick={() => setActiveTab("checkpoints")} className="mt-2">
													<CheckCircle className="h-4 w-4 mr-2" />
													Go to Learning Checkpoints
												</Button>

												<Button variant="outline" size="sm" onClick={() => setActiveTab("chat")} className="mt-2">
													<Bot className="h-4 w-4 mr-2" />
													Ask AI Coach About Video
												</Button>
											</div>
										</div>
									</div>
								</TabsContent>
							)}

							<TabsContent value="content" className="m-0 p-0">
								<ScrollArea className="h-[700px]" ref={contentRef}>
									<CardContent className="p-6">
										<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: highlightKeypoints(chapterContent) }} />
									</CardContent>
								</ScrollArea>
							</TabsContent>

							<TabsContent value="chat" className={`m-0 p-0 ${activeTab == "chat" ? "flex-1" : ""} flex flex-col`}>
								{/*Classic AI*/}
								{isRealtimeAI ? (
									<>
										<RealtimeAICoach chapterId={chapterId} chapterTitle={chapterTitle} chapterContent={chapterContent} userId={userId} courseId={courseId} onComplete={onComplete} userName={userName} />
									</>
								) : (
									<>
										<CardContent className="p-6 flex-1 overflow-y-auto">
											<ScrollArea className="pr-4">
												<div className="space-y-6">
													{messages.map((message) => (
														<div key={message.id} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
															{message.role === "assistant" && (
																<Avatar className="h-8 w-8 mt-1">
																	<AvatarFallback className="bg-primary/20 text-primary">
																		<Bot className="h-4 w-4" />
																	</AvatarFallback>
																</Avatar>
															)}

															<div className={`rounded-lg p-3 max-w-[80%] break-words ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
																<div className="space-y-2">{formatMessageContent(message.content)}</div>
																<div className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
															</div>

															{message.role === "user" && (
																<Avatar className="h-8 w-8 mt-1">
																	<AvatarFallback className="bg-muted">
																		<User className="h-4 w-4" />
																	</AvatarFallback>
																</Avatar>
															)}
														</div>
													))}
													<div ref={messagesEndRef} />
												</div>
											</ScrollArea>
										</CardContent>
										<div className="p-4 border-t mt-auto">
											<div className="flex w-full items-end gap-2">
												<Textarea
													placeholder="Ask the AI coach a question..."
													value={inputValue}
													onChange={(e) => setInputValue(e.target.value)}
													onKeyDown={handleKeyDown}
													className="min-h-10 resize-none"
													rows={2}
													disabled={isLoading}
												/>
												<Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
													<Send className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</>
								)}
							</TabsContent>

							<TabsContent value="checkpoints" className="m-0 p-0">
								<ScrollArea className="h-[700px]">
									<CardContent className="p-6">
										{activeCheckpoint ? (
											<div className="space-y-4">
												<div className="flex items-center justify-between">
													<h3 className="text-lg font-semibold">{activeCheckpoint.title}</h3>
													<Button variant="ghost" size="sm" onClick={() => setActiveCheckpoint(null)}>
														Back to Checkpoints
													</Button>
												</div>

												<div className="p-4 border rounded-lg bg-muted/50">
													<p className="font-medium mb-2">{activeCheckpoint.question}</p>
													<Textarea placeholder="Type your answer here..." value={checkpointAnswer} onChange={(e) => setCheckpointAnswer(e.target.value)} className="min-h-[150px]" disabled={isLoading} />
													<Button className="mt-4 w-full" onClick={handleCheckpointSubmit} disabled={isLoading || !checkpointAnswer.trim()}>
														Submit Answer
													</Button>
												</div>
											</div>
										) : (
											<div className="space-y-6">
												<div>
													<h3 className="text-lg font-semibold mb-4">Learning Checkpoints</h3>
													<p className="text-sm text-muted-foreground mb-6">Complete these checkpoints to test your understanding of key concepts</p>

													<div className="space-y-4">
														{checkpoints.map((checkpoint) => (
															<div key={checkpoint.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-2">
																		{checkpoint.isCompleted ? <CheckCircle className="h-5 w-5 text-green-500" /> : <HelpCircle className="h-5 w-5 text-muted-foreground" />}
																		<h4 className="font-medium">{checkpoint.title}</h4>
																	</div>

																	{checkpoint.isCompleted ? (
																		<Badge className="bg-green-100 text-green-800">Completed</Badge>
																	) : (
																		<Button size="sm" variant="outline" onClick={() => setActiveCheckpoint(checkpoint)}>
																			Start
																		</Button>
																	)}
																</div>

																{checkpoint.isCompleted && checkpoint.userAnswer && (
																	<div className="mt-4 space-y-2">
																		<div className="text-sm">
																			<span className="font-medium">Your answer:</span>
																			<p className="mt-1 text-muted-foreground">{checkpoint.userAnswer}</p>
																		</div>

																		{checkpoint.aiResponse && (
																			<div className="text-sm mt-2">
																				<span className="font-medium">Coach feedback:</span>
																				<p className="mt-1 text-muted-foreground">{checkpoint.aiResponse}</p>
																			</div>
																		)}
																	</div>
																)}
															</div>
														))}
													</div>
												</div>

												<div className="pt-6 border-t">
													<h3 className="text-lg font-semibold mb-4">Learning Challenges</h3>
													<p className="text-sm text-muted-foreground mb-6">Apply what you've learned with these practical challenges</p>

													<div className="space-y-4">
														{learningChallenges.map((challenge) => (
															<div key={challenge.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
																<div className="flex items-center justify-between">
																	<div>
																		<h4 className="font-medium">{challenge.title}</h4>
																		<p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
																	</div>

																	{challenge.completed ? (
																		<Badge className="bg-green-100 text-green-800">Completed</Badge>
																	) : (
																		<Button size="sm" variant="outline" onClick={() => handleCompleteLearningChallenge(challenge.id)}>
																			Mark Complete
																		</Button>
																	)}
																</div>
															</div>
														))}
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</Card>
				</div>

				{/* Right column: Key points and insights */}
				<div className="lg:col-span-1">
					<Card className="h-full">
						<CardContent className="p-6">
							<div className="space-y-6">
								<div className="flex items-center space-x-2">
									<span className="text-sm text-muted-foreground">Voice Enabled AI</span>
									<Switch checked={isRealtimeAI} onCheckedChange={setIsRealtimeAI} />
								</div>
								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center">
										<Bot className="h-5 w-5 mr-2 text-primary" />
										AI Coach Insights
									</h3>

									<div className="space-y-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
										{keypoints.map((keypoint) => (
											<div key={keypoint.id} className={`p-4 border rounded-lg transition-all ${keypoint.isHighlighted ? "border-primary bg-primary/5" : ""}`}>
												<h4 className="font-medium">{keypoint.title}</h4>
												<p className="text-sm text-muted-foreground mt-1">{keypoint.description}</p>
											</div>
										))}
									</div>
								</div>

								<div className="pt-4 border-t">
									<h3 className="text-lg font-semibold mb-4">Personalized Suggestions</h3>

									<div className="space-y-3" style={{ maxHeight: "500px", overflowY: "auto" }}>
										{aiSuggestions.map((suggestion, index) => (
											<div key={index} className="flex items-start gap-2">
												<ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
												<p className="text-sm">{suggestion}</p>
											</div>
										))}
									</div>
								</div>

								<div className="pt-4 border-t">
									<h3 className="text-lg font-semibold mb-4">Learning Progress</h3>

									<div className="space-y-3">
										{/* Video progress */}
										{videoUrl && (
											<div className="flex justify-between items-center text-sm mb-2">
												<span>Video Lecture:</span>
												<Badge className={videoWatched ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>{videoWatched ? "Complete" : "In Progress"}</Badge>
											</div>
										)}

										{/* Reading progress */}
										<div className="flex justify-between items-center text-sm mb-2">
											<span>Chapter Reading:</span>
											<Badge className={readingProgress >= 90 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>{readingProgress >= 90 ? "Complete" : readingProgress > 0 ? `${readingProgress}%` : "Not Started"}</Badge>
										</div>

										{/* Checkpoints progress */}
										<div className="flex justify-between items-center text-sm mb-2">
											<span>Checkpoints:</span>
											<Badge className={checkpoints.every((cp) => cp.isCompleted) ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
												{checkpoints.filter((cp) => cp.isCompleted).length}/{checkpoints.length}
											</Badge>
										</div>
									</div>
								</div>

								<div className="pt-4 border-t">
									<h3 className="text-lg font-semibold mb-4">Feedback</h3>
									<p className="text-sm text-muted-foreground mb-4">Was the AI coach helpful with this chapter?</p>

									<div className="flex gap-2">
										<Button variant="outline" className="flex-1">
											<ThumbsUp className="h-4 w-4 mr-2" />
											Helpful
										</Button>
										<Button variant="outline" className="flex-1">
											<ThumbsDown className="h-4 w-4 mr-2" />
											Not Helpful
										</Button>
									</div>
								</div>

								<div className="pt-4 border-t">
									<Button className="w-full" onClick={handleMarkComplete} disabled={!((videoUrl ? videoWatched : true) && checkpoints.every((cp) => cp.isCompleted))}>
										<CheckCircle className="h-4 w-4 mr-2" />
										{(videoUrl ? videoWatched : true) && checkpoints.every((cp) => cp.isCompleted) ? "Mark Chapter as Completed" : videoUrl && !videoWatched ? "Watch Video First" : "Complete All Checkpoints First"}
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
