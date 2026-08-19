Primary action button for Kaffelog — pill-shaped, always paired with an IBM Plex Sans 600 label.

```jsx
<Button variant="primary" size="md" onClick={confirmOrder}>Confirm order</Button>
<Button variant="outline" size="sm">Export PDF</Button>
<Button variant="destructive">Delete account</Button>
```

Variants: `primary` (soot fill, for the one main action per screen), `secondary` (paper fill + soot border), `outline` (transparent + subtle border), `ghost` (no border, for toolbar actions), `destructive` (red, confirm-delete flows), `link` (inline text action, no pill). Never use more than one `primary` button per view.
