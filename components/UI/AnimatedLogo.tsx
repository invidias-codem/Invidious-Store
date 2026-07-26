'use client';

import Image from 'next/image';

export function AnimatedLogo({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: '1400px' }}
    >
      <div
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
        style={{
          transformStyle: 'preserve-3d',
          animation: 'invBoxSpin 8s linear infinite',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black" style={{ transform: 'translateZ(24px)' }}>
          <Image src="/invidious-logo.jpg" alt="Invidious Crest" width={320} height={320} className="h-full w-full object-contain select-none" priority />
        </div>

        <div className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black" style={{ transform: 'translateZ(-24px) rotateY(180deg)' }}>
          <Image src="/invidious-logo.jpg" alt="Invidious Crest Back" width={320} height={320} className="h-full w-full object-contain select-none" style={{ transform: 'scaleX(-1)' }} priority />
        </div>

        <div className="absolute inset-y-0 left-0 w-[48px] bg-zinc-800 border-r border-zinc-700" style={{ transform: 'rotateY(-90deg) translateZ(0px)' }} />
        <div className="absolute inset-y-0 right-0 w-[48px] bg-zinc-800 border-l border-zinc-700" style={{ transform: 'rotateY(90deg) translateZ(0px)' }} />
      </div>

      <style jsx global>{`
        @keyframes invBoxSpin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}
