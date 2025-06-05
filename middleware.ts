import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req: NextRequest & { auth: any }) => {
  try {
    const isAuth = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isPublicPage = ['/', '/about', '/contact'].includes(req.nextUrl.pathname)
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    // Allow API routes to pass through
    if (isApiRoute) {
      return NextResponse.next()
    }

    // Redirect old assessment results route to new consolidated route
    if (req.nextUrl.pathname.startsWith('/assessment/results/')) {
      const userId = req.nextUrl.pathname.split('/assessment/results/')[1];
      return NextResponse.redirect(new URL(`/results?user=${userId}`, req.url));
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow public pages and auth pages
    if (isPublicPage || isAuthPage) {
      return NextResponse.next()
    }

    // All other routes require authentication
    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // If there's an auth error, redirect to login
    if (req.nextUrl.pathname.startsWith('/auth') || ['/', '/about', '/contact'].includes(req.nextUrl.pathname)) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}