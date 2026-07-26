import Link from 'next/link';

export function SilverDaggerLogo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={className}>
      <svg
        viewBox="0 0 180 28"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-auto"
        aria-label="Silver Dagger Logo"
        role="img"
      >
        <text
          x="0"
          y="22"
          fontFamily="Playfair Display, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="6"
          fill="currentColor"
        >
          SILVER DAGGER
        </text>
      </svg>
    </Link>
  );
}
