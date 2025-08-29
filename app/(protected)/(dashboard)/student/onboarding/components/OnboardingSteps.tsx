"use client";

import { motion } from "framer-motion";
import { Heart, Settings, Target, CheckCircle2, Lock } from "lucide-react";

interface Step {
	id: string;
	title: string;
	component: any;
}

interface OnboardingStepsProps {
	steps: Step[];
	currentStep: number;
	onStepClick: (step: number) => void;
}

export default function OnboardingSteps({ steps, currentStep, onStepClick }: OnboardingStepsProps) {
	const stepIcons = {
		welcome: Heart,
		preferences: Settings,
		goals: Target,
		complete: CheckCircle2,
	};

	const stepColors = {
		welcome: "from-pink-500 to-rose-500",
		preferences: "from-blue-500 to-indigo-500",
		goals: "from-green-500 to-emerald-500",
		complete: "from-purple-500 to-pink-500",
	};

	return (
		<div className="relative">
			{/* Desktop Steps */}
			<div className="hidden md:flex justify-center items-center">
				<div className="flex items-center gap-8">
					{steps.map((step, index) => {
						const Icon = stepIcons[step.id as keyof typeof stepIcons];
						const gradient = stepColors[step.id as keyof typeof stepColors];
						const isCompleted = index < currentStep;
						const isCurrent = index === currentStep;
						const isLocked = index > currentStep;

						return (
							<div key={step.id} className="flex items-center gap-8">
								{/* Step Circle */}
								<motion.div className="relative cursor-pointer" onClick={() => !isLocked && onStepClick(index)} whileHover={!isLocked ? { scale: 1.05 } : {}} whileTap={!isLocked ? { scale: 0.95 } : {}}>
									<motion.div
										className={`w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
											isCompleted || isCurrent ? `bg-gradient-to-r ${gradient} shadow-lg` : "bg-gray-200 dark:bg-gray-700"
										}`}
										animate={
											isCurrent
												? {
														scale: [1, 1.05, 1],
														boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0.4)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0 rgba(59, 130, 246, 0.4)"],
												  }
												: {}
										}
										transition={{
											duration: 2,
											repeat: isCurrent ? Infinity : 0,
										}}
									>
										{isLocked ? <Lock className="w-6 h-6 text-gray-500" /> : <Icon className={`w-6 h-6 ${isCompleted || isCurrent ? "text-white" : "text-gray-500"}`} />}

										{/* Completion Check */}
										{isCompleted && (
											<motion.div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
												<CheckCircle2 className="w-4 h-4 text-white" />
											</motion.div>
										)}

										{/* Current Step Pulse */}
										{isCurrent && <motion.div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />}
									</motion.div>

									{/* Step Label */}
									<div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center min-w-max">
										<p className={`text-sm font-medium ${isCurrent ? "text-primary" : isCompleted ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>{step.title}</p>
									</div>
								</motion.div>

								{/* Connector Line */}
								{index < steps.length - 1 && (
									<div className="relative">
										<div className="w-20 h-0.5 bg-gray-300 dark:bg-gray-600" />
										<motion.div
											className="absolute top-0 left-0 h-0.5 bg-gradient-primary"
											initial={{ width: 0 }}
											animate={{
												width: index < currentStep ? "100%" : "0%",
											}}
											transition={{ duration: 0.6, ease: "easeOut" }}
										/>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Mobile Steps */}
			<div className="md:hidden">
				<div className="flex justify-center">
					<div className="flex items-center gap-2">
						{steps.map((_, index) => (
							<motion.div
								key={index}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep ? "bg-gradient-primary scale-125" : index < currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
								animate={
									index === currentStep
										? {
												scale: [1.25, 1.5, 1.25],
										  }
										: {}
								}
								transition={{
									duration: 2,
									repeat: index === currentStep ? Infinity : 0,
								}}
							/>
						))}
					</div>
				</div>

				{/* Current Step Title */}
				<motion.div key={currentStep} className="text-center mt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
					<h3 className="text-lg font-semibold text-foreground">{steps[currentStep].title}</h3>
				</motion.div>
			</div>
		</div>
	);
}
