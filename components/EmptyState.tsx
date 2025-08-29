import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface EmptyStateProps {
	title: string;
	description: string;
	actionLabel: string;
	actionHref: string;
}

export default function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-slate-50">
			<div className="p-3 bg-primary/10 rounded-full mb-4">
				<BookOpen className="h-8 w-8 text-primary" />
			</div>
			<h3 className="font-medium text-lg mb-2">{title}</h3>
			<p className="text-muted-foreground mb-4 max-w-md">{description}</p>
			<Link href={actionHref}>
				<Button>{actionLabel}</Button>
			</Link>
		</div>
	);
}
