// app/(protected)/(dashboard)/dashboard/courses/loading.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
	return (
		<div className="container mx-auto py-8 space-y-6">
			<div>
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-64" />
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<Skeleton className="h-6 w-48" />
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex justify-between">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-4 w-8" />
								</div>
								<Skeleton className="h-2 w-full" />
							</div>
							<div className="flex justify-between">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-32" />
							</div>
						</CardContent>
						<CardFooter>
							<Skeleton className="h-9 w-full" />
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
