// // middleware.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;
    
//     // Exclude debug route from middleware protection
//     const isExcludedRoute = pathname.startsWith('/api/auth') || 
//                             pathname === '/login' ||
//                             pathname === '/api/debug';
    
//     if (isExcludedRoute) {
//         return NextResponse.next();
//     }
    
//     const isDebugMode = request.nextUrl.searchParams.get('debug') === 'true';
    
//     try {
//         const token = await getToken({
//             req: request,
//             secret: process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_KEY
//         });

//         if (isDebugMode) {
//             console.log('Debug mode: Token received:', JSON.stringify(token, null, 2));
//         }

//         if (!token) {
//             console.log('No token found, redirecting to login');
//             const loginUrl = new URL('/login', request.url);
//             loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
//             return NextResponse.redirect(loginUrl);
//         }

//         // Check user groups
//         /* if (token.userGroup) {
//             const rawUserGroup = token.userGroup;
            
//             // Detailed logging of the userGroup value for debugging
//             if (isDebugMode) {
//                 console.log('Debug mode: User group raw value:', rawUserGroup);
//                 console.log('Debug mode: User group type:', typeof rawUserGroup);
//             }

//               const userGroups = typeof rawUserGroup === 'string'
//                 ? rawUserGroup.split(',').map(group => group.trim().toLowerCase())
//                 : Array.isArray(rawUserGroup)
//                     ? rawUserGroup.map(group => String(group).toLowerCase())
//                     : [];
                    

//                     if (isDebugMode) {
//                         console.log('Debug mode: Processed user groups:', userGroups);
//                     }        

//             const hasInternalAccess = userGroups.some(group => group === 'internal');

//             if (isDebugMode) {
//                 console.log(`Debug mode: Has internal access: ${hasInternalAccess}`);
//             }

            
//             if (!hasInternalAccess) {
//                 console.log(`Access denied for ${token.email}: Missing internal group. Groups found: ${JSON.stringify(userGroups)}`);
                
//                 // In debug mode, return detailed information instead of redirecting
//                 if (isDebugMode) {
//                     return new NextResponse(
//                         JSON.stringify({
//                             error: 'Access denied',
//                             reason: 'Missing internal group',
//                             email: token.email,
//                             groups: userGroups,
//                             rawGroupData: rawUserGroup
//                         }),
//                         {
//                             status: 403,
//                             headers: {
//                                 'Content-Type': 'application/json',
//                             },
//                         }
//                     );
//                 }
                
//                 return NextResponse.redirect(new URL('/api/auth/signout', request.url));
//             }
 
//         } else {
//             console.log('No user group found in token');
//             if (isDebugMode) {
//                 return new NextResponse(
//                     JSON.stringify({
//                         error: 'No user group found',
//                         email: token.email,
//                         tokenKeys: Object.keys(token)
//                     }),
//                     {
//                         status: 403,
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
//             }
//             return NextResponse.redirect(new URL('/api/auth/signout', request.url));
//         } */

//         return NextResponse.next();
//     } catch (error) {
//         console.error('Middleware error:', error);
//         if (isDebugMode) {
//             return new NextResponse(
//                 JSON.stringify({
//                     error: 'Middleware error',
//                     message: error instanceof Error ? error.message : String(error),
//                     stack: error instanceof Error ? error.stack : undefined
//                 }),
//                 {
//                     status: 500,
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//         }
//         return NextResponse.redirect(new URL('/login', request.url));
//     }
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|public).*)'
//     ]
// };