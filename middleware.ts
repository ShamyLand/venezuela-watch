import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if user is accessing the dashboard
    if (request.nextUrl.pathname === '/dashboard') {
        // Check for authentication cookie
        const authCookie = request.cookies.get('dashboard_auth');

        if (!authCookie || authCookie.value !== 'authenticated') {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Check if user is accessing login page while already authenticated
    if (request.nextUrl.pathname === '/login') {
        const authCookie = request.cookies.get('dashboard_auth');

        if (authCookie && authCookie.value === 'authenticated') {
            // Redirect to dashboard if already authenticated
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Check if user is accessing root path
    if (request.nextUrl.pathname === '/') {
        const authCookie = request.cookies.get('dashboard_auth');

        if (authCookie && authCookie.value === 'authenticated') {
            // Redirect to dashboard if authenticated
            return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
            // Redirect to login if not authenticated
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/login', '/admin']
};
