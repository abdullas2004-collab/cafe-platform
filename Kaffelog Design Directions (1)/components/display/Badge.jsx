import React from 'react';

export function Badge({ tone = 'neutral', children }) {
  const tones = {
    success: { background: 'var(--color-success-bg)', color: 'var(--color-success-text)', border: 'var(--color-success-border)' },
    warning: { background: 'var(--color-warning-bg)', color: 'var(--color-warning-text)', border: 'var(--color-warning-border)' },
    error: { background: 'var(--color-error-bg)', color: 'var(--color-error-text)', border: 'var(--color-error-border)' },
    neutral: { background: 'var(--color-neutral-bg)', color: 'var(--color-neutral-text)', border: 'var(--color-neutral-border)' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px',
      fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
      background: t.background, color: t.color, border: `1px solid ${t.border}`,
    }}>{children}</span>
  );
}

export function Card({ title, subtitle, actions, children, inverse = false }) {
  return (
    <div style={{
      background: inverse ? 'var(--brown-900)' : 'var(--color-bg-card)',
      color: inverse ? 'var(--paper-100)' : 'var(--color-text-primary)',
      border: inverse ? 'none' : '1.5px solid var(--brown-900)',
      padding: 24,
    }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <div>
            {title && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 18 }}>{title}</div>}
            {subtitle && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: inverse ? 'var(--stone-400)' : 'var(--color-text-secondary)', marginTop: 4 }}>{subtitle}</div>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export function MetricTile({ label, value, unit, delta, tone = 'neutral' }) {
  const deltaColor = tone === 'success' ? 'var(--sage-600)' : tone === 'error' ? 'var(--red-600)' : 'var(--color-text-secondary)';
  return (
    <div style={{ borderTop: '2px solid var(--brown-900)', paddingTop: 12 }}>
      <div className="text-label">{label}</div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 44, lineHeight: 1.05, marginTop: 4 }}>
        {value}{unit && <span style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}> {unit}</span>}
      </div>
      {delta && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: deltaColor, marginTop: 4 }}>{delta}</div>}
    </div>
  );
}

export function StatusRow({ label, meta, status = 'success' }) {
  const colors = {
    success: 'var(--sage-600)',
    warning: 'var(--rust-400)',
    error: 'var(--red-600)',
  };
  const labels = { success: 'SAFE', warning: 'DUE SOON', error: 'NEEDS ATTENTION' };
  return (
    <div style={{ display: 'flex', border: '1.5px solid var(--brown-900)', marginTop: -1.5 }}>
      <div style={{ width: 9, background: colors[status] }} />
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14 }}>{label}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-text-secondary)', marginTop: 3 }}>{meta}</div>
        </div>
        <Badge tone={status}>{labels[status]}</Badge>
      </div>
    </div>
  );
}
