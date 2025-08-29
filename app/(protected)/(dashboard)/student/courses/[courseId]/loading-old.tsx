"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function CourseLoading() {
	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<div className="flex flex-col items-center justify-center space-y-4">
				<Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
				<h2 className="text-xl font-semibold text-blue-300">Loading Course Content</h2>
				<p className="text-gray-400">Preparing your learning experience...</p>
			</div>
		</div>
	);
}
