'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GothicButton } from '@/components/UI';

type NavItem = { label: string; route: string };

const CHAPTERS: NavItem[] = [
  { label: 'Manifesto', route: '/manifesto' },
  { label: 'Archive', route: '/products' },
  { label: 'Shop', route: '/products' },
  { label: 'Forgery', route: '/forge' },
  { label: 'Lookbook', route: '/' },
  { label: 'Retro Cart', route: '/products' },
];

export function AnimatedLogo({ className = '' }: { className?: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [autoSpin, setAutoSpin] = useState(true);
  const [opened, setOpened] = useState(false);
  const [selectedPage, setSelectedPage] = useState<NavItem | null>(null);

  // Auto spin
  useEffect(() => {
    if (!autoSpin || opened) return;
    const id = requestAnimationFrame(function tick() {
      setRotY((y) => (y + 0.6) % 360);
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [autoSpin, opened]);

  const onPointerDown = (e: React.PointerEvent) => {
    setAutoSpin(false);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;
    setRotY((prev) => prev + nx * 2.5);
    setRotX((prev) => prev - ny * 2.5);
  };

  const handleDoubleClick = () => {
    if (!opened) {
      setOpened(true);
    }
  };

  const navigate = (item: NavItem) => {
    setSelectedPage(item);
    setTimeout(() => router.push(item.route), 600);
  };

  const openSpread = opened;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ perspective: '1400px' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
        style={{ transformStyle: 'preserve-3d', animation: opened ? 'none' : 'none' }}
      >
        {!openSpread ? (
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: autoSpin ? 'none' : 'transform 60ms linear',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black" style={{ transform: 'translateZ(24px)' }}>
              <Image src="/invidious-logo.jpg" alt="Invidious Crest" width={320} height={320} className="h-full w-full object-contain" priority />
            </div>
            <div className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black" style={{ transform: 'translateZ(-24px) rotateY(180deg)' }}>
              <Image src="/invidious-logo.jpg" alt="Invidious Crest Back" width={320} height={320} className="h-full w-full object-contain" style={{ transform: 'scaleX(-1)' }} priority />
            </div>
            <div className="absolute inset-y-0 left-0 w-[48px] bg-zinc-800 border-r border-zinc-700" style={{ transform: 'rotateY(-90deg) translateZ(0px)' }} />
            <div className="absolute inset-y-0 right-0 w-[48px] bg-zinc-800 border-l border-zinc-700" style={{ transform: 'rotateY(90deg) translateZ(0px)' }} />
          </div>
        ) : (
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            <div
              className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black"
              style={{ transform: 'translateZ(24px)' }}
            >
              <Image src="/invidious-logo.jpg" alt="Invidious Crest" width={320} height={320} className="h-full w-full object-contain" priority />
            </div>

            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between gap-6 px-4 sm:px-8" style={{ transform: 'translateZ(0px) rotateY(180deg)' }}>
              {CHAPTERS.map((item) => (
                <button
                  key={item.route}
                  onClick={() => navigate(item)}
                  onDoubleClick={(e) => e.stopPropagation()}
                  className="border border-invidious-border bg-invidious-bg px-3 py-2 text-[10px] uppercase tracking-widest hover:border-white hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes invOpen {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08) rotateX(0deg) rotateY(0deg); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-inv-open {
            animation: invOpen 0.6s ease-out forwards;
          }
        `}</style>
      </div>

      <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-gray-600 text-center">Drag to inspect / dbl-click to open</p>
    </div>
  );
}
