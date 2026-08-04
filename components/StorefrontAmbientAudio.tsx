'use client';

import React, { useState, useEffect, useCallback } from 'react';

const YOUTUBE_VIDEO_ID = 's1Apr5OeyT4';
const START_SECONDS = 15;

export const StorefrontAmbientAudio: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('storefront-ambient-audio');
      if (stored === '1') setEnabled(true);
    } catch {}
  }, []);

  const enable = useCallback(() => {
    setEnabled(true);
    try {
      window.sessionStorage.setItem('storefront-ambient-audio', '1');
    } catch {}
  }, []);

  if (!enabled) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          type="button"
          onClick={enable}
          className="rounded-xl border border-invidious-border bg-[#0a0a0a]/85 px-3 py-2 text-[11px] tracking-[0.18em] uppercase text-gray-300 backdrop-blur hover:border-gray-500 hover:text-white"
        >
          Play ambient beat
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-3 rounded-xl border border-invidious-border bg-[#0a0a0a]/85 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] tracking-[0.18em] uppercase text-gray-400">Ambient</span>
        </div>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="rounded-lg border border-invidious-border px-2 py-1 text-[11px] tracking-widest uppercase text-gray-300 hover:border-gray-500 hover:text-white"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&start=${START_SECONDS}&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0${muted ? '&mute=1' : ''}`}
        allow="autoplay"
        title="storefront ambient audio"
        className="storefront-ambient-iframe"
      />
      <style jsx global>{`
        .storefront-ambient-iframe {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
          border: 0;
        }
      `}</style>
    </div>
  );
};

export default StorefrontAmbientAudio;
