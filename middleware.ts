import { NextRequest } from 'next/server'
import { auth } from '@/auth'

export default auth((req: NextRequest & { auth: any }) => {
  const isAuth = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isPublicPage = ['/', '/about', '/contact'].includes(req.nextUrl.pathname)

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuth) {
    return Response.redirect(new URL('/dashboard', req.url))
  }

  // Allow public pages and auth pages
  if (isPublicPage || isAuthPage) {
    return
  }

  // All other routes require authentication
  if (!isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }
    return Response.redirect(
      new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
    );
  }
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}