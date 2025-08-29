"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Shield, Key, Globe, Download, Trash2, Eye, EyeOff, Bell, Lock, Smartphone, Mail, AlertTriangle, CheckCircle2, Settings, Database, Share2, Users, Heart, Zap, Save, RefreshCw } from "lucide-react";

interface ProfileSettingsProps {
	userData: {
		email: string;
		name: string;
	};
}

export default function ProfileSettings({ userData }: ProfileSettingsProps) {
	const [showPassword, setShowPassword] = useState(false);
	const [settings, setSettings] = useState({
		emailNotifications: true,
		pushNotifications: true,
		dataSharing: false,
		publicProfile: false,
		analyticsOptIn: true,
		twoFactorEnabled: false,
	});

	const [passwords, setPasswords] = useState({
		current: "",
		new: "",
		confirm: "",
	});

	const securitySettings = [
		{
			id: "two-factor",
			title: "Two-Factor Authentication",
			description: "Add an extra layer of security to your account",
			icon: Shield,
			enabled: settings.twoFactorEnabled,
			recommended: true,
			action: () => setSettings({ ...settings, twoFactorEnabled: !settings.twoFactorEnabled }),
		},
		{
			id: "login-alerts",
			title: "Login Alerts",
			description: "Get notified of new device logins",
			icon: Bell,
			enabled: true,
			recommended: true,
			action: () => {},
		},
		{
			id: "session-timeout",
			title: "Auto Session Timeout",
			description: "Automatically log out after 30 minutes of inactivity",
			icon: Lock,
			enabled: true,
			recommended: false,
			action: () => {},
		},
	];

	const privacySettings = [
		{
			id: "public-profile",
			title: "Public Profile",
			description: "Allow others to see your learning progress",
			icon: Users,
			enabled: settings.publicProfile,
			action: () => setSettings({ ...settings, publicProfile: !settings.publicProfile }),
		},
		{
			id: "data-sharing",
			title: "Anonymous Data Sharing",
			description: "Help improve AI by sharing anonymized learning data",
			icon: Database,
			enabled: settings.dataSharing,
			action: () => setSettings({ ...settings, dataSharing: !settings.dataSharing }),
		},
		{
			id: "analytics",
			title: "Learning Analytics",
			description: "Allow detailed analysis of your learning patterns",
			icon: Zap,
			enabled: settings.analyticsOptIn,
			action: () => setSettings({ ...settings, analyticsOptIn: !settings.analyticsOptIn }),
		},
	];

	const notificationSettings = [
		{
			id: "email",
			title: "Email Notifications",
			description: "Course updates, achievements, and reminders",
			icon: Mail,
			enabled: settings.emailNotifications,
			action: () => setSettings({ ...settings, emailNotifications: !settings.emailNotifications }),
		},
		{
			id: "push",
			title: "Push Notifications",
			description: "Real-time alerts and study reminders",
			icon: Smartphone,
			enabled: settings.pushNotifications,
			action: () => setSettings({ ...settings, pushNotifications: !settings.pushNotifications }),
		},
	];

	const dataActions = [
		{
			title: "Download Your Data",
			description: "Export all your learning data and progress",
			icon: Download,
			action: "download",
			color: "text-blue-600",
		},
		{
			title: "Share Profile",
			description: "Generate a shareable link to your achievements",
			icon: Share2,
			action: "share",
			color: "text-green-600",
		},
		{
			title: "Reset Progress",
			description: "Start fresh with a clean learning slate",
			icon: RefreshCw,
			action: "reset",
			color: "text-orange-600",
		},
		{
			title: "Delete Account",
			description: "Permanently remove your account and all data",
			icon: Trash2,
			action: "delete",
			color: "text-red-600",
		},
	];

	const handlePasswordChange = () => {
		if (passwords.new !== passwords.confirm) {
			alert("New passwords don't match!");
			return;
		}
		// Password change logic here
		console.log("Changing password...");
		setPasswords({ current: "", new: "", confirm: "" });
	};

	const handleDataAction = (action: string) => {
		console.log(`Performing action: ${action}`);
		// Handle different data actions
	};

	return (
		<Card className="adaptive-card">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="w-5 h-5 text-primary" />
					Account & Security Settings
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				{/* Account Information */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Key className="w-4 h-4" />
						Account Information
					</h3>
					<div className="grid gap-4">
						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
							<Input type="email" value={userData.email} disabled className="bg-gray-50 dark:bg-gray-800" />
							<p className="text-xs text-muted-foreground mt-1">Contact support to change your email address</p>
						</div>
					</div>
				</div>

				{/* Password Change */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Lock className="w-4 h-4" />
						Change Password
					</h3>
					<div className="space-y-3">
						<div>
							<label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
							<div className="relative">
								<Input type={showPassword ? "text" : "password"} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="Enter current password" />
								<button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
								</button>
							</div>
						</div>

						<div className="grid md:grid-cols-2 gap-3">
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
								<Input type={showPassword ? "text" : "password"} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} placeholder="Enter new password" />
							</div>
							<div>
								<label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
								<Input type={showPassword ? "text" : "password"} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="Confirm new password" />
							</div>
						</div>

						<EnhancedButton variant="ai-primary" onClick={handlePasswordChange} disabled={!passwords.current || !passwords.new || !passwords.confirm}>
							<Save className="w-4 h-4 mr-2" />
							Update Password
						</EnhancedButton>
					</div>
				</div>

				{/* Security Settings */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Shield className="w-4 h-4" />
						Security Settings
					</h3>
					<div className="space-y-3">
						{securitySettings.map((setting, index) => (
							<motion.div
								key={setting.id}
								className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
										<setting.icon className="w-4 h-4 text-white" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="font-medium text-foreground">{setting.title}</p>
											{setting.recommended && (
												<Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
													Recommended
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground">{setting.description}</p>
									</div>
								</div>
								<motion.button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`} onClick={setting.action} whileTap={{ scale: 0.95 }}>
									<motion.div className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: setting.enabled ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
								</motion.button>
							</motion.div>
						))}
					</div>
				</div>

				{/* Privacy Settings */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Eye className="w-4 h-4" />
						Privacy Settings
					</h3>
					<div className="space-y-3">
						{privacySettings.map((setting, index) => (
							<motion.div
								key={setting.id}
								className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 + index * 0.1 }}
							>
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
										<setting.icon className="w-4 h-4 text-white" />
									</div>
									<div>
										<p className="font-medium text-foreground">{setting.title}</p>
										<p className="text-sm text-muted-foreground">{setting.description}</p>
									</div>
								</div>
								<motion.button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`} onClick={setting.action} whileTap={{ scale: 0.95 }}>
									<motion.div className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: setting.enabled ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
								</motion.button>
							</motion.div>
						))}
					</div>
				</div>

				{/* Notification Settings */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Bell className="w-4 h-4" />
						Notification Settings
					</h3>
					<div className="space-y-3">
						{notificationSettings.map((setting, index) => (
							<motion.div
								key={setting.id}
								className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all"
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.6 + index * 0.1 }}
							>
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
										<setting.icon className="w-4 h-4 text-white" />
									</div>
									<div>
										<p className="font-medium text-foreground">{setting.title}</p>
										<p className="text-sm text-muted-foreground">{setting.description}</p>
									</div>
								</div>
								<motion.button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`} onClick={setting.action} whileTap={{ scale: 0.95 }}>
									<motion.div className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: setting.enabled ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
								</motion.button>
							</motion.div>
						))}
					</div>
				</div>

				{/* Data Management */}
				<div className="space-y-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<Database className="w-4 h-4" />
						Data Management
					</h3>
					<div className="grid gap-3">
						{dataActions.map((action, index) => (
							<motion.div
								key={action.action}
								className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8 + index * 0.1 }}
								onClick={() => handleDataAction(action.action)}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
							>
								<div className="flex items-center gap-3">
									<action.icon className={`w-5 h-5 ${action.color}`} />
									<div>
										<p className="font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</p>
										<p className="text-sm text-muted-foreground">{action.description}</p>
									</div>
								</div>
								{action.action === "delete" && <AlertTriangle className="w-5 h-5 text-red-500" />}
							</motion.div>
						))}
					</div>
				</div>

				{/* Security Notice */}
				<motion.div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200/30" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
					<div className="flex items-start gap-3">
						<CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
						<div>
							<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Your Data is Secure</h4>
							<p className="text-sm text-blue-600 dark:text-blue-300">
								We use industry-standard encryption and security practices to protect your personal information and learning data. Your privacy is our priority, and you have full control over your data.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Save All Settings */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
					<EnhancedButton variant="ai-primary" className="w-full" withGlow>
						<Save className="w-4 h-4 mr-2" />
						Save All Settings
					</EnhancedButton>
				</motion.div>
			</CardContent>
		</Card>
	);
}
