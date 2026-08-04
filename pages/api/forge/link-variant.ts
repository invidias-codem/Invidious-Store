import type { NextApiRequest, NextApiResponse } from 'next';
import { setDevForged, getDevLedgerMemory, writeLedger } from '@/lib/forgeState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionToken = req.cookies.invidious_vault_access;
  if (!sessionToken) {
    return res.status(401).json({ error: 'Unauthorized: vault gate required.' });
  }

  const { artifactId, shopifyVariantId } = (req.body ?? {}) as {
    artifactId?: string;
    shopifyVariantId?: string;
  };

  if (!artifactId || !shopifyVariantId) {
    return res.status(400).json({ error: 'Missing artifactId or shopifyVariantId.' });
  }

  try {
    const memory = getDevLedgerMemory();
    if (memory) {
      const entry = memory.ledgers.get(artifactId) ?? {
        votes: 0,
        votedSessionCount: 0,
        threshold: 25,
        status: 'MESH_PENDING',
      };
      memory.ledgers.set(artifactId, { ...entry, shopifyVariantId });
      memory.forged.add(artifactId);
    } else {
      const entry = (await writeLedger(artifactId, {
        votes: 0,
        votedSessionCount: 0,
        threshold: 25,
        status: 'MESH_PENDING',
      })) as unknown as string | void | Promise<void>;
      if (entry instanceof Promise) {
        await entry;
      }
    }

    setDevForged(artifactId);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: 'Failed to link Shopify variant.' });
  }
}
