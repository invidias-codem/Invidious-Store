import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const GATE_ROUTE = '/vault';
const PROTECTED_PREFIXES = ['/checkout'];

function isProtectedPath(pathname: string) {
  if (pathname === '/' || pathname === '/index') return false;
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix + '/') || pathname === prefix);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.has('invidious_vault_access');

  if (hasAccess) {
    return NextResponse.next();
  }

  const gateUrl = new URL(GATE_ROUTE, request.url);
  gateUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|vault|api).*)'],
};
