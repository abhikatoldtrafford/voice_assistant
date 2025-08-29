"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedMessageBubbleProps {
	role: "user" | "assistant" | "system";
	content: React.ReactNode;
	timestamp: Date;
	isNew?: boolean;
	isTyping?: boolean;
}

export default function AnimatedMessageBubble({ role, content, timestamp, isNew = false, isTyping = false }: AnimatedMessageBubbleProps) {
	// Animation variants for the message container
	const containerVariants = {
		hidden: {
			opacity: 0,
			y: 20,
			scale: 0.95,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.4,
				type: "spring",
				stiffness: 500,
				damping: 30,
			},
		},
	};

	// Animation variants for the message bubble
	const bubbleVariants: Variants = {
		hidden: {
			scale: 0.9,
		},
		visible: {
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 500,
				damping: 30,
			},
		},
		typing: {
			boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"],
			transition: {
				duration: 1.5,
				repeat: Infinity,
				repeatType: "loop",
			},
		},
	};

	return (
		<motion.div initial="hidden" animate="visible" variants={containerVariants} className={`flex items-start gap-3 ${role === "user" ? "justify-end" : "justify-start"}`}>
			{role === "assistant" && (
				<Avatar className="h-8 w-8 mt-1 bg-blue-500/20 border border-blue-500/30">
					<AvatarFallback className="text-blue-300">
						<Bot className="h-4 w-4" />
					</AvatarFallback>
				</Avatar>
			)}

			<motion.div
				variants={bubbleVariants}
				animate={isTyping ? "typing" : "visible"}
				className={cn("rounded-lg p-3 max-w-[80%] break-words", role === "user" ? "bg-blue-600/30 text-blue-50 border border-blue-500/30" : "bg-gray-800/40 border border-white/10")}
			>
				<div className="space-y-2">{content}</div>
				<div className="text-xs opacity-70 mt-1">{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
			</motion.div>

			{role === "user" && (
				<Avatar className="h-8 w-8 mt-1 bg-indigo-500/20 border border-indigo-500/30">
					<AvatarFallback className="text-indigo-300">
						<User className="h-4 w-4" />
					</AvatarFallback>
				</Avatar>
			)}
		</motion.div>
	);
}
