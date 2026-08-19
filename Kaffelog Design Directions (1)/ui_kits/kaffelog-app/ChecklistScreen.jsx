import React, { useState } from 'react';
import { Checkbox } from '../../components/forms/Input.jsx';
import { Button } from '../../components/actions/Button.jsx';

export function ChecklistScreen() {
  const [checks, setChecks] = useState([true, true, true, false]);
  const toggle = (i) => setChecks(checks.map((c, idx) => (idx === i ? !c : c)));
  const items = [
    { label: 'Fridge 1 — display chiller', meta: '3.2°C' },
    { label: 'Fridge 2 — milk store', meta: '4.0°C' },
    { label: 'Counter & grinder clean-down', meta: '06:15' },
    { label: 'Receiving check — dairy delivery', meta: 'due 07:30' },
  ];
  const done = checks.filter(Boolean).length;
  return (
    <div style={{ background: 'var(--paper-050)', border: '1.5px solid var(--brown-900)', padding: '26px 28px', maxWidth: 460 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22 }}>Opening shift</div>
        <div className="text-label">{done} OF {items.length} DONE</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 18 }}>
        {items.map((item, i) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < items.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}>
            <Checkbox label={item.label} checked={checks[i]} onChange={() => toggle(i)} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-secondary)' }}>{item.meta}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, borderTop: '1px solid var(--color-border-default)', paddingTop: 16 }}>
        <span style={{ fontSize: 13.5, color: 'var(--color-text-secondary)' }}>Tick the list. Kaffelog handles the paperwork.</span>
        <Button size="sm" variant="secondary">Export PDF</Button>
      </div>
    </div>
  );
}
