// app/(protected)/(dashboard)/student/courses/[courseId]/components/AnimatedFace.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedFaceProps {
	isActive: boolean;
	isAITalking: boolean;
	audioLevel: number;
	onClick: () => void;
	isLoading?: boolean;
	className?: string;
	activity?: string | null;
}

export default function AnimatedFace({ isActive, isAITalking, audioLevel, onClick, isLoading = false, className, activity }: AnimatedFaceProps) {
	const [blinking, setBlinking] = useState(false);
	const [eyeOffsetX, setEyeOffsetX] = useState(0);
	const [eyeOffsetY, setEyeOffsetY] = useState(0);
	const svgRef = useRef<SVGSVGElement | null>(null);
	const pulsesRef = useRef<SVGGElement | null>(null);
	const activePulses = useRef<{ element: SVGCircleElement; radius: number; opacity: number }[]>([]);
	const animationFrameRef = useRef<number | null>(null);
	const lastAudioLevelRef = useRef(0);

	// Refs for eye movement
	const lastMouseMoveTimeRef = useRef(Date.now());
	const lastMousePositionRef = useRef({ x: 0, y: 0 });
	const randomEyeMovementTimerRef = useRef<NodeJS.Timeout | null>(null);
	const cursorMovingRef = useRef(false);
	const targetEyePositionRef = useRef({ x: 0, y: 0 });
	const currentEyePositionRef = useRef({ x: 0, y: 0 });

	// Memory recall state
	const isRecallingMemory = activity === "MEMORY";

	// Constants for face animations
	const EYE_OPEN_HEIGHT = 30;
	const EYE_CLOSED_HEIGHT = 5;
	const EYE_ORIG_Y_OPEN = 85;
	const EYE_Y_CLOSED = EYE_ORIG_Y_OPEN + EYE_OPEN_HEIGHT / 2 - EYE_CLOSED_HEIGHT / 2;
	const LEFT_EYE_ORIG_X = 67.5;
	const RIGHT_EYE_ORIG_X = 117.5;
	const MAX_EYE_OFFSET = 15;
	const FACE_CIRCLE_RADIUS = 80;
	const MAX_PULSE_RADIUS = 300;
	const PULSE_SPEED = 0.8;
	const FADE_SPEED = 0.015;
	const AUDIO_PULSE_THRESHOLD = 0.25; // Lower threshold to capture more audio changes

	// Constants for eye movement
	const MOUSE_MOVE_THRESHOLD = 5; // Pixels of movement to consider "significant"
	const CURSOR_IDLE_TIMEOUT = 1000; // Time in ms before considering cursor idle
	const EYE_MOVEMENT_SMOOTHNESS = 0.1; // Lower = smoother (0-1)

	// Memory recall blinking pattern (slower, more contemplative)
	useEffect(() => {
		let blinkInterval: NodeJS.Timeout;

		if (isRecallingMemory) {
			// Slower, contemplative blinks during memory recall (every 800ms)
			blinkInterval = setInterval(() => {
				setBlinking(true);
				setTimeout(() => {
					setBlinking(false);
				}, 200); // Slightly longer blink duration
			}, 800);
		} else if (isLoading) {
			// Faster blinks during loading (every 500ms)
			blinkInterval = setInterval(() => {
				setBlinking(true);
				setTimeout(() => {
					setBlinking(false);
				}, 150);
			}, 500);
		} else {
			// Normal blinks (every 3-5 seconds with randomness)
			const scheduleNextBlink = () => {
				const nextBlinkDelay = 3000 + Math.random() * 2000;
				blinkInterval = setTimeout(() => {
					setBlinking(true);
					setTimeout(() => {
						setBlinking(false);
						scheduleNextBlink();
					}, 150);
				}, nextBlinkDelay);
			};

			scheduleNextBlink();
		}

		return () => {
			if (blinkInterval) clearTimeout(blinkInterval);
		};
	}, [isLoading, isRecallingMemory]);

	// Generate random eye movement when cursor is idle
	const generateRandomEyeMovement = () => {
		if (cursorMovingRef.current) return;

		let randomX, randomY;

		if (isRecallingMemory) {
			// During memory recall, eyes look up and slightly to the side (contemplative look)
			randomX = (Math.random() * 0.6 - 0.3) * MAX_EYE_OFFSET; // Small horizontal movement
			randomY = -(0.6 + Math.random() * 0.4) * MAX_EYE_OFFSET; // Look up
		} else {
			// Normal random movement
			const randomScale = 0.7; // Only move 70% of max range for subtle movements
			randomX = (Math.random() * 2 - 1) * MAX_EYE_OFFSET * randomScale;
			randomY = (Math.random() * 2 - 1) * MAX_EYE_OFFSET * randomScale;
		}

		targetEyePositionRef.current = { x: randomX, y: randomY };

		// Schedule next random movement (longer intervals during memory recall)
		const nextMovementDelay = isRecallingMemory
			? 2000 + Math.random() * 3000 // 2-5 seconds for contemplative look
			: 1000 + Math.random() * 2000; // 1-3 seconds normal
		randomEyeMovementTimerRef.current = setTimeout(generateRandomEyeMovement, nextMovementDelay);
	};

	// Combined mouse tracking and random movement effect
	useEffect(() => {
		// Initialize eye animation loop
		const animateEyes = () => {
			// Smoothly interpolate between current position and target position
			currentEyePositionRef.current.x += (targetEyePositionRef.current.x - currentEyePositionRef.current.x) * EYE_MOVEMENT_SMOOTHNESS;
			currentEyePositionRef.current.y += (targetEyePositionRef.current.y - currentEyePositionRef.current.y) * EYE_MOVEMENT_SMOOTHNESS;

			// Update eye position state for rendering
			setEyeOffsetX(currentEyePositionRef.current.x);
			setEyeOffsetY(currentEyePositionRef.current.y);

			requestAnimationFrame(animateEyes);
		};

		const animation = requestAnimationFrame(animateEyes);

		// Start random eye movement for initial state
		generateRandomEyeMovement();

		// Handle mouse movement (disabled during memory recall for contemplative effect)
		const handleMouseMove = (event: MouseEvent) => {
			if (!svgRef.current || isRecallingMemory) return; // Ignore mouse during memory recall

			const currentTime = Date.now();
			const mouseX = event.clientX;
			const mouseY = event.clientY;

			// Calculate distance moved since last event
			const dx = mouseX - lastMousePositionRef.current.x;
			const dy = mouseY - lastMousePositionRef.current.y;
			const distanceMoved = Math.sqrt(dx * dx + dy * dy);

			// Only respond to significant mouse movement
			if (distanceMoved > MOUSE_MOVE_THRESHOLD) {
				lastMouseMoveTimeRef.current = currentTime;
				lastMousePositionRef.current = { x: mouseX, y: mouseY };

				// Mark cursor as moving and clear any pending random movement
				cursorMovingRef.current = true;
				if (randomEyeMovementTimerRef.current) {
					clearTimeout(randomEyeMovementTimerRef.current);
					randomEyeMovementTimerRef.current = null;
				}

				// Calculate eye target position based on mouse
				const svgRect = svgRef.current.getBoundingClientRect();
				if (svgRect.width === 0 || svgRect.height === 0) return;

				const clientWidth = svgRect.width;
				const clientHeight = svgRect.height;
				const svgViewBoxWidth = 200;
				const svgViewBoxHeight = 200;

				const mouseXRelativeToSvg = mouseX - svgRect.left;
				const mouseYRelativeToSvg = mouseY - svgRect.top;

				const svgMouseX = mouseXRelativeToSvg * (svgViewBoxWidth / clientWidth);
				const svgMouseY = mouseYRelativeToSvg * (svgViewBoxHeight / clientHeight);

				const faceCenterX = 100;
				const eyesVerticalCenter = EYE_ORIG_Y_OPEN + EYE_OPEN_HEIGHT / 2;

				let dx = svgMouseX - faceCenterX;
				let dy = svgMouseY - eyesVerticalCenter;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist > 0.1) {
					const normDx = dx / dist;
					const normDy = dy / dist;
					targetEyePositionRef.current = {
						x: normDx * MAX_EYE_OFFSET,
						y: normDy * MAX_EYE_OFFSET,
					};
				}
			}

			// Check if cursor has been idle
			if (cursorMovingRef.current && currentTime - lastMouseMoveTimeRef.current > CURSOR_IDLE_TIMEOUT) {
				cursorMovingRef.current = false;
				generateRandomEyeMovement();
			}
		};

		document.addEventListener("mousemove", handleMouseMove);

		// Periodically check for idle cursor
		const idleCheckInterval = setInterval(() => {
			const currentTime = Date.now();
			if (cursorMovingRef.current && currentTime - lastMouseMoveTimeRef.current > CURSOR_IDLE_TIMEOUT) {
				cursorMovingRef.current = false;
				generateRandomEyeMovement();
			}
		}, 500);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(animation);
			clearInterval(idleCheckInterval);
			if (randomEyeMovementTimerRef.current) {
				clearTimeout(randomEyeMovementTimerRef.current);
			}
		};
	}, [isRecallingMemory]); // Re-run when memory recall state changes

	// Create audio pulse effect
	const createPulse = (intensity = 1, isAISource = false, isMemoryPulse = false) => {
		if (!pulsesRef.current) return;

		const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("cx", "100");
		circle.setAttribute("cy", "100");
		circle.setAttribute("r", FACE_CIRCLE_RADIUS.toString());
		circle.setAttribute("fill", "none");

		// Different colors for different states
		let hue;

		if (isMemoryPulse) {
			hue = 300; // Purple/magenta for memory recall
		} else if (isLoading) {
			hue = 45; // Yellow/gold for loading
		} else {
			hue = isAISource ? 180 : 0; // Blue for AI, Red for user
		}

		circle.setAttribute("stroke", `hsla(${hue}, 100%, 70%, 0.8)`);
		circle.setAttribute("stroke-width", isMemoryPulse ? "3" : "2");
		circle.style.opacity = "0.8";

		pulsesRef.current.appendChild(circle);
		activePulses.current.push({
			element: circle,
			radius: FACE_CIRCLE_RADIUS,
			opacity: 0.8,
		});
	};

	// Animation loop for all pulses - runs continuously
	useEffect(() => {
		const updatePulses = () => {
			activePulses.current = activePulses.current.filter((pulse) => {
				pulse.radius += PULSE_SPEED;
				pulse.opacity -= FADE_SPEED;

				if (pulse.radius > MAX_PULSE_RADIUS || pulse.opacity <= 0) {
					if (pulse.element.parentNode) {
						pulse.element.remove();
					}
					return false;
				}

				pulse.element.setAttribute("r", pulse.radius.toString());
				pulse.element.style.opacity = pulse.opacity.toString();
				return true;
			});

			animationFrameRef.current = requestAnimationFrame(updatePulses);
		};

		// Start the continuous animation loop
		updatePulses();

		// Clean up on unmount
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}

			// Clean up any remaining pulse elements
			activePulses.current.forEach((pulse) => {
				if (pulse.element.parentNode) {
					pulse.element.remove();
				}
			});
			activePulses.current = [];
		};
	}, []);

	// Generate memory recall pulses
	useEffect(() => {
		if (!isRecallingMemory) return;

		// Create memory recall pulses every 1200ms (slower, more contemplative)
		const memoryPulseInterval = setInterval(() => {
			createPulse(0.6, false, true); // Memory pulses
		}, 1200);

		return () => clearInterval(memoryPulseInterval);
	}, [isRecallingMemory]);

	// Generate pulses during loading state
	useEffect(() => {
		if (!isLoading || isRecallingMemory) return;

		// Create a loading pulse every 800ms
		const loadingPulseInterval = setInterval(() => {
			createPulse(0.8);
		}, 800);

		return () => clearInterval(loadingPulseInterval);
	}, [isLoading, isRecallingMemory]);

	// Create pulses based on audio level - Fixed to properly detect both AI and user speech
	useEffect(() => {
		if (!isActive || isLoading || isRecallingMemory) return; // No audio pulses during memory recall

		// Store the current audio level
		const currentAudioLevel = audioLevel;

		// Detect significant changes in audio level
		const audioLevelDelta = Math.abs(currentAudioLevel - lastAudioLevelRef.current);

		// Only create pulses when there's a significant audio spike
		if (currentAudioLevel > AUDIO_PULSE_THRESHOLD && audioLevelDelta > 0.1) {
			const intensity = Math.min(1, currentAudioLevel);
			createPulse(intensity, isAITalking);
		}

		// Update last audio level
		lastAudioLevelRef.current = currentAudioLevel;
	}, [isActive, audioLevel, isAITalking, isLoading, isRecallingMemory]);

	// Create additional check for user audio specifically - for more reliable user pulses
	useEffect(() => {
		if (!isActive || isLoading || isAITalking || isRecallingMemory) return;

		// Dedicated interval for user audio checks (50ms is more responsive)
		const userAudioCheckInterval = setInterval(() => {
			// Only create when there's good volume and not AI talking
			if (audioLevel > AUDIO_PULSE_THRESHOLD && !isAITalking) {
				createPulse(Math.min(1, audioLevel), false); // false = user pulse
			}
		}, 150); // Check several times per second for more responsive pulses

		return () => clearInterval(userAudioCheckInterval);
	}, [isActive, isAITalking, isLoading, isRecallingMemory]);

	// Calculate eye positions based on state
	const leftEyeY = blinking ? EYE_Y_CLOSED + eyeOffsetY : EYE_ORIG_Y_OPEN + eyeOffsetY;
	const rightEyeY = blinking ? EYE_Y_CLOSED + eyeOffsetY : EYE_ORIG_Y_OPEN + eyeOffsetY;
	const eyeHeight = blinking ? EYE_CLOSED_HEIGHT : EYE_OPEN_HEIGHT;

	// Determine face colors based on state
	let faceGradientColors = {
		inner: "#555555",
		outer: "#222222",
	};

	if (isRecallingMemory) {
		faceGradientColors = {
			inner: "#a855f7", // Purple-500 for memory recall
			outer: "#7c3aed", // Purple-600
		};
	} else if (isLoading) {
		faceGradientColors = {
			inner: "#d97706", // Amber-600
			outer: "#92400e", // Amber-800
		};
	} else if (isActive) {
		if (isAITalking) {
			faceGradientColors = {
				inner: "#5540af", // Purple
				outer: "#2a1a66", // Dark purple
			};
		} else {
			faceGradientColors = {
				inner: "#2563eb", // Blue
				outer: "#1e40af", // Dark blue
			};
		}
	}

	return (
		<motion.div className={`flex items-center justify-center ${className || ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick}>
			<svg ref={svgRef} viewBox="0 0 200 200" className="w-64 h-64 cursor-pointer" style={{ overflow: "visible" }}>
				<defs>
					<radialGradient id="faceShadingGradient" cx="60%" cy="40%" r="70%" fx="65%" fy="35%">
						<stop offset="0%" style={{ stopColor: faceGradientColors.inner, stopOpacity: 1 }} />
						<stop offset="100%" style={{ stopColor: faceGradientColors.outer, stopOpacity: 1 }} />
					</radialGradient>
				</defs>

				{/* Pulses container - this will persist independent of connection status */}
				<g ref={pulsesRef}></g>

				{/* Face background */}
				<motion.circle
					cx="100"
					cy="100"
					r="80"
					fill="url(#faceShadingGradient)"
					animate={{
						scale: isRecallingMemory
							? [1, 1.03, 0.97, 1.03, 1] // Gentle, contemplative pulsing
							: isLoading
							? [1, 1.05, 0.98, 1.05, 1] // More pronounced pulsing during loading
							: isActive
							? [1, 1.02, 1]
							: 1,
					}}
					transition={{
						repeat: isRecallingMemory || isLoading || isActive ? Infinity : 0,
						duration: isRecallingMemory ? 2.5 : isLoading ? 1.5 : 2, // Slower during memory recall
						ease: "easeInOut",
					}}
				/>

				{/* Memory recall indicator - animated thought bubbles */}
				{isRecallingMemory && (
					<g>
						{/* Thought bubble dots */}
						<motion.circle
							cx="130"
							cy="65"
							r="3"
							fill="#e879f9"
							animate={{
								opacity: [0, 1, 0],
								scale: [0.8, 1.2, 0.8],
							}}
							transition={{
								repeat: Infinity,
								duration: 1.5,
								delay: 0,
							}}
						/>
						<motion.circle
							cx="140"
							cy="50"
							r="4"
							fill="#c084fc"
							animate={{
								opacity: [0, 1, 0],
								scale: [0.8, 1.2, 0.8],
							}}
							transition={{
								repeat: Infinity,
								duration: 1.5,
								delay: 0.3,
							}}
						/>
						<motion.circle
							cx="155"
							cy="40"
							r="6"
							fill="#a855f7"
							animate={{
								opacity: [0, 1, 0],
								scale: [0.8, 1.2, 0.8],
							}}
							transition={{
								repeat: Infinity,
								duration: 1.5,
								delay: 0.6,
							}}
						/>
					</g>
				)}

				{/* Loading spinner indicator around face */}
				{isLoading && !isRecallingMemory && (
					<motion.circle
						cx="100"
						cy="100"
						r="90"
						fill="none"
						stroke="#f59e0b"
						strokeWidth="2"
						strokeDasharray="15,10"
						animate={{ rotate: 360 }}
						transition={{
							repeat: Infinity,
							duration: 3,
							ease: "linear",
						}}
					/>
				)}

				{/* Eyes */}
				<g id="eyes">
					<rect id="left-eye" x={LEFT_EYE_ORIG_X + eyeOffsetX} y={leftEyeY} width="15" height={eyeHeight} rx="7.5" ry="7.5" fill="white" />
					<rect id="right-eye" x={RIGHT_EYE_ORIG_X + eyeOffsetX} y={rightEyeY} width="15" height={eyeHeight} rx="7.5" ry="7.5" fill="white" />
				</g>

				{/* Mouth - different expressions for different states */}
				{(isActive || isLoading || isRecallingMemory) && (
					<motion.path
						d={`M 80,140 Q 100,${140 + (isAITalking ? 10 * audioLevel : isLoading ? 5 : isRecallingMemory ? -2 : 0)} 120,140`}
						stroke="white"
						strokeWidth="3"
						fill="none"
						animate={{
							d: isRecallingMemory
								? [`M 80,140 Q 100,${140 - 3} 120,140`, `M 80,140 Q 100,${140 - 1} 120,140`, `M 80,140 Q 100,${140 - 3} 120,140`] // Subtle thinking expression
								: isLoading
								? [`M 80,140 Q 100,${140 - 2} 120,140`, `M 80,140 Q 100,${140 + 2} 120,140`, `M 80,140 Q 100,${140 - 2} 120,140`]
								: isAITalking
								? [`M 80,140 Q 100,${140 + 5} 120,140`, `M 80,140 Q 100,${140 + 15} 120,140`, `M 80,140 Q 100,${140 + 5} 120,140`]
								: "M 80,140 Q 100,140 120,140",
						}}
						transition={{
							repeat: isLoading || isAITalking || isRecallingMemory ? Infinity : 0,
							duration: isRecallingMemory ? 1.2 : isLoading ? 0.5 : 0.8,
						}}
					/>
				)}

				{/* Status indicator dot */}
				{(isActive || isLoading || isRecallingMemory) && (
					<motion.circle
						cx="100"
						cy="170"
						r="5"
						fill={isRecallingMemory ? "#a855f7" : isLoading ? "#f59e0b" : isAITalking ? "#10b981" : "#3b82f6"}
						animate={{
							opacity: [0.5, 1, 0.5],
							scale: isRecallingMemory ? [1, 1.1, 1] : isLoading ? [1, 1.2, 1] : 1,
						}}
						transition={{
							repeat: Infinity,
							duration: isRecallingMemory ? 1.5 : isLoading ? 0.7 : 2,
							ease: "easeInOut",
						}}
					/>
				)}
			</svg>
		</motion.div>
	);
}
