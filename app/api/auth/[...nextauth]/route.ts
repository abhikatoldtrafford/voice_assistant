import NextAuth from "next-auth"
import Auth0Provider from "next-auth/providers/auth0";

const handler = NextAuth({
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        })
        // ...add more providers here
    ],
})

export { handler as GET, handler as POST }