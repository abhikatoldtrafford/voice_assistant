// app/(protected)/(dashboard)/student/profile/components/PrivacyCenter.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Shield,
	Eye,
	EyeOff,
	Users,
	Database,
	Share2,
	Globe,
	Lock,
	Unlock,
	Key,
	AlertTriangle,
	CheckCircle2,
	Info,
	Download,
	Trash2,
	RefreshCw,
	Bell,
	Heart,
	Activity,
	BarChart3,
	MessageCircle,
	Settings,
	Smartphone,
	Mail,
	UserX,
	UserCheck,
	Save,
	X,
	Zap,
	Target,
	Brain,
	Clock,
	Trophy,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import React from "react";

interface PrivacyCenterProps {
	userData: IUserProfileData;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	isLoading?: boolean;
}

export default function PrivacyCenter({ userData, onUpdate, isLoading = false }: PrivacyCenterProps) {
	const [privacySettings, setPrivacySettings] = useState(userData.privacySettings);
	const [securitySettings, setSecuritySettings] = useState(userData.securitySettings);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [pendingChanges, setPendingChanges] = useState(false);

	const privacyControls = [
		{
			id: "publicProfile",
			title: "Public Profile",
			description: "Allow others to view your profile and learning progress",
			icon: Globe,
			category: "visibility",
			impact: "high",
			enabled: privacySettings.publicProfile,
			details: "When enabled, other students can see your achievements, learning streak, and completed courses. Your personal information remains private.",
		},
		{
			id: "showProgress",
			title: "Show Learning Progress",
			description: "Display your course progress and statistics publicly",
			icon: BarChart3,
			category: "visibility",
			impact: "medium",
			enabled: privacySettings.showProgress,
			details: "Others can see your learning hours, completion rates, and skill development when viewing your profile.",
		},
		{
			id: "showAchievements",
			title: "Show Achievements",
			description: "Display your badges and milestones on your public profile",
			icon: Trophy,
			category: "visibility",
			impact: "low",
			enabled: privacySettings.showAchievements,
			details: "Your achievement badges, certificates, and learning milestones will be visible to other users.",
		},
		{
			id: "showOnlineStatus",
			title: "Online Status",
			description: "Show when you're actively learning or online",
			icon: Activity,
			category: "visibility",
			impact: "low",
			enabled: privacySettings.showOnlineStatus,
			details: "Other users can see when you're currently online and engaged in learning activities.",
		},
	];

	const communicationControls = [
		{
			id: "allowMessageFromStudents",
			title: "Messages from Students",
			description: "Allow other students to send you direct messages",
			icon: MessageCircle,
			category: "communication",
			impact: "medium",
			enabled: privacySettings.allowMessageFromStudents,
			details: "Other learners can reach out to you for study groups, questions, or collaboration opportunities.",
		},
		{
			id: "allowMessageFromInstructors",
			title: "Messages from Instructors",
			description: "Allow course instructors to contact you directly",
			icon: UserCheck,
			category: "communication",
			impact: "low",
			enabled: privacySettings.allowMessageFromInstructors,
			details: "Course creators and instructors can send you personalized feedback and learning recommendations.",
		},
	];

	const dataControls = [
		{
			id: "dataSharing",
			title: "Anonymous Data Sharing",
			description: "Share anonymized learning data to improve AI algorithms",
			icon: Database,
			category: "data",
			impact: "low",
			enabled: privacySettings.dataSharing,
			details: "Help improve the AI tutoring system by sharing anonymized learning patterns. No personal information is included.",
		},
		{
			id: "analyticsOptIn",
			title: "Learning Analytics",
			description: "Allow detailed analysis of your learning patterns for personalization",
			icon: Brain,
			category: "data",
			impact: "high",
			enabled: privacySettings.analyticsOptIn,
			details: "Enable advanced AI analysis of your learning behavior to provide highly personalized recommendations and adaptive tutoring.",
		},
	];

	const securityControls = [
		{
			id: "twoFactorEnabled",
			title: "Two-Factor Authentication",
			description: "Add an extra layer of security to your account",
			icon: Shield,
			category: "security",
			impact: "high",
			enabled: securitySettings.twoFactorEnabled,
			details: "Require a second verification step when logging in from new devices or locations.",
			recommended: true,
		},
		{
			id: "loginAlerts",
			title: "Login Notifications",
			description: "Get notified when someone logs into your account",
			icon: Bell,
			category: "security",
			impact: "medium",
			enabled: securitySettings.loginAlerts,
			details: "Receive immediate alerts via email or push notification for all login attempts.",
			recommended: true,
		},
		{
			id: "sessionTimeout",
			title: "Automatic Session Timeout",
			description: "Automatically log out after 30 minutes of inactivity",
			icon: Clock,
			category: "security",
			impact: "medium",
			enabled: securitySettings.sessionTimeout,
			details: "Protect your account by automatically ending sessions when you're away from the device.",
		},
		{
			id: "deviceTracking",
			title: "Device Tracking",
			description: "Monitor and manage devices that access your account",
			icon: Smartphone,
			category: "security",
			impact: "medium",
			enabled: securitySettings.deviceTracking,
			details: "Keep track of all devices that have accessed your account and revoke access if needed.",
		},
		{
			id: "suspiciousActivityAlerts",
			title: "Suspicious Activity Alerts",
			description: "Get notified of unusual account activity",
			icon: AlertTriangle,
			category: "security",
			impact: "high",
			enabled: securitySettings.suspiciousActivityAlerts,
			details: "Immediate notifications for unusual login patterns, multiple failed attempts, or suspicious behavior.",
			recommended: true,
		},
	];

	const dataManagementOptions = [
		{
			title: "Download Your Data",
			description: "Export all your learning data, progress, and personal information",
			icon: Download,
			action: "download",
			color: "text-blue-600",
			buttonText: "Download Archive",
		},
		{
			title: "Data Portability",
			description: "Transfer your learning progress to another platform",
			icon: Share2,
			action: "export",
			color: "text-green-600",
			buttonText: "Export Data",
		},
		{
			title: "Reset Learning Data",
			description: "Clear all progress and start fresh with a clean slate",
			icon: RefreshCw,
			action: "reset",
			color: "text-orange-600",
			buttonText: "Reset Progress",
			warning: true,
		},
		{
			title: "Delete Account",
			description: "Permanently remove your account and all associated data",
			icon: Trash2,
			action: "delete",
			color: "text-red-600",
			buttonText: "Delete Account",
			warning: true,
		},
	];

	const handlePrivacyChange = (settingId: string, value: boolean) => {
		const newSettings = { ...privacySettings, [settingId]: value };
		setPrivacySettings(newSettings);
		setPendingChanges(true);
	};

	const handleSecurityChange = (settingId: string, value: boolean) => {
		const newSettings = { ...securitySettings, [settingId]: value };
		setSecuritySettings(newSettings);
		setPendingChanges(true);
	};

	const handleSaveChanges = () => {
		onUpdate({
			privacySettings,
			securitySettings,
		});
		setPendingChanges(false);
	};

	const handleDataAction = (action: string) => {
		console.log(`Performing data action: ${action}`);
		// Handle different data management actions
		switch (action) {
			case "download":
				// Trigger data download
				break;
			case "export":
				// Export to external platform
				break;
			case "reset":
				// Reset learning progress
				break;
			case "delete":
				// Delete account (with confirmation)
				break;
		}
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case "high":
				return "text-red-600";
			case "medium":
				return "text-orange-600";
			case "low":
				return "text-green-600";
			default:
				return "text-gray-600";
		}
	};

	const getImpactBadge = (impact: string) => {
		const colors = {
			high: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300",
			medium: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
			low: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
		};
		return colors[impact as keyof typeof colors] || colors.low;
	};

	const renderControlGroup = (title: string, controls: any[], icon: React.ElementType, description: string, isSecurityGroup = false) => (
		<Card className="adaptive-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-3">
					<div className={`w-10 h-10 rounded-xl ${isSecurityGroup ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gradient-primary"} flex items-center justify-center`}>{React.createElement(icon, { className: "w-5 h-5 text-white" })}</div>
					<div>
						<span>{title}</span>
						<p className="text-sm font-normal text-muted-foreground">{description}</p>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{controls.map((control, index) => (
					<motion.div
						key={control.id}
						className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-start gap-3 flex-1">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
									<control.icon className="w-4 h-4 text-muted-foreground" />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium text-foreground">{control.title}</h4>
										{control.recommended && (
											<Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
												Recommended
											</Badge>
										)}
										<Badge variant="secondary" className={`text-xs ${getImpactBadge(control.impact)}`}>
											{control.impact} impact
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground mb-2">{control.description}</p>
									{showAdvanced && <p className="text-xs text-blue-600 dark:text-blue-400 italic">{control.details}</p>}
								</div>
							</div>
							<motion.button
								className={`w-12 h-6 rounded-full transition-colors ${control.enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
								onClick={() => {
									if (isSecurityGroup) {
										handleSecurityChange(control.id, !control.enabled);
									} else {
										handlePrivacyChange(control.id, !control.enabled);
									}
								}}
								whileTap={{ scale: 0.95 }}
							>
								<motion.div className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: control.enabled ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
							</motion.button>
						</div>
					</motion.div>
				))}
			</CardContent>
		</Card>
	);

	return (
		<div className="space-y-6">
			{/* Privacy Overview */}
			<Card className="adaptive-card intelligence-glow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="w-5 h-5 text-primary" />
						Privacy & Security Center
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Privacy Score */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-green-500 flex items-center justify-center">
								<Shield className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-green-800 dark:text-green-200">High</p>
							<p className="text-xs text-green-600 dark:text-green-300">Privacy Level</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500 flex items-center justify-center">
								<Key className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-blue-800 dark:text-blue-200">Strong</p>
							<p className="text-xs text-blue-600 dark:text-blue-300">Security Score</p>
						</div>

						<div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl border border-purple-200/30">
							<div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-500 flex items-center justify-center">
								<Database className="w-6 h-6 text-white" />
							</div>
							<p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{privacySettings.dataSharing ? "Shared" : "Private"}</p>
							<p className="text-xs text-purple-600 dark:text-purple-300">Data Status</p>
						</div>
					</div>

					{/* Quick Actions */}
					<div className="flex flex-wrap gap-3">
						<EnhancedButton variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
							<Settings className="w-4 h-4 mr-1" />
							{showAdvanced ? "Hide" : "Show"} Details
						</EnhancedButton>

						<EnhancedButton variant="outline" size="sm">
							<Eye className="w-4 h-4 mr-1" />
							Privacy Checkup
						</EnhancedButton>

						<EnhancedButton variant="outline" size="sm">
							<Download className="w-4 h-4 mr-1" />
							Privacy Report
						</EnhancedButton>
					</div>
				</CardContent>
			</Card>

			{/* Profile Visibility */}
			{renderControlGroup("Profile Visibility", privacyControls, Eye, "Control what others can see about your learning journey")}

			{/* Communication Preferences */}
			{renderControlGroup("Communication", communicationControls, MessageCircle, "Manage who can contact you and how")}

			{/* Data & Analytics */}
			{renderControlGroup("Data & Analytics", dataControls, Database, "Control how your learning data is used and shared")}

			{/* Security Settings */}
			{renderControlGroup("Security Settings", securityControls, Shield, "Protect your account with advanced security features", true)}

			{/* Data Management */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
							<Database className="w-5 h-5 text-white" />
						</div>
						<div>
							<span>Data Management</span>
							<p className="text-sm font-normal text-muted-foreground">Export, reset, or delete your learning data</p>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{dataManagementOptions.map((option, index) => (
						<motion.div
							key={option.action}
							className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							onClick={() => handleDataAction(option.action)}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							<div className="flex items-center gap-3">
								<option.icon className={`w-5 h-5 ${option.color}`} />
								<div>
									<p className="font-medium text-foreground group-hover:text-primary transition-colors">{option.title}</p>
									<p className="text-sm text-muted-foreground">{option.description}</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{option.warning && <AlertTriangle className="w-4 h-4 text-orange-500" />}
								<EnhancedButton variant="outline" size="sm">
									{option.buttonText}
								</EnhancedButton>
							</div>
						</motion.div>
					))}
				</CardContent>
			</Card>

			{/* AI Learning Impact */}
			<Card className="adaptive-card">
				<CardHeader>
					<CardTitle className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center">
							<Brain className="w-5 h-5 text-white" />
						</div>
						<div>
							<span>AI Learning Impact</span>
							<p className="text-sm font-normal text-muted-foreground">How your privacy settings affect AI personalization</p>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4">
						<div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30">
							<div className="flex items-start gap-3">
								<CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
								<div>
									<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Current AI Personalization Level: {privacySettings.analyticsOptIn ? "High" : "Limited"}</h4>
									<p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
										{privacySettings.analyticsOptIn ? "Your AI coach has full access to learning patterns for optimal personalization." : "Limited data access means less personalized recommendations but higher privacy."}
									</p>
									<div className="grid grid-cols-2 gap-3 text-xs">
										<div>
											<p className="text-blue-700 dark:text-blue-200 font-medium">Enhanced Features:</p>
											<ul className="text-blue-600 dark:text-blue-300 mt-1 space-y-1">
												<li>• Adaptive difficulty adjustment</li>
												<li>• Personalized learning paths</li>
												<li>• Predictive recommendations</li>
											</ul>
										</div>
										<div>
											<p className="text-blue-700 dark:text-blue-200 font-medium">Privacy Protection:</p>
											<ul className="text-blue-600 dark:text-blue-300 mt-1 space-y-1">
												<li>• Anonymous data processing</li>
												<li>• Encrypted data transmission</li>
												<li>• No third-party sharing</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Save Changes Button */}
			{pendingChanges && (
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
					<div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-floating border border-border">
						<Info className="w-4 h-4 text-blue-600" />
						<span className="text-sm font-medium">You have unsaved changes</span>
						<div className="flex gap-2">
							<EnhancedButton
								variant="outline"
								size="sm"
								onClick={() => {
									setPrivacySettings(userData.privacySettings);
									setSecuritySettings(userData.securitySettings);
									setPendingChanges(false);
								}}
							>
								<X className="w-3 h-3 mr-1" />
								Cancel
							</EnhancedButton>
							<EnhancedButton variant="ai-primary" size="sm" onClick={handleSaveChanges} disabled={isLoading} withGlow>
								<Save className="w-3 h-3 mr-1" />
								Save Changes
							</EnhancedButton>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
