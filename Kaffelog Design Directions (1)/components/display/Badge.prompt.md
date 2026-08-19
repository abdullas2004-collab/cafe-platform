Badge (status pill), Card (ruled container), MetricTile (hairline-rule stat figure — borrowed from the Editorial direction), StatusRow (SafeVault / document list row with colored left border).

```jsx
<MetricTile label="Saved this week" value="418" unit="AED" delta="+14% WoW" tone="success" />
<StatusRow label="Pest Control Contract" meta="Expires 16 Aug · 3 days" status="error" />
<Card title="Morning checks" subtitle="3 / 4 done"><Checklist /></Card>
```

`StatusRow`'s left border color + `Badge` label together carry status — never color alone.
