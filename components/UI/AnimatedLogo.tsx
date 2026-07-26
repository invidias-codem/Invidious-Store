'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GothicButton } from '@/components/UI';

const CHAPTERS = [
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Archive', href: '/products' },
  { label: 'Shop', href: '/products' },
  { label: 'Forgery', href: '/forge' },
  { label: 'Lookbook', href: '/' },
  { label: 'Retro Cart', href: '/products' },
];

export function AnimatedLogo({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!hovering) {
      setTilt({ x: 0, y: 0 });
      return;
    }
    const tick = () => {
      if (!containerRef.current) return;
      setTilt((prev) => ({
        x: prev.x + (0 - prev.x) * 0.08,
        y: prev.y + (0 - prev.y) * 0.08,
      }));
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [hovering]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: ny * -6, y: nx * 6 });
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ perspective: '1200px' }}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <div
        className="relative mx-auto w-[260px] sm:w-[300px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hovering ? 'none' : 'transform 400ms ease-out',
        }}
      >
        <Image
          src="/invidious-logo.jpg"
          alt="Invidious Crest"
          width={320}
          height={320}
          priority
          className="h-auto w-full drop-shadow-2xl"
        />
      </div>

      <nav className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
        {CHAPTERS.map((item) => (
          <Link key={item.href} href={item.href}>
            <GothicButton
              label={item.label}
              href={item.href}
              variant={item.href === '/' ? 'primary' : 'outline'}
              size="sm"
            />
          </Link>
        ))}
      </nav>

      <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-gray-600 text-center">
        Move to inspect
      </p>
    </div>
  );
}
