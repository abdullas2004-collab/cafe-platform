# Claude Design Prompt — Kaffelog App Redesign

**How to use this file:** Open Claude Design and paste **Phase 0 + Phase 1** first. Get the plan approved before any screens are drawn. Then paste each subsequent phase one at a time. Do not paste the whole file at once — you'll get shallow work across 22 screens instead of finished work on the six that matter.

---

## Phase 0 — Context

You are redesigning **Kaffelog**, a daily operations app for independent cafés in the UAE. It is a live, finished React PWA that installs to a phone's home screen from the browser. It is being redesigned because the current UI looks functional but unpolished — it needs to look like a product a café owner would pay AED 199/month for.

**The user of this app** is a café owner-operator in Dubai, Sharjah, or Ajman. She is 28–50, runs one location or a small chain, is not technical, and is usually holding a phone with one hand while doing something else. Her staff — baristas, often on shift for a few months — also use the app at the counter. English is a second language for most of them.

**The three jobs the app does:**
1. Tells her how much milk to order tomorrow, calculated from her sales pattern
2. Turns daily hygiene checks into Dubai Municipality-format PDF logs
3. Warns her before her trade licence or staff cards expire

**Business context:** solo founder, pre-revenue, zero customers. This redesign exists to make live demos and sales conversations go well. Prioritise accordingly — the screens a prospect actually sees matter more than completeness.

**Usage reality:** ~95% of usage is mobile. Desktop matters for exactly one thing: the founder demoing on a laptop. Design mobile-first, then adapt up.

---

## Phase 1 — Plan before you draw

Before producing any screens, produce a plan covering:

1. **Screen map** — all screens grouped by area, with the states each one needs
2. **Navigation solution** for mobile (see the critical problem below)
3. **Component inventory** — the reusable pieces you'll build once and use everywhere (buttons, inputs, cards, stat blocks, empty states, toasts, modals)
4. **Order of work** — which screens you'll do first and why
5. **Open questions** — anything ambiguous, asked before you commit

**Wait for approval on the plan before drawing anything.**

### The one structural problem to solve in the plan

The app currently has **seven top-level tabs**: Dashboard, Sales Entry, Logs, Analytics, SafeVault, AI Settings, Tools — plus a logout button. Seven tabs do not fit on a 375px screen. This is the single biggest structural issue and it affects every other screen.

Propose a solution. Options worth considering: a bottom tab bar with 4 primary destinations plus "More"; consolidating Settings and Tools into one; moving Analytics inside Dashboard. Recommend one and explain the reasoning — don't just list options.

---

## Design system

Use these exact values. They come from the existing brand and the marketing site, and the app must feel like the same product as kaffelog.com.

### Colour

| Token | Hex | Use |
|---|---|---|
| Bone | `#F7F4EE` | App background |
| Card | `#FFFFFF` | Cards, sheets, inputs |
| Ink | `#1A1A18` | Primary text, dark CTAs |
| Stone | `#6E6A5E` | Secondary text, labels |
| Sage | `#4A5D43` | Primary action, success, "done" |
| Sage soft | `#EEF1EA` | Success backgrounds, pills |
| Rust | `#B5502A` | Warnings, urgency — **used sparingly** |
| Rust soft | `#F7EBE4` | Warning backgrounds |
| Border | `#E7E1D5` | All 1px borders |

Dark mode equivalent: espresso `#1A1612` background, warm off-white text. Every screen eventually needs both, but **light mode first** — do not split effort until light is finished.

### Typography

- **Display:** Fraunces (500/600) — screen titles, big numbers, prices, the milk quantity
- **UI:** Inter (400/500/600/700) — everything else
- **Data:** monospace — receipt-style output and log tables only
- Heading line-height 1.12–1.20; body 1.6
- Sentence case. No ALL CAPS except small eyebrow labels.

### Rules

- No gradients, no glows, no neon, no noise textures
- 1px borders (`Border` token) on every card — no drop shadows except elevated sheets and modals
- Radius: 10px buttons, 12–16px cards, 999px pills
- Rust appears at most twice per screen
- No decorative emoji. Icons only, from a single consistent set.
- Motion: only functional transitions (sheet slides, tab changes). No scroll-triggered animation, no parallax, no spring physics.

### Non-negotiable quality floor

- Tap targets ≥ 44×44px
- Visible keyboard focus states
- Numeric inputs trigger the numeric keypad on mobile
- Nothing important sits under the on-screen keyboard
- iOS safe areas respected (notch, home indicator)
- No horizontal scroll at any width
- No layout shift — fixed dimensions on charts and mockups

---

## Breakpoints

| Name | Width | Priority |
|---|---|---|
| Small mobile | 360–390px | **Primary — design here first** |
| Large mobile | 391–430px | High |
| Tablet | 768–1023px | Medium (counter iPads) |
| Desktop | 1024px+ | Medium (demo laptop only) |

