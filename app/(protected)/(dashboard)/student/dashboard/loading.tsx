import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<Skeleton className="h-8 w-64 mb-2" />
				<Skeleton className="h-4 w-48" />
			</div>

			<div className="grid gap-6">
				<div>
					<Skeleton className="h-6 w-32 mb-4" />
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<Card key={i} className="relative overflow-hidden">
								<CardHeader>
									<Skeleton className="h-6 w-full" />
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
										<Skeleton className="h-4 w-24" />
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

				<div className="mt-8">
					<Skeleton className="h-6 w-40 mb-4" />
					<div className="grid gap-4 md:grid-cols-3">
						{[1, 2, 3].map((i) => (
							<Card key={i}>
								<CardContent className="pt-6">
									<div className="flex items-center space-x-4">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div>
											<Skeleton className="h-6 w-8 mb-1" />
											<Skeleton className="h-4 w-32" />
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
