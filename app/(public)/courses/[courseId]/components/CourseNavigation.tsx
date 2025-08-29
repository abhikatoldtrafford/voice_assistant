"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, Users, Star, MessageSquare, Award, Bot, Target, FileText, HelpCircle, ChevronDown } from "lucide-react";

const navigationItems = [
	{ id: "overview", label: "Overview", icon: BookOpen },
	{ id: "ai-tutor", label: "AI Tutor", icon: Bot },
	{ id: "outcomes", label: "Learning Outcomes", icon: Target },
	{ id: "curriculum", label: "Curriculum", icon: FileText },
	{ id: "requirements", label: "Requirements", icon: HelpCircle },
	{ id: "instructor", label: "Instructor", icon: Users },
	{ id: "reviews", label: "Reviews", icon: Star },
	{ id: "faq", label: "FAQ", icon: MessageSquare },
];

export default function CourseNavigation() {
	const [activeSection, setActiveSection] = useState("overview");
	const [isVisible, setIsVisible] = useState(false);
	const { scrollY } = useScroll();
	const y = useTransform(scrollY, [0, 100], [0, -10]);

	useEffect(() => {
		const handleScroll = () => {
			const sections = navigationItems.map((item) => item.id);
			const currentSection = sections.find((section) => {
				const element = document.getElementById(section);
				if (element) {
					const rect = element.getBoundingClientRect();
					return rect.top <= 100 && rect.bottom >= 100;
				}
				return false;
			});

			if (currentSection) {
				setActiveSection(currentSection);
			}

			// Show/hide navigation based on scroll
			setIsVisible(window.scrollY > 200);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			const offset = 100;
			const elementPosition = element.offsetTop - offset;
			window.scrollTo({
				top: elementPosition,
				behavior: "smooth",
			});
		}
	};

	return (
		<motion.nav className={`sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-border/50 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`} style={{ y }}>
			<div className="container-custom">
				<div className="flex items-center justify-between py-4">
					{/* Navigation Items */}
					<div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
						{navigationItems.map((item, index) => (
							<motion.button
								key={item.id}
								onClick={() => scrollToSection(item.id)}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
									activeSection === item.id ? "bg-blue-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"
								}`}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<item.icon className="w-4 h-4" />
								<span className="hidden sm:inline">{item.label}</span>
							</motion.button>
						))}
					</div>

					{/* Progress Indicator */}
					<motion.div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
						<div className="ai-badge">
							<Bot className="w-3 h-3" />
							<span>AI-Enhanced Course</span>
						</div>
					</motion.div>
				</div>

				{/* Progress Bar */}
				<motion.div
					className="h-1 bg-gradient-primary rounded-full origin-left"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 1, delay: 0.8 }}
					style={{
						scaleX: useTransform(scrollY, [400, 2000], [0, 1]),
					}}
				/>
			</div>
		</motion.nav>
	);
}
