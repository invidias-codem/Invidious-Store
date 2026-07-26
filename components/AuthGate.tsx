'use client';

import { useEffect, useState } from 'react';
import { LockedOverlay } from './LockedOverlay';

type CookieBanner = {
  invidious_vault_access?: string;
  [key: string]: string | undefined;
};

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce<CookieBanner>((acc, item) => {
      const [key, ...rest] = item.trim().split('=');
      acc[key] = rest.join('=');
      return acc;
    }, {});
    setAuthenticated(Boolean(cookies.invidious_vault_access));
  }, []);

  if (!authenticated) {
    return (
      <>
        {children}
        <LockedOverlay />
      </>
    );
  }

  return <>{children}</>;
}
