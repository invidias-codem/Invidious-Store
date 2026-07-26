import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GothicButtonProps {
  label: string;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function GothicButton({
  label,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
}: GothicButtonProps) {
  const base = 'font-display tracking-widest uppercase border transition-all inline-flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-white';
  const variants = {
    primary: 'border-white bg-white text-black hover:bg-black hover:text-white',
    outline: 'border-white bg-transparent text-white hover:bg-white hover:text-black',
  };
  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-7 py-3 text-sm',
  };

  const className = cn(base, variants[variant], sizes[size]);

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {label}
    </button>
  );
}
