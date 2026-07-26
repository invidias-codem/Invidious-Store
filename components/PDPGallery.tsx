import { useState } from 'react';
import Image from 'next/image';

interface ImageItem {
  url: string;
  altText?: string;
}

interface PDPGalleryProps {
  images: ImageItem[];
  title: string;
}

export default function PDPGallery({ images, title }: PDPGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    { url: '/assets/placeholder-1.jpg', altText: `${title} Angle 1` },
    { url: '/assets/placeholder-2.jpg', altText: `${title} Angle 2` },
    { url: '/assets/placeholder-3.jpg', altText: `${title} Detail Shot` },
  ];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar scroll-smooth">
        {displayImages.map((img, idx) => {
          const isActive = idx === selectedIndex;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              type="button"
              className={`relative flex-shrink-0 w-16 h-20 bg-zinc-900 border transition-all ${
                isActive ? 'border-gray-200 opacity-100 scale-105' : 'border-zinc-800 opacity-40 hover:opacity-80'
              }`}
            >
              {isActive && (
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white z-10" />
              )}
              <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-zinc-600 uppercase">
                0{idx + 1}
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden group">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 pointer-events-none z-10">
          <div className="border-r border-b border-gray-400" />
          <div className="border-r border-b border-gray-400" />
          <div className="border-b border-gray-400" />
          <div className="border-r border-b border-gray-400" />
          <div className="border-r border-b border-gray-400" />
          <div className="border-b border-gray-400" />
        </div>

        <div className="absolute top-3 right-3 z-10 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
          FIG_0{selectedIndex + 1} // {displayImages.length}
        </div>

        <div className="w-full h-full flex items-center justify-center relative">
          <span className="text-zinc-700 text-sm tracking-widest uppercase font-mono">
            {displayImages[selectedIndex]?.altText || 'Visual Asset'}
          </span>
        </div>
      </div>
    </div>
  );
}
