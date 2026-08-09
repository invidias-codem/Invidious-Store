import type { NextApiRequest, NextApiResponse } from 'next';
import { setDevForged, getDevLedgerMemory, writeLedger } from '@/lib/forgeState';
import { ShopifyAdminClient } from '@/lib/shopify-admin';

const admin = new ShopifyAdminClient();

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

  if (!shopifyVariantId.startsWith('gid://shopify/')) {
    return res.status(400).json({ error: 'Invalid Shopify variant ID format.' });
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
      const entry = await writeLedger(artifactId, {
        votes: 0,
        votedSessionCount: 0,
        threshold: 25,
        status: 'MESH_PENDING',
      });
      await entry;
    }

    setDevForged(artifactId);

    let metafieldsUpdated = false;
    try {
      const base = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host || ''}`;
      const origin = base.replace(/\/$/, '');
      const glbSrc = `${origin}/3d/${artifactId}/artifact.glb`;
      const usdzSrc = `${origin}/3d/${artifactId}/artifact.usdz`;

      await admin.setVariantModelMetafields(shopifyVariantId, glbSrc, usdzSrc);
      metafieldsUpdated = true;
    } catch (adminError: any) {
      console.error('[link-variant] metafield write failed:', adminError);
    }

    return res.status(200).json({ success: true, metafieldsUpdated });
  } catch (error: any) {
    console.error('[link-variant] handler failed:', error);
    return res.status(500).json({ error: 'Failed to link Shopify variant.' });
  }
}
