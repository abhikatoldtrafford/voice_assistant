"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Settings, BookOpen, Brain, Target, Trophy, Mail, MapPin, Calendar, Edit3, Check, X } from "lucide-react";
import { IUserProfile, IUserProfileData } from "@/models/UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function StudentProfile() {
	const [activeSection, setActiveSection] = useState("overview");
	const [isEditing, setIsEditing] = useState(false);
	const router = useRouter();
	const { profile: userData } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (userData) {
			if (userData.onboardingStatus !== "completed") {
				// router.push("/student/onboarding");
			}
		}
	}, [userData]);

	if (!userData) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading profile...</p>
				</div>
			</div>
		);
	}

	const saveUserData = (data: IUserProfileData) => {
		setIsLoading(true);
		// Simulate API call
		setTimeout(() => setIsLoading(false), 1000);
	};

	const handleUpdateProfile = async (updates: Partial<IUserProfileData>) => {
		setIsLoading(true);
		try {
			const updatedData = { ...userData, ...updates };
			saveUserData(updatedData);
			console.log("Profile updated:", updates);
		} catch (error) {
			console.error("Failed to update profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const profileCompletionScore = () => {
		let score = 0;
		const checks = [
			userData.personalInfo.firstName,
			userData.personalInfo.lastName,
			userData.personalInfo.bio,
			userData.learningPreferences.learningStyle,
			userData.learningGoals.shortTerm.length > 0,
			userData.learningGoals.longTerm.length > 0,
			userData.personalInfo.interests.length > 0,
		];
		score = (checks.filter(Boolean).length / checks.length) * 100;
		return Math.round(score);
	};

	const sections = [
		{ id: "overview", label: "Overview", icon: User },
		{ id: "learning", label: "Learning", icon: Brain },
		{ id: "progress", label: "Progress", icon: Target },
		{ id: "settings", label: "Settings", icon: Settings },
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="container-custom py-8">
				{/* Header */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-semibold text-foreground mb-2">
								{userData.personalInfo.firstName} {userData.personalInfo.lastName}
							</h1>
							<p className="text-muted-foreground">{userData.email}</p>
						</div>
						<Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="border-border hover:border-accent">
							<Edit3 className="w-4 h-4 mr-2" />
							{isEditing ? "Cancel" : "Edit Profile"}
						</Button>
					</div>
				</motion.div>

				{/* Navigation */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
					<nav className="flex space-x-1 bg-muted/30 p-1 rounded-lg w-fit">
						{sections.map((section) => (
							<button
								key={section.id}
								onClick={() => setActiveSection(section.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
									activeSection === section.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
								}`}
							>
								<section.icon className="w-4 h-4" />
								{section.label}
							</button>
						))}
					</nav>
				</motion.div>

				{/* Content */}
				<motion.div key={activeSection} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
					{activeSection === "overview" && (
						<div className="grid lg:grid-cols-3 gap-8">
							{/* Profile Info */}
							<div className="lg:col-span-2 space-y-6">
								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Personal Information</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="grid md:grid-cols-2 gap-4">
											<div>
												<label className="text-sm font-medium text-muted-foreground">First Name</label>
												<p className="text-foreground">{userData.personalInfo.firstName || "Not set"}</p>
											</div>
											<div>
												<label className="text-sm font-medium text-muted-foreground">Last Name</label>
												<p className="text-foreground">{userData.personalInfo.lastName || "Not set"}</p>
											</div>
											<div className="md:col-span-2">
												<label className="text-sm font-medium text-muted-foreground">Email</label>
												<p className="text-foreground">{userData.email}</p>
											</div>
											<div className="md:col-span-2">
												<label className="text-sm font-medium text-muted-foreground">Bio</label>
												<p className="text-foreground">{userData.personalInfo.bio || "Tell us about yourself..."}</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Learning Preferences</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground">Learning Style</label>
											<p className="text-foreground capitalize">{userData.learningPreferences.learningStyle || "Not set"}</p>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground">Interests</label>
											<div className="flex flex-wrap gap-2 mt-1">
												{userData.personalInfo.interests?.length > 0 ? (
													userData.personalInfo.interests.map((interest, index) => (
														<Badge key={index} variant="secondary" className="text-xs">
															{interest}
														</Badge>
													))
												) : (
													<p className="text-muted-foreground text-sm">No interests set</p>
												)}
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Sidebar */}
							<div className="space-y-6">
								{/* Profile Completion */}
								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Profile Completion</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											<div className="flex justify-between items-center">
												<span className="text-sm text-muted-foreground">Progress</span>
												<span className="text-sm font-medium">{profileCompletionScore()}%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${profileCompletionScore()}%` }} />
											</div>
											{profileCompletionScore() < 100 && <p className="text-xs text-muted-foreground">Complete your profile to get better AI recommendations</p>}
										</div>
									</CardContent>
								</Card>

								{/* Quick Stats */}
								<Card className="border-border">
									<CardHeader>
										<CardTitle className="text-lg">Learning Stats</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<BookOpen className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">Courses Enrolled</span>
											</div>
											<span className="font-medium">3</span>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Trophy className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">Certificates</span>
											</div>
											<span className="font-medium">1</span>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Target className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">Goals Completed</span>
											</div>
											<span className="font-medium">2/5</span>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					)}

					{activeSection === "learning" && (
						<div className="grid lg:grid-cols-2 gap-8">
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Learning Goals</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground mb-2 block">Short-term Goals</label>
										{userData.learningGoals.shortTerm?.length > 0 ? (
											<ul className="space-y-2">
												{userData.learningGoals.shortTerm.map((goal, index) => (
													<li key={index} className="flex items-center gap-2 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full" />
														{goal}
													</li>
												))}
											</ul>
										) : (
											<p className="text-muted-foreground text-sm">No short-term goals set</p>
										)}
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground mb-2 block">Long-term Goals</label>
										{userData.learningGoals.longTerm?.length > 0 ? (
											<ul className="space-y-2">
												{userData.learningGoals.longTerm.map((goal, index) => (
													<li key={index} className="flex items-center gap-2 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full" />
														{goal}
													</li>
												))}
											</ul>
										) : (
											<p className="text-muted-foreground text-sm">No long-term goals set</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">AI Coach Relationship</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<Brain className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="font-medium text-sm">AI Coach Status</p>
											<p className="text-xs text-muted-foreground">Ready to help</p>
										</div>
									</div>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Interactions</span>
											<span>47</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Helpful Responses</span>
											<span>94%</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Last Chat</span>
											<span>2 hours ago</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{activeSection === "progress" && (
						<div className="space-y-6">
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Recent Activity</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{[
											{ action: "Completed", item: "Introduction to React", time: "2 hours ago", type: "lesson" },
											{ action: "Started", item: "Advanced JavaScript Concepts", time: "1 day ago", type: "course" },
											{ action: "Earned", item: "JavaScript Fundamentals Certificate", time: "3 days ago", type: "certificate" },
										].map((activity, index) => (
											<div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
												<div className="w-2 h-2 bg-primary rounded-full" />
												<div className="flex-1">
													<p className="text-sm">
														<span className="font-medium">{activity.action}</span> {activity.item}
													</p>
													<p className="text-xs text-muted-foreground">{activity.time}</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{activeSection === "settings" && (
						<div className="space-y-6">
							<Card className="border-border">
								<CardHeader>
									<CardTitle className="text-lg">Account Settings</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-sm">Email Notifications</p>
												<p className="text-xs text-muted-foreground">Receive updates about your courses</p>
											</div>
											<Button variant="outline" size="sm">
												Configure
											</Button>
										</div>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-sm">Privacy Settings</p>
												<p className="text-xs text-muted-foreground">Manage your data and privacy</p>
											</div>
											<Button variant="outline" size="sm">
												Manage
											</Button>
										</div>
										<div className="flex items-center justify-between">
											<div>
												<p className="font-medium text-sm">AI Preferences</p>
												<p className="text-xs text-muted-foreground">Customize your AI experience</p>
											</div>
											<Button variant="outline" size="sm">
												Update
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
}
