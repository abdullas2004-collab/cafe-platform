import React from 'react';

export function Tabs({ items = [], active, onChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1.5px solid var(--brown-900)', gap: 0 }}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange && onChange(item.value)}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '12px 18px', background: 'transparent', border: 'none', cursor: 'pointer',
            color: active === item.value ? 'var(--brown-900)' : 'var(--color-text-secondary)',
            borderBottom: active === item.value ? '2px solid var(--rust-600)' : '2px solid transparent',
            marginBottom: -1.5,
          }}
        >{item.label}</button>
      ))}
    </div>
  );
}
