import { NextResponse } from 'next/server';

export function middleware(request) {
    const { origin, pathname, searchParams } = request.nextUrl;
    const allowedPaths = ['/_next', '/static', '/favicon.ico', '/signin'];

    if (allowedPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (!request.cookies.get('token')) {
        const url = encodeURIComponent(pathname + searchParams);
        return NextResponse.redirect(`${origin}/signin?redirect_url=${url}`);
    }

    return NextResponse.next();
}