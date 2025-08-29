// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { enrollInCourse, enrollInCourseFromBackend } from '@/actions/enrollment';
import connectToDatabase from '@/lib/mongodb';

// This is your Stripe webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = (req.headers.get('stripe-signature') as string) ?? '';

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {

            const session = event.data.object;


            // Connect to the database
            await connectToDatabase();

            // Extract the courseId and userId from the session metadata
            const courseId = session.metadata?.courseId;
            const userId = session.metadata?.userId;

            if (!courseId || !userId) {
                return new NextResponse('Missing courseId or userId in metadata', { status: 400 });
            }

            // Enroll the user in the course
            const enrollmentResult = await enrollInCourseFromBackend(courseId, userId);

            if (!enrollmentResult.success) {
                console.error(`Failed to enroll user ${userId} in course ${courseId}: ${enrollmentResult.error}`);
                return new NextResponse(`Enrollment failed: ${enrollmentResult.error}`, { status: 500 });
            }

            console.log(`✅ User ${userId} successfully enrolled in course ${courseId}`);
        } else {
            // Unexpected event type
            console.log(`Unhandled event type: ${event.type}`);
        }

        return new NextResponse(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error processing webhook:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }
}