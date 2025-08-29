"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight, Bot } from "lucide-react";

export default function TestimonialsSection() {
	const [currentIndex, setCurrentIndex] = useState(0);

	const testimonials = [
		{
			id: "1",
			name: "Sarah Chen",
			role: "Software Developer",
			company: "TechCorp",
			content: "The AI tutoring system completely transformed how I learn. The personalized feedback and adaptive pacing helped me master complex concepts faster than I ever thought possible.",
			rating: 5,
			image: "SC",
		},
		{
			id: "2",
			name: "Marcus Rodriguez",
			role: "Data Scientist",
			company: "DataFlow Inc",
			content: "What impressed me most was how the AI understood my learning style and adjusted accordingly. The real-time feedback made all the difference in my understanding.",
			rating: 5,
			image: "MR",
		},
		{
			id: "3",
			name: "Dr. Emily Watson",
			role: "University Professor",
			company: "MIT",
			content: "As an educator, I was amazed by the sophistication of the AI tutoring. It provides the kind of personalized attention that's difficult to achieve in traditional classroom settings.",
			rating: 5,
			image: "EW",
		},
	];

	const nextTestimonial = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
	};

	const prevTestimonial = () => {
		setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	};

	return (
		<section className="section-padding bg-background">
			<div className="container-custom">
				<div className="max-w-3xl mx-auto text-center mb-16">
					<motion.h2 className="heading-2 text-foreground mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
						What our students say
					</motion.h2>
					<motion.p className="text-xl text-muted-foreground leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
						Join thousands of learners who have transformed their skills with our AI-powered platform.
					</motion.p>
				</div>

				<div className="max-w-4xl mx-auto">
					<motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
						<Card className="bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
							<CardContent className="p-12">
								<div className="text-center">
									<div className="flex justify-center mb-8">
										<div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
											<Quote className="w-8 h-8 text-accent" />
										</div>
									</div>

									<blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-medium">"{testimonials[currentIndex].content}"</blockquote>

									<div className="flex justify-center mb-6">
										{[...Array(testimonials[currentIndex].rating)].map((_, i) => (
											<Star key={i} className="w-5 h-5 text-accent fill-accent" />
										))}
									</div>

									<div className="flex items-center justify-center gap-4">
										<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">{testimonials[currentIndex].image}</div>
										<div className="text-left">
											<div className="font-semibold text-foreground text-lg">{testimonials[currentIndex].name}</div>
											<div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
											<div className="text-sm text-muted-foreground">{testimonials[currentIndex].company}</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Navigation */}
					<div className="flex items-center justify-center gap-4 mt-8">
						<button onClick={prevTestimonial} className="p-3 rounded-full border border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
							<ChevronLeft className="w-5 h-5" />
						</button>

						<div className="flex gap-2">
							{testimonials.map((_, index) => (
								<button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-accent w-8" : "bg-muted-foreground/30 hover:bg-accent/50"}`} />
							))}
						</div>

						<button onClick={nextTestimonial} className="p-3 rounded-full border border-border hover:border-accent hover:bg-accent/10 text-muted-foreground hover:text-accent transition-all duration-300">
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* AI Badge */}
				<motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
						<Bot className="w-4 h-4 text-accent" />
						<span className="text-accent text-sm font-medium">Powered by AI intelligence</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
