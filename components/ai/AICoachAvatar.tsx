"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, Brain, Heart, Zap, Sparkles } from "lucide-react";

interface AICoachAvatarProps {
	size?: "sm" | "md" | "lg" | "xl";
	mood?: "thinking" | "happy" | "encouraging" | "focused" | "celebrating";
	isActive?: boolean;
	isTyping?: boolean;
	personality?: "warm" | "energetic" | "focused" | "wise";
	className?: string;
	onClick?: () => void;
}

const AICoachAvatar: React.FC<AICoachAvatarProps> = ({ size = "md", mood = "happy", isActive = false, isTyping = false, personality = "warm", className, onClick }) => {
	const [isHovered, setIsHovered] = useState(false);

	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16",
		xl: "w-24 h-24",
	};

	const getAvatarColors = () => {
		switch (personality) {
			case "warm":
				return {
					primary: "from-orange-400 to-pink-500",
					secondary: "from-pink-300 to-orange-300",
					glow: "shadow-orange-500/30",
				};
			case "energetic":
				return {
					primary: "from-blue-400 to-purple-600",
					secondary: "from-purple-300 to-blue-300",
					glow: "shadow-purple-500/30",
				};
			case "focused":
				return {
					primary: "from-slate-600 to-blue-700",
					secondary: "from-blue-300 to-slate-300",
					glow: "shadow-blue-500/30",
				};
			default:
				return {
					primary: "from-blue-400 to-purple-600",
					secondary: "from-purple-300 to-blue-300",
					glow: "shadow-purple-500/30",
				};
		}
	};

	const getMoodIcon = () => {
		switch (mood) {
			case "thinking":
				return <Brain className="w-1/2 h-1/2" />;
			case "happy":
				return <Heart className="w-1/2 h-1/2" />;
			case "encouraging":
				return <Zap className="w-1/2 h-1/2" />;
			case "focused":
				return <Bot className="w-1/2 h-1/2" />;
			case "celebrating":
				return <Sparkles className="w-1/2 h-1/2" />;
			default:
				return <Bot className="w-1/2 h-1/2" />;
		}
	};

	const colors = getAvatarColors();

	return (
		<motion.div className={cn("relative cursor-pointer", sizeClasses[size], className)} onClick={onClick} onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
			{/* Main Avatar Circle */}
			<motion.div
				className={cn("relative w-full h-full rounded-full flex items-center justify-center text-white", `bg-gradient-to-br ${colors.primary}`, isActive && "animate-pulse-subtle", isHovered && `shadow-lg ${colors.glow}`)}
				animate={{
					boxShadow: isActive ? ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 10px rgba(168, 85, 247, 0)", "0 0 0 0 rgba(168, 85, 247, 0)"] : "0 0 0 0 rgba(168, 85, 247, 0)",
				}}
				transition={{
					duration: 2,
					repeat: isActive ? Infinity : 0,
					ease: "easeInOut",
				}}
			>
				{getMoodIcon()}

				{/* Thinking dots when typing */}
				<AnimatePresence>
					{isTyping && (
						<motion.div className="absolute -bottom-1 -right-1 flex space-x-0.5" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className="w-1 h-1 bg-white rounded-full"
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
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Activity Ring */}
			<AnimatePresence>
				{isActive && (
					<motion.div
						className={cn("absolute inset-0 rounded-full border-2", `border-gradient-to-r ${colors.secondary}`)}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1.2, opacity: [0, 1, 0] }}
						exit={{ scale: 1.4, opacity: 0 }}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeOut",
						}}
					/>
				)}
			</AnimatePresence>

			{/* Personality-based decorative elements */}
			{personality === "warm" && isHovered && (
				<motion.div className="absolute -top-1 -right-1 w-3 h-3" initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ duration: 0.5 }}>
					<Heart className="w-full h-full text-pink-400 fill-pink-400" />
				</motion.div>
			)}

			{personality === "energetic" && isActive && (
				<motion.div className="absolute inset-0 pointer-events-none" animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
					<Sparkles className="absolute -top-1 left-1/2 w-2 h-2 text-yellow-400 fill-yellow-400" />
					<Zap className="absolute top-1/2 -right-1 w-2 h-2 text-blue-400 fill-blue-400" />
				</motion.div>
			)}
		</motion.div>
	);
};

export default AICoachAvatar;
