'use server'

import { getCurrentUser } from './user';
import Stripe from 'stripe';
import Course from '@/models/Course';
import connectToDatabase from '@/lib/mongodb';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

/**
 * Creates a Stripe checkout session for a course purchase
 */
export async function createCheckoutSession(courseId: string) {
    try {
        // Get the current user
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }
        connectToDatabase();


        // Fetch the course details to get the price
        const course = await Course.findById(courseId);

        if (!course) {
            return { success: false, error: 'Course not found' };
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            description: course.description.substring(0, 500), // Stripe has a limit on description length
                        },
                        unit_amount: Math.round(course.price * 100), // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.APP_BASE_URL}/api/payments/success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${process.env.APP_BASE_URL}/courses/${courseId}?paymentCancelled=true`,
            metadata: {
                courseId: courseId,
                userId: user._id.toString(),
            },
            customer_email: user.email,
        });

        return { success: true, checkoutUrl: session.url };
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Verify a completed checkout session and enroll the user
 */
export async function verifyPaymentAndEnroll(sessionId: string, courseId: string) {
    try {
        // Retrieve the session to verify payment status
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return { success: false, error: 'Payment not completed' };
        }

        // Get the user from the session metadata
        const userId = session.metadata?.userId;

        if (!userId) {
            return { success: false, error: 'User information missing' };
        }

        // Enroll the user in the course
        // You could call your existing enrollment function here
        // For example: return await enrollInCourse(courseId, userId);
        return { success: true };
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return { success: false, error: error.message };
    }
}