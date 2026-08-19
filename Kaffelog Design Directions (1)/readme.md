# Kaffelog Design System

Kaffelog is a daily operations app for independent cafés and small café chains in the UAE. It helps owners waste less money, stay inspection-ready, and avoid expensive surprises across three jobs: **milk ordering** (calculates tomorrow's order from historical counts), **Dubai Municipality logs** (turns phone checklists into inspection-ready PDFs), and **SafeVault** (expiry tracking for trade licences, food-handler cards, pest control, halal certificates).

This system codifies **Direction 02 — Operations Desk**, the direction chosen after a three-way moodboard review (Quiet Control / Operations Desk / Modern Café Editorial — still in the project root as reference). It borrows two treatments from Direction 03 (hairline-rule stat figures, the "needs attention" list card) at the user's request.

**Sources used:**
- `uploads/Kaffelog_Product_Overview.md` — product jobs, target user, copy examples
- `uploads/Visual Brand Guidelines for Kafelog.md` — brand guidance
- `uploads/KAFFELOG - BRAND VIBE REPORT.md` — emotional territory, brand feel
- The three moodboard files and `Kaffelog Logo Exploration.dc.html` (this project) — visual direction and the chosen mark (Route C, "The Logged Tick")

No product codebase or Figma file was attached — every visual decision below originates from the moodboard exploration, not an existing UI.

## Content fundamentals

- **Voice:** calm, precise, protective, capable — "the calm system behind the café," never "enterprise restaurant management software."
- **Casing:** sentence case in UI; ALL CAPS only for mono-set labels/overlines (`TOMORROW'S MILK`, `SAFE`), never for sentences.
- **Numbers first:** lead with the number the owner cares about (`54 L`, `AED 418`, `96%`), label second.
- **Status words are fixed vocabulary:** `SAFE` / `DUE SOON` / `NEEDS ATTENTION` (SafeVault) — never rephrase per-screen.
- **No filler stats.** Every figure shown is one an owner would act on (savings, litres, days remaining) — never decorative charts.
- **Bilingual moments:** English is primary; Arabic appears as a secondary line (`اليوم جاهز`) on receipts and critical mobile alerts, not throughout.
- **Currency:** always `AED 000` (space, no symbol).
- **No emoji.**

## Visual foundations

- **Palette:** soot black (`--brown-900`) and warm paper (`--paper-100/200`) carry the system; rust (`--rust-600`) is the single brand accent, amber (`--rust-400`) is the "due soon" signal, sage (`--sage-600`) is "safe," red (`--red-600`) is "needs attention." Max two background colors per screen (paper or soot), never both busy at once.
- **Type:** IBM Plex Sans for UI and headlines (700 for headings, tracked tight at `-0.03em`), IBM Plex Mono for every number, date, label and unit (this is the load-bearing rule — money, litres, percentages and timestamps are always mono), Newsreader serif reserved for large money figures on stat cards only (a deliberate accent, not a body font).
- **Structure:** hard 1.5px rules, not shadows, separate regions. Radius is used sparingly (`--radius-none` default; `--radius-full` only for chip-style status pills and CTA buttons). Cards sit on ruled borders, not drop shadows — shadow tokens exist for popovers/modals only.
- **Ownable device:** the **modular status cell** — a hard-ruled rectangle with a colored left border (stock labels, document rows) or a colored corner cell on the bean-oval mark. Repeats across product, mark and print.
- **Backgrounds:** flat paper or flat soot only. No gradients, no glassmorphism, no texture beyond an occasional dashed "perforation" rule on receipts.
- **Imagery:** flat, evenly lit, top-down or straight-on product/operational photography (stock shelves, receipt printers, clipboards) — never lifestyle coffee shots of customers. Placeholder striping stands in until real photography is supplied.
- **Motion:** fast and functional — 100–180ms ease-out for hovers/toggles, no bounce, no playful spring. Respect `prefers-reduced-motion`.
- **Elevation:** most surfaces are flat with a border; shadow only appears for anything that floats above the page (dropdown, modal, receipt card lifted off a desk).

## Iconography

No icon asset source was provided (no codebase, no icon font). This system uses **Lucide** (CDN, MIT-licensed, outline style at 1.5px stroke — the closest open match to the hand-drawn 1.5px glyphs in the moodboards) as a substitute — flagged for swap if Kaffelog has or commissions its own set. Icons inherit `currentColor` and sit at 16/20/24px paired with `--text-sm`/`--text-base`/`--text-lg` respectively. Status is never color-only: every status pill pairs a color with a text label.

No logo file was provided. Wherever a mark would go, this system renders the wordmark **KAFFELOG** in IBM Plex Sans 700 caps, or the Route C "Logged Tick" oval-in-a-box concept from the logo exploration — both are placeholders pending a real logo file.

## Intentional additions

Standard component set (Button, Input, Select, Checkbox, Switch, Badge, Card, MetricTile, Tabs, Banner, Toast) — no source codebase defined a component inventory, so this is a from-scratch set sized to Kaffelog's actual screens (dashboard, milk order, SafeVault, checklists), not a generic SaaS kit.

## Index

- `styles.css` — root stylesheet (import this)
- `tokens/` — colors, typography, spacing, radius/shadow, base resets
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Status, Icons)
- `components/actions/` — Button
- `components/forms/` — Input, Select, Checkbox, Switch
- `components/display/` — Badge, Card, MetricTile, StatusRow
- `components/navigation/` — Tabs
- `components/feedback/` — Banner, Toast
- `ui_kits/kaffelog-app/` — Dashboard, Milk Order, SafeVault, Municipality Checklist screens
- `SKILL.md` — Claude Code-portable skill file

## Roadmap (not yet built)

Motion/interaction-state matrix per component, data tables with sort/filter, charts (waste trend, roast-free here since Kaffelog has no roasting), onboarding/billing/settings screens, dark mode QA pass, accessibility audit, print stylesheet for PDF exports. Flag any of these to prioritize next.
