"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Search, Calendar, Settings, Award, BookOpen, MessageCircle, Target, TrendingUp, Bell, Download } from "lucide-react";

export const QuickActions: React.FC = () => {
	const actions = [
		{
			icon: Search,
			label: "Find Courses",
			description: "Discover new learning paths",
			color: "from-blue-500 to-cyan-500",
			href: "/courses",
		},
		{
			icon: Calendar,
			label: "Schedule",
			description: "Plan your learning time",
			color: "from-green-500 to-emerald-500",
			href: "/student/schedule",
		},
		{
			icon: Award,
			label: "Certificates",
			description: "View your achievements",
			color: "from-yellow-500 to-orange-500",
			href: "/student/certificates",
		},
		{
			icon: Settings,
			label: "Preferences",
			description: "Customize your experience",
			color: "from-purple-500 to-pink-500",
			href: "/student/settings",
		},
	];

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
			<Card className="adaptive-card">
				<CardContent className="p-6 space-y-4">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
							<Target className="w-4 h-4 text-white" />
						</div>
						<h3 className="font-semibold text-foreground">Quick Actions</h3>
					</div>

					<div className="grid grid-cols-2 gap-3">
						{actions.map((action, index) => (
							<motion.button
								key={action.label}
								className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group text-left"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6 + index * 0.1 }}
								whileHover={{ scale: 1.02, y: -2 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
									<action.icon className="w-5 h-5 text-white" />
								</div>
								<div>
									<p className="font-medium text-sm text-foreground group-hover:text-blue-600 transition-colors">{action.label}</p>
									<p className="text-xs text-muted-foreground">{action.description}</p>
								</div>
							</motion.button>
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default QuickActions;
