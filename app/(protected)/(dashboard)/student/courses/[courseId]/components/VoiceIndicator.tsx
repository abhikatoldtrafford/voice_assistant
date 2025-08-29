"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceIndicatorProps {
	isActive: boolean;
	color: string;
	audioLevel?: number;
	className?: string;
}

export default function VoiceIndicator({ isActive, color, audioLevel = 0, className }: VoiceIndicatorProps) {
	const level = isActive ? Math.max(0.1, audioLevel) : 0;

	return (
		<div className={cn("relative flex items-center justify-center", className)}>
			{/* Background circle */}
			<motion.div
				className="absolute rounded-full bg-opacity-20"
				style={{
					backgroundColor: color,
					width: "40px",
					height: "40px",
				}}
				animate={{
					scale: isActive ? [1, 1 + level * 0.3, 1] : 1,
					opacity: isActive ? 0.6 : 0.2,
				}}
				transition={{
					repeat: isActive ? Infinity : 0,
					duration: 1.5,
					ease: "easeInOut",
				}}
			/>

			{/* Central dot */}
			<motion.div
				className="rounded-full bg-white"
				style={{
					width: "10px",
					height: "10px",
					boxShadow: `0 0 10px ${color}`,
				}}
				animate={{
					scale: isActive ? [1, 1.2, 1] : 1,
				}}
				transition={{
					repeat: isActive ? Infinity : 0,
					duration: 1,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}
