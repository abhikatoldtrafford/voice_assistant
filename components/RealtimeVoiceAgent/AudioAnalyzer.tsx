// app/(protected)/(dashboard)/student/courses/[courseId]/components/AudioAnalyzer.tsx
"use client";

import { useEffect, useRef } from "react";

interface AudioAnalyzerProps {
	audioElement: HTMLAudioElement | null;
	isActive: boolean;
	onLevelChange: (level: number) => void;
}

export default function AudioAnalyzer({ audioElement, isActive, onLevelChange }: AudioAnalyzerProps) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(() => {
		if (!audioElement || !isActive || !audioElement.srcObject) {
			onLevelChange(0);
			return cleanup;
		}

		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
		}

		const setupAnalyzer = async () => {
			try {
				if (!audioContextRef.current) return;

				if (!analyserRef.current) {
					const analyser = audioContextRef.current.createAnalyser();
					analyser.fftSize = 256;
					analyserRef.current = analyser;
				}

				if (!sourceRef.current && audioElement.srcObject) {
					const source = audioContextRef.current.createMediaStreamSource(audioElement.srcObject as MediaStream);
					source.connect(analyserRef.current);
					sourceRef.current = source;
				}

				startAnalyzing();
			} catch (error) {
				console.error("Error setting up audio analyzer:", error);
			}
		};

		const startAnalyzing = () => {
			if (!analyserRef.current) return;

			const analyser = analyserRef.current;
			const dataArray = new Uint8Array(analyser.frequencyBinCount);

			const analyze = () => {
				analyser.getByteFrequencyData(dataArray);
				const sum = Array.from(dataArray).reduce((total, value) => total + value, 0);
				const average = sum / dataArray.length;
				const normalizedLevel = Math.min(1, Math.max(0, (average / 128) * 1.5));

				if (isActive) {
					onLevelChange(normalizedLevel);
				} else {
					onLevelChange(0);
				}

				animationFrameRef.current = requestAnimationFrame(analyze);
			};

			analyze();
		};

		setupAnalyzer();

		function cleanup() {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}

			if (sourceRef.current) {
				sourceRef.current.disconnect();
				sourceRef.current = null;
			}
		}

		return cleanup;
	}, [audioElement, isActive, onLevelChange]);

	return null; // This is a non-visual component
}
