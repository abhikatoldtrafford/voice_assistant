"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Phone, MapPin, Twitter, Linkedin, Github, ArrowRight, Bot, Sparkles, Heart } from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		product: [
			{ label: "Courses", href: "/courses" },
			{ label: "AI Tutoring", href: "/ai-tutor" },
			{ label: "Certifications", href: "/certifications" },
			{ label: "For Business", href: "/business" },
		],
		resources: [
			{ label: "Help Center", href: "/help" },
			{ label: "Community", href: "/community" },
			{ label: "Blog", href: "/blog" },
			{ label: "API Docs", href: "/docs" },
		],
		company: [
			{ label: "About Us", href: "/about" },
			{ label: "Careers", href: "/careers" },
			{ label: "Press", href: "/press" },
			{ label: "Contact", href: "/contact" },
		],
		legal: [
			{ label: "Privacy Policy", href: "/privacy" },
			{ label: "Terms of Service", href: "/terms" },
			{ label: "Cookie Policy", href: "/cookies" },
			{ label: "Accessibility", href: "/accessibility" },
		],
	};

	const socialLinks = [
		{ icon: Twitter, href: "https://twitter.com", label: "Twitter" },
		{ icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
		{ icon: Github, href: "https://github.com", label: "GitHub" },
	];

	return (
		<footer className="bg-background border-t border-border">
			<div className="container-custom">
				{/* Main Footer Content */}
				<div className="py-16">
					<div className="grid lg:grid-cols-12 gap-8">
						{/* Brand Section */}
						<div className="lg:col-span-4">
							<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
								<Link href="/" className="flex items-center gap-3 mb-6 group">
									<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
										<GraduationCap className="h-6 w-6 text-primary-foreground group-hover:text-accent-foreground" />
									</div>
									<span className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">EduMattor</span>
								</Link>

								<p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">Empowering learners worldwide with AI-driven education that adapts to your unique learning style and pace.</p>

								{/* AI Badge */}
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20 mb-6">
									<Bot className="w-4 h-4 text-accent" />
									<span className="text-accent text-sm font-medium">Powered by AI</span>
								</div>

								{/* Contact Info */}
								<div className="space-y-3 text-sm text-muted-foreground">
									<div className="flex items-center gap-3">
										<Mail className="w-4 h-4 text-accent" />
										<a href="mailto:hello@edumattor.com" className="hover:text-accent transition-colors">
											hello@edumattor.com
										</a>
									</div>
									<div className="flex items-center gap-3">
										<Phone className="w-4 h-4 text-accent" />
										<a href="tel:+1234567890" className="hover:text-accent transition-colors">
											+1 (234) 567-890
										</a>
									</div>
									<div className="flex items-center gap-3">
										<MapPin className="w-4 h-4 text-accent" />
										<span>San Francisco, CA</span>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Links Grid */}
						<div className="lg:col-span-8">
							<div className="grid md:grid-cols-4 gap-8">
								{/* Product Links */}
								<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
									<h3 className="font-semibold text-foreground mb-4">Product</h3>
									<ul className="space-y-3">
										{footerLinks.product.map((link, index) => (
											<li key={index}>
												<Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 group">
													{link.label}
													<ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
												</Link>
											</li>
										))}
									</ul>
								</motion.div>

								{/* Resources Links */}
								<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
									<h3 className="font-semibold text-foreground mb-4">Resources</h3>
									<ul className="space-y-3">
										{footerLinks.resources.map((link, index) => (
											<li key={index}>
												<Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 group">
													{link.label}
													<ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
												</Link>
											</li>
										))}
									</ul>
								</motion.div>

								{/* Company Links */}
								<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
									<h3 className="font-semibold text-foreground mb-4">Company</h3>
									<ul className="space-y-3">
										{footerLinks.company.map((link, index) => (
											<li key={index}>
												<Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 group">
													{link.label}
													<ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
												</Link>
											</li>
										))}
									</ul>
								</motion.div>

								{/* Legal Links */}
								<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
									<h3 className="font-semibold text-foreground mb-4">Legal</h3>
									<ul className="space-y-3">
										{footerLinks.legal.map((link, index) => (
											<li key={index}>
												<Link href={link.href} className="text-muted-foreground hover:text-accent transition-colors duration-300 text-sm flex items-center gap-2 group">
													{link.label}
													<ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
												</Link>
											</li>
										))}
									</ul>
								</motion.div>
							</div>
						</div>
					</div>
				</div>

				{/* Newsletter Section */}
				<motion.div className="py-8 border-t border-border" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
					<div className="flex flex-col lg:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-accent" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground">Stay updated</h3>
								<p className="text-sm text-muted-foreground">Get the latest news and updates from our AI learning platform.</p>
							</div>
						</div>

						<div className="flex gap-3 w-full lg:w-auto">
							<input
								type="email"
								placeholder="Enter your email"
								className="px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent flex-1 lg:w-64 transition-all duration-300"
							/>
							<button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300 font-medium">Subscribe</button>
						</div>
					</div>
				</motion.div>

				{/* Bottom Footer */}
				<motion.div className="py-6 border-t border-border" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>© {currentYear} EduMattor. Made with</span>
							<Heart className="w-4 h-4 text-accent fill-accent" />
							<span>for learners worldwide.</span>
						</div>

						{/* Social Links */}
						<div className="flex items-center gap-4">
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
									aria-label={social.label}
								>
									<social.icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</footer>
	);
}
