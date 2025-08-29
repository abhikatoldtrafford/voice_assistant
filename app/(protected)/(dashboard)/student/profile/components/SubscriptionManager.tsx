"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import {
	Crown,
	Star,
	Shield,
	Users,
	Zap,
	Brain,
	Target,
	Heart,
	CheckCircle2,
	X,
	CreditCard,
	Calendar,
	Download,
	Gift,
	AlertTriangle,
	Sparkles,
	Infinity,
	Clock,
	TrendingUp,
	Award,
	Bot,
	MessageCircle,
	BookOpen,
	Activity,
	Globe,
	Lock,
	Unlock,
	ArrowRight,
	RefreshCw,
	Eye,
	Settings,
} from "lucide-react";
import { IUserProfileData } from "@/models/UserProfile";
import React from "react";

interface SubscriptionManagerProps {
	userData: IUserProfileData;
}

interface PricingPlan {
	id: string;
	name: string;
	price: number;
	period: string;
	description: string;
	icon: any;
	color: string;
	gradient: string;
	features: string[];
	limits: {
		courses: string;
		aiInteractions: string;
		storage: string;
		support: string;
	};
	popular?: boolean;
	recommended?: boolean;
}

export default function SubscriptionManager({ userData }: SubscriptionManagerProps) {
	const [selectedPlan, setSelectedPlan] = useState(userData.subscriptionStatus);
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
	const [showBillingHistory, setShowBillingHistory] = useState(false);

	const plans: PricingPlan[] = [
		{
			id: "free",
			name: "Free Explorer",
			price: 0,
			period: "forever",
			description: "Perfect for getting started with AI-powered learning",
			icon: Users,
			color: "text-gray-600",
			gradient: "from-gray-400 to-gray-600",
			features: ["Access to 3 courses", "50 AI coach interactions/month", "Basic progress tracking", "Community access", "Mobile app access"],
			limits: {
				courses: "3 courses",
				aiInteractions: "50/month",
				storage: "1GB",
				support: "Community",
			},
		},
		{
			id: "premium",
			name: "Premium Learner",
			price: billingCycle === "monthly" ? 19 : 190,
			period: billingCycle === "monthly" ? "month" : "year",
			description: "Accelerate your learning with advanced AI features",
			icon: Crown,
			color: "text-yellow-600",
			gradient: "from-yellow-400 to-orange-500",
			features: ["Unlimited course access", "Unlimited AI coach interactions", "Advanced analytics & insights", "Personalized learning paths", "Priority support", "Offline downloads", "Certificate generation", "Goal tracking & reminders"],
			limits: {
				courses: "Unlimited",
				aiInteractions: "Unlimited",
				storage: "100GB",
				support: "Priority",
			},
			popular: true,
			recommended: true,
		},
		{
			id: "enterprise",
			name: "Enterprise Pro",
			price: billingCycle === "monthly" ? 49 : 490,
			period: billingCycle === "monthly" ? "month" : "year",
			description: "Advanced features for serious learners and professionals",
			icon: Shield,
			color: "text-purple-600",
			gradient: "from-purple-500 to-indigo-600",
			features: [
				"Everything in Premium",
				"Advanced AI coach personalities",
				"Custom learning environments",
				"API access for integrations",
				"Advanced security features",
				"Dedicated account manager",
				"Custom branding options",
				"Team collaboration tools",
				"Advanced reporting",
			],
			limits: {
				courses: "Unlimited",
				aiInteractions: "Unlimited",
				storage: "Unlimited",
				support: "Dedicated",
			},
		},
	];

	const getCurrentPlan = () => plans.find((plan) => plan.id === userData.subscriptionStatus);
	const currentPlan = getCurrentPlan();

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const calculateSavings = (monthlyPrice: number) => {
		const yearlyPrice = monthlyPrice * 10; // 2 months free
		const savings = monthlyPrice * 12 - yearlyPrice;
		return Math.round((savings / (monthlyPrice * 12)) * 100);
	};

	const mockBillingHistory = [
		{
			id: "1",
			date: new Date("2024-04-01"),
			amount: 19,
			status: "paid",
			plan: "Premium Learner",
			period: "April 2024",
		},
		{
			id: "2",
			date: new Date("2024-03-01"),
			amount: 19,
			status: "paid",
			plan: "Premium Learner",
			period: "March 2024",
		},
		{
			id: "3",
			date: new Date("2024-02-01"),
			amount: 19,
			status: "paid",
			plan: "Premium Learner",
			period: "February 2024",
		},
	];

	const usageStats = {
		coursesAccessed: userData.learningStats.coursesCompleted + userData.learningStats.coursesInProgress,
		aiInteractions: userData.learningStats.totalAIInteractions,
		storageUsed: 2.5, // GB
		monthlyMinutes: userData.learningStats.totalLearningHours * 60,
	};

	const handlePlanChange = (planId: string) => {
		console.log(`Changing to plan: ${planId}`);
		// In real app, this would handle payment processing
	};

	const handleCancelSubscription = () => {
		console.log("Cancelling subscription");
		// In real app, this would handle cancellation
	};

	return (
		<div className="space-y-6">
			{/* Current Subscription Overview */}
			<Card className="adaptive-card intelligence-glow">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{currentPlan?.icon && React.createElement(currentPlan.icon, { className: `w-6 h-6 ${currentPlan?.color}` })}
						Current Subscription
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Current Plan Status */}
					<div className="flex flex-col lg:flex-row gap-6">
						<div className="flex-1 space-y-4">
							<div className="flex items-center gap-4">
								<div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentPlan?.gradient} flex items-center justify-center shadow-lg`}>{currentPlan?.icon && <currentPlan.icon className="w-8 h-8 text-white" />}</div>
								<div>
									<h3 className="text-2xl font-bold text-foreground">{currentPlan?.name}</h3>
									<p className="text-muted-foreground">{currentPlan?.description}</p>
									{currentPlan?.popular && (
										<Badge className="mt-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300">
											<Star className="w-3 h-3 mr-1" />
											Most Popular
										</Badge>
									)}
								</div>
							</div>

							{/* Subscription Details */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg text-center">
									<Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
									<p className="text-sm font-medium text-foreground">Started</p>
									<p className="text-xs text-muted-foreground">{userData.subscriptionStartDate ? formatDate(userData.subscriptionStartDate) : "N/A"}</p>
								</div>

								{userData.subscriptionStatus !== "free" && (
									<div className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg text-center">
										<RefreshCw className="w-5 h-5 mx-auto mb-1 text-green-600" />
										<p className="text-sm font-medium text-foreground">Next Billing</p>
										<p className="text-xs text-muted-foreground">{userData.subscriptionEndDate ? formatDate(userData.subscriptionEndDate) : "N/A"}</p>
									</div>
								)}

								<div className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg text-center">
									<TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
									<p className="text-sm font-medium text-foreground">Status</p>
									<p className="text-xs text-green-600 font-medium capitalize">{userData.status}</p>
								</div>

								<div className="p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg text-center">
									<Crown className="w-5 h-5 mx-auto mb-1 text-purple-600" />
									<p className="text-sm font-medium text-foreground">Type</p>
									<p className="text-xs text-muted-foreground capitalize">{userData.subscriptionStatus}</p>
								</div>
							</div>
						</div>

						{/* Usage Overview */}
						<div className="lg:w-80">
							<h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
								<Activity className="w-4 h-4" />
								Usage This Month
							</h4>
							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Courses Accessed</span>
									<span className="font-medium">
										{usageStats.coursesAccessed}/{currentPlan?.limits.courses}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">AI Interactions</span>
									<span className="font-medium">
										{usageStats.aiInteractions}/{currentPlan?.limits.aiInteractions}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Storage Used</span>
									<span className="font-medium">
										{usageStats.storageUsed}GB/{currentPlan?.limits.storage}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">Learning Time</span>
									<span className="font-medium">{Math.round(usageStats.monthlyMinutes / 60)}h this month</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Billing Cycle Toggle */}
			<Card className="adaptive-card">
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold text-foreground">Choose Your Plan</h3>
						<div className="flex items-center gap-4">
							<span className="text-sm text-muted-foreground">Monthly</span>
							<motion.button
								className={`w-12 h-6 rounded-full transition-colors ${billingCycle === "yearly" ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
								onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
								whileTap={{ scale: 0.95 }}
							>
								<motion.div className="w-5 h-5 bg-white rounded-full shadow-md" animate={{ x: billingCycle === "yearly" ? 26 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
							</motion.button>
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">Yearly</span>
								<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
									Save 17%
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Pricing Plans */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{plans.map((plan, index) => (
					<motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
						<Card
							className={`relative h-full transition-all duration-300 cursor-pointer ${plan.id === userData.subscriptionStatus ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg hover:scale-[1.02]"} ${
								plan.popular ? "border-yellow-400 dark:border-yellow-600" : ""
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1">
										<Sparkles className="w-3 h-3 mr-1" />
										Most Popular
									</Badge>
								</div>
							)}

							<CardContent className="p-6 space-y-6">
								{/* Plan Header */}
								<div className="text-center space-y-4">
									<div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center shadow-lg`}>
										<plan.icon className="w-8 h-8 text-white" />
									</div>

									<div>
										<h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
										<p className="text-sm text-muted-foreground">{plan.description}</p>
									</div>

									<div className="space-y-2">
										<div className="flex items-baseline justify-center gap-1">
											<span className="text-3xl font-bold text-foreground">${plan.price}</span>
											<span className="text-muted-foreground">/{plan.period}</span>
										</div>
										{billingCycle === "yearly" && plan.price > 0 && <p className="text-xs text-green-600">Save {calculateSavings(plan.id === "premium" ? 19 : 49)}% with yearly billing</p>}
									</div>
								</div>

								{/* Features List */}
								<div className="space-y-3">
									{plan.features.map((feature, featureIndex) => (
										<div key={featureIndex} className="flex items-start gap-3">
											<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
											<span className="text-sm text-foreground">{feature}</span>
										</div>
									))}
								</div>

								{/* Limits Overview */}
								<div className="pt-4 border-t border-border/50">
									<div className="grid grid-cols-2 gap-3 text-xs">
										<div>
											<span className="text-muted-foreground">Courses:</span>
											<span className="font-medium ml-1">{plan.limits.courses}</span>
										</div>
										<div>
											<span className="text-muted-foreground">AI Chat:</span>
											<span className="font-medium ml-1">{plan.limits.aiInteractions}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Storage:</span>
											<span className="font-medium ml-1">{plan.limits.storage}</span>
										</div>
										<div>
											<span className="text-muted-foreground">Support:</span>
											<span className="font-medium ml-1">{plan.limits.support}</span>
										</div>
									</div>
								</div>

								{/* Action Button */}
								<div className="pt-4">
									{plan.id === userData.subscriptionStatus ? (
										<EnhancedButton variant="outline" className="w-full" disabled>
											<CheckCircle2 className="w-4 h-4 mr-2" />
											Current Plan
										</EnhancedButton>
									) : (
										<EnhancedButton variant={plan.popular ? "ai-primary" : "adaptive"} className="w-full" onClick={() => handlePlanChange(plan.id)} withGlow={plan.popular}>
											{plan.id === "free" ? (
												<>
													<Users className="w-4 h-4 mr-2" />
													Downgrade to Free
												</>
											) : (
												<>
													<ArrowRight className="w-4 h-4 mr-2" />
													Upgrade to {plan.name}
												</>
											)}
										</EnhancedButton>
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Billing & Payment Management */}
			{userData.subscriptionStatus !== "free" && (
				<div className="grid md:grid-cols-2 gap-6">
					{/* Payment Information */}
					<Card className="adaptive-card">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CreditCard className="w-5 h-5 text-primary" />
								Payment Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-lg flex items-center gap-4">
								<div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
									<CreditCard className="w-4 h-4 text-white" />
								</div>
								<div className="flex-1">
									<p className="font-medium text-foreground">•••• •••• •••• 4242</p>
									<p className="text-sm text-muted-foreground">Expires 12/27</p>
								</div>
								<EnhancedButton variant="outline" size="sm">
									<Settings className="w-3 h-3 mr-1" />
									Update
								</EnhancedButton>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">Next billing date:</span>
									<span className="text-sm font-medium">{userData.subscriptionEndDate ? formatDate(userData.subscriptionEndDate) : "N/A"}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">Amount:</span>
									<span className="text-sm font-medium">
										${currentPlan?.price}/{currentPlan?.period}
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Billing History */}
					<Card className="adaptive-card">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center gap-2">
									<Clock className="w-5 h-5 text-primary" />
									Billing History
								</CardTitle>
								<EnhancedButton variant="outline" size="sm" onClick={() => setShowBillingHistory(!showBillingHistory)}>
									<Eye className="w-3 h-3 mr-1" />
									{showBillingHistory ? "Hide" : "View All"}
								</EnhancedButton>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							{(showBillingHistory ? mockBillingHistory : mockBillingHistory.slice(0, 2)).map((bill) => (
								<div key={bill.id} className="flex items-center justify-between p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg">
									<div>
										<p className="font-medium text-foreground">${bill.amount}</p>
										<p className="text-xs text-muted-foreground">{bill.period}</p>
									</div>
									<div className="text-right">
										<Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
											{bill.status}
										</Badge>
										<p className="text-xs text-muted-foreground mt-1">{formatDate(bill.date)}</p>
									</div>
									<EnhancedButton variant="outline" size="sm">
										<Download className="w-3 h-3" />
									</EnhancedButton>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			)}

			{/* Subscription Actions */}
			{userData.subscriptionStatus !== "free" && (
				<Card className="adaptive-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Settings className="w-5 h-5 text-primary" />
							Subscription Management
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid md:grid-cols-2 gap-4">
							<EnhancedButton variant="outline" className="justify-start">
								<RefreshCw className="w-4 h-4 mr-2" />
								Change Billing Cycle
							</EnhancedButton>

							<EnhancedButton variant="outline" className="justify-start">
								<Gift className="w-4 h-4 mr-2" />
								Apply Promo Code
							</EnhancedButton>

							<EnhancedButton variant="outline" className="justify-start">
								<Download className="w-4 h-4 mr-2" />
								Download Invoices
							</EnhancedButton>

							<EnhancedButton variant="outline" className="justify-start text-red-600 hover:text-red-700 border-red-200 hover:border-red-300" onClick={handleCancelSubscription}>
								<X className="w-4 h-4 mr-2" />
								Cancel Subscription
							</EnhancedButton>
						</div>

						{/* Cancellation Warning */}
						<div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200/30">
							<div className="flex items-start gap-3">
								<AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
								<div>
									<h4 className="font-semibold text-orange-800 dark:text-orange-200">Subscription Cancellation</h4>
									<p className="text-sm text-orange-600 dark:text-orange-300 mt-1">
										If you cancel your subscription, you'll retain access until {userData.subscriptionEndDate ? formatDate(userData.subscriptionEndDate) : "your billing period ends"}. After that, you'll be moved to the free plan with
										limited features.
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
