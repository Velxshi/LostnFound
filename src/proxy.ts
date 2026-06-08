// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    const { searchParams } = req.nextUrl

    const isManualVisit = searchParams.get('mode') === 'public'

    // Redirect jika admin mengakses root '/'
    if (pathname === '/' && token?.roleId === 1 && !isManualVisit) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Blokir jika user non-admin mencoba mengakses halaman /admin
    if (pathname.startsWith('/admin') && token?.roleId !== 1) {
      return NextResponse.redirect(new URL('/forbidden', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // PROTEKSI API: Jika mencoba hit API statistik admin tapi bukan admin (roleId !== 1)
        if (pathname.startsWith('/api/stats') && token?.roleId !== 1) {
          return false // Mengembalikan HTTP 401/403 otomatis
        }

        // Proteksi API umum jika tidak login
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
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/notifications/:path*',
    '/reports/:path*',
    '/about/:path*',
    '/',
    '/api/stats',
  ],
}
