import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { forgeStateMatrix, getDevLedgerMemory } from '@/lib/forgeState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const state = await forgeStateMatrix();
    const memory = getDevLedgerMemory();

    let mappings: Record<string, string | null> = {};

    if (memory) {
      for (const id of state.forgedArtifactIds) {
        const entry = memory.ledgers.get(id) ?? null;
        mappings[id] = (entry as { shopifyVariantId?: unknown } | null)?.shopifyVariantId as string | undefined ?? null;
      }
    } else {
      await Promise.all(
        state.forgedArtifactIds.map(async (id) => {
          const raw = await kv.hgetall(`forge:ledger:${id}`);
          const value = raw && typeof raw === 'object' && Object.prototype.hasOwnProperty.call(raw, 'shopifyVariantId')
            ? (raw as Record<string, unknown>).shopifyVariantId
            : null;
          mappings[id] = typeof value === 'string' ? value : null;
        })
      );
    }

    return res.status(200).json({
      ...state,
      mappings,
    });
  } catch (error) {
    console.error('State read error', error);
    return res.status(500).json({ error: 'Failed to read forge state' });
  }
}
