import { NextResponse } from 'next/server';
import { consumeVaultSession } from '@/lib/vault/session';

export const runtime = 'edge';

export default async function GET(request: Request) {
  const url = new URL(request.url);
  const session = url.searchParams.get('session');
  const code = url.searchParams.get('code');

  if (!session || !code) {
    return NextResponse.redirect(new URL('/vault?error=invalid_session', request.url));
  }

  const result = await consumeVaultSession(session, code);
  if (!result.ok) {
    return NextResponse.redirect(new URL(`/vault?error=${encodeURIComponent(result.error)}`, request.url));
  }

  const redirectTo = new URL(result.next || '/', request.url);

  const response = NextResponse.redirect(redirectTo);
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? 'None' : 'Lax';
  const cookie = `invidious_vault_access=true; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=7200${isProduction ? '; Secure' : ''}`;
  response.headers.set('Set-Cookie', cookie);

  return response;
}
