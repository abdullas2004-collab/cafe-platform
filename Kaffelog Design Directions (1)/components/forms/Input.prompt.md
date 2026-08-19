Text input, select, checkbox and switch — the form primitives, all sharp-edged with a 1.5px soot border matching the receipt/label motif.

```jsx
<Input label="Grams per litre" suffix="g/L" value={dose} onChange={setDose} />
<Select label="Milk type" options={[{value:'whole', label:'Whole milk'}]} />
<Checkbox label="Fridge 1 — display chiller" checked={true} />
<Switch label="Send WhatsApp report" checked={true} />
```

Checkbox uses sage fill + check glyph (matches the "Tick the list" checklist pattern). Never round these below `--radius-none`/`sm` — the hard edge is intentional.
