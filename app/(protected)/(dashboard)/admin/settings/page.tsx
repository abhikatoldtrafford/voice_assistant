"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	// General settings
	const [platformName, setPlatformName] = useState("EduMattor");
	const [supportEmail, setSupportEmail] = useState("support@edumattor.com");
	const [maintenanceMode, setMaintenanceMode] = useState(false);

	// Course settings
	const [defaultCurrency, setDefaultCurrency] = useState("usd");
	const [minCoursePrice, setMinCoursePrice] = useState("9.99");
	const [autoApprove, setAutoApprove] = useState(false);

	// Security settings
	const [sessionTimeout, setSessionTimeout] = useState("60");
	const [twoFactorRequired, setTwoFactorRequired] = useState(true);
	const [strongPassword, setStrongPassword] = useState(true);

	// Registration settings
	const [allowSignups, setAllowSignups] = useState(true);
	const [verifyEmails, setVerifyEmails] = useState(true);
	const [defaultUserRole, setDefaultUserRole] = useState("student");

	// Save settings
	const handleSaveSettings = async () => {
		try {
			setIsLoading(true);

			// In a real implementation, you would call your API to save settings
			// For demo purposes, we'll just simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 800));

			toast({
				title: "Settings saved",
				description: "Your platform settings have been updated.",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save settings. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	// Reset to defaults
	const handleResetDefaults = () => {
		// Reset general settings
		setPlatformName("EduMattor");
		setSupportEmail("support@edumattor.com");
		setMaintenanceMode(false);

		// Reset course settings
		setDefaultCurrency("usd");
		setMinCoursePrice("9.99");
		setAutoApprove(false);

		// Reset security settings
		setSessionTimeout("60");
		setTwoFactorRequired(true);
		setStrongPassword(true);

		// Reset registration settings
		setAllowSignups(true);
		setVerifyEmails(true);
		setDefaultUserRole("student");

		toast({
			title: "Settings reset",
			description: "All settings have been reset to defaults.",
		});
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold">Platform Settings</h2>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>General Settings</CardTitle>
						<CardDescription>Configure general platform settings and defaults</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="platform-name">Platform Name</Label>
							<Input id="platform-name" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="max-w-md" />
						</div>

						<div className="space-y-2">
							<Label htmlFor="support-email">Support Email</Label>
							<Input id="support-email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="max-w-md" />
						</div>

						<div className="flex items-center space-x-2">
							<Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
							<Label htmlFor="maintenance-mode">Maintenance Mode</Label>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Course Settings</CardTitle>
						<CardDescription>Manage course-related settings and requirements</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="default-currency">Default Currency</Label>
							<Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
								<SelectTrigger className="max-w-md">
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="usd">USD ($)</SelectItem>
									<SelectItem value="eur">EUR (€)</SelectItem>
									<SelectItem value="gbp">GBP (£)</SelectItem>
									<SelectItem value="cad">CAD ($)</SelectItem>
									<SelectItem value="aud">AUD ($)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="min-course-price">Minimum Course Price</Label>
							<Input id="min-course-price" type="number" value={minCoursePrice} onChange={(e) => setMinCoursePrice(e.target.value)} className="max-w-md" />
						</div>

						<div className="flex items-center space-x-2">
							<Switch id="auto-approve" checked={autoApprove} onCheckedChange={setAutoApprove} />
							<Label htmlFor="auto-approve">Auto-approve new courses</Label>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Security Settings</CardTitle>
						<CardDescription>Configure security and authentication settings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
							<Input id="session-timeout" type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="max-w-md" />
						</div>

						<div className="flex items-center space-x-2">
							<Switch id="two-factor" checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
							<Label htmlFor="two-factor">Require Two-Factor Authentication for Admins</Label>
						</div>

						<div className="flex items-center space-x-2">
							<Switch id="strong-password" checked={strongPassword} onCheckedChange={setStrongPassword} />
							<Label htmlFor="strong-password">Enforce Strong Password Policy</Label>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Registration Settings</CardTitle>
						<CardDescription>Configure user registration and account settings</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center space-x-2">
							<Switch id="allow-signups" checked={allowSignups} onCheckedChange={setAllowSignups} />
							<Label htmlFor="allow-signups">Allow New User Registrations</Label>
						</div>

						<div className="flex items-center space-x-2">
							<Switch id="verify-emails" checked={verifyEmails} onCheckedChange={setVerifyEmails} />
							<Label htmlFor="verify-emails">Require Email Verification</Label>
						</div>

						<div className="space-y-2">
							<Label htmlFor="default-role">Default User Role</Label>
							<Select value={defaultUserRole} onValueChange={setDefaultUserRole}>
								<SelectTrigger className="max-w-md">
									<SelectValue placeholder="Select default role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="student">Student</SelectItem>
									<SelectItem value="instructor">Instructor</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<div className="flex justify-end space-x-4">
					<Button variant="outline" onClick={handleResetDefaults} disabled={isLoading}>
						Reset to Defaults
					</Button>
					<Button onClick={handleSaveSettings} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>
		</div>
	);
}