Also account for: landscape phone, and the on-screen keyboard open.

---

## Phase 2 — Foundations and empty states

These come first because they're reused everywhere and because empty states are what every new customer sees before they see anything good.

**Build the component library:**
buttons (primary / secondary / destructive / disabled / loading) · text and number inputs (default / focus / filled / error / disabled) · cards · stat blocks · pills and badges · toasts (success / error / info) · modal and bottom-sheet shells · list rows · progress indicators · skeleton loaders

**Then design the universal states:**

| State | Requirement |
|---|---|
| **Empty / first run** | A pattern applied consistently: what this screen is for, one clear action to fill it. Never a blank page. |
| **Loading** | Skeletons matching final layout, not spinners |
| **Error** | Plain-language message + retry. Never a raw error code. |
| **Offline** | App-wide banner, plus "last updated" stamps on cached data |
| **Global crash screen** | The app currently has no error boundary. Design a recovery screen — this is what stands between a demo and a white screen in front of a client. |

---

## Phase 3 — Onboarding and auth

Design in this order:

**1. Signup** — empty, typing, weak password, email already registered, submitting, **success ("check your email")**, network error.
⚠️ The success message is currently displayed in a red error box. Design it clearly as a success moment.

**2. Login** — empty, typing, submitting, wrong credentials, **email not yet confirmed** (needs its own message plus a "resend" action), network error.
Also design a **forgot-password flow** — it does not currently exist.

**3. Onboarding — 4 steps**
- Step 1: welcome
- Step 2: café name, emirate
- Step 3: POS system, staff size
- Step 4: licence number, trade expiry, phone (optional)

States per step: empty, valid, invalid, saving, save failed. Plus progress indication, back navigation, and the completion moment.

This flow is the first thing a paying customer sees. It should feel like the best-designed part of the product.

---

## Phase 4 — Core screens

**Dashboard** — the most-returned-to screen.
States: first-run empty · loading · normal · waste alert · fine risk low/medium/high · municipality log pending vs. done today · offline · error.

**Sales Entry** — the screen where the product proves its value.
The moment that matters: she enters yesterday's numbers and tomorrow's milk order appears. That transition should feel like a small reward. Consider rendering the result as a receipt — it's the app's signature motif and café owners already trust that object.
States: empty · partially filled · complete with calculation · submitting · saved · save failed · validation error · insufficient history for a forecast.
Mobile-critical: the result must stay visible when the numeric keypad is open.

**SafeVault** — document expiry tracking.
Five distinct expiry treatments: safe (>30 days) · warning (30d) · urgent (14d) · critical (3d) · expired. These five states *are* the feature — make the visual difference unmistakable at a glance.
Plus: empty, document list, add document, uploading, upload failed, document detail, delete confirmation.

---

## Phase 5 — Secondary screens

**Logs** — empty · loading · populated · filtered · detail view · PDF generating · PDF ready · export failed
**Analytics** — insufficient data (under 7 days, currently undefined behaviour) · weekly · monthly · loading · trend improving vs. declining · export. Charts must work at 375px, not just shrink.
**Tools & Settings** — supplier book, WhatsApp report, recipe settings, language toggle, theme toggle, notification permission states (not asked / granted / denied / unsupported)
**Municipality Log modal** — empty · filling · validation error · submitting · success · failed
**Pro upgrade modal** — default · plan selected · redirecting

---

## Phase 6 — Responsive and dark mode

Only after light-mode mobile is finished:
1. Tablet adaptations (768–1023px)
2. Desktop adaptations (1024px+) — this is the pitch-day view; it should look deliberate, not like a stretched phone
3. Dark mode across all completed screens

---

## Output expectations

For each screen, provide: the mobile design first, then desktop; every state listed for that screen; annotations for anything non-obvious; and the component tokens used, so it maps back to code.

Flag any place where you think the existing information architecture is wrong. Do not silently work around a structural problem — say so.

---

## What to avoid

- Generic SaaS dashboard aesthetics — this is a tool for a café, not an analytics startup
- Dark, neon, or "AI product" visual language — the audience reads it as unfinished
- Dense data tables on mobile
- More than one primary action per screen
- Any state left undesigned because it seemed minor — the empty and error states are exactly where the app currently looks unfinished

---

## Scope note — read this before starting

Full coverage across every screen, state, breakpoint, and theme is roughly **480 artboards**. That is a design team's quarter, not a solo founder's week.

**The version worth doing:** Phases 1–4, mobile, light mode only — about 25 artboards. That covers every screen a prospect touches, fixes the navigation problem, and eliminates the three ways a live demo can visibly break. Phases 5 and 6 should wait until someone is paying.

If you can only do one thing: the global crash screen, the signup success message, and the empty states. Those three protect a demo. Everything else is improvement.
