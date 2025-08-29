import { NextRequest, NextResponse } from 'next/server';
import { verifyPaymentAndEnroll } from '@/actions/payment';

export async function GET(request: NextRequest) {
    try {
        // Get the session ID and course ID from the query parameters
        const searchParams = request.nextUrl.searchParams;
        const sessionId = searchParams.get('session_id');
        const courseId = searchParams.get('courseId');

        if (!sessionId || !courseId) {
            return NextResponse.redirect(
                new URL(`/courses?error=missing_parameters`, request.url)
            );
        }

        // Verify the payment and enroll the user
        const result = await verifyPaymentAndEnroll(sessionId, courseId);

        if (!result.success) {
            return NextResponse.redirect(
                new URL(`/courses/${courseId}?error=${result.error}`, request.url)
            );
        }
        return NextResponse.redirect(
            new URL(`/student/courses/${courseId}`, request.url)
        );

    } catch (error) {
        console.error('Error processing payment success:', error);
        return NextResponse.redirect(
            new URL('/courses?error=payment_processing_failed', request.url)
        );
    }
}