// app/(protected)/(dashboard)/student/courses/[courseId]/components/EnhancedVideoPlayer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
	videoUrl: string;
	title: string;
	isCompleted?: boolean;
	onComplete?: () => void;
}

export default function VideoPlayer({ videoUrl, title, isCompleted = false, onComplete }: VideoPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [bufferedProgress, setBufferedProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const [isWatched, setIsWatched] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showControls, setShowControls] = useState(true);
	const [playbackSpeed, setPlaybackSpeed] = useState(1);
	const [secureVideoUrl, setSecureVideoUrl] = useState(videoUrl);

	const videoRef = useRef<HTMLVideoElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Add a timestamp parameter to bypass cache and prevent hot-linking
	useEffect(() => {
		const url = `${videoUrl}?t=${Date.now()}`;
		setSecureVideoUrl(url);
	}, [videoUrl]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleTimeUpdate = () => {
			setCurrentTime(video.currentTime);
			setProgress((video.currentTime / video.duration) * 100);

			// Mark as watched when 90% complete
			if (video.currentTime > video.duration * 0.9 && !isWatched) {
				setIsWatched(true);
				if (onComplete) onComplete();
			}
		};
		// Prevent right-click menu
		const handleContextMenu = (e: Event) => {
			e.preventDefault();
			return false;
		};

		// Prevent keyboard shortcuts that could be used to download
		const handleKeyDown = (e: KeyboardEvent) => {
			// Prevent Ctrl+S, Cmd+S
			if ((e.ctrlKey || e.metaKey) && e.key === "s") {
				e.preventDefault();
				return false;
			}
		};

		const handleLoadedMetadata = () => {
			setDuration(video.duration);
			setIsLoading(false);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setIsWatched(true);
			if (onComplete) onComplete();
		};

		const handleProgress = () => {
			if (video.buffered.length > 0) {
				const bufferedEnd = video.buffered.end(video.buffered.length - 1);
				setBufferedProgress((bufferedEnd / video.duration) * 100);
			}
		};

		const handleWaiting = () => {
			setIsLoading(true);
		};

		const handlePlaying = () => {
			setIsLoading(false);
		};

		// Prevent right-click menu to disable "Save Video As" option
		video.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			return false;
		});

		// Event listeners
		video.addEventListener("timeupdate", handleTimeUpdate);
		video.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("keydown", handleKeyDown);
		video.addEventListener("loadedmetadata", handleLoadedMetadata);
		video.addEventListener("ended", handleEnded);
		video.addEventListener("progress", handleProgress);
		video.addEventListener("waiting", handleWaiting);
		video.addEventListener("playing", handlePlaying);
		video.addEventListener("loadeddata", handlePlaying);

		return () => {
			// Clean up listeners
			video.removeEventListener("timeupdate", handleTimeUpdate);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
			video.removeEventListener("ended", handleEnded);
			video.removeEventListener("progress", handleProgress);
			video.removeEventListener("waiting", handleWaiting);
			video.removeEventListener("playing", handlePlaying);
			video.removeEventListener("loadeddata", handlePlaying);
			video.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isWatched, onComplete]);

	// Fullscreen handling
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	// Auto-hide controls
	useEffect(() => {
		const handleMouseMove = () => {
			setShowControls(true);

			// Clear existing timer
			if (controlsTimerRef.current) {
				clearTimeout(controlsTimerRef.current);
			}

			// Set new timer to hide controls after 3 seconds of inactivity
			controlsTimerRef.current = setTimeout(() => {
				if (isPlaying) {
					setShowControls(false);
				}
			}, 3000);
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener("mousemove", handleMouseMove);
			container.addEventListener("mouseleave", () => {
				if (isPlaying) {
					setShowControls(false);
				}
			});
			container.addEventListener("mouseenter", () => {
				setShowControls(true);
			});
		}

		return () => {
			if (container) {
				container.removeEventListener("mousemove", handleMouseMove);
			}

			if (controlsTimerRef.current) {
				clearTimeout(controlsTimerRef.current);
			}
		};
	}, [isPlaying]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const video = videoRef.current;
			if (!video) return;

			if (e.key === " " || e.key === "k") {
				togglePlay();
			} else if (e.key === "ArrowRight") {
				video.currentTime += 10;
			} else if (e.key === "ArrowLeft") {
				video.currentTime -= 10;
			} else if (e.key === "m") {
				toggleMute();
			} else if (e.key === "f") {
				handleFullscreen();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const handleVolumeChange = (value: number[]) => {
		const newVolume = value[0];
		if (videoRef.current) {
			videoRef.current.volume = newVolume / 100;
			setVolume(newVolume / 100);
			if (newVolume === 0) {
				setIsMuted(true);
			} else if (isMuted) {
				setIsMuted(false);
			}
		}
	};

	const handleProgressChange = (value: number[]) => {
		const newProgress = value[0];
		if (videoRef.current) {
			const newTime = (newProgress / 100) * duration;
			videoRef.current.currentTime = newTime;
			setCurrentTime(newTime);
			setProgress(newProgress);
		}
	};

	const handleFullscreen = () => {
		const container = containerRef.current;
		if (!container) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	};

	const skipForward = () => {
		if (videoRef.current) {
			videoRef.current.currentTime += 10;
		}
	};

	const skipBackward = () => {
		if (videoRef.current) {
			videoRef.current.currentTime -= 10;
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	};

	const handlePlaybackSpeedChange = (speed: number) => {
		if (videoRef.current) {
			videoRef.current.playbackRate = speed;
			setPlaybackSpeed(speed);
		}
	};

	return (
		<Card className="overflow-hidden">
			<div className="relative" ref={containerRef} onDoubleClick={handleFullscreen} onClick={togglePlay} onContextMenu={(e) => e.preventDefault()}>
				<video
					ref={videoRef}
					src={secureVideoUrl}
					className="w-full aspect-video bg-black cursor-pointer"
					playsInline
					controlsList="nodownload"
					disablePictureInPicture
					// Prevent right-click save
					onContextMenu={(e) => e.preventDefault()}
					style={{
						// CSS to prevent selection/dragging
						WebkitUserSelect: "none",
						userSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
					}}
				/>
				{/* Watermark overlay - translucent and non-intrusive */}
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 flex items-center justify-center">
					<div className="text-white text-lg font-bold transform -rotate-30">EduMattor</div>
				</div>

				{/* Loading overlay */}
				{isLoading && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40">
						<Loader2 className="h-12 w-12 text-white animate-spin" />
					</div>
				)}

				{/* Controls overlay */}
				<div className={`absolute inset-0 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"}`} onClick={(e) => e.stopPropagation()}>
					<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
						<div className="flex flex-col space-y-2">
							{/* Progress bar with buffer indicator */}
							<div className="w-full flex items-center space-x-2 group">
								<div className="relative w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
									{/* Buffer indicator */}
									<div className="absolute top-0 left-0 h-full bg-white/30 transition-all" style={{ width: `${bufferedProgress}%` }} />
									{/* Progress indicator */}
									<div className="absolute top-0 left-0 h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
									{/* Invisible slider for interaction */}
									<Slider value={[progress]} max={100} step={0.1} onValueChange={handleProgressChange} className="absolute inset-0 h-full opacity-0 group-hover:opacity-100" />
								</div>
							</div>

							{/* Controls */}
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-white hover:bg-white/20"
										onClick={(e) => {
											e.stopPropagation();
											togglePlay();
										}}
									>
										{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-white hover:bg-white/20"
										onClick={(e) => {
											e.stopPropagation();
											skipBackward();
										}}
									>
										<SkipBack className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-white hover:bg-white/20"
										onClick={(e) => {
											e.stopPropagation();
											skipForward();
										}}
									>
										<SkipForward className="h-4 w-4" />
									</Button>
									<span className="text-xs text-white">
										{formatTime(currentTime)} / {formatTime(duration)}
									</span>
								</div>

								<div className="flex items-center space-x-2">
									{/* Volume control */}
									<div className="relative flex items-center group">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-white hover:bg-white/20"
											onClick={(e) => {
												e.stopPropagation();
												toggleMute();
											}}
										>
											{isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
										</Button>
										<div className="h-8 w-0 overflow-hidden transition-all group-hover:w-20 flex items-center">
											<Slider value={[isMuted ? 0 : volume * 100]} max={100} step={1} onValueChange={handleVolumeChange} className="w-full h-1 mx-1 cursor-pointer" onClick={(e) => e.stopPropagation()} />
										</div>
									</div>

									{/* Playback speed */}
									<DropdownMenu>
										<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
											<Button variant="ghost" size="sm" className="h-8 text-white hover:bg-white/20">
												{playbackSpeed}x
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
												<DropdownMenuItem key={speed} onClick={() => handlePlaybackSpeedChange(speed)} className={playbackSpeed === speed ? "bg-primary/20" : ""}>
													{speed}x
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>

									{/* Settings */}
									{/* <DropdownMenu>
										<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
											<Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
												<Settings className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => window.open(secureVideoUrl, "_blank")}>Open in new tab</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu> */}

									{/* Fullscreen */}
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-white hover:bg-white/20"
										onClick={(e) => {
											e.stopPropagation();
											handleFullscreen();
										}}
									>
										<Maximize className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Status badges */}
				{(isWatched || isCompleted) && <Badge className="absolute top-2 right-2 bg-green-500 text-white">Watched</Badge>}
			</div>

			<CardContent className="p-4">
				<h3 className="font-medium">{title}</h3>
				<p className="text-xs text-muted-foreground mt-1">Use spacebar to play/pause. Arrow keys to skip forward/backward.</p>
			</CardContent>
		</Card>
	);
}
