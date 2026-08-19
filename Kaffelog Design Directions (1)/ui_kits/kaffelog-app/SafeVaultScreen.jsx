import React from 'react';
import { Card } from '../../components/display/Badge.jsx';
import { StatusRow } from '../../components/display/Badge.jsx';
import { Button } from '../../components/actions/Button.jsx';

export function SafeVaultScreen() {
  return (
    <Card title="SafeVault" subtitle="5 documents tracked" actions={<Button size="sm" variant="outline">Add document</Button>}>
      <StatusRow label="Trade Licence" meta="Expires 10 Sep · 28 days remaining" status="success" />
      <StatusRow label="Ahmed — Food Handler Card" meta="Expires 27 Aug · 14 days remaining" status="warning" />
      <StatusRow label="Pest Control Contract" meta="Expires 16 Aug · 3 days remaining" status="error" />
      <StatusRow label="Halal Certificate" meta="Expires 2 Dec · 111 days remaining" status="success" />
      <StatusRow label="Tenancy Contract" meta="Expires 4 Jan · 144 days remaining" status="success" />
    </Card>
  );
}
