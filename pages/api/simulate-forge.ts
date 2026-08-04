import type { NextApiRequest, NextApiResponse } from 'next';
import { setDevForged, getDevForgedIds } from '@/lib/forgeState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Simulation disabled in production matrix' });
  }

  const targetArtifact = 'forge-01';

  try {
    setDevForged(targetArtifact);

    return res.status(200).json({
      message: 'Simulation complete. Check /products UI.',
      verifiedIds: getDevForgedIds(),
    });
  } catch {
    return res.status(500).json({ error: 'Simulation failed' });
  }
}
