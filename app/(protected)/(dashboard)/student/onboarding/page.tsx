"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import AICoachIntroduction from "./components/AICoachIntroduction";

export default function OnboardingPage() {
	const [currentStep, setCurrentStep] = useState(0);
	const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
	const [onboardingData, setOnboardingData] = useState({
		preferences: {},
		goals: {},
		personalInfo: {},
	});

	const { profile } = useAuth();
	const router = useRouter();
	if (!profile) return <div>Loading...</div>;

	const handleFinish = () => {
		completeOnboarding();
	};

	const handlePreviousStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const completeOnboarding = async () => {
		try {
			// Save onboarding data to user profile
			console.log("Saving onboarding data:", onboardingData);

			// Redirect to dashboard
			router.push("/student/dashboard");
		} catch (error) {
			console.error("Failed to complete onboarding:", error);
		}
	};

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Main Content */}
			<div className="relative z-10 min-h-screen flex flex-col">
				{/* Header */}

				{/* Main Content Area */}
				<div className="flex-1 flex items-center justify-center p-4">
					<div className="w-full max-w-4xl">
						{/* Dynamic Step Content */}
						<motion.div key={currentStep} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5, ease: "easeOut" }} className="mt-8">
							<AICoachIntroduction onNext={handleFinish} onPrevious={handlePreviousStep} canGoBack={currentStep > 0} isVoiceEnabled={isVoiceEnabled} userData={profile} onboardingData={onboardingData} />
						</motion.div>
					</div>
				</div>
				{/* Footer */}
				<motion.div className="p-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
					<p className="text-muted-foreground text-sm">Creating your personalized learning experience...</p>
				</motion.div>
			</div>
		</div>
	);
}
