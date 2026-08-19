import React from 'react';

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconOnly = false,
  children,
  onClick,
}) {
  const sizes = {
    sm: { padding: '7px 12px', fontSize: 'var(--text-sm)' },
    md: { padding: '11px 20px', fontSize: 'var(--text-base)' },
    lg: { padding: '14px 26px', fontSize: 'var(--text-md)' },
  };
  const variants = {
    primary: { background: 'var(--brown-900)', color: 'var(--paper-100)', border: '1.5px solid var(--brown-900)' },
    secondary: { background: 'var(--color-bg-card)', color: 'var(--brown-900)', border: '1.5px solid var(--brown-900)' },
    outline: { background: 'transparent', color: 'var(--brown-900)', border: '1.5px solid var(--color-border-default)' },
    ghost: { background: 'transparent', color: 'var(--brown-900)', border: '1.5px solid transparent' },
    destructive: { background: 'var(--red-600)', color: 'var(--paper-100)', border: '1.5px solid var(--red-600)' },
    link: { background: 'transparent', color: 'var(--color-text-link)', border: 'none', padding: 0 },
  };
  const style = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '0.01em',
    borderRadius: variant === 'link' ? 0 : 'var(--radius-full)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)',
    ...sizes[size],
    ...variants[variant],
    ...(iconOnly ? { padding: sizes[size].padding.split(' ')[0], width: size === 'sm' ? 30 : size === 'lg' ? 44 : 38, height: size === 'sm' ? 30 : size === 'lg' ? 44 : 38, borderRadius: 'var(--radius-md)' } : {}),
  };
  return (
    <button style={style} disabled={disabled || loading} onClick={onClick}>
      {loading ? '···' : children}
    </button>
  );
}
