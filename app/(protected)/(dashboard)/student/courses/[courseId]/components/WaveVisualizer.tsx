// app/(protected)/(dashboard)/student/courses/[courseId]/components/WaveVisualizer.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WaveVisualizerProps {
	isActive: boolean;
	isAITalking: boolean;
	className?: string;
}

export default function WaveVisualizer({ isActive, isAITalking, className }: WaveVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const width = canvas.width;
		const height = canvas.height;

		let phase = 0;

		const draw = () => {
			// Clear canvas
			ctx.clearRect(0, 0, width, height);

			if (!isActive) {
				// Draw a flat line when inactive
				ctx.beginPath();
				ctx.moveTo(0, height / 2);
				ctx.lineTo(width, height / 2);
				ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
				ctx.lineWidth = 2;
				ctx.stroke();

				animationFrameRef.current = requestAnimationFrame(draw);
				return;
			}

			// Increase phase for animation
			phase += 0.05;

			// Primary color based on who's talking
			const primaryColor = isAITalking ? "rgba(130, 90, 255, 0.8)" : "rgba(90, 210, 255, 0.8)";

			const secondaryColor = isAITalking ? "rgba(130, 90, 255, 0.2)" : "rgba(90, 210, 255, 0.2)";

			// Draw multiple wave lines
			const waveCount = 3;
			const amplitude = isAITalking ? 40 : 25;

			for (let j = 0; j < waveCount; j++) {
				const offset = (j * 2 * Math.PI) / waveCount;
				const lineWidth = 4 - j;
				const alpha = 1 - j * 0.2;

				ctx.beginPath();

				for (let i = 0; i < width; i += 5) {
					// Calculate wave height
					const intensity = isActive ? (isAITalking ? 1.0 : 0.7) : 0.1;
					const y = height / 2 + Math.sin(i * 0.02 + phase + offset) * amplitude * intensity * Math.sin(i * 0.001 + phase * 0.5) * 0.5;

					if (i === 0) {
						ctx.moveTo(i, y);
					} else {
						ctx.lineTo(i, y);
					}
				}

				// Wave line
				ctx.strokeStyle = primaryColor.replace("0.8", String(alpha));
				ctx.lineWidth = lineWidth;
				ctx.stroke();
			}

			// Draw reflection (mirror effect)
			const gradient = ctx.createLinearGradient(0, height / 2, 0, height);
			gradient.addColorStop(0, primaryColor);
			gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

			ctx.fillStyle = secondaryColor;
			ctx.fillRect(0, height / 2, width, height / 2);

			animationFrameRef.current = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [isActive, isAITalking]);

	return (
		<div className={cn("w-full", className)}>
			<canvas ref={canvasRef} width={800} height={200} className="w-full h-full" />
		</div>
	);
}
