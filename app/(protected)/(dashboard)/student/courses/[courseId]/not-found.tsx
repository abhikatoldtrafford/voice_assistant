import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
	return (
		<div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<div className="max-w-md text-center space-y-6">
				<div className="bg-gray-800/50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto border border-gray-700">
					<FileQuestion className="h-12 w-12 text-blue-400" />
				</div>
				<h1 className="text-3xl font-bold text-white">Course Not Found</h1>
				<p className="text-gray-300">The course you're looking for doesn't exist or you may not have access to it.</p>
				<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
					<Link href="/student/courses">
						<Button className="bg-blue-600 hover:bg-blue-700 text-white">My Courses</Button>
					</Link>
					<Link href="/courses">
						<Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
							Browse All Courses
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
