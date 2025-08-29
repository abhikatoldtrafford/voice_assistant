"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CircularAudioVisualizerProps {
	isActive: boolean;
	isAITalking: boolean;
	audioData: number[];
	className?: string;
}

export default function CircularAudioVisualizer({ isActive, isAITalking, audioData, className }: CircularAudioVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number | null>(null);

	// Animation parameters
	const rotationRef = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;
		const centerX = width / 2;
		const centerY = height / 2;
		const baseRadius = Math.min(centerX, centerY) - 20;

		const draw = () => {
			// Clear canvas
			ctx.clearRect(0, 0, width, height);

			// Set colors based on speaker
			const primaryColor = isAITalking ? "rgba(130, 90, 255, 0.8)" : "rgba(90, 210, 255, 0.8)";

			const secondaryColor = isAITalking ? "rgba(130, 90, 255, 0.2)" : "rgba(90, 210, 255, 0.2)";

			// Increment rotation for animation
			rotationRef.current += 0.01;

			// Draw background circle
			ctx.beginPath();
			ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
			ctx.strokeStyle = "rgba(100, 100, 100, 0.1)";
			ctx.lineWidth = 2;
			ctx.stroke();

			if (!isActive) {
				// If not active, just draw the background circle
				animationFrameRef.current = requestAnimationFrame(draw);
				return;
			}

			// Draw inner circle with pulsating effect
			const pulseSize = 30 + Math.sin(Date.now() * 0.003) * 10;
			ctx.beginPath();
			ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
			ctx.fillStyle = secondaryColor;
			ctx.fill();

			// Draw audio data visualization bars
			const barCount = audioData.length;
			const angleStep = (Math.PI * 2) / barCount;

			for (let i = 0; i < barCount; i++) {
				const angle = i * angleStep + rotationRef.current;

				// Scale the bar height based on audio data
				const scaledValue = audioData[i] * 0.8; // Adjust sensitivity
				const barHeight = scaledValue * 1.2;

				const innerRadius = baseRadius + 5;
				const outerRadius = innerRadius + barHeight;

				const innerX = centerX + Math.cos(angle) * innerRadius;
				const innerY = centerY + Math.sin(angle) * innerRadius;
				const outerX = centerX + Math.cos(angle) * outerRadius;
				const outerY = centerY + Math.sin(angle) * outerRadius;

				// Create gradient for the bar
				const gradient = ctx.createLinearGradient(innerX, innerY, outerX, outerY);
				gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
				gradient.addColorStop(1, primaryColor);

				// Draw the bar
				ctx.beginPath();
				ctx.moveTo(innerX, innerY);
				ctx.lineTo(outerX, outerY);
				ctx.lineWidth = 3;
				ctx.strokeStyle = gradient;
				ctx.lineCap = "round";

				// Add glow effect
				ctx.shadowBlur = 15;
				ctx.shadowColor = isAITalking ? "rgba(130, 90, 255, 0.6)" : "rgba(90, 210, 255, 0.6)";

				ctx.stroke();

				// Reset shadow
				ctx.shadowBlur = 0;
			}

			// Add center icon or text
			const iconSize = 20;
			if (isAITalking) {
				// Draw AI icon (simple robot face)
				ctx.fillStyle = "rgba(130, 90, 255, 0.9)";
				ctx.fillRect(centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
				ctx.fillStyle = "white";
				// Eyes
				ctx.fillRect(centerX - iconSize / 4 - 2, centerY - iconSize / 6, 4, 4);
				ctx.fillRect(centerX + iconSize / 4 - 2, centerY - iconSize / 6, 4, 4);
				// Mouth
				ctx.fillRect(centerX - iconSize / 3, centerY + iconSize / 5, (iconSize * 2) / 3, 2);
			} else {
				// Draw mic icon
				ctx.beginPath();
				ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(90, 210, 255, 0.9)";
				ctx.fill();
				ctx.fillStyle = "white";
				ctx.beginPath();
				ctx.arc(centerX, centerY, iconSize / 4, 0, Math.PI * 2);
				ctx.fill();
			}

			animationFrameRef.current = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isActive, isAITalking, audioData]);

	return (
		<div className={cn("flex items-center justify-center", className)}>
			<canvas ref={canvasRef} width={300} height={300} className="max-w-full max-h-full" />
		</div>
	);
}
