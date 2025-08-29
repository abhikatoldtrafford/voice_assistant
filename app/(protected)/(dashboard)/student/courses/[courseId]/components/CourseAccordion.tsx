"use client";

import React from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

interface CourseAccordionProps {
	position: "top" | "left" | "right" | "bottom";
	isOpen: boolean;
	onToggle: () => void;
	title: string;
	children: React.ReactNode;
}

export default function CourseAccordion({ position, isOpen, onToggle, title, children }: CourseAccordionProps) {
	// Determine styles based on position
	const getStyles = () => {
		const baseStyle = {
			background: "rgba(26, 32, 44, 0.8)",
			backdropFilter: "blur(8px)",
		};

		switch (position) {
			case "top":
				return {
					...baseStyle,
					height: isOpen ? "18rem" : "3rem", // h-72 or h-12
					borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
					transition: "height 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
					boxShadow: isOpen ? "0 4px 12px rgba(0, 0, 0, 0.2)" : "none",
				};
			case "bottom":
				return {
					...baseStyle,
					height: isOpen ? "18rem" : "3rem", // h-72 or h-12
					borderTop: "1px solid rgba(255, 255, 255, 0.1)",
					transition: "height 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
					boxShadow: isOpen ? "0 -4px 12px rgba(0, 0, 0, 0.2)" : "none",
				};
			case "left":
				return {
					...baseStyle,
					width: isOpen ? "16rem" : "3rem", // w-64 or w-12
					borderRight: "1px solid rgba(255, 255, 255, 0.1)",
					transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
				};
			case "right":
				return {
					...baseStyle,
					width: isOpen ? "16rem" : "3rem", // w-64 or w-12
					borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
					transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
				};
			default:
				return baseStyle;
		}
	};

	// Render the appropriate toggle button based on position
	const renderToggleButton = () => {
		switch (position) {
			case "top":
				return (
					<div className="h-12 px-6 flex items-center justify-center cursor-pointer hover:bg-gray-700 text-gray-200 transition-all duration-300" onClick={onToggle}>
						<span className="font-medium tracking-wide">{title}</span>
						<span className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
							<ChevronDown className="h-4 w-4" />
						</span>
					</div>
				);
			case "bottom":
				return (
					<div className="h-12 px-6 flex items-center justify-center cursor-pointer hover:bg-gray-700 text-gray-200 transition-all duration-300" onClick={onToggle}>
						<span className="font-medium tracking-wide">{title}</span>
						<span className={`ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
							<ChevronUp className="h-4 w-4" />
						</span>
					</div>
				);
			case "left":
				return (
					<div className="w-12 h-full float-left flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 text-gray-200 transition-all duration-300" onClick={onToggle}>
						<span className="transform -rotate-90 whitespace-nowrap font-medium tracking-wide">{title}</span>
						<span className={`mt-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
							<ChevronRight className="h-4 w-4" />
						</span>
					</div>
				);
			case "right":
				return (
					<div className="w-12 h-full float-right flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700 text-gray-200 transition-all duration-300" onClick={onToggle}>
						<span className="transform rotate-90 whitespace-nowrap font-medium tracking-wide">{title}</span>
						<span className={`mt-2 transition-transform duration-300 ${isOpen ? "rotate-180 scale-x-[-1]" : ""}`}>
							<ChevronLeft className="h-4 w-4" />
						</span>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div style={getStyles()}>
			{renderToggleButton()}
			{isOpen && children}
		</div>
	);
}
