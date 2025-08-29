"use client";

import { Brain, Target, Users, Clock, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
	const features = [
		{
			icon: Brain,
			title: "AI-Powered Adaptation",
			description: "Our intelligent system learns how you learn best and adapts content delivery to maximize your understanding and retention.",
		},
		{
			icon: Target,
			title: "Personalized Learning Paths",
			description: "Every student gets a unique journey tailored to their goals, background, and learning preferences.",
		},
		{
			icon: Users,
			title: "Expert Instructors",
			description: "Learn from industry professionals and subject matter experts who bring real-world experience to every lesson.",
		},
		{
			icon: Clock,
			title: "Learn at Your Pace",
			description: "Study when it works for you with 24/7 access to all course materials and AI tutoring support.",
		},
		{
			icon: Award,
			title: "Industry Recognition",
			description: "Earn certificates that are valued by employers and demonstrate your mastery of in-demand skills.",
		},
		{
			icon: Zap,
			title: "Real-Time Feedback",
			description: "Get instant feedback on your progress with detailed explanations to help you improve continuously.",
		},
	];

	return (
		<section className="section-padding bg-muted/30">
			<div className="container-custom">
				<div className="max-w-3xl mx-auto text-center mb-16">
					<motion.h2 className="heading-2 text-foreground mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
						Why choose our platform?
					</motion.h2>
					<motion.p className="text-xl text-muted-foreground leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
						We combine cutting-edge AI technology with proven educational methods to create the most effective learning experience possible.
					</motion.p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							className="group bg-card rounded-xl p-8 border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							whileHover={{ y: -5 }}
						>
							<div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl mb-6 group-hover:bg-accent/20 transition-colors duration-300">
								<feature.icon className="h-6 w-6 text-accent" />
							</div>
							<h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">{feature.title}</h3>
							<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
						</motion.div>
					))}
				</div>

				{/* Additional CTA */}
				<motion.div className="text-center mt-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
					<div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 rounded-full border border-accent/20">
						<Zap className="w-4 h-4 text-accent" />
						<span className="text-accent font-medium">Experience the future of learning today</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
