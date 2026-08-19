import React from 'react';
import { MetricTile } from '../../components/display/Badge.jsx';
import { StatusRow } from '../../components/display/Badge.jsx';
import { Card } from '../../components/display/Badge.jsx';
import { Badge } from '../../components/display/Badge.jsx';

export function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 30, letterSpacing: 'var(--tracking-tight)' }}>GOOD MORNING</div>
          <div className="text-label" style={{ marginTop: 4 }}>MIRDIF BRANCH · TUE 13 AUG · 06:48</div>
        </div>
        <Badge tone="error">2 need attention</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        <MetricTile label="Tomorrow's milk" value="54" unit="L" />
        <MetricTile label="Saved this week" value="418" unit="AED" delta="+14% WoW" tone="success" />
        <MetricTile label="Inspection ready" value="96" unit="%" />
        <MetricTile label="Milk waste" value="↓18%" delta="2.1 L this week" tone="success" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card title="Documents" subtitle="2 need attention">
          <StatusRow label="Trade Licence" meta="28 days remaining" status="success" />
          <StatusRow label="Ahmed — Food Handler Card" meta="14 days remaining" status="warning" />
          <StatusRow label="Pest Control Contract" meta="3 days remaining" status="error" />
        </Card>
        <Card title="Morning checks" subtitle="3 / 4 done">
          <StatusRow label="Fridge 1 — display chiller" meta="3.4°C · logged" status="success" />
          <StatusRow label="Fridge 2 — milk store" meta="4.1°C · logged" status="success" />
          <StatusRow label="Receiving — dairy delivery" meta="due 07:30" status="warning" />
        </Card>
      </div>
    </div>
  );
}
