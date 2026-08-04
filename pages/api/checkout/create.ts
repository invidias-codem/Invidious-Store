import type { NextApiRequest, NextApiResponse } from 'next';
import { createCheckout } from '@/lib/shopify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionToken = req.cookies.invidious_vault_access;
  if (!sessionToken) {
    return res.status(401).json({ error: 'Unauthorized: Syndicate access required for transactions.' });
  }

  try {
    const body = req.body as {
      items?: Array<{ merchandiseId?: string; quantity?: number }>;
      returnUrl?: string;
    } | undefined;

    const items = body?.items;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Cart manifest is empty.' });
    }

    const cleaned = items
      .filter((item) => typeof item.merchandiseId === 'string' && typeof item.quantity === 'number')
      .map((item) => ({ merchandiseId: item.merchandiseId as string, quantity: item.quantity as number }));

    if (!cleaned.length) {
      return res.status(400).json({ error: 'Cart manifest is empty.' });
    }

    const cart = await createCheckout(cleaned, body?.returnUrl);
    return res.status(200).json({ checkoutUrl: cart.checkoutUrl });
  } catch (error: any) {
    const message = error?.message || 'Failed to initialize secure transaction.';
    const normalized = message.toLowerCase();
    let userErrors: string[] | undefined;

    if (normalized.includes('out of stock') || normalized.includes('unavailable')) {
      userErrors = ['One or more selected variants are out of stock.'];
    } else if (normalized.includes('invalid')) {
      userErrors = ['One or more variant IDs are invalid.'];
    }

    return res.status(400).json({
      error: userErrors ? undefined : message,
      errors: userErrors,
    });
  }
}
