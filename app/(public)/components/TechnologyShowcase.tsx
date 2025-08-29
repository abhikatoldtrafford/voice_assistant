"use client";

import { CheckCircle2, Brain, Cpu, Zap, Target, ArrowRight, Bot, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TechnologyShowcase() {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true });
	const [activeTab, setActiveTab] = useState("ai-engine");

	const aiCapabilities = [
		{
			title: "Adaptive Learning",
			description: "AI that continuously learns from your progress and adjusts teaching methods accordingly.",
			icon: Brain,
			stats: "98.5% accuracy",
		},
		{
			title: "Natural Language Processing",
			description: "Understands your questions and provides human-like explanations in real-time.",
			icon: Bot,
			stats: "50+ languages",
		},
		{
			title: "Predictive Analytics",
			description: "Anticipates learning challenges and provides proactive support.",
			icon: Target,
			stats: "85% accuracy",
		},
		{
			title: "Real-time Adaptation",
			description: "Instant content personalization based on your learning patterns.",
			icon: Zap,
			stats: "<100ms response",
		},
	];

	const techSpecs = [
		{
			id: "ai-engine",
			label: "AI Engine",
			title: "Advanced Neural Networks",
			subtitle: "Powering Intelligent Learning",
			description: "Our proprietary AI engine uses state-of-the-art machine learning to create personalized learning experiences that adapt to each student's unique needs.",
			features: ["Deep Learning Models", "Natural Language Processing", "Computer Vision", "Predictive Analytics", "Real-time Adaptation", "Multi-modal Learning"],
			metrics: [
				{ label: "Model Accuracy", value: "99.2%" },
				{ label: "Response Time", value: "45ms" },
				{ label: "Data Points", value: "500M+" },
				{ label: "Learning Patterns", value: "2.5M+" },
			],
		},
		{
			id: "infrastructure",
			label: "Infrastructure",
			title: "Enterprise-Grade Platform",
			subtitle: "Built for Scale and Reliability",
			description: "Cloud-native architecture designed to handle millions of concurrent learners with enterprise-level security and performance.",
			features: ["Auto-scaling Infrastructure", "Global CDN Network", "Real-time Analytics", "Microservices Architecture", "Edge Computing", "High Availability"],
			metrics: [
				{ label: "Uptime", value: "99.99%" },
				{ label: "Global Regions", value: "25+" },
				{ label: "Response Time", value: "<50ms" },
				{ label: "Concurrent Users", value: "1M+" },
			],
		},
		{
			id: "security",
			label: "Security",
			title: "Bank-Level Protection",
			subtitle: "Your Data, Completely Secure",
			description: "Military-grade encryption and comprehensive security protocols protect your learning data with full compliance to global standards.",
			features: ["End-to-End Encryption", "Zero-Trust Architecture", "GDPR Compliance", "SOC 2 Type II", "Multi-Factor Authentication", "Regular Security Audits"],
			metrics: [
				{ label: "Encryption", value: "AES-256" },
				{ label: "Compliance", value: "100%" },
				{ label: "Security Score", value: "A+" },
				{ label: "Zero Breaches", value: "5+ Years" },
			],
		},
	];

	return (
		<section className="py-24 bg-gray-50" ref={ref}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
					<Badge variant="secondary" className="mb-4 bg-gray-100 text-gray-700 border-gray-200">
						Technology Platform
					</Badge>

					<h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by advanced AI</h2>

					<p className="text-xl text-gray-600 max-w-3xl mx-auto">Our cutting-edge technology stack combines machine learning, cloud computing, and security to deliver personalized learning experiences at scale.</p>
				</motion.div>

				{/* AI Capabilities Grid */}
				<motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
					{aiCapabilities.map((capability, index) => (
						<motion.div
							key={index}
							className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
							whileHover={{ scale: 1.02, y: -2 }}
						>
							<div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
								<capability.icon className="w-6 h-6 text-blue-600" />
							</div>

							<h4 className="font-semibold text-gray-900 mb-2">{capability.title}</h4>
							<p className="text-gray-600 text-sm leading-relaxed mb-3">{capability.description}</p>

							<Badge variant="outline" className="text-xs">
								{capability.stats}
							</Badge>
						</motion.div>
					))}
				</motion.div>

				{/* Technology Tabs */}
				<motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}>
					<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
						<TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-100 mb-12">
							{techSpecs.map((spec) => (
								<TabsTrigger key={spec.id} value={spec.id} className="data-[state=active]:bg-white data-[state=active]:text-gray-900">
									{spec.label}
								</TabsTrigger>
							))}
						</TabsList>

						{techSpecs.map((spec) => (
							<TabsContent key={spec.id} value={spec.id} className="mt-0">
								<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
									<Card className="border-gray-200">
										<CardContent className="p-0">
											<div className="grid lg:grid-cols-2 gap-0">
												{/* Content Side */}
												<div className="p-12 space-y-8">
													<div className="space-y-4">
														<Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
															{spec.subtitle}
														</Badge>

														<h3 className="text-3xl font-bold text-gray-900">{spec.title}</h3>

														<p className="text-gray-600 leading-relaxed">{spec.description}</p>
													</div>

													{/* Features List */}
													<div className="space-y-3">
														{spec.features.map((feature, index) => (
															<motion.div key={index} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
																<CheckCircle2 className="w-5 h-5 text-green-500" />
																<span className="text-gray-700">{feature}</span>
															</motion.div>
														))}
													</div>

													{/* Metrics */}
													<div className="grid grid-cols-2 gap-4">
														{spec.metrics.map((metric, index) => (
															<motion.div
																key={index}
																className="text-center p-4 bg-gray-50 rounded-lg"
																initial={{ opacity: 0, scale: 0.8 }}
																animate={{ opacity: 1, scale: 1 }}
																transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
																whileHover={{ scale: 1.05 }}
															>
																<div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
																<div className="text-xs text-gray-600">{metric.label}</div>
															</motion.div>
														))}
													</div>

													<Button className="bg-blue-600 hover:bg-blue-700">
														<Bot className="w-5 h-5 mr-2" />
														Learn More
														<ArrowRight className="w-4 h-4 ml-2" />
													</Button>
												</div>

												{/* Visual Side */}
												<div className="bg-gray-900 p-12 flex items-center justify-center relative overflow-hidden">
													{/* Simple tech visualization */}
													<div className="relative">
														<div className="w-48 h-48 rounded-full bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center">
															{spec.id === "ai-engine" && <Brain className="w-20 h-20 text-blue-400" />}
															{spec.id === "infrastructure" && <Cpu className="w-20 h-20 text-blue-400" />}
															{spec.id === "security" && <Shield className="w-20 h-20 text-blue-400" />}
														</div>

														{/* Orbiting elements */}
														{[...Array(6)].map((_, i) => (
															<motion.div
																key={i}
																className="absolute w-4 h-4 rounded-full bg-blue-400/50"
																style={{
																	top: "50%",
																	left: "50%",
																}}
																animate={{
																	rotate: [0, 360],
																}}
																transition={{
																	duration: 8 + i * 2,
																	repeat: Infinity,
																	ease: "linear",
																	delay: i * 0.5,
																}}
																initial={{
																	x: Math.cos((i * 60 * Math.PI) / 180) * 100 - 8,
																	y: Math.sin((i * 60 * Math.PI) / 180) * 100 - 8,
																}}
															/>
														))}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							</TabsContent>
						))}
					</Tabs>
				</motion.div>
			</div>
		</section>
	);
}
