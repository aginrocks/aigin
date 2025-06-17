import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    // const isPublicPath = path === '/api/login';
    const split = path.split('/')[1];
    const isPublicPath =
        split === 'home' ||
        path.startsWith('/_next/') ||
        path === '/favicon.ico' ||
        path.endsWith('.png') ||
        path.endsWith('.svg');

    const cookieHeader = request.cookies.get('oidc-auth') || '';

    if (!cookieHeader && !isPublicPath) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
