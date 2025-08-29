// app/components/CourseCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, BookOpenCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface CourseCardProps {
	course: {
		_id: string;
		title: string;
		progress: number;
		totalChapters: number;
		completedChapters: string[];
		isCompleted: boolean;
		lastAccessed: string;
	};
	showContinueAction?: boolean;
}

export default function CourseCard({ course, showContinueAction = true }: CourseCardProps) {
	return (
		<Card key={course._id} className="flex flex-col">
			<CardHeader>
				<CardTitle className="line-clamp-1">{course.title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 flex-grow">
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span>Progress</span>
						<span className="font-medium">{course.progress}%</span>
					</div>
					<Progress value={course.progress} className="h-2" />
				</div>
				<div className="flex justify-between text-sm text-muted-foreground">
					<div className="flex items-center">
						<BookOpen className="h-4 w-4 mr-1" />
						{course.completedChapters.length}/{course.totalChapters} chapters
					</div>
					<div className="flex items-center">
						<Clock className="h-4 w-4 mr-1" />
						{formatDistanceToNow(new Date(course.lastAccessed), { addSuffix: true })}
					</div>
				</div>
			</CardContent>
			{showContinueAction && (
				<CardFooter>
					<Link href={`/student/courses/${course._id}`} className="w-full">
						<Button className="w-full" variant={course.isCompleted ? "outline" : "default"}>
							{course.isCompleted ? (
								<>
									<BookOpenCheck className="h-4 w-4 mr-2" />
									Review Course
								</>
							) : (
								<>
									Continue Learning
									<ArrowRight className="h-4 w-4 ml-2" />
								</>
							)}
						</Button>
					</Link>
				</CardFooter>
			)}
		</Card>
	);
}
