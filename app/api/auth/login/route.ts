import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // Get password from environment variable
        const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'Venezuela2026';

        if (password === DASHBOARD_PASSWORD) {
            // Set secure cookie for 7 days
            const cookieStore = await cookies();
            cookieStore.set('dashboard_auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/'
            });

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
