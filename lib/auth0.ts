import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
// Check if we're in a build environment
const isBuildEnv = process.env.NODE_ENV === 'production' && !process.env.AUTH0_SECRET;

// Create a mock Auth0 client for build time
const createMockAuth0Client = () => {
    return {
        getSession: async () => null,
        middleware: async (req: any) => req,
    } as unknown as Auth0Client;
};

// Create the real Auth0 client or a mock based on environment
export const auth0 = isBuildEnv
    ? createMockAuth0Client()
    : new Auth0Client({
        domain: process.env.AUTH0_DOMAIN || 'ottomater-codacus.us.auth0.com',
        clientId: process.env.AUTH0_CLIENT_ID || 'yw7ixDvmy7KqqRfrDGEbZHqYWiAOzoOv',
        clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
        appBaseUrl: process.env.APP_BASE_URL || 'https://riata-lms-j5ef4.ondigitalocean.app',
        secret: process.env.AUTH0_SECRET || '',
        authorizationParameters: {
            scope: process.env.AUTH0_SCOPE || 'openid profile email offline_access',
            response_type: 'code'
        },
        signInReturnToPath: "/student/profile",
        async onCallback(error, context, session) {
            // redirect the user to a custom error page
            if (error) {
                return NextResponse.redirect(
                    new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL)
                )
            }

            // complete the redirect to the provided returnTo URL
            return NextResponse.redirect(
                new URL(context.returnTo || "/", process.env.APP_BASE_URL)
            )
        },
    })

