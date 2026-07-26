import type { NextApiRequest, NextApiResponse } from 'next';

type TokenRecord = { used: boolean; email: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const hasKvEnv = Boolean(process.env.KV_REST_API_URL || process.env.KV_URL);

  if (!hasKvEnv) {
    return res.status(500).json({ error: 'KV is not configured on this deployment' });
  }

  if (req.method === 'GET') {
    try {
      const { kv } = await import('@vercel/kv');
      const keys: string[] = await kv.keys('token:*');
      if (!keys.length) return res.status(200).json([]);

      const pipeline = kv.pipeline();
      keys.forEach((key) => pipeline.get<TokenRecord>(key));
      const results = await pipeline.exec();

      const tokens = keys.map((key, index) => {
        const data = results[index] as TokenRecord | undefined;
        return {
          code: key.replace('token:', ''),
          used: data?.used ?? true,
          email: data?.email ?? 'unassigned',
        };
      });

      return res.status(200).json(tokens);
    } catch {
      return res.status(500).json({ error: 'Failed to fetch tokens' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { count } = req.body as { count?: number };
      const quantity = typeof count === 'number' ? Math.min(Math.max(count, 1), 500) : 10;
      const { kv } = await import('@vercel/kv');

      const pipeline = kv.pipeline();
      const generatedCodes: string[] = [];

      for (let i = 0; i < quantity; i++) {
        const code = Math.random().toString(16).substring(2, 10).toUpperCase();
        generatedCodes.push(code);
        pipeline.set(`token:${code}`, { used: false, email: 'unassigned' });
      }

      await pipeline.exec();
      return res.status(200).json({ success: true, generatedCodes });
    } catch {
      return res.status(500).json({ error: 'Failed to generate tokens' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
