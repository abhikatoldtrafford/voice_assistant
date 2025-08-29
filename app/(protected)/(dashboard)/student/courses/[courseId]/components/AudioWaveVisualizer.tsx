"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioWaveVisualizerProps {
	isActive: boolean;
	isAITalking: boolean;
	audioData: number[];
	className?: string;
}

export default function AudioWaveVisualizer({ isActive, isAITalking, audioData, className }: AudioWaveVisualizerProps) {
	return (
		<div className={cn("flex items-center justify-center gap-[2px] w-full", className)}>
			{audioData.map((value, index) => (
				<motion.div
					key={index}
					initial={{ height: 4 }}
					animate={{
						height: isActive ? Math.max(4, value) : 4,
						opacity: isActive ? 1 : 0.5,
					}}
					transition={{
						type: "spring",
						damping: 10,
						stiffness: 100,
					}}
					className={cn("w-1 rounded-full", isAITalking ? "bg-green-500" : "bg-blue-500")}
				/>
			))}
		</div>
	);
}
