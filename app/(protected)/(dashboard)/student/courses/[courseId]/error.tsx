"use client";

import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<div className="max-w-md text-center space-y-6">
				<XCircle className="h-16 w-16 text-red-500 mx-auto" />
				<h2 className="text-2xl font-bold text-white">Something went wrong</h2>
				<p className="text-gray-300">We encountered an error while loading this course.</p>
				<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
					<Button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white">
						Try Again
					</Button>
					<Link href="/student/courses">
						<Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
							Return to Courses
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
