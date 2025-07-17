import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { User } from "next-auth"; 
import { checkIfEmailAndGroup } from 'app/utils/db/auth-db';

export const authOptions: NextAuthOptions = {
    providers: [
        AzureADProvider({
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
            tenantId: process.env.MICROSOFT_TENANT_ID!,
            authorization: { 
                params: { 
                    scope: "openid profile email",
                    redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/azure-ad" 
                } 
            },
        }),
    ],
    callbacks: {
        async signIn({ user }: { user: User }) {
            console.log("Sign-in attempt for:", user.email);
           /*  if (!user.email) return false;
            return await checkIfEmailWhitelisted(user.email); */
            return true
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                const email = token.email as string;

                const result = await checkIfEmailAndGroup(email);
                console.log(`Database result for ${email}:`, result);
                //token.isWhitelisted = result.isWhitelisted;
                token.isWhitelisted = true
                
                const groupValue = result.userGroup ? 
                    result.userGroup.toLowerCase() : 'internal';
                
                token.userGroup = groupValue;
                
                console.log(`Token for ${email} now has userGroup:`, token.userGroup);
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.userGroup = token.userGroup as string;
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl) || url.startsWith('/')) {
                if (url.startsWith('/')) {
                    return `${baseUrl}${url}`;
                }
                return url;
            }
            return `${baseUrl}/dashboard`;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_KEY,
    debug: process.env.NODE_ENV === "development",
};