import Link from 'next/link';
import { cn } from '@/lib/utils';

export type GothicColor = {
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  hoverText: string;
};

export const GOTHIC_COLORS: Record<string, GothicColor> = {
  blood: { bg: '#3b0000', text: '#ffffff', border: '#5c0000', hoverBg: '#1a0000', hoverText: '#ffdddd' },
  bone: { bg: '#ffffff', text: '#050505', border: '#ffffff', hoverBg: '#0a0a0a', hoverText: '#ffffff' },
  iron: { bg: '#141414', text: '#e5e5e5', border: '#333333', hoverBg: '#0f0f0f', hoverText: '#ffffff' },
  oxide: { bg: '#2b1d12', text: '#f3e2c4', border: '#4a3220', hoverBg: '#22180e', hoverText: '#fff3e0' },
  coal: { bg: '#0c0c0c', text: '#cfcfcf', border: '#2a2a2a', hoverBg: '#050505', hoverText: '#ffffff' },
};

interface GothicButtonProps {
  label: string;
  color?: keyof typeof GOTHIC_COLORS;
  variant?: 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function GothicButton({
  label,
  color = 'iron',
  variant = 'filled',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled,
}: GothicButtonProps) {
  const palette = GOTHIC_COLORS[color] || GOTHIC_COLORS.iron;

  const base =
    'font-gothic-ui tracking-[0.18em] uppercase border inline-flex items-center justify-center focus:outline-none focus:ring-1 focus:ring-white transition-colors select-none';
  const sizes = { sm: 'px-4 py-2 text-[12px]', md: 'px-5 py-2.5 text-[13px]', lg: 'px-7 py-3 text-sm' };

  const filledStyle: React.CSSProperties = {
    backgroundColor: palette.bg,
    color: palette.text,
    borderColor: palette.border,
  };
  const ghostStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    color: palette.text,
    borderColor: palette.border,
  };

  const hoverFill: React.CSSProperties = {
    backgroundColor: palette.hoverBg,
    color: palette.hoverText,
  };
  const hoverGhost: React.CSSProperties = {
    backgroundColor: palette.border,
    color: palette.text,
  };

  const style =
    variant === 'filled' ? (disabled ? filledStyle : { ...filledStyle, ':hover': hoverFill } as any) : (disabled ? ghostStyle : { ...ghostStyle, ':hover': hoverGhost } as any);

  const className = cn(base, sizes[size], disabled ? 'opacity-40 cursor-not-allowed' : '');

  const content = <span>{label}</span>;

  if (href) {
    return (
      <Link href={href} className={className} style={style as any}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className} style={style as any}>
      {content}
    </button>
  );
}
