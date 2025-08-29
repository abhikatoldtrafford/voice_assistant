"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	User,
	Mail,
	Phone,
	MapPin,
	Calendar,
	Briefcase,
	GraduationCap,
	Heart,
	Globe,
	Github,
	Linkedin,
	ExternalLink,
	Save,
	Plus,
	X,
	Edit3,
	Languages,
	Clock,
	Users,
	Award,
	Book,
	Home,
	Building,
	Flag,
	Camera,
	Shield,
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	Target,
	TrendingUp,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";

interface PersonalInformationProps {
	userData: IUserProfileData;
	onUpdate: (updates: Partial<IUserProfileData>) => void;
	isLoading: boolean;
}

export default function PersonalInformation({ userData, onUpdate, isLoading }: PersonalInformationProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [activeSection, setActiveSection] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		firstName: userData.personalInfo.firstName || "",
		lastName: userData.personalInfo.lastName || "",
		email: userData.email,
		phoneNumber: userData.personalInfo.phoneNumber || "",
		bio: userData.personalInfo.bio || "",
		occupation: userData.personalInfo.occupation || "",
		dateOfBirth: userData.personalInfo.dateOfBirth ? new Date(userData.personalInfo.dateOfBirth).toISOString().split("T")[0] : "",
		gender: userData.personalInfo.gender || "",
		street: userData.personalInfo.address?.street || "",
		city: userData.personalInfo.address?.city || "",
		state: userData.personalInfo.address?.state || "",
		zipCode: userData.personalInfo.address?.zipCode || "",
		country: userData.personalInfo.address?.country || "",
		timezone: userData.personalInfo.timezone || "",
		linkedin: userData.personalInfo.linkedin || "",
		github: userData.personalInfo.github || "",
		portfolio: userData.personalInfo.portfolio || "",
		emergencyContactName: userData.personalInfo.emergencyContact?.name || "",
		emergencyContactPhone: userData.personalInfo.emergencyContact?.phoneNumber || "",
		emergencyContactEmail: userData.personalInfo.emergencyContact?.email || "",
		emergencyContactRelationship: userData.personalInfo.emergencyContact?.relationship || "",
		degree: userData.personalInfo.education?.degree || "",
		institution: userData.personalInfo.education?.institution || "",
		fieldOfStudy: userData.personalInfo.education?.fieldOfStudy || "",
		graduationYear: userData.personalInfo.education?.graduationYear?.toString() || "",
	});

	const [interests, setInterests] = useState(userData.personalInfo.interests || []);
	const [languages, setLanguages] = useState(userData.personalInfo.languages || []);
	const [newInterest, setNewInterest] = useState("");
	const [newLanguage, setNewLanguage] = useState("");

	const handleSave = () => {
		const updates: Partial<IUserProfileData> = {
			email: formData.email,
			personalInfo: {
				...userData.personalInfo,
				firstName: formData.firstName,
				lastName: formData.lastName,
				phoneNumber: formData.phoneNumber,
				bio: formData.bio,
				occupation: formData.occupation,
				dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
				gender: formData.gender as any,
				address: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					zipCode: formData.zipCode,
					country: formData.country,
				},
				timezone: formData.timezone,
				linkedin: formData.linkedin,
				github: formData.github,
				portfolio: formData.portfolio,
				emergencyContact: {
					name: formData.emergencyContactName,
					phoneNumber: formData.emergencyContactPhone,
					email: formData.emergencyContactEmail,
					relationship: formData.emergencyContactRelationship,
				},
				education: {
					degree: formData.degree,
					institution: formData.institution,
					fieldOfStudy: formData.fieldOfStudy,
					graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
				},
				interests,
				languages,
			},
		};
		onUpdate(updates);
		setIsEditing(false);
		setActiveSection(null);
	};

	const addInterest = () => {
		if (newInterest.trim() && !interests.includes(newInterest.trim())) {
			setInterests([...interests, newInterest.trim()]);
			setNewInterest("");
		}
	};

	const removeInterest = (interest: string) => {
		setInterests(interests.filter((i) => i !== interest));
	};

	const addLanguage = () => {
		if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
			setLanguages([...languages, newLanguage.trim()]);
			setNewLanguage("");
		}
	};

	const removeLanguage = (language: string) => {
		setLanguages(languages.filter((l) => l !== language));
	};

	const personalDetails = [
		{
			icon: User,
			label: "Full Name",
			value: `${userData.personalInfo.firstName || ""} ${userData.personalInfo.lastName || ""}`.trim() || "Not provided",
			isComplete: !!(userData.personalInfo.firstName && userData.personalInfo.lastName),
		},
		{
			icon: Mail,
			label: "Email",
			value: userData.email,
			isComplete: !!userData.email,
			verified: true,
		},
		{
			icon: Phone,
			label: "Phone",
			value: userData.personalInfo.phoneNumber || "Not provided",
			isComplete: !!userData.personalInfo.phoneNumber,
		},
		{
			icon: Calendar,
			label: "Date of Birth",
			value: userData.personalInfo.dateOfBirth ? new Date(userData.personalInfo.dateOfBirth).toLocaleDateString() : "Not provided",
			isComplete: !!userData.personalInfo.dateOfBirth,
		},
		{
			icon: Briefcase,
			label: "Occupation",
			value: userData.personalInfo.occupation || "Not provided",
			isComplete: !!userData.personalInfo.occupation,
		},
		{
			icon: Clock,
			label: "Timezone",
			value: userData.personalInfo.timezone || "UTC",
			isComplete: !!userData.personalInfo.timezone,
		},
	];

	const socialLinks = [
		{
			icon: Linkedin,
			label: "LinkedIn",
			value: userData.personalInfo.linkedin,
			color: "text-blue-600",
			placeholder: "https://linkedin.com/in/yourprofile",
		},
		{
			icon: Github,
			label: "GitHub",
			value: userData.personalInfo.github,
			color: "text-gray-800 dark:text-gray-200",
			placeholder: "https://github.com/yourusername",
		},
		{
			icon: Globe,
			label: "Portfolio",
			value: userData.personalInfo.portfolio,
			color: "text-green-600",
			placeholder: "https://yourportfolio.com",
		},
	];

	const timezones = [
		{ value: "America/Los_Angeles", label: "Pacific Time (PT)" },
		{ value: "America/Denver", label: "Mountain Time (MT)" },
		{ value: "America/Chicago", label: "Central Time (CT)" },
		{ value: "America/New_York", label: "Eastern Time (ET)" },
		{ value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
		{ value: "Europe/Paris", label: "Central European Time (CET)" },
		{ value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
		{ value: "Asia/Shanghai", label: "China Standard Time (CST)" },
		{ value: "Asia/Kolkata", label: "India Standard Time (IST)" },
		{ value: "UTC", label: "Coordinated Universal Time (UTC)" },
	];

	const genderOptions = [
		{ value: "", label: "Select gender" },
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
		{ value: "non-binary", label: "Non-binary" },
		{ value: "prefer-not-to-say", label: "Prefer not to say" },
	];

	const calculateCompletionScore = () => {
		const fields = [
			userData.personalInfo.firstName,
			userData.personalInfo.lastName,
			userData.personalInfo.phoneNumber,
			userData.personalInfo.bio,
			userData.personalInfo.occupation,
			userData.personalInfo.dateOfBirth,
			userData.personalInfo.address?.city,
			userData.personalInfo.address?.country,
			interests.length > 0,
			languages.length > 0,
		];
		return Math.round((fields.filter(Boolean).length / fields.length) * 100);
	};

	const completionScore = calculateCompletionScore();

	return (
		<div className="space-y-6">
			{/* Profile Completion Overview */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
				<Card className="adaptive-card border-blue-200 dark:border-blue-800">
					<CardContent className="p-6">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative">
								<User className="w-8 h-8 text-white" />
								<div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
									<span className="text-xs font-bold text-blue-600">{completionScore}%</span>
								</div>
							</div>
							<div className="flex-1">
								<h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
								<p className="text-muted-foreground">Complete your profile to get better AI recommendations and personalized learning experiences.</p>
								<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
									<motion.div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${completionScore}%` }} transition={{ duration: 1, delay: 0.3 }} />
								</div>
							</div>
							<EnhancedButton variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} disabled={isLoading}>
								<Edit3 className="w-4 h-4 mr-1" />
								{isEditing ? "Cancel" : "Edit Profile"}
							</EnhancedButton>
						</div>
					</CardContent>
				</Card>
			</motion.div>

			{/* Basic Information */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
				<Card className="adaptive-card">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5 text-primary" />
								Basic Information
							</CardTitle>
							{!isEditing && (
								<Badge variant="secondary" className={completionScore >= 60 ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300" : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"}>
									{completionScore >= 60 ? "Well Complete" : "Needs Attention"}
								</Badge>
							)}
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{isEditing ? (
							<div className="space-y-6">
								{/* Basic Details */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">First Name *</label>
										<Input
											value={formData.firstName}
											onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
											placeholder="Enter your first name"
											className={!formData.firstName ? "border-orange-300 dark:border-orange-700" : ""}
										/>
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Last Name *</label>
										<Input
											value={formData.lastName}
											onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
											placeholder="Enter your last name"
											className={!formData.lastName ? "border-orange-300 dark:border-orange-700" : ""}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
										<Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="+1 (555) 123-4567" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Date of Birth</label>
										<Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Gender</label>
										<select
											value={formData.gender}
											onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
											className="w-full p-3 rounded-lg border border-border bg-background text-foreground hover:border-border/80 transition-colors"
										>
											{genderOptions.map((option) => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Occupation</label>
										<Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} placeholder="Your current job title" />
									</div>
								</div>

								<div>
									<label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
									<Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself, your interests, and your learning goals..." rows={4} className="resize-none" />
									<p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/500 characters</p>
								</div>
							</div>
						) : (
							<div className="grid gap-4">
								{personalDetails.map((detail, index) => (
									<motion.div
										key={detail.label}
										className="flex items-center gap-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all group cursor-pointer"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										whileHover={{ scale: 1.01 }}
									>
										<div className={`w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-lg transition-shadow`}>
											<detail.icon className="w-5 h-5 text-white" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<p className="font-medium text-foreground">{detail.label}</p>
												{detail.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
												{!detail.isComplete && <AlertTriangle className="w-4 h-4 text-orange-500" />}
											</div>
											<p className={`text-sm ${detail.isComplete ? "text-muted-foreground" : "text-orange-600 dark:text-orange-400"}`}>{detail.value}</p>
										</div>
										<div className={`w-3 h-3 rounded-full ${detail.isComplete ? "bg-green-500" : "bg-orange-500"}`} />
									</motion.div>
								))}

								{/* Bio Section */}
								{userData.personalInfo.bio && (
									<motion.div
										className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200/30"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6 }}
									>
										<h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
											<Sparkles className="w-4 h-4" />
											About Me
										</h4>
										<p className="text-blue-700 dark:text-blue-300 leading-relaxed">{userData.personalInfo.bio}</p>
									</motion.div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Address Information */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MapPin className="w-5 h-5 text-primary" />
							Address & Location
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isEditing ? (
							<div className="space-y-4">
								<div>
									<label className="text-sm font-medium text-foreground mb-2 block">Street Address</label>
									<Input value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })} placeholder="123 Main Street, Apt 4B" />
								</div>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">City</label>
										<Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="San Francisco" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">State/Province</label>
										<Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="CA" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">ZIP Code</label>
										<Input value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} placeholder="94105" />
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Country</label>
										<Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} placeholder="United States" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
										<select
											value={formData.timezone}
											onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
											className="w-full p-3 rounded-lg border border-border bg-background text-foreground hover:border-border/80 transition-colors"
										>
											{timezones.map((tz) => (
												<option key={tz.value} value={tz.value}>
													{tz.label}
												</option>
											))}
										</select>
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center gap-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
									<div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
										<Home className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1">
										<p className="font-medium text-foreground">Home Address</p>
										<p className="text-sm text-muted-foreground">
											{[userData.personalInfo.address?.street, userData.personalInfo.address?.city, userData.personalInfo.address?.state, userData.personalInfo.address?.zipCode].filter(Boolean).join(", ") || "No address provided"}
										</p>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
										<Flag className="w-5 h-5 text-blue-600" />
										<div>
											<p className="text-sm font-medium text-foreground">Country</p>
											<p className="text-xs text-muted-foreground">{userData.personalInfo.address?.country || "Not specified"}</p>
										</div>
									</div>

									<div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
										<Clock className="w-5 h-5 text-purple-600" />
										<div>
											<p className="text-sm font-medium text-foreground">Timezone</p>
											<p className="text-xs text-muted-foreground">{timezones.find((tz) => tz.value === userData.personalInfo.timezone)?.label || userData.personalInfo.timezone || "UTC"}</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Social Links */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Globe className="w-5 h-5 text-primary" />
							Social Links & Portfolio
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isEditing ? (
							<div className="space-y-4">
								{socialLinks.map((link, index) => (
									<div key={link.label}>
										<label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
											<link.icon className={`w-4 h-4 ${link.color}`} />
											{link.label} Profile
										</label>
										<Input
											value={formData[link.label.toLowerCase() as keyof typeof formData] as string}
											onChange={(e) =>
												setFormData({
													...formData,
													[link.label.toLowerCase()]: e.target.value,
												})
											}
											placeholder={link.placeholder}
										/>
									</div>
								))}
							</div>
						) : (
							<div className="space-y-3">
								{socialLinks.map((link, index) => (
									<motion.div
										key={link.label}
										className="flex items-center justify-between p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all group"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:shadow-lg transition-shadow">
												<link.icon className={`w-5 h-5 ${link.color}`} />
											</div>
											<div>
												<span className="font-medium text-foreground">{link.label}</span>
												{!link.value && <p className="text-xs text-muted-foreground">Not connected</p>}
											</div>
										</div>
										{link.value ? (
											<a
												href={link.value}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
											>
												<span className="text-sm">Visit</span>
												<ExternalLink className="w-3 h-3" />
											</a>
										) : (
											<Badge variant="secondary" className="text-xs">
												Not Set
											</Badge>
										)}
									</motion.div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Interests & Languages */}
			<div className="grid lg:grid-cols-2 gap-6">
				{/* Interests */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
					<Card className="adaptive-card h-full">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Heart className="w-5 h-5 text-primary" />
								Interests & Hobbies
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2 min-h-[40px]">
									{interests.map((interest, index) => (
										<motion.div
											key={interest}
											className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: index * 0.1 }}
											whileHover={{ scale: 1.05 }}
										>
											<span>{interest}</span>
											{isEditing && (
												<button onClick={() => removeInterest(interest)} className="ml-1 hover:text-red-600 transition-colors">
													<X className="w-3 h-3" />
												</button>
											)}
										</motion.div>
									))}
									{interests.length === 0 && !isEditing && <p className="text-sm text-muted-foreground italic">No interests added yet</p>}
								</div>

								{isEditing && (
									<div className="flex gap-2">
										<Input value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Add new interest (e.g., Photography, Hiking)" onKeyPress={(e) => e.key === "Enter" && addInterest()} />
										<EnhancedButton onClick={addInterest} size="sm" disabled={!newInterest.trim()}>
											<Plus className="w-4 h-4" />
										</EnhancedButton>
									</div>
								)}

								{!isEditing && interests.length > 0 && (
									<div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/30">
										<p className="text-xs text-blue-700 dark:text-blue-300">💡 Your interests help our AI coach recommend relevant learning content and examples</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Languages */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
					<Card className="adaptive-card h-full">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Languages className="w-5 h-5 text-primary" />
								Languages Spoken
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex flex-wrap gap-2 min-h-[40px]">
									{languages.map((language, index) => (
										<motion.div
											key={language}
											className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm border border-green-200 dark:border-green-800"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: index * 0.1 }}
											whileHover={{ scale: 1.05 }}
										>
											<span>{language}</span>
											{isEditing && (
												<button onClick={() => removeLanguage(language)} className="ml-1 hover:text-red-600 transition-colors">
													<X className="w-3 h-3" />
												</button>
											)}
										</motion.div>
									))}
									{languages.length === 0 && !isEditing && <p className="text-sm text-muted-foreground italic">No languages added yet</p>}
								</div>

								{isEditing && (
									<div className="flex gap-2">
										<Input value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="Add language (e.g., English, Spanish)" onKeyPress={(e) => e.key === "Enter" && addLanguage()} />
										<EnhancedButton onClick={addLanguage} size="sm" disabled={!newLanguage.trim()}>
											<Plus className="w-4 h-4" />
										</EnhancedButton>
									</div>
								)}

								{!isEditing && languages.length > 0 && (
									<div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/30">
										<p className="text-xs text-green-700 dark:text-green-300">🌍 Multilingual skills open doors to global opportunities and diverse learning resources</p>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>

			{/* Education */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<GraduationCap className="w-5 h-5 text-primary" />
							Education Background
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Degree</label>
										<Input value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} placeholder="Bachelor's, Master's, PhD, High School, etc." />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Field of Study</label>
										<Input value={formData.fieldOfStudy} onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })} placeholder="Computer Science, Business, Psychology, etc." />
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Institution</label>
										<Input value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} placeholder="University of California, Berkeley" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Graduation Year</label>
										<Input type="number" value={formData.graduationYear} onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })} placeholder="2020" min="1950" max="2030" />
									</div>
								</div>
							</div>
						) : (
							<div className="space-y-4">
								{userData.personalInfo.education?.degree ? (
									<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
												<Book className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-foreground text-lg">
													{userData.personalInfo.education.degree}
													{userData.personalInfo.education.fieldOfStudy && ` in ${userData.personalInfo.education.fieldOfStudy}`}
												</h4>
												<div className="flex items-center gap-4 mt-2 text-muted-foreground">
													{userData.personalInfo.education.institution && (
														<div className="flex items-center gap-1">
															<Building className="w-4 h-4" />
															<span className="text-sm">{userData.personalInfo.education.institution}</span>
														</div>
													)}
													{userData.personalInfo.education.graduationYear && (
														<div className="flex items-center gap-1">
															<Calendar className="w-4 h-4" />
															<span className="text-sm">Class of {userData.personalInfo.education.graduationYear}</span>
														</div>
													)}
												</div>
											</div>
											<Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
												<Award className="w-3 h-3 mr-1" />
												Verified
											</Badge>
										</div>
									</div>
								) : (
									<div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
										<GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
										<p className="text-muted-foreground">No education information provided</p>
										<p className="text-sm text-muted-foreground mt-1">Add your educational background to help our AI coach understand your learning foundation</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* Emergency Contact */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="w-5 h-5 text-primary" />
							Emergency Contact
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isEditing ? (
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Contact Name</label>
										<Input value={formData.emergencyContactName} onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} placeholder="Full name of emergency contact" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Relationship</label>
										<Input value={formData.emergencyContactRelationship} onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })} placeholder="Parent, Spouse, Sibling, Friend, etc." />
									</div>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
										<Input value={formData.emergencyContactPhone} onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })} placeholder="+1 (555) 123-4567" />
									</div>
									<div>
										<label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
										<Input type="email" value={formData.emergencyContactEmail} onChange={(e) => setFormData({ ...formData, emergencyContactEmail: e.target.value })} placeholder="emergency@example.com" />
									</div>
								</div>
							</div>
						) : (
							<div>
								{userData.personalInfo.emergencyContact?.name ? (
									<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl">
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
												<Users className="w-6 h-6 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-foreground">{userData.personalInfo.emergencyContact.name}</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
													{userData.personalInfo.emergencyContact.relationship && (
														<div className="flex items-center gap-1">
															<Heart className="w-4 h-4" />
															<span>{userData.personalInfo.emergencyContact.relationship}</span>
														</div>
													)}
													{userData.personalInfo.emergencyContact.phoneNumber && (
														<div className="flex items-center gap-1">
															<Phone className="w-4 h-4" />
															<span>{userData.personalInfo.emergencyContact.phoneNumber}</span>
														</div>
													)}
													{userData.personalInfo.emergencyContact.email && (
														<div className="flex items-center gap-1">
															<Mail className="w-4 h-4" />
															<span>{userData.personalInfo.emergencyContact.email}</span>
														</div>
													)}
												</div>
											</div>
											<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
												<Shield className="w-3 h-3 mr-1" />
												Secure
											</Badge>
										</div>
									</div>
								) : (
									<div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
										<Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
										<p className="text-muted-foreground">No emergency contact information provided</p>
										<p className="text-sm text-muted-foreground mt-1">Add emergency contact details for your safety and peace of mind</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>

			{/* AI Insights */}
			{!isEditing && completionScore > 0 && (
				<motion.div
					className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200/30"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
				>
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
							<TrendingUp className="w-6 h-6 text-white" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">AI Profile Analysis</h3>
							<div className="grid gap-3">
								<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-indigo-300/20">
									<div className="flex items-center gap-2 mb-1">
										<Target className="w-4 h-4 text-blue-600" />
										<span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Profile Completeness</span>
									</div>
									<p className="text-sm text-indigo-600 dark:text-indigo-400">
										Your profile is {completionScore}% complete.
										{completionScore >= 80
											? " Excellent! Your AI coach has rich context for personalization."
											: completionScore >= 60
											? " Good progress! A few more details will enhance your experience."
											: " Consider adding more information to unlock personalized learning features."}
									</p>
								</div>

								{userData.personalInfo.interests && userData.personalInfo.interests.length > 0 && (
									<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-indigo-300/20">
										<div className="flex items-center gap-2 mb-1">
											<Heart className="w-4 h-4 text-pink-600" />
											<span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Personalization Boost</span>
										</div>
										<p className="text-sm text-indigo-600 dark:text-indigo-400">
											Your interests in {userData.personalInfo.interests.slice(0, 2).join(" and ")}
											{userData.personalInfo.interests.length > 2 && ` (and ${userData.personalInfo.interests.length - 2} more)`}
											help us create more engaging and relevant learning content.
										</p>
									</div>
								)}

								{userData.personalInfo.occupation && (
									<div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-indigo-300/20">
										<div className="flex items-center gap-2 mb-1">
											<Briefcase className="w-4 h-4 text-green-600" />
											<span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Career-Focused Learning</span>
										</div>
										<p className="text-sm text-indigo-600 dark:text-indigo-400">As a {userData.personalInfo.occupation}, we can recommend courses and skills that align with your career goals.</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</motion.div>
			)}

			{/* Save Button */}
			{isEditing && (
				<motion.div className="flex gap-3 pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
					<EnhancedButton onClick={handleSave} disabled={isLoading} variant="ai-primary" className="flex-1" withGlow aiPersonality="warm">
						<Save className="w-4 h-4 mr-2" />
						Save Personal Information
						<Sparkles className="w-4 h-4 ml-2" />
					</EnhancedButton>

					<EnhancedButton
						onClick={() => {
							setIsEditing(false);
							setActiveSection(null);
						}}
						variant="outline"
						className="flex-1"
					>
						Cancel Changes
					</EnhancedButton>
				</motion.div>
			)}
		</div>
	);
}
