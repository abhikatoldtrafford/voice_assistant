"use client";

import { useEffect, useRef, useState } from "react";

interface VoiceActivityDetectorProps {
	isActive: boolean;
	onVoiceActivityChange: (activityData: number[]) => void;
	onSpeakingChange?: (isSpeaking: boolean) => void;
	speakingThreshold?: number;
}

export default function VoiceActivityDetector({ isActive, onVoiceActivityChange, onSpeakingChange, speakingThreshold = 30 }: VoiceActivityDetectorProps) {
	const audioContextRef = useRef<AudioContext | null>(null);
	const analyserRef = useRef<AnalyserNode | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	// Clean up function to stop all audio processing
	const stopAudioProcessing = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}

		if (sourceRef.current) {
			sourceRef.current.disconnect();
			sourceRef.current = null;
		}

		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			mediaStreamRef.current = null;
		}

		if (audioContextRef.current && audioContextRef.current.state !== "closed") {
			audioContextRef.current.close().catch(console.error);
		}
	};

	// Initialize audio processing when component is active
	useEffect(() => {
		if (!isActive) {
			stopAudioProcessing();
			onVoiceActivityChange(Array(32).fill(0));
			if (onSpeakingChange) onSpeakingChange(false);
			return;
		}

		const initializeAudio = async () => {
			try {
				// Request microphone access
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: {
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true,
					},
				});
				mediaStreamRef.current = stream;

				// Create audio context and analyzer
				const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
				audioContextRef.current = audioContext;

				const analyser = audioContext.createAnalyser();
				analyser.fftSize = 256; // Adjust for more/less detail
				analyserRef.current = analyser;

				// Connect stream to analyzer
				const source = audioContext.createMediaStreamSource(stream);
				source.connect(analyser);
				sourceRef.current = source;

				// Start analyzing audio
				startAnalyzing();
			} catch (error) {
				console.error("Error initializing audio:", error);
			}
		};

		initializeAudio();

		// Clean up when component becomes inactive or unmounts
		return () => {
			stopAudioProcessing();
		};
	}, [isActive]);

	// Start analyzing audio data
	const startAnalyzing = () => {
		if (!analyserRef.current) return;

		const analyser = analyserRef.current;
		const dataArray = new Uint8Array(analyser.frequencyBinCount);

		const analyze = () => {
			// Get frequency data
			analyser.getByteFrequencyData(dataArray);

			// Process data for visualization (32 data points)
			const activityData = Array(32).fill(0);
			let sum = 0;

			for (let i = 0; i < dataArray.length; i++) {
				const value = dataArray[i];
				sum += value;

				// Map the data to 32 points for visualization
				const index = Math.floor(i / (dataArray.length / 32));
				if (index < 32) {
					activityData[index] = Math.max(activityData[index], value);
				}
			}

			// Detect if voice is active based on average volume
			const average = sum / dataArray.length;
			const isSpeaking = average > speakingThreshold;

			// Send data to parent components
			onVoiceActivityChange(activityData);
			if (onSpeakingChange) onSpeakingChange(isSpeaking);

			// Continue the loop
			animationFrameRef.current = requestAnimationFrame(analyze);
		};

		analyze();
	};

	return null; // This is a non-visual component
}
