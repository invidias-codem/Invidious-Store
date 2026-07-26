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
  const base = 'font-display tracking-wide border transition-colors inline-flex items-center justify-center';
  const variants = {
    primary: 'border-invidious-border bg-invidious-bg text-white hover:border-white',
    outline: 'border-invidious-border bg-transparent text-white hover:border-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-7 py-3 text-base',
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
