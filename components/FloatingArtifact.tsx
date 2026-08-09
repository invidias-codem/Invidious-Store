'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface FloatingArtifactProps {
  glbSrc: string;
  usdzSrc?: string;
  images?: { url: string; altText?: string }[];
  posterSrc?: string;
  altText?: string;
  className?: string;
}

export default function FloatingArtifact({
  glbSrc,
  usdzSrc,
  images,
  posterSrc,
  altText = '3D Artifact',
  className = '',
}: FloatingArtifactProps) {
  const [isViewerDefined, setIsViewerDefined] = useState(false);
  const [meshError, setMeshError] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (typeof window === 'undefined') return;

    import('@google/model-viewer')
      .then(() => {
        if (!cancelled) setIsViewerDefined(true);
      })
      .catch(() => {
        if (!cancelled) console.warn('model-viewer load failed; 3D preview unavailable.');
      });

    const viewer = viewerRef.current;
    const handleError = () => setMeshError(true);
    if (viewer) {
      viewer.addEventListener('error', handleError);
    }

    return () => {
      cancelled = true;
      if (viewer) {
        viewer.removeEventListener('error', handleError);
      }
    };
  }, []);

  // Levitation + slow rotation via model-viewer camera/behavior
  useEffect(() => {
    if (!isViewerDefined || meshError || typeof window === 'undefined') return;
    const viewer = viewerRef.current as any;
    if (!viewer) return;

    let raf = 0;
    let t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - t0) / 1000;
      const floatY = Math.sin(elapsed * 0.8) * 0.08;
      const rotY = elapsed * 12;

      try {
        viewer.cameraOrbit = `0deg ${75 + rotY}deg ${2.6 + floatY}m`;
      } catch {
        // ignore transient camera update failures
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isViewerDefined, meshError]);

  const show3D = Boolean(glbSrc) && !meshError && isViewerDefined;
  const showFallback = !(Boolean(glbSrc) && !meshError && isViewerDefined);

  const fallbackSrc = Array.isArray(images) && images.length > 0 ? images[0].url : posterSrc;

  return (
    <div
      className={`relative w-full h-full min-h-[520px] overflow-hidden border border-zinc-800 bg-black ${className}`}
    >
      {/* Dark gothic background with subtle chrome/metallic wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 25%, rgba(120,120,124,0.10), transparent 45%), radial-gradient(circle at 75% 60%, rgba(90,90,94,0.08), transparent 50%), linear-gradient(120deg, rgba(30,30,30,0.35), rgba(8,8,8,0.15))',
        }}
      />

      {showFallback && fallbackSrc ? (
        <div className="absolute inset-0 z-10">
          <img
            src={fallbackSrc}
            alt={altText}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute bottom-3 left-3 bg-black/70 border border-zinc-800 px-2 py-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">
              Mesh Pending
            </span>
          </div>
        </div>
      ) : null}

      {showFallback && !fallbackSrc ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 space-y-2 border border-dashed border-zinc-700 m-4">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest">
            [ ERR_NO_MESH ]
          </span>
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Universal Web Render Pending
          </span>
          <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
            (iOS AR Quick Look Available)
          </span>
        </div>
      ) : null}

      {show3D ? (
        <model-viewer
          ref={viewerRef}
          src={glbSrc}
          ios-src={usdzSrc}
          alt={altText}
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          ar
          ar-modes="webxr scene-viewer quick-look"
          shadow-intensity="0.9"
          environment-image="neutral"
          exposure="1.1"
          style={{
            width: '100%',
            height: '100%',
            cursor: 'move',
            backgroundColor: 'transparent',
          }}
        >
          <div
            slot="poster"
            className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest bg-zinc-900 z-10"
          >
            [ Loading 3D Matrix ]
          </div>

          <button
            slot="ar-button"
            className="absolute bottom-4 right-4 bg-white text-black font-mono text-[10px] uppercase tracking-widest px-4 py-2 border border-gray-400 hover:bg-gray-300 transition-colors z-30"
          >
            View in Space
          </button>
        </model-viewer>
      ) : null}
    </div>
  );
}
