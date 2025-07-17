import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_KEY 
    });
    
    return Response.json({
        env: {
            hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
            hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
            hasMicrosoftClientId: !!process.env.MICROSOFT_CLIENT_ID,
            hasMicrosoftClientSecret: !!process.env.MICROSOFT_CLIENT_SECRET,
            hasDbCreds: !!(process.env.DB_USER && process.env.DB_PASSWORD),
            nextAuthUrl: process.env.NEXTAUTH_URL?.substring(0, 10) + '...',
        },
        session: {
            user: session?.user ?? null,
            userGroup: session?.userGroup ?? null,
            email: session?.user?.email ?? null
        },
        token: token ? {
            email: token.email,
            userGroup: token.userGroup,
            isWhitelisted: token.isWhitelisted,
            tokenKeys: Object.keys(token)
        } : null
    });
}