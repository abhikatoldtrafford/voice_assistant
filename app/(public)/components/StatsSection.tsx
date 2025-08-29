"use client";

import { Users, BookOpen, Trophy, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsSection() {
	const stats = [
		{
			number: "50,000+",
			label: "Active learners worldwide",
			icon: Users,
		},
		{
			number: "1,000+",
			label: "Expert-designed courses",
			icon: BookOpen,
		},
		{
			number: "95%",
			label: "Course completion rate",
			icon: Trophy,
		},
		{
			number: "180+",
			label: "Countries served",
			icon: Globe,
		},
	];

	return (
		<section className="py-16 bg-white">
			<div className="container-custom">
				<motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					{stats.map((stat, index) => (
						<motion.div key={stat.label} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
							<div className="flex justify-center mb-4">
								<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
									<stat.icon className="h-6 w-6 text-blue-600" />
								</div>
							</div>
							<div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
							<div className="text-gray-600">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
