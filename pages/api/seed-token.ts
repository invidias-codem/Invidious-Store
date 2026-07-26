import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const testToken = 'CHROME-TEST-01';

  if (!process.env.KV_REST_API_URL && !process.env.KV_URL) {
    return res.status(500).json({ message: 'KV is not configured on this deployment' });
  }

  await kv.set(`token:${testToken}`, { used: false, email: 'test@invidious.com' });

  return res.status(200).json({ message: `Token ${testToken} seeded successfully.` });
}
