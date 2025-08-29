"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AICoachAvatar from "@/components/ai/AICoachAvatar";
import { Brain, TrendingUp, Target, Sun, Moon, Sunrise, Sunset, ArrowRight, Book, Coffee } from "lucide-react";

interface WelcomeHeroProps {
	userName: string;
	userImage?: string;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ userName, userImage }) => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Get greeting based on time
	const getGreeting = () => {
		const hour = currentTime.getHours();
		if (hour < 6) return { text: "Good night", icon: Moon };
		if (hour < 12) return { text: "Good morning", icon: Sunrise };
		if (hour < 17) return { text: "Good afternoon", icon: Sun };
		if (hour < 21) return { text: "Good evening", icon: Sunset };
		return { text: "Good night", icon: Moon };
	};

	const greeting = getGreeting();
	const GreetingIcon = greeting.icon;

	// Motivational messages based on time
	const getMotivationalMessage = () => {
		const hour = currentTime.getHours();
		if (hour < 12) return "Ready to start your learning adventure?";
		if (hour < 17) return "Keep the momentum going!";
		return "Perfect time for some evening learning!";
	};

	const userInitials = userName
		? userName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	return (
		<motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
			<div className="bg-card border border-border rounded-lg p-8">
				<div className="grid lg:grid-cols-3 gap-8 items-center">
					{/* Welcome Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Greeting Header */}
						<motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
							<div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
								<GreetingIcon className="w-5 h-5 text-muted-foreground" />
							</div>
							<div>
								<h1 className="text-2xl font-semibold text-foreground">
									{greeting.text}, {userName}
								</h1>
								<p className="text-muted-foreground text-sm">
									{currentTime.toLocaleDateString("en-US", {
										weekday: "long",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</motion.div>

						{/* Motivational Message */}
						<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
							<p className="text-muted-foreground">{getMotivationalMessage()}</p>
						</motion.div>

						{/* Quick Stats */}
						<motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
							<Badge variant="secondary" className="text-xs">
								<TrendingUp className="w-3 h-3 mr-1" />7 day streak
							</Badge>
							<Badge variant="secondary" className="text-xs">
								<Target className="w-3 h-3 mr-1" />
								80% monthly goal
							</Badge>
						</motion.div>

						{/* Action Buttons */}
						<motion.div className="flex gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
							<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
								<Brain className="w-4 h-4 mr-2" />
								Continue Learning
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
							<Button variant="outline" className="border-border hover:bg-muted/50">
								<Book className="w-4 h-4 mr-2" />
								Explore Courses
							</Button>
						</motion.div>
					</div>

					{/* AI Coach Section */}
					<motion.div className="text-center space-y-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
						{/* User Avatar */}
						<div className="flex justify-center mb-4">
							<div className="relative">
								<div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg border-2 border-border">
									{userImage ? <img src={userImage} alt={userName} className="w-full h-full rounded-full object-cover" /> : userInitials}
								</div>
								{/* Online indicator */}
								<div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background flex items-center justify-center">
									<div className="w-2 h-2 bg-background rounded-full" />
								</div>
							</div>
						</div>

						{/* AI Coach */}
						<div className="space-y-3">
							<AICoachAvatar size="md" personality="warm" mood="encouraging" isActive={true} className="mx-auto" />

							<div className="p-3 bg-muted/30 rounded-lg border border-border/50">
								<div className="flex items-start gap-2">
									<Coffee className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
									<div className="text-left text-sm">
										<p className="font-medium text-foreground">Your personalized study plan is ready!</p>
										<p className="text-muted-foreground text-xs mt-1">Ready to dive into some amazing content?</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
};

export default WelcomeHero;
