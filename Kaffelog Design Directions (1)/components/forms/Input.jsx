import React from 'react';

export function Input({ label, placeholder, value, onChange, error, helperText, prefix, suffix, disabled }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && <label className="text-label">{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1.5px solid ${error ? 'var(--color-border-error)' : 'var(--brown-900)'}`,
        background: disabled ? 'var(--color-bg-sunken)' : 'var(--color-bg-card)',
        padding: '10px 14px', opacity: disabled ? 0.6 : 1,
      }}>
        {prefix && <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{prefix}</span>}
        <input
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}
        />
        {suffix && <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{suffix}</span>}
      </div>
      {(helperText || error) && (
        <span style={{ fontSize: 12, color: error ? 'var(--color-error-text)' : 'var(--color-text-secondary)' }}>{error || helperText}</span>
      )}
    </div>
  );
}

export function Select({ label, options = [], value, onChange, placeholder = 'Select…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {label && <label className="text-label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        style={{ border: '1.5px solid var(--brown-900)', background: 'var(--color-bg-card)', padding: '10px 14px', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Checkbox({ label, checked, onChange, indeterminate }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', cursor: 'pointer' }}>
      <span style={{
        width: 22, height: 22, border: '1.5px solid var(--brown-900)', background: checked || indeterminate ? 'var(--sage-600)' : 'var(--color-bg-card)',
        color: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0,
      }}>
        {checked ? '✓' : indeterminate ? '–' : ''}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
      {label}
    </label>
  );
}

export function Switch({ label, checked, onChange, disabled }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
      <span style={{
        width: 40, height: 22, borderRadius: 'var(--radius-full)', border: '1.5px solid var(--brown-900)',
        background: checked ? 'var(--brown-900)' : 'var(--color-bg-card)', position: 'relative', transition: 'background var(--duration-base) var(--ease-out)',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: checked ? 20 : 2, width: 14, height: 14, borderRadius: '50%',
          background: checked ? 'var(--paper-100)' : 'var(--brown-900)', transition: 'left var(--duration-base) var(--ease-out)',
        }} />
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ display: 'none' }} />
      {label}
    </label>
  );
}
