'use client';

import React, { useState, useEffect, useCallback } from 'react';

const YOUTUBE_VIDEO_ID = 's1Apr5OeyT4';
const START_SECONDS = 15;

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const StorefrontAmbientAudio: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = React.useRef<any | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.sessionStorage.getItem('storefront-ambient-audio');
      if (stored === '1') setEnabled(true);
    } catch {}

    const existing = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      existing?.();
      setPlayerReady(true);
    };

    if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    } else if (window.YT) {
      setPlayerReady(true);
    }

    return () => {
      window.onYouTubeIframeAPIReady = existing || undefined;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !playerReady || !containerRef.current) return;

    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
    }

    const player = new window.YT.Player(containerRef.current, {
      height: '1',
      width: '1',
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        start: START_SECONDS,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
        mute: muted ? 1 : 0,
        autoplay: 1,
      },
      events: {
        onReady: (event: any) => {
          try {
            if (muted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
            event.target.loadVideoById({
              videoId: YOUTUBE_VIDEO_ID,
              startSeconds: START_SECONDS,
            });
            playerRef.current = event.target;
          } catch (e) {
            console.error('[AMBIENT_AUDIO_READY_ERROR]', e);
          }
        },
        onError: (event: any) => {
          console.error('[AMBIENT_AUDIO_ERROR]', event?.data);
        },
      },
    });

    return () => {
      if (player && typeof player.destroy === 'function') {
        try { player.destroy(); } catch {}
      }
      playerRef.current = null;
    };
  }, [enabled, playerReady, muted]);

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
      <div
        ref={containerRef}
        className="storefront-ambient-container"
        aria-hidden
      />
      <style jsx global>{`
        .storefront-ambient-container {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default StorefrontAmbientAudio;
