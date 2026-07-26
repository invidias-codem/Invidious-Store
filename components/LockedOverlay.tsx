'use client';

import { useEffect, useState } from 'react';

export function LockedOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="border border-invidious-border bg-invidious-bg p-8 max-w-md w-full">
        <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 mb-3">Access Denied</p>
        <p className="text-sm text-gray-400 font-mono leading-relaxed">
          This archive is locked until vault authentication is granted. Unlock via the vault to view the archive.
        </p>
        <div className="mt-6 border-t border-invidious-border pt-4">
          <p className="text-xs text-gray-500">ERR: SYNDICATE_ACCESS_REQUIRED</p>
        </div>
      </div>
    </div>
  );
}
