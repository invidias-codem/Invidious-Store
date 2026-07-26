import Link from 'next/link';

export function InvidiousLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`font-display text-white tracking-widest uppercase ${className}`}>
      <span className="text-sm sm:text-base md:text-lg">Invidious</span>
    </Link>
  );
}
