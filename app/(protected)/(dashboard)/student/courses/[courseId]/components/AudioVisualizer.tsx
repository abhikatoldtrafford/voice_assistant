"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
	isActive: boolean;
	isAITalking: boolean;
	className?: string;
}

export default function AudioVisualizer({ isActive, isAITalking, className }: AudioVisualizerProps) {
	const [audioData, setAudioData] = useState<number[]>(Array(40).fill(0));
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	// Initialize audio context and analyzer
	useEffect(() => {
		if (typeof window !== "undefined") {
			audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
			analyserRef.current = audioContextRef.current.createAnalyser();
			analyserRef.current.fftSize = 256;
		}

		return () => {
			if (audioContextRef.current) {
				audioContextRef.current.close();
			}
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	// Update visualizer data regularly when active
	useEffect(() => {
		if (!isActive || !analyserRef.current) {
			// Reset data when inactive
			setAudioData(Array(40).fill(0));
			return;
		}

		// If not connected to a real audio source, generate random values for visual effect
		const updateData = () => {
			// In a real implementation, we would connect to the actual audio source
			// For now, we'll simulate audio data

			if (isActive) {
				// Higher activity if AI is talking
				const intensity = isAITalking ? 0.8 : 0.5;
				const newData = Array(40)
					.fill(0)
					.map(() => Math.random() * intensity * (isAITalking ? 100 : 70));
				setAudioData(newData);
				animationFrameRef.current = requestAnimationFrame(updateData);
			}
		};

		updateData();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isActive, isAITalking]);

	return (
		<div className={cn("w-full flex items-center justify-center gap-[2px] h-12", className)}>
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
					style={{
						backgroundColor: isAITalking ? "var(--color-primary)" : "var(--color-accent)",
					}}
					className={cn("w-1 rounded-full", isAITalking ? "bg-primary/80" : "bg-secondary")}
				/>
			))}
		</div>
	);
}
