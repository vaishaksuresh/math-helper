import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const profileId = req.cookies.get('profile_id')?.value

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/profile-picker') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (pathname === '/') return NextResponse.next()

  if (!profileId) {
    return NextResponse.redirect(new URL('/profile-picker', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
