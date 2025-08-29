import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import CTASection from "./components/CTASection";

export default async function Home() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<HeroSection />

			{/* Features Section */}
			<FeaturesSection />

			{/* Testimonials */}
			<TestimonialsSection />

			{/* CTA Section */}
			<CTASection />
		</div>
	);
}
