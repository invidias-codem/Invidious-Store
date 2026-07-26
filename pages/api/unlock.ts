import type { NextApiRequest, NextApiResponse } from 'next';

type TokenPayload = { used: boolean; email: string };

function buildCookie(maxAgeSeconds: number, isProduction: boolean) {
  const parts = `invidious_vault_access=true; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
  return isProduction ? `${parts}; Secure` : parts;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessCode } = req.body as { accessCode?: string };

  if (!accessCode || typeof accessCode !== 'string') {
    return res.status(400).json({ error: 'Access code required' });
  }

  const hasKvEnv = Boolean(process.env.KV_REST_API_URL || process.env.KV_URL);
  const isProduction = process.env.NODE_ENV === 'production';

  if (!hasKvEnv) {
    return res.status(500).json({ error: 'KV is not configured on this deployment' });
  }

  try {
    const { kv } = await import('@vercel/kv');
    const tokenData = (await kv.get<TokenPayload>(`token:${accessCode}`)) ?? null;

    if (!tokenData) {
      return res.status(401).json({ error: 'ACCESS DENIED: Token not recognized' });
    }

    if (tokenData.used) {
      return res.status(401).json({ error: 'ACCESS DENIED: Token already consumed' });
    }

    await kv.set(`token:${accessCode}`, { ...tokenData, used: true });

    const next = Array.isArray(req.query.next) ? req.query.next[0] : req.query.next;
    const redirectTo = typeof next === 'string' ? next : '/';

    res.setHeader('Set-Cookie', buildCookie(60 * 60 * 2, isProduction));
    return res.status(200).json({ success: true, email: tokenData.email, redirectTo });
  } catch (error) {
    console.error('KV Validation Error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}
