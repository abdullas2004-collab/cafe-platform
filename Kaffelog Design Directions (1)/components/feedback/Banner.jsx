import React from 'react';

export function Banner({ tone = 'neutral', title, description, action }) {
  const tones = {
    success: { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)' },
    warning: { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)' },
    error: { bg: 'var(--color-error-bg)', border: 'var(--color-error-border)' },
    neutral: { bg: 'var(--color-bg-surface)', border: 'var(--brown-900)' },
  };
  const t = tones[tone];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: t.bg, borderLeft: `4px solid ${t.border}`, padding: '14px 18px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14 }}>{title}</div>
        {description && <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{description}</div>}
      </div>
      {action}
    </div>
  );
}

export function Toast({ tone = 'neutral', message }) {
  const colors = { success: 'var(--sage-600)', warning: 'var(--rust-400)', error: 'var(--red-600)', neutral: 'var(--brown-900)' };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, background: 'var(--brown-900)', color: 'var(--paper-100)',
      padding: '12px 16px', boxShadow: 'var(--shadow-lg)', fontSize: 13.5, fontFamily: 'var(--font-sans)',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[tone] }} />
      {message}
    </div>
  );
}
