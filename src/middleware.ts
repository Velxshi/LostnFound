// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    const { searchParams } = req.nextUrl

    const isManualVisit = searchParams.get('mode') === 'public'

    if (pathname === '/' && token?.roleId === 1 && !isManualVisit) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    if (pathname.startsWith('/admin') && token?.roleId !== 1) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        if (pathname.startsWith('/api') && !token) {
          return false
        }

        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  },
)

export const config = {
  // matcher: [
  //   '/((?!api/auth|login|_next/static|_next/image|favicon.ico|public|images).*)',
  // ],
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/reports/:path*',
    '/about/:path*',
    '/',
  ],
}
