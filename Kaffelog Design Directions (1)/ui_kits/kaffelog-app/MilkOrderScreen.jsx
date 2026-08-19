import React, { useState } from 'react';
import { Button } from '../../components/actions/Button.jsx';

export function MilkOrderScreen() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
      <div style={{ background: 'var(--paper-050)', padding: '22px 20px', fontFamily: 'var(--font-mono)', width: 300, boxShadow: 'var(--shadow-md)' }}>
        <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.2em', fontWeight: 600 }}>TOMORROW'S MILK ORDER</div>
        <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--color-text-secondary)', marginTop: 5 }}>WED 14 AUG · MIRDIF · 06:00 DELIVERY</div>
        <div style={{ borderTop: '1px dashed var(--brown-900)', margin: '16px 0' }} />
        <div style={{ display: 'grid', gap: 11, fontSize: 13.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>WHOLE MILK</span><span>38 L</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>OAT</span><span>12 L</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ALMOND</span><span>4 L</span></div>
        </div>
        <div style={{ borderTop: '1px dashed var(--brown-900)', margin: '16px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--color-text-secondary)' }}>EST. SAVING</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--color-brand)' }}>AED 72</span>
        </div>
        <div style={{ marginTop: 18 }}>
          <Button variant={confirmed ? 'secondary' : 'primary'} size="md" onClick={() => setConfirmed(true)}>
            {confirmed ? 'Order confirmed ✓' : 'Confirm order'}
          </Button>
        </div>
      </div>
      <div style={{ maxWidth: 340, fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
        Calculated from 28 days of counts logged at close each night. Confirming sends the order straight to your supplier via WhatsApp.
      </div>
    </div>
  );
}
