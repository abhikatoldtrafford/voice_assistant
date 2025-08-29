import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, CheckCircle2, ArrowRight, Send } from "lucide-react";

export interface QuizOption {
	id: string;
	text: string;
	isCorrect?: boolean;
	explanation?: string;
}

export interface QuizWidgetProps {
	question: string;
	options: QuizOption[];
	onSubmit: (selectedOptions: QuizOption[]) => void;
	showCorrectAnswer?: boolean;
	aiPersonality?: "warm" | "encouraging" | "playful";
	variant?: "default" | "quiz" | "assessment";
	multiSelect?: boolean;
	className?: string;
	submitButtonText?: string;
}

export function QuizWidget({ question, options, onSubmit, showCorrectAnswer = false, aiPersonality = "warm", variant = "default", multiSelect = false, className = "", submitButtonText = "Submit Answer" }: QuizWidgetProps) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [isThinking, setIsThinking] = useState(false);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
				staggerChildren: 0.1,
			},
		},
	};

	const optionVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.4, ease: "easeOut" },
		},
		selected: {
			scale: 1.02,
			transition: { duration: 0.2, ease: "easeInOut" },
		},
		correct: {
			backgroundColor: "hsl(142, 76%, 36%)",
			borderColor: "hsl(142, 76%, 36%)",
			color: "white",
			transition: { duration: 0.3 },
		},
		incorrect: {
			backgroundColor: "hsl(0, 84%, 60%)",
			borderColor: "hsl(0, 84%, 60%)",
			color: "white",
			transition: { duration: 0.3 },
		},
	};

	const handleOptionSelect = (option: QuizOption) => {
		if (isSubmitted) return;

		setIsThinking(true);

		setTimeout(() => {
			if (multiSelect) {
				const isSelected = selectedOptions.includes(option.id);
				const newSelected = isSelected ? selectedOptions.filter((id) => id !== option.id) : [...selectedOptions, option.id];
				setSelectedOptions(newSelected);
			} else {
				setSelectedOptions([option.id]);
			}

			setIsThinking(false);
		}, 300);
	};

	const handleSubmit = () => {
		if (selectedOptions.length === 0) return;

		const selectedQuizOptions = selectedOptions.map((id) => options.find((option) => option.id === id)!);

		setIsSubmitted(true);
		onSubmit(selectedQuizOptions);

		if (showCorrectAnswer) {
			setTimeout(() => setShowFeedback(true), 500);
		}
	};

	const getPersonalityColors = () => {
		switch (aiPersonality) {
			case "encouraging":
				return {
					primary: "from-green-500 to-emerald-600",
					glow: "shadow-green-500/20",
					accent: "text-green-600",
				};
			case "playful":
				return {
					primary: "from-purple-500 to-pink-500",
					glow: "shadow-purple-500/20",
					accent: "text-purple-600",
				};
			default:
				return {
					primary: "from-blue-600 to-indigo-600",
					glow: "shadow-blue-500/20",
					accent: "text-blue-600",
				};
		}
	};

	const personalityColors = getPersonalityColors();

	const getVariantStyles = () => {
		switch (variant) {
			case "quiz":
				return "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200";
			case "assessment":
				return "bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200";
			default:
				return "bg-gradient-to-br from-white to-blue-50/30 border-blue-100";
		}
	};

	return (
		<motion.div className={`relative w-full max-w-2xl mx-auto ${className}`} variants={containerVariants} initial="hidden" animate="visible">
			{/* AI Personality Indicator */}
			<motion.div className="flex items-center gap-3 mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
				<div className={`relative p-3 rounded-xl bg-gradient-to-r ${personalityColors.primary} ${personalityColors.glow} shadow-lg`}>
					<Brain className="w-5 h-5 text-white" />
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
					<h3 className="font-semibold text-slate-800 font-heading"> Your AI Tutor </h3>
					<p className={`text-sm ${personalityColors.accent} font-medium`}>
						{aiPersonality === "warm" && "Ready to help you learn!"}
						{aiPersonality === "encouraging" && "You've got this!"}
						{aiPersonality === "playful" && "Let's make learning fun!"}
					</p>
				</div>
			</motion.div>

			{/* Question Container */}
			<motion.div className={`relative p-8 rounded-2xl border-2 ${getVariantStyles()} backdrop-blur-sm`} variants={optionVariants}>
				{/* Ambient glow effect */}
				{/* <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse-subtle" /> */}

				{/* Question Text */}
				<motion.div className="relative mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
					<h2 className="text-xl font-semibold text-slate-800 leading-relaxed font-heading mb-2">{question}</h2>
					<div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
				</motion.div>

				{/* Options */}
				<motion.div className="space-y-3">
					{options.map((option, index) => {
						const isSelected = selectedOptions.includes(option.id);
						const showResult = showCorrectAnswer && isSubmitted;
						const isCorrect = option.isCorrect;
						const isIncorrect = showResult && isSelected && !isCorrect;

						return (
							<motion.button
								key={option.id}
								className={`
                  group relative w-full p-4 rounded-xl border-2 transition-all duration-300 
                  text-left font-medium hover:shadow-lg hover:scale-[1.01]
                  ${isSelected && !showResult ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300"}
                  ${showResult && isCorrect ? "border-green-500 bg-green-50 text-green-700" : ""}
                  ${isIncorrect ? "border-red-500 bg-red-50 text-red-700" : ""}
                  ${isSubmitted ? "cursor-default" : "cursor-pointer"}
                `}
								onClick={() => handleOptionSelect(option)}
								disabled={isSubmitted}
								variants={optionVariants}
								whileHover={!isSubmitted ? "selected" : undefined}
								whileTap={!isSubmitted ? { scale: 0.98 } : undefined}
							>
								{/* Selection indicator */}
								<div className="flex items-center gap-4">
									<div
										className={`
                    flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300 group-hover:border-slate-400"}
                    ${showResult && isCorrect ? "border-green-500 bg-green-500" : ""}
                    ${isIncorrect ? "border-red-500 bg-red-500" : ""}
                  `}
									>
										{(isSelected || (showResult && isCorrect)) && (
											<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}>
												<CheckCircle2 className="w-4 h-4 text-white" />
											</motion.div>
										)}
									</div>

									<span className="flex-1 text-base">{option.text}</span>

									{/* AI thinking indicator */}
									<AnimatePresence>
										{isThinking && isSelected && (
											<motion.div className="flex-shrink-0" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
												<div className="flex space-x-1">
													{[0, 1, 2].map((i) => (
														<motion.div
															key={i}
															className="w-2 h-2 bg-blue-500 rounded-full"
															animate={{
																y: [0, -8, 0],
																opacity: [0.5, 1, 0.5],
															}}
															transition={{
																duration: 0.6,
																repeat: Infinity,
																delay: i * 0.1,
															}}
														/>
													))}
												</div>
											</motion.div>
										)}
									</AnimatePresence>

									{/* Arrow indicator for selection */}
									{isSelected && !isThinking && (
										<motion.div className="flex-shrink-0" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
											<ArrowRight className="w-5 h-5 text-blue-600" />
										</motion.div>
									)}
								</div>

								{/* Hover gradient effect */}
								<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300" />
							</motion.button>
						);
					})}
				</motion.div>

				{/* Submit Button */}
				<AnimatePresence>
					{selectedOptions.length > 0 && !isSubmitted && (
						<motion.div className="mt-6 flex justify-center" initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -20, height: 0 }} transition={{ duration: 0.3 }}>
							<motion.button
								className={`
									px-8 py-3 rounded-xl font-semibold text-white
									bg-gradient-to-r ${personalityColors.primary}
									shadow-lg ${personalityColors.glow}
									hover:shadow-xl hover:scale-105
									transition-all duration-200
									flex items-center gap-2
								`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleSubmit}
							>
								<Send className="w-4 h-4" />
								{submitButtonText}
								{multiSelect && selectedOptions.length > 1 && ` (${selectedOptions.length})`}
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Feedback Section */}
				<AnimatePresence>
					{showFeedback && showCorrectAnswer && (
						<motion.div
							className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
							initial={{ opacity: 0, y: 20, height: 0 }}
							animate={{ opacity: 1, y: 0, height: "auto" }}
							exit={{ opacity: 0, y: -20, height: 0 }}
							transition={{ duration: 0.4 }}
						>
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0 p-2 rounded-lg bg-blue-100">
									<Brain className="w-5 h-5 text-blue-600" />
								</div>
								<div>
									<h4 className="font-semibold text-blue-800 mb-2"> AI Tutor Feedback </h4>
									{options.find((opt) => opt.isCorrect)?.explanation && <p className="text-blue-700 text-sm leading-relaxed">{options.find((opt) => opt.isCorrect)?.explanation}</p>}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}
