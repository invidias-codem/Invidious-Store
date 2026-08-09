'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';

const BASE_URL = 'https://invidious.shop';
const SITE_NAME = 'Invidious';

const PAGE_DEFAULTS: Record<string, { title: string; description: string; path: string }> = {
  '/': {
    title: 'Invidious — Restricted Drops With Transparent Pricing',
    description: 'Shop limited engineered garments without hidden sales-tax shock. Built for California, Colorado, and Washington buyers who want a clear price at checkout.',
    path: '/',
  },
  '/products': {
    title: 'All Drops — Archive | Invidious',
    description: 'Browse the full invidious archive. Finite batches, exposed seams, and final-sale clarity with no regional tax surprises.',
    path: '/products',
  },
  '/checkout': {
    title: 'Checkout — Secure Purchase | Invidious',
    description: 'Checkout securely with Shop Pay. See the final price before you buy, including any applicable duties or shipping.',
    path: '/checkout',
  },
  '/manifesto': {
    title: 'Manifesto — Invidious',
    description: 'Engineered for longevity, offline ownership, and controlled distribution. Clothing first. Retro sovereignty as side channel.',
    path: '/manifesto',
  },
  '/forge': {
    title: 'Forge — Invidious',
    description: 'Interactive 3D artifact viewer. Preview garments in your browser before checkout.',
    path: '/forge',
  },
};

const GEO_COPY: Record<string, string> = {
  US: 'Order from California, Colorado, or Washington and compare our transparent pricing against local 8–10% sales-tax burdens.',
  CA: 'California buyers: skip hidden tax shocks at checkout with Invidious final-price clarity on engineered garments.',
  CO: 'Colorado buyers: compare Invidious transparent pricing against local sales-tax burden. What you see is what you pay.',
  WA: 'Washington buyers: buy engineered garments with clear final pricing, not post-checkout tax surprises.',
};

function resolveRegion(): string {
  if (typeof window === 'undefined') return 'US';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('America/Los_Angeles') || tz.includes('America/Vancouver')) return 'CA';
    if (tz.includes('America/Denver')) return 'CO';
    if (tz.includes('America/Los_Angeles') || tz.includes('America/Tijuana')) return 'CA';
    if (tz.includes('America/Seattle') || tz.includes('America/Los_Angeles') || tz.includes('America/Denver')) {
      if (tz.includes('Seattle')) return 'WA';
    }
  } catch {
    // ignore timezone detection failure
  }
  return 'US';
}

export function SeoHead({ title, description, canonicalPath, jsonLd }: { title?: string; description?: string; canonicalPath?: string; jsonLd?: Record<string, any> }) {
  const router = useRouter();
  const resolvedPath = typeof canonicalPath === 'string' ? canonicalPath : (router.asPath.split('?')[0] || '/');
  const defaults = PAGE_DEFAULTS[resolvedPath] || PAGE_DEFAULTS['/'];
  const pageTitle = title || defaults.title;
  const pageDescription = description || defaults.description;
  const region = resolveRegion();
  const geoLine = GEO_COPY[region] || GEO_COPY.US;
  const enrichedDescription = `${pageDescription} ${geoLine}`;

  const url = `${BASE_URL}${resolvedPath === '/' ? '' : resolvedPath}`;
  const productJsonLd = jsonLd || {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: enrichedDescription,
  };

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={enrichedDescription} />
      <link rel="canonical" href={canonicalPath ? `${BASE_URL}${canonicalPath === '/' ? '' : canonicalPath}` : `${BASE_URL}${resolvedPath === '/' ? '' : resolvedPath}`} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={enrichedDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={enrichedDescription} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </Head>
  );
}
