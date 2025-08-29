"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle, Sparkles, Bot, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
	return (
		<section className="section-padding bg-muted/30">
			<div className="container-custom">
				<motion.div className="max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<div className="mb-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-6">
							<Bot className="w-4 h-4 text-accent" />
							<span className="text-accent text-sm font-medium">Ready to get started?</span>
						</div>

						<h2 className="heading-2 text-foreground mb-6">Ready to start your learning journey?</h2>

						<p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">Join thousands of students who are already transforming their careers with our AI-powered learning platform.</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Link href="/courses">
							<Button size="lg" className="text-base px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
								<Sparkles className="mr-2 h-5 w-5" />
								Start learning today
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</Link>
						<Button variant="outline" size="lg" className="text-base px-8 py-4 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent transition-all duration-300">
							<Play className="mr-2 h-4 w-4" />
							Watch how it works
						</Button>
					</div>

					<div className="grid sm:grid-cols-3 gap-6 text-sm text-muted-foreground mb-12">
						{[
							{ icon: CheckCircle, text: "Free to start" },
							{ icon: CheckCircle, text: "No credit card required" },
							{ icon: CheckCircle, text: "Cancel anytime" },
						].map((item, index) => (
							<motion.div
								key={index}
								className="flex items-center justify-center gap-2 p-4 rounded-lg bg-card border border-border/50"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
							>
								<item.icon className="w-5 h-5 text-accent" />
								<span className="text-foreground font-medium">{item.text}</span>
							</motion.div>
						))}
					</div>

					{/* Trust indicators */}
					<motion.div className="bg-card rounded-xl p-8 border border-border/50" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
						<div className="grid md:grid-cols-3 gap-8 text-center">
							<div>
								<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
									<Users className="w-6 h-6 text-accent" />
								</div>
								<div className="text-2xl font-bold text-foreground mb-2">50,000+</div>
								<div className="text-muted-foreground">Happy Students</div>
							</div>

							<div>
								<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
									<Sparkles className="w-6 h-6 text-accent" />
								</div>
								<div className="text-2xl font-bold text-foreground mb-2">4.9/5</div>
								<div className="text-muted-foreground">Average Rating</div>
							</div>

							<div>
								<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
									<Bot className="w-6 h-6 text-accent" />
								</div>
								<div className="text-2xl font-bold text-foreground mb-2">24/7</div>
								<div className="text-muted-foreground">AI Support</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
