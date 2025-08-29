// app/(public)/courses/loading.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

export default function CoursesLoading() {
	return (
		<div className="container mx-auto py-12">
			<div className="flex items-center gap-x-3 mb-8">
				<div className="bg-primary/10 p-2 rounded-full">
					<GraduationCap className="h-8 w-8 text-primary" />
				</div>
				<div>
					<Skeleton className="h-8 w-48 mb-2" />
					<Skeleton className="h-4 w-64" />
				</div>
			</div>

			{/* Filter skeleton */}
			<Skeleton className="h-14 w-full mb-8" />

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<Card key={i} className="overflow-hidden">
						<Skeleton className="h-48 w-full" />
						<CardHeader>
							<div className="flex items-center justify-between mb-2">
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-5 w-12" />
							</div>
							<Skeleton className="h-6 w-full mb-2" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4 mt-1" />
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-full" />
							</div>
						</CardContent>
						<CardFooter className="border-t pt-4">
							<div className="flex items-center justify-between w-full">
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-9 w-28" />
							</div>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
