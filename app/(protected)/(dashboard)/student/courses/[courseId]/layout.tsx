"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CourseContentLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			{/* Minimal navigation header */}
			<div className="h-12 flex items-center px-4 bg-black/30 backdrop-blur-sm border-b border-white/5">
				<div className="flex items-center space-x-4">
					<Link href="/student/courses" className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition">
						<ChevronLeft className="h-4 w-4 mr-1" />
						Return to Courses
					</Link>
					<div className="h-4 w-px bg-white/10" />
					<Link href="/student/dashboard" className="flex items-center text-sm text-gray-400 hover:text-white transition">
						<Home className="h-4 w-4 mr-1" />
						Dashboard
					</Link>
				</div>
			</div>

			{/* Main content - full height minus the header */}
			<div className="h-[calc(100vh-3rem)] w-full overflow-hidden">{children}</div>
		</div>
	);
}
