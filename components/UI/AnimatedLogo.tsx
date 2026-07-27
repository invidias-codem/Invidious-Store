'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GothicButton } from '@/components/UI';

const CHAPTERS = [
  { label: 'About', href: '/about' },
  { label: 'Manifesto', href: '/manifesto' },
  { label: 'Archive', href: '/products' },
  { label: 'Shop', href: '/products' },
  { label: 'Forgery', href: '/forge' },
  { label: 'Lookbook', href: '/' },
  { label: 'Retro Cart', href: '/products' },
];

export function AnimatedLogo({ className = '' }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    let raf = 0;
    let angle = 0;

    const tick = () => {
      angle += 0.35;
      if (angle > 360) angle -= 360;
      const y = Math.sin((angle * Math.PI) / 180) * 8;
      const x = Math.cos((angle * Math.PI) / 180) * 3;
      el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`relative select-none ${className}`} style={{ perspective: '1200px' }}>
      <div
        ref={boxRef}
        className="relative mx-auto w-[260px] sm:w-[300px]"
        style={{ transformStyle: 'preserve-3d' }}
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
              variant={item.href === '/' || item.href === '/about' ? 'primary' : 'outline'}
              size="sm"
            />
          </Link>
        ))}
      </nav>
    </div>
  );
}
