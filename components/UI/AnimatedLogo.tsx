'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type NavItem = { label: string; route: string };

const CHAPTERS: NavItem[] = [
  { label: 'Manifesto', route: '/manifesto' },
  { label: 'Archive', route: '/products' },
  { label: 'Forge', route: '/forge' },
];

export function AnimatedLogo({ className = '' }: { className?: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Rotation & Drag State
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Animation State
  const [autoSpin, setAutoSpin] = useState(true);
  const [opened, setOpened] = useState(false);

  // Passive auto-spin
  useEffect(() => {
    if (!autoSpin || opened || isDragging) return;
    
    let id: number;
    const tick = () => {
      setRotY((y) => (y + 0.4) % 360);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    
    return () => cancelAnimationFrame(id);
  }, [autoSpin, opened, isDragging]);

  // Touch & Mouse Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (opened) return; // Disable drag when reading
    setIsDragging(true);
    setAutoSpin(false);
    setStartPos({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || opened) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    // Adjust sensitivity multiplier here (currently 0.5)
    setRotY((prev) => prev + deltaX * 0.5);
    setRotX((prev) => Math.max(-60, Math.min(60, prev - deltaY * 0.5))); // Clamp X rotation to prevent flipping
    
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  // Open the book and snap it to a readable angle
  const handleDoubleClick = () => {
    if (!opened) {
      setOpened(true);
      setRotX(15); // Slight tilt for 3D depth
      setRotY(0);  // Face the user directly
    } else {
      setOpened(false);
      setAutoSpin(true); // Resume spin when closed
    }
  };

  const navigate = (route: string) => {
    // Optional: Close the book before navigating
    // setOpened(false); 
    setTimeout(() => router.push(route), 300);
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ perspective: '1600px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* === BACK COVER & INSIDE PAGES (The Nav Menu) === */}
        <div 
          className="absolute inset-0 border border-zinc-700 bg-zinc-950 flex flex-col justify-center items-center gap-6 shadow-2xl" 
          style={{ transform: 'translateZ(-12px)' }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-600 to-transparent"></div>
          
          <h2 className="text-white uppercase tracking-[0.3em] text-xs font-bold font-mono z-10 mb-2">
            System Index
          </h2>
          
          {CHAPTERS.map((item) => (
            <button
              key={item.route}
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.route);
              }}
              onDoubleClick={(e) => e.stopPropagation()} // Prevent closing book when double clicking button
              className="z-10 w-48 border border-zinc-800 bg-black px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 hover:border-gray-500 hover:text-white transition-all hover:scale-105"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* === THE SPINE === */}
        <div 
          className="absolute inset-y-0 left-0 w-[24px] bg-zinc-900 border-l border-zinc-700" 
          style={{ transform: 'rotateY(-90deg) translateZ(12px) translateX(12px)' }} 
        />
        <div 
          className="absolute inset-y-0 right-0 w-[24px] bg-zinc-900 border-r border-zinc-700" 
          style={{ transform: 'rotateY(90deg) translateZ(12px) translateX(-12px)' }} 
        />

        {/* === FRONT COVER (Hinged left) === */}
        <div
          className="absolute inset-0 origin-left transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transformStyle: 'preserve-3d',
            transform: opened ? 'rotateY(-165deg) translateZ(12px)' : 'rotateY(0deg) translateZ(12px)',
          }}
        >
          {/* Front of the Cover (The Crest) */}
          <div 
            className="absolute inset-0 flex items-center justify-center border border-zinc-700 bg-black"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <Image 
              src="/invidious-logo.jpg" 
              alt="Invidious Crest" 
              width={320} 
              height={320} 
              className="h-full w-full object-contain pointer-events-none" 
              priority 
            />
          </div>

          {/* Back of the Front Cover (Inside left page) */}
          <div 
            className="absolute inset-0 border border-zinc-700 bg-zinc-900 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest leading-loose text-center">
                Artifact // 001<br/><br/>
                Ninety-seven percent heritage structural DNA.<br/>
                Three percent calculated disruption.
             </p>
          </div>
        </div>
      </div>

      {/* User Instruction Label */}
      <div className="absolute -bottom-12 inset-x-0 flex justify-center">
        <p className={`text-[10px] font-mono uppercase tracking-widest text-zinc-500 transition-opacity duration-500 ${opened ? 'opacity-0' : 'opacity-100'}`}>
          [ Drag to inspect // Dbl-click to open ]
        </p>
      </div>
    </div>
  );
}