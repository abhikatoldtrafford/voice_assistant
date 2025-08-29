"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollInCourse } from "@/actions/enrollment";
import { createCheckoutSession } from "@/actions/payment";
import { CheckCircle, Loader2, Play, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface EnrollButtonProps {
	courseId: string;
	isEnrolled: boolean;
	price: number;
	isFree?: boolean;
}

export default function EnrollButton({ courseId, isEnrolled, price, isFree = false }: EnrollButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { isAuthenticated } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	// Check if we're coming back from a payment
	const paymentCancelled = searchParams.get("paymentCancelled");
	const paymentError = searchParams.get("error");

	// Show error toast if payment was cancelled or had an error
	useEffect(() => {
		if (paymentCancelled) {
			toast({
				title: "Payment cancelled",
				description: "Your enrollment was not completed because the payment was cancelled.",
				variant: "destructive",
			});
		} else if (paymentError) {
			toast({
				title: "Payment error",
				description: paymentError,
				variant: "destructive",
			});
		}
	}, [paymentCancelled, paymentError, toast]);

	const handleEnroll = async () => {
		if (isEnrolled) {
			router.push(`/student/courses/${courseId}`);
			return;
		}

		try {
			setIsLoading(true);

			if (!isAuthenticated) {
				router.push(`/auth/login?redirectTo=/courses/${courseId}`);
				return;
			}

			// For free courses, enroll directly
			if (isFree) {
				const result = await enrollInCourse(courseId);

				if (result.success) {
					toast({
						title: "Successfully enrolled!",
						description: "You can now access all course content.",
						variant: "default",
					});
					router.push(`/student/courses/${courseId}`);
				} else {
					toast({
						title: "Enrollment failed",
						description: result.error || "Something went wrong",
						variant: "destructive",
					});
				}
				return;
			}

			// For paid courses, redirect to Stripe
			const result = await createCheckoutSession(courseId);

			if (result.success && result.checkoutUrl) {
				// Redirect to the Stripe checkout page
				window.location.href = result.checkoutUrl;
			} else {
				toast({
					title: "Payment initialization failed",
					description: result.error || "Unable to process payment at this time",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to process your request. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (isEnrolled) {
		return (
			<Button onClick={handleEnroll} className="w-full bg-success text-white hover:bg-success/90 shadow-sm hover:shadow-md transition-all duration-300" disabled={isLoading}>
				<CheckCircle className="mr-2 h-4 w-4" />
				Continue Learning
			</Button>
		);
	}

	return (
		<Button onClick={handleEnroll} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md transition-all duration-300 group" disabled={isLoading}>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Processing...
				</>
			) : (
				<>
					{isFree ? (
						<>
							<Play className="mr-2 h-4 w-4" />
							Start Learning - Free
						</>
					) : (
						<>
							Enroll Now - ${price.toFixed(0)}
							<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
						</>
					)}
				</>
			)}
		</Button>
	);
}
