import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Brain, RotateCcw, Shuffle, Grid3X3, Maximize2, Minimize2, BookOpen, Zap, Eye, Clock } from "lucide-react";

export interface StackableWidget {
	id: string;
	type: "quiz" | "notes" | "custom";
	title: string;
	component: React.ReactNode;
	priority?: "low" | "medium" | "high" | "critical";
	timestamp: Date;
	completed?: boolean;
	interacted?: boolean;
	aiPersonality?: "warm" | "encouraging" | "playful";
}

interface AIWidgetStackProps {
	widgets: StackableWidget[];
	onWidgetComplete?: (widgetId: string) => void;
	onWidgetInteraction?: (widgetId: string, interaction: string) => void;
	className?: string;
	stackMode?: "cards" | "carousel" | "deck" | "timeline";
	aiCoachMode?: boolean;
	autoProgress?: boolean;
	maxVisible?: number;
}

export function AIWidgetStack({ widgets, onWidgetComplete, onWidgetInteraction, className = "", stackMode = "cards", aiCoachMode = true, autoProgress = false, maxVisible = 3 }: AIWidgetStackProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [stackOrder, setStackOrder] = useState<string[]>(widgets.map((w) => w.id));
	const [expandedMode, setExpandedMode] = useState(false);
	const [shuffleAnimation, setShuffleAnimation] = useState(false);
	const [viewMode, setViewMode] = useState<"focus" | "overview" | "grid">("focus");
	const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

	const containerRef = useRef<HTMLDivElement>(null);
	const currentWidget = widgets[currentIndex];

	// Update drag constraints based on container size
	useEffect(() => {
		if (containerRef.current) {
			const width = containerRef.current.offsetWidth;
			setDragConstraints({ left: -width / 2, right: width / 2 });
		}
	}, []);

	// Auto-progress functionality
	useEffect(() => {
		if (!autoProgress || widgets.length <= 1) return;

		const timer = setInterval(() => {
			if (currentWidget?.completed) {
				handleNext();
			}
		}, 3000);

		return () => clearInterval(timer);
	}, [currentIndex, currentWidget?.completed, autoProgress]);

	const handleNext = () => {
		if (currentIndex < widgets.length - 1) {
			setCurrentIndex((prev) => prev + 1);
			onWidgetInteraction?.(widgets[currentIndex + 1]?.id, "navigate_next");
		}
	};

	const handlePrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex((prev) => prev - 1);
			onWidgetInteraction?.(widgets[currentIndex - 1]?.id, "navigate_previous");
		}
	};

	const handleShuffle = () => {
		setShuffleAnimation(true);
		setTimeout(() => {
			const remainingWidgets = widgets.slice(currentIndex + 1);
			const shuffled = [...remainingWidgets].sort(() => Math.random() - 0.5);
			const newOrder = [...widgets.slice(0, currentIndex + 1).map((w) => w.id), ...shuffled.map((w) => w.id)];
			setStackOrder(newOrder);
			setShuffleAnimation(false);
			onWidgetInteraction?.("stack", "shuffle");
		}, 500);
	};

	const handleWidgetSelect = (index: number) => {
		setCurrentIndex(index);
		onWidgetInteraction?.(widgets[index]?.id, "direct_select");
	};

	const handleSwipeComplete = (direction: "left" | "right") => {
		if (direction === "left" && currentIndex < widgets.length - 1) {
			handleNext();
		} else if (direction === "right" && currentIndex > 0) {
			handlePrevious();
		}
	};

	const getWidgetIcon = (type: string) => {
		switch (type) {
			case "quiz":
				return Zap;
			case "notes":
				return BookOpen;
			default:
				return Brain;
		}
	};

	const getPriorityColor = (priority?: string) => {
		switch (priority) {
			case "critical":
				return "bg-red-500 shadow-red-500/30";
			case "high":
				return "bg-amber-500 shadow-amber-500/30";
			case "medium":
				return "bg-blue-500 shadow-blue-500/30";
			default:
				return "bg-slate-500 shadow-slate-500/30";
		}
	};

	const getPersonalityGradient = (personality?: string) => {
		switch (personality) {
			case "encouraging":
				return "from-green-500/10 to-emerald-500/10";
			case "playful":
				return "from-purple-500/10 to-pink-500/10";
			default:
				return "from-blue-500/10 to-indigo-500/10";
		}
	};

	// Card stack mode rendering
	if (stackMode === "cards") {
		return (
			<div className={`relative w-full ${className}`} ref={containerRef}>
				{/* AI Coach Header */}
				{aiCoachMode && (
					<motion.div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
						<div className="flex items-center gap-3">
							<div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg">
								<Brain className="w-5 h-5 text-white" />
							</div>
							<div>
								<h3 className="font-semibold text-slate-800">AI Learning Stack</h3>
								<p className="text-sm text-blue-600">
									{currentIndex + 1} of {widgets.length} activities
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2">
							{/* View mode toggle */}
							<motion.button
								className="p-2 rounded-lg bg-white/60 hover:bg-white/80 text-slate-600 hover:text-slate-800 transition-all"
								onClick={() => setViewMode(viewMode === "grid" ? "focus" : "grid")}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{viewMode === "grid" ? <Minimize2 className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
							</motion.button>

							{/* Shuffle button */}
							<motion.button
								className="p-2 rounded-lg bg-white/60 hover:bg-white/80 text-slate-600 hover:text-slate-800 transition-all"
								onClick={handleShuffle}
								disabled={widgets.length <= 1}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95, rotate: 180 }}
							>
								<Shuffle className="w-4 h-4" />
							</motion.button>
						</div>
					</motion.div>
				)}

				{/* Grid View */}
				{viewMode === "grid" && (
					<motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
						{widgets.map((widget, index) => {
							const WidgetIcon = getWidgetIcon(widget.type);
							return (
								<motion.button
									key={widget.id}
									className={`
                    relative p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${index === currentIndex ? "border-blue-500 bg-blue-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}
                  `}
									onClick={() => {
										handleWidgetSelect(index);
										setViewMode("focus");
									}}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className="flex items-center gap-3 mb-2">
										<div className={`p-2 rounded-lg ${getPriorityColor(widget.priority)}`}>
											<WidgetIcon className="w-4 h-4 text-white" />
										</div>
										<span className="text-sm font-semibold text-slate-800">{widget.title}</span>
									</div>

									<div className="flex items-center justify-between text-xs text-slate-500">
										<span className="capitalize">{widget.type}</span>
										{widget.completed && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
									</div>
								</motion.button>
							);
						})}
					</motion.div>
				)}

				{/* Main Stack Container */}
				{viewMode !== "grid" && (
					<div className="relative h-[600px] perspective-1000">
						<AnimatePresence mode="wait">
							{widgets.map((widget, index) => {
								const offset = index - currentIndex;
								const isVisible = Math.abs(offset) <= maxVisible;

								if (!isVisible) return null;

								return (
									<motion.div
										key={widget.id}
										className={`
                      absolute inset-0 cursor-pointer
                      ${Math.abs(offset) === 0 ? "z-30" : `z-${30 - Math.abs(offset)}`}
                    `}
										initial={{ opacity: 0, scale: 0.8, y: 50 }}
										animate={{
											opacity: Math.abs(offset) === 0 ? 1 : 0.6 - Math.abs(offset) * 0.2,
											scale: 1 - Math.abs(offset) * 0.05,
											y: offset * 20,
											x: offset * 30,
											rotateY: offset * 10,
											transformOrigin: "center center",
										}}
										exit={{ opacity: 0, scale: 0.8, y: 50 }}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
										drag={Math.abs(offset) === 0 ? "x" : false}
										dragConstraints={dragConstraints}
										dragElastic={0.2}
										onDragEnd={(event, info: PanInfo) => {
											const threshold = 100;
											if (info.offset.x > threshold) {
												handleSwipeComplete("right");
											} else if (info.offset.x < -threshold) {
												handleSwipeComplete("left");
											}
										}}
										whileHover={Math.abs(offset) === 0 ? { scale: 1.02 } : undefined}
										onClick={() => {
											if (Math.abs(offset) !== 0) {
												handleWidgetSelect(index);
											}
										}}
									>
										<div
											className={`
                      h-full rounded-2xl border-2 shadow-xl overflow-hidden
                      bg-gradient-to-br ${getPersonalityGradient(widget.aiPersonality)}
                      ${Math.abs(offset) === 0 ? "border-blue-300 shadow-2xl" : "border-slate-200 shadow-lg"}
                    `}
										>
											{/* Widget Header */}
											<div
												className={`
                        p-4 border-b border-slate-200/50 
                        bg-gradient-to-r from-white/80 to-slate-50/80 backdrop-blur-sm
                      `}
											>
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-3">
														<div className={`p-2 rounded-lg shadow-lg ${getPriorityColor(widget.priority)}`}>
															{React.createElement(getWidgetIcon(widget.type), {
																className: "w-4 h-4 text-white",
															})}
														</div>
														<div>
															<h3 className="font-semibold text-slate-800">{widget.title}</h3>
															<p className="text-xs text-slate-500 capitalize">{widget.type} Widget</p>
														</div>
													</div>

													<div className="flex items-center gap-2">
														{widget.completed && <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>}
														<span className="text-xs text-slate-500">
															{index + 1}/{widgets.length}
														</span>
													</div>
												</div>
											</div>

											{/* Widget Content */}
											<div className="h-full p-6 overflow-auto">{widget.component}</div>
										</div>

										{/* Stack indicator for background cards */}
										{Math.abs(offset) > 0 && <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-2xl pointer-events-none" />}
									</motion.div>
								);
							})}
						</AnimatePresence>

						{/* Navigation Controls */}
						<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-40">
							<motion.button
								className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={handlePrevious}
								disabled={currentIndex === 0}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<ChevronLeft className="w-5 h-5 text-slate-700" />
							</motion.button>

							{/* Progress indicators */}
							<div className="flex gap-2">
								{widgets.map((widget, index) => (
									<motion.button
										key={widget.id}
										className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentIndex ? "bg-blue-600 shadow-lg" : widget.completed ? "bg-green-500" : "bg-slate-300 hover:bg-slate-400"}`}
										onClick={() => handleWidgetSelect(index)}
										whileHover={{ scale: 1.2 }}
										whileTap={{ scale: 0.9 }}
									/>
								))}
							</div>

							<motion.button
								className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={handleNext}
								disabled={currentIndex === widgets.length - 1}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<ChevronRight className="w-5 h-5 text-slate-700" />
							</motion.button>
						</div>

						{/* Quick actions */}
						<div className="absolute top-6 right-6 flex flex-col gap-2 z-40">
							<motion.button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200" onClick={() => setExpandedMode(!expandedMode)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								{expandedMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
							</motion.button>

							<motion.button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200" onClick={() => onWidgetInteraction?.(currentWidget?.id, "reset")} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								<RotateCcw className="w-4 h-4" />
							</motion.button>
						</div>
					</div>
				)}

				{/* Stack Summary Footer */}
				<motion.div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Layers className="w-4 h-4 text-slate-600" />
								<span className="text-sm text-slate-600">{widgets.filter((w) => w.completed).length} completed</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-slate-600" />
								<span className="text-sm text-slate-600">{widgets.length - widgets.filter((w) => w.completed).length} remaining</span>
							</div>
						</div>

						<div className="text-xs text-slate-500">Swipe or use arrows to navigate</div>
					</div>
				</motion.div>
			</div>
		);
	}

	// Other stack modes can be implemented here (carousel, deck, timeline)
	return null;
}
