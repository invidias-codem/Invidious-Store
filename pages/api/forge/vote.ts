import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionToken = req.cookies.invidious_vault_access;
    const { artifactId } = req.body as { artifactId?: string };

    if (!artifactId || typeof artifactId !== 'string' || !sessionToken) {
      return res.status(401).json({ error: 'Unauthorized or missing artifact identifier' });
    }

    const voterSetKey = `forge:voted:${artifactId}`;
    const voteCountKey = `forge:votes:${artifactId}`;

    const hasVoted = await kv.sismember(voterSetKey, sessionToken);

    if (hasVoted) {
      return res.status(429).json({ error: 'Artifact already endorsed by this session' });
    }

    const pipeline = kv.pipeline();
    pipeline.incr(voteCountKey);
    pipeline.sadd(voterSetKey, sessionToken);
    const results = await pipeline.exec();
    const newTotal = results[0] as number;

    return res.status(200).json({ success: true, votes: newTotal });
  } catch {
    return res.status(500).json({ error: 'Internal server error during sequence' });
  }
}
