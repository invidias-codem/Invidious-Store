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
  const [debugOpen, setDebugOpen] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [playerState, setPlayerState] = useState<number | null>(null);
  const playerRef = React.useRef<any | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const enabledRef = React.useRef(enabled);
  const mutedRef = React.useRef(muted);
  const timeIntervalRef = React.useRef<number | null>(null);

  useEffect(() => {
    enabledRef.current = enabled;
    mutedRef.current = muted;
  }, [enabled, muted]);

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
            if (mutedRef.current) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
            event.target.loadVideoById({
              videoId: YOUTUBE_VIDEO_ID,
              startSeconds: START_SECONDS,
            });
            playerRef.current = event.target;

            if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
            timeIntervalRef.current = window.setInterval(() => {
              try {
                const t = event.target.getCurrentTime();
                setCurrentTime(typeof t === 'number' ? t : null);
              } catch {}
            }, 500);
          } catch (e) {
            console.error('[AMBIENT_AUDIO_READY_ERROR]', e);
            setLastError('ready:' + String(e));
          }
        },
        onStateChange: (event: any) => {
          try {
            setPlayerState(event?.data ?? null);
            if (event?.data === 0) {
              event.target.seekTo(START_SECONDS);
              event.target.playVideo();
            }
          } catch (e) {
            console.error('[AMBIENT_AUDIO_LOOP_ERROR]', e);
            setLastError('loop:' + String(e));
          }
        },
        onError: (event: any) => {
          console.error('[AMBIENT_AUDIO_ERROR] code=', event?.data);
          setLastError('yt:' + String(event?.data ?? 'unknown'));
        },
      },
    });

    return () => {
      if (player && typeof player.destroy === 'function') {
        try { player.destroy(); } catch {}
      }
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      playerRef.current = null;
      setCurrentTime(null);
      setPlayerState(null);
    };
  }, [enabled, playerReady]);

  const enable = useCallback(() => {
    setEnabled(true);
    setLastError(null);
    try {
      window.sessionStorage.setItem('storefront-ambient-audio', '1');
    } catch {}

    setTimeout(() => {
      try {
        const player = playerRef.current;
        if (!player || typeof player.playVideo !== 'function') return;

        if (mutedRef.current) {
          player.mute();
        } else {
          player.unMute();
        }
        player.loadVideoById({
          videoId: YOUTUBE_VIDEO_ID,
          startSeconds: START_SECONDS,
        });
      } catch (e) {
        console.error('[AMBIENT_AUDIO_ENABLE_ERROR]', e);
        setLastError('enable:' + String(e));
      }
    }, 0);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      mutedRef.current = next;
      try {
        const player = playerRef.current;
        if (!player) return next;

        if (next) {
          if (typeof player.mute === 'function') player.mute();
        } else {
          if (typeof player.unMute === 'function') player.unMute();
          if (typeof player.playVideo === 'function') player.playVideo();
        }
      } catch (e) {
        console.error('[AMBIENT_AUDIO_MUTE_ERROR]', e);
        setLastError('mute:' + String(e));
      }
      return next;
    });
  }, []);

  const stateLabel = playerState === null ? 'idle' : playerState === -1 ? 'unstarted' : playerState === 0 ? 'ended' : playerState === 1 ? 'playing' : playerState === 2 ? 'paused' : playerState === 3 ? 'buffering' : playerState === 5 ? 'cued' : 'state:' + playerState;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-3 rounded-xl border border-invidious-border bg-[#0a0a0a]/85 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] tracking-[0.18em] uppercase text-gray-400">Ambient</span>
        </div>
        <button
          type="button"
          onClick={toggleMute}
          className="rounded-lg border border-invidious-border px-2 py-1 text-[11px] tracking-widest uppercase text-gray-300 hover:border-gray-500 hover:text-white"
        >
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button
          type="button"
          onClick={() => setDebugOpen((v) => !v)}
          className="rounded-lg border border-invidious-border px-2 py-1 text-[11px] tracking-widest uppercase text-gray-300 hover:border-gray-500 hover:text-white"
        >
          {debugOpen ? 'Hide debug' : 'Debug'}
        </button>
      </div>
      {debugOpen && (
        <div className="mt-2 w-72 rounded-xl border border-invidious-border bg-[#0a0a0a]/90 p-3 text-[11px] text-gray-300 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-gray-400">Ambient debug</span>
            <span className="text-gray-500">YT {YOUTUBE_VIDEO_ID}</span>
          </div>
          <div className="mt-2 space-y-1">
            <div>ready: {playerReady ? 'yes' : 'no'}</div>
            <div>state: {stateLabel}</div>
            <div>time: {currentTime !== null ? currentTime.toFixed(1) + 's' : '—'}</div>
            <div>muted: {muted ? 'yes' : 'no'}</div>
            <div>start: {START_SECONDS}s</div>
            <div>error: {lastError || 'none'}</div>
          </div>
        </div>
      )}
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
