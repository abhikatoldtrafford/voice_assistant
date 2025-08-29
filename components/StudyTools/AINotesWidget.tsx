import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Eye, Lightbulb, Zap, Star, BookOpen, PenTool, Bookmark, Target } from "lucide-react";

interface NoteContent {
	id: string;
	type: "heading" | "term" | "equation" | "concept" | "highlight" | "tip";
	content: string;
	subtext?: string;
	explanation?: string;
	importance?: "low" | "medium" | "high" | "critical";
	category?: string;
}

interface AINotesWidgetProps {
	notes: NoteContent[];
	title?: string;
	aiPersonality?: "warm" | "encouraging" | "playful";
	variant?: "spotlight" | "notebook" | "flashcard" | "bulletin";
	interactive?: boolean;
	autoReveal?: boolean;
	className?: string;
	onNoteInteraction?: (note: NoteContent, action: "view" | "expand" | "bookmark") => void;
}

export function AINotesWidget({ notes, title = "Key Concepts", aiPersonality = "warm", variant = "spotlight", interactive = true, autoReveal = false, className = "", onNoteInteraction }: AINotesWidgetProps) {
	const [revealedNotes, setRevealedNotes] = useState<string[]>(autoReveal ? notes.map((n) => n.id) : []);
	const [expandedNotes, setExpandedNotes] = useState<string[]>([]);
	const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>([]);
	const [currentSpotlight, setCurrentSpotlight] = useState(0);

	// Auto-reveal notes with staggered animation
	useEffect(() => {
		if (autoReveal) return;

		const timer = setTimeout(() => {
			notes.forEach((_, index) => {
				setTimeout(() => {
					setRevealedNotes((prev) => [...prev, notes[index].id]);
				}, index * 800);
			});
		}, 500);

		return () => clearTimeout(timer);
	}, [notes, autoReveal]);

	// Auto-cycle spotlight variant
	useEffect(() => {
		if (variant === "spotlight" && notes.length > 1) {
			const interval = setInterval(() => {
				setCurrentSpotlight((prev) => (prev + 1) % notes.length);
			}, 4000);
			return () => clearInterval(interval);
		}
	}, [variant, notes.length]);

	const getPersonalityConfig = () => {
		switch (aiPersonality) {
			case "encouraging":
				return {
					colors: {
						primary: "from-green-500 to-emerald-600",
						secondary: "from-green-50 to-emerald-50",
						accent: "text-green-600",
						glow: "shadow-green-500/20",
					},
					icon: Lightbulb,
					message: "You're making great progress!",
				};
			case "playful":
				return {
					colors: {
						primary: "from-purple-500 to-pink-500",
						secondary: "from-purple-50 to-pink-50",
						accent: "text-purple-600",
						glow: "shadow-purple-500/20",
					},
					icon: Star,
					message: "Let's explore these exciting concepts!",
				};
			default:
				return {
					colors: {
						primary: "from-blue-600 to-indigo-600",
						secondary: "from-blue-50 to-indigo-50",
						accent: "text-blue-600",
						glow: "shadow-blue-500/20",
					},
					icon: Brain,
					message: "Here are some important insights for you",
				};
		}
	};

	const getTypeConfig = (type: NoteContent["type"]) => {
		const configs = {
			heading: { icon: BookOpen, color: "text-slate-700", bg: "bg-slate-100" },
			term: { icon: Target, color: "text-blue-700", bg: "bg-blue-100" },
			equation: { icon: Zap, color: "text-purple-700", bg: "bg-purple-100" },
			concept: { icon: Lightbulb, color: "text-amber-700", bg: "bg-amber-100" },
			highlight: { icon: Eye, color: "text-red-700", bg: "bg-red-100" },
			tip: { icon: PenTool, color: "text-green-700", bg: "bg-green-100" },
		};
		return configs[type];
	};

	const getImportanceStyles = (importance: NoteContent["importance"]) => {
		switch (importance) {
			case "critical":
				return "border-red-300 bg-gradient-to-r from-red-50 to-orange-50 shadow-lg";
			case "high":
				return "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-md";
			case "medium":
				return "border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50";
			default:
				return "border-slate-300 bg-gradient-to-r from-slate-50 to-gray-50";
		}
	};

	const handleNoteClick = (note: NoteContent) => {
		if (!interactive) return;

		const isExpanded = expandedNotes.includes(note.id);
		setExpandedNotes((prev) => (isExpanded ? prev.filter((id) => id !== note.id) : [...prev, note.id]));

		onNoteInteraction?.(note, isExpanded ? "view" : "expand");
	};

	const handleBookmark = (note: NoteContent, e: React.MouseEvent) => {
		e.stopPropagation();
		const isBookmarked = bookmarkedNotes.includes(note.id);
		setBookmarkedNotes((prev) => (isBookmarked ? prev.filter((id) => id !== note.id) : [...prev, note.id]));

		onNoteInteraction?.(note, "bookmark");
	};

	const personalityConfig = getPersonalityConfig();
	const PersonalityIcon = personalityConfig.icon;

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
				staggerChildren: 0.2,
			},
		},
	};

	const noteVariants = {
		hidden: { opacity: 0, scale: 0.8, y: 20 },
		visible: {
			opacity: 1,
			scale: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 25,
			},
		},
		hover: {
			scale: 1.02,
			y: -2,
			transition: {
				type: "spring",
				stiffness: 400,
				damping: 25,
			},
		},
	};

	if (variant === "spotlight") {
		return (
			<motion.div className={`relative w-full max-w-4xl mx-auto ${className}`} variants={containerVariants} initial="hidden" animate="visible">
				{/* AI Header */}
				<motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
					<div className={`relative p-4 rounded-2xl bg-gradient-to-r ${personalityConfig.colors.primary} ${personalityConfig.colors.glow} shadow-xl`}>
						<PersonalityIcon className="w-6 h-6 text-white" />
						<motion.div
							className="absolute -top-2 -right-2"
							animate={{
								scale: [1, 1.3, 1],
								rotate: [0, 15, -15, 0],
							}}
							transition={{
								duration: 3,
								repeat: Infinity,
								repeatType: "reverse",
							}}
						>
							<Sparkles className="w-5 h-5 text-yellow-400" />
						</motion.div>
					</div>
					<div>
						<h2 className="text-2xl font-bold text-slate-300 font-heading">{title}</h2>
						<p className={`${personalityConfig.colors.accent} font-medium`}>{personalityConfig.message}</p>
					</div>
				</motion.div>

				{/* Spotlight Container */}
				<div className="relative h-96 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden shadow-2xl">
					{/* Background effects */}
					<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-subtle" />

					{/* Spotlight beam */}
					<motion.div
						className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-radial from-white/20 via-white/5 to-transparent rounded-full blur-xl"
						animate={{
							scale: [1, 1.1, 1],
							opacity: [0.3, 0.6, 0.3],
						}}
						transition={{
							duration: 4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						style={{
							transformOrigin: "center top",
							transform: "translateX(-50%)",
						}}
					/>

					{/* Notes carousel */}
					<div className="relative h-full flex items-center justify-center p-12">
						<AnimatePresence mode="wait">
							{notes.map((note, index) => {
								if (index !== currentSpotlight) return null;

								const typeConfig = getTypeConfig(note.type);

								return (
									<motion.div
										key={note.id}
										className="text-center max-w-2xl"
										initial={{ opacity: 0, y: 30, scale: 0.8 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -30, scale: 0.8 }}
										transition={{ duration: 0.8, ease: "easeOut" }}
									>
										{/* Type indicator */}
										<motion.div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${typeConfig.bg} mb-6`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
											<typeConfig.icon className={`w-4 h-4 ${typeConfig.color}`} />
											<span className={`text-sm font-semibold ${typeConfig.color} capitalize`}>{note.type}</span>
										</motion.div>

										{/* Main content */}
										<motion.h3 className="text-4xl font-bold text-white mb-4 font-heading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
											{note.content}
										</motion.h3>

										{note.subtext && (
											<motion.p className="text-xl text-blue-200 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
												{note.subtext}
											</motion.p>
										)}

										{note.explanation && (
											<motion.div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
												<p className="text-white/90 leading-relaxed">{note.explanation}</p>
											</motion.div>
										)}
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					{/* Progress indicators */}
					<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
						{notes.map((_, index) => (
							<motion.button
								key={index}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSpotlight ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"}`}
								onClick={() => setCurrentSpotlight(index)}
								whileHover={{ scale: 1.2 }}
								whileTap={{ scale: 0.9 }}
							/>
						))}
					</div>
				</div>
			</motion.div>
		);
	}

	// Default grid layout for other variants
	return (
		<motion.div className={`relative w-full max-w-6xl mx-auto ${className}`} variants={containerVariants} initial="hidden" animate="visible">
			{/* AI Header */}
			<motion.div className="flex items-center gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
				<div className={`relative p-3 rounded-xl bg-gradient-to-r ${personalityConfig.colors.primary} ${personalityConfig.colors.glow} shadow-lg`}>
					<PersonalityIcon className="w-5 h-5 text-white" />
					<motion.div
						className="absolute -top-1 -right-1"
						animate={{
							scale: [1, 1.2, 1],
							rotate: [0, 10, -10, 0],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					>
						<Sparkles className="w-4 h-4 text-yellow-400" />
					</motion.div>
				</div>
				<div>
					<h2 className="text-xl font-semibold text-slate-400 font-heading">{title}</h2>
					<p className={`text-sm ${personalityConfig.colors.accent} font-medium`}>{personalityConfig.message}</p>
				</div>
			</motion.div>

			{/* Notes Grid */}
			<div className={`grid gap-6 max-h-[20vh] overflow-y-auto rounded-xl ${variant === "flashcard" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 lg:grid-cols-2"}`}>
				{notes.map((note, index) => {
					const isRevealed = revealedNotes.includes(note.id);
					const isExpanded = expandedNotes.includes(note.id);
					const isBookmarked = bookmarkedNotes.includes(note.id);
					const typeConfig = getTypeConfig(note.type);

					return (
						<AnimatePresence key={note.id}>
							{isRevealed && (
								<motion.div
									className={`
                    relative group cursor-pointer border-2 rounded-2xl p-6
                    ${getImportanceStyles(note.importance)}
                    ${interactive ? "hover:shadow-xl" : ""}
                    transition-all duration-300
                  `}
									variants={noteVariants}
									whileHover={interactive ? "hover" : undefined}
									onClick={() => handleNoteClick(note)}
									layout
								>
									{/* Importance indicator */}
									{note.importance === "critical" && (
										<motion.div
											className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
											animate={{
												scale: [1, 1.2, 1],
												boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.7)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
											}}
										>
											<Zap className="w-3 h-3 text-white" />
										</motion.div>
									)}

									{/* Bookmark button */}
									{interactive && (
										<motion.button
											className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${isBookmarked ? "bg-yellow-100 text-yellow-600" : "bg-slate-100 text-slate-400 hover:text-slate-600"}`}
											onClick={(e) => handleBookmark(note, e)}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
										>
											<Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
										</motion.button>
									)}

									{/* Type indicator */}
									<div className="flex items-center gap-3 mb-4">
										<div className={`p-2 rounded-lg ${typeConfig.bg}`}>
											<typeConfig.icon className={`w-5 h-5 ${typeConfig.color}`} />
										</div>
										<div>
											<span className={`text-sm font-semibold ${typeConfig.color} capitalize`}>{note.type}</span>
											{note.category && <span className="text-xs text-slate-500 ml-2">{note.category}</span>}
										</div>
									</div>

									{/* Content */}
									<div className="space-y-3">
										<h3 className="text-lg font-bold text-slate-800 font-heading leading-tight">{note.content}</h3>

										{note.subtext && <p className="text-slate-600 font-medium">{note.subtext}</p>}

										{/* Expandable explanation */}
										<AnimatePresence>
											{note.explanation && isExpanded && (
												<motion.div className="pt-4 border-t border-slate-200" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
													<p className="text-slate-700 leading-relaxed text-sm">{note.explanation}</p>
												</motion.div>
											)}
										</AnimatePresence>

										{/* Expand indicator */}
										{interactive && note.explanation && (
											<div className="flex items-center justify-between pt-2">
												<span className="text-xs text-slate-500">{isExpanded ? "Click to collapse" : "Click to learn more"}</span>
												<motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
													<Eye className="w-4 h-4 text-slate-400" />
												</motion.div>
											</div>
										)}
									</div>

									{/* Hover gradient effect */}
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />
								</motion.div>
							)}
						</AnimatePresence>
					);
				})}
			</div>
		</motion.div>
	);
}
