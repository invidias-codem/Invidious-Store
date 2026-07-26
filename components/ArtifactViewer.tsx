'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

// 1. Declare the custom web component for strict TypeScript compliance
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ArtifactViewerProps {
  glbSrc: string | null;
  usdzSrc: string;
  altText: string;
  fallbackImage?: { url: string; altText?: string };
}

export function ArtifactViewer({ glbSrc, usdzSrc, altText, fallbackImage }: ArtifactViewerProps) {
  const [meshError, setMeshError] = useState(false);
  
  // 2. Track module load to prevent rendering unknown elements
  const [isViewerDefined, setIsViewerDefined] = useState(false);
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

  const show3D = Boolean(glbSrc) && !meshError && isViewerDefined;
  const showFallback = !Boolean(glbSrc) || meshError || !isViewerDefined;

  return (
    <div className="relative w-full h-full min-h-[500px] bg-zinc-900 border border-zinc-800">
      
      {/* 2D Fallback Render */}
      {showFallback && fallbackImage?.url ? (
        <div className="absolute inset-0 z-10">
          <Image 
            src={fallbackImage.url} 
            alt={fallbackImage.altText || altText} 
            fill 
            className="object-cover" 
            priority // Optimization: prioritize LCP for above-the-fold artifacts
          />
          <div className="absolute bottom-3 left-3 bg-black/70 border border-zinc-800 px-2 py-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-300">Mesh Pending</span>
          </div>
        </div>
      ) : null}

      {/* Total Missing Asset State */}
      {showFallback && !fallbackImage?.url ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 space-y-2 border border-dashed border-zinc-700 m-4">
          <span className="text-red-500 font-mono text-xs uppercase tracking-widest">[ ERR_NO_MESH ]</span>
          <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Universal Web Render Pending</span>
          <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">(iOS AR Quick Look Available)</span>
        </div>
      ) : null}

      {/* Volumetric Mesh Render */}
      {show3D ? (
        <model-viewer
          ref={viewerRef}
          src={glbSrc as string}
          ios-src={usdzSrc}
          alt={altText}
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          shadow-intensity="1"
          environment-image="neutral"
          style={{ width: '100%', height: '100%', cursor: 'move' }}
        >
          {/* 3. 'poster' slot automatically dismisses when the 3D model is fully parsed and ready */}
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