"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EnhancedButtonProps extends Omit<ButtonProps, "variant"> {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "ai-primary" | "ai-secondary" | "neural" | "adaptive" | "glow";
	withGlow?: boolean;
	withPulse?: boolean;
	withFloat?: boolean;
	aiPersonality?: "warm" | "energetic" | "focused" | "wise";
	className?: string;
	children: React.ReactNode;
	ref?: React.Ref<HTMLButtonElement>;
	disabled?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(({ className, variant = "default", withGlow = false, withPulse = false, withFloat = false, aiPersonality = "warm", children, ...props }, ref) => {
	const getVariantClasses = () => {
		const baseClasses = "relative overflow-hidden transition-all duration-300 font-medium";

		switch (variant) {
			case "ai-primary":
				return cn(
					baseClasses,
					"bg-gradient-primary text-white shadow-lg hover:shadow-xl",
					"hover:scale-105 active:scale-95",
					"before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
					"before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
					withGlow && "hover:shadow-ai-glow",
					aiPersonality === "warm" && "rounded-xl",
					aiPersonality === "energetic" && "rounded-lg transform hover:rotate-1",
					aiPersonality === "focused" && "rounded-md",
					aiPersonality === "wise" && "rounded-full"
				);

			case "ai-secondary":
				return cn(baseClasses, "bg-gradient-ai text-white shadow-md hover:shadow-lg", "hover:scale-[1.02] active:scale-98", "backdrop-blur-sm border border-purple-300/20", withGlow && "hover:shadow-neural");

			case "neural":
				return cn(baseClasses, "bg-gradient-neural text-white shadow-md hover:shadow-lg", "hover:scale-[1.02] border border-blue-300/20", "backdrop-blur-md");

			case "adaptive":
				return cn(baseClasses, "bg-gradient-card backdrop-blur-md border border-border/50", "text-foreground hover:bg-gradient-surface", "hover:border-primary/30 hover:shadow-lg");

			case "glow":
				return cn(baseClasses, "bg-primary text-primary-foreground", "shadow-glow hover:shadow-ai-glow", "animate-pulse-subtle");

			default:
				return "";
		}
	};

	const motionProps = {
		whileHover: withFloat ? { y: -2 } : { scale: 1.02 },
		whileTap: { scale: 0.98 },
		transition: { type: "spring", stiffness: 400, damping: 17 },
	};

	if (withPulse || withFloat || variant.startsWith("ai-")) {
		return (
			<motion.div {...motionProps}>
				<Button className={cn(getVariantClasses(), className)} ref={ref} variant={variant.startsWith("ai-") ? "default" : (variant as any)} {...props}>
					<span className="relative z-10 flex items-center gap-2">{children}</span>
					{withPulse && <div className="absolute inset-0 rounded-inherit animate-neural-pulse opacity-30" />}
				</Button>
			</motion.div>
		);
	}

	return (
		<Button className={cn(getVariantClasses(), className)} ref={ref} variant={variant.startsWith("ai-") ? "default" : (variant as any)} {...props}>
			<span className="relative z-10 flex items-center gap-2">{children}</span>
			{withPulse && <div className="absolute inset-0 rounded-inherit animate-neural-pulse opacity-30" />}
		</Button>
	);
});

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
export type { EnhancedButtonProps };
