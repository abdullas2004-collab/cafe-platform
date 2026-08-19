# Kaffelog — Complete Screen & State Inventory
### Redesign reference: every screen, every breakpoint, every state

**Source:** audited directly from `Kaffelog.jsx` (5,347 lines, 33 components) — this is what actually exists, not a wishlist.
**Last updated:** August 2026

**How to use this:** work top to bottom. Each screen lists its variants (desktop / mobile) and every state it can be in. A screen isn't "redesigned" until every state in its list has been drawn — the empty and error states are where apps look unfinished, and they're the ones that get skipped.

---

## Legend

| Mark | Meaning |
|---|---|
| 🟢 | Exists and works |
| 🟡 | Exists, needs design attention |
| 🔴 | Missing — should exist |
| ⭐ | High priority for pitch day |

---

## Part A — Unauthenticated screens

### A1. Landing page ⭐ 🟢
*Component: `KaffelogLandingV2`*

**Desktop (≥1024px)** — two-column hero, 3-up feature grid, 3-up pricing, horizontal nav
**Tablet (640–1023px)** — stacked hero, 2-up grids
**Mobile (<640px)** — single column, nav text links hidden, mockups stack

**States:**
| State | Notes |
|---|---|
| Default | First load, cookie banner visible |
| Cookie accepted | Banner dismissed, doesn't return this session |
| Privacy modal open | Scroll locked, Escape closes |
| FAQ item expanded | One open at a time |
| Install tab: iOS | Default |
| Install tab: Android | Toggled |
| Scrolled | Sticky nav with blur active |
| Reduced motion | Instant scroll instead of smooth |
| Instagram in-app browser | ⚠️ **must be tested separately** — your real traffic path |

---

### A2. Login 🟡
*Component: `LoginScreen`*

**States:**
| State | Notes |
|---|---|
| Empty | Default |
| Typing | Focus rings, live validation |
| Invalid email format | Inline error under field |
| Submitting | Button spinner, inputs disabled |
| Wrong credentials | Error message |
| **Email not confirmed** | ⚠️ Your known Supabase issue — needs its own clear message + "resend confirmation" action, not a generic error |
| Network failure | Distinct from wrong password |
| Success | Transition to dashboard or onboarding |
| Password visibility toggle | Show/hide |
| 🔴 Forgot password | **Missing entirely** — no recovery path exists today |

---

### A3. Signup 🟡
*Component: `SignupScreen`*

**States:**
| State | Notes |
|---|---|
| Empty / typing / submitting | Standard |
| Weak password | Inline strength feedback |
| Email already registered | Offer "log in instead" link |
| ⚠️ **Success — check your email** | Currently styled as a RED ERROR BOX. It's a success message. **Fix this first** — it's the single most confusing moment in the whole app |
| Network failure | |
| 🔴 Resend confirmation email | Missing |

---

### A4. Onboarding flow ⭐ 🟡
*Component: `OnboardingFlow` — 4 steps*

| Step | Collects | Validation |
|---|---|---|
| 1 | Welcome | Always passable |
| 2 | Café name, emirate | Name ≥ 2 chars |
| 3 | POS system, staff size | Both required |
| 4 | Licence number, trade expiry, phone | Optional |

**States per step:** empty · valid · invalid · saving · save failed · complete
**Global states:** progress indicator (1/4 → 4/4), back navigation, exit/abandon, final save spinner

**Redesign note:** this is the highest-leverage screen in the app. It's the first thing a paying café owner sees after signing up, and it's currently the plainest. If a demo goes wrong on pitch day, it goes wrong here.

---

### A5. Install prompt 🟢
*Component: `InstallPrompt` — renders on all 5 screens*

**States:** hidden · visible (Android/Chrome native) · visible (iOS manual instructions) · dismissed · already installed
⚠️ Does not work inside Instagram/WhatsApp in-app browsers — needs an explicit "open in Safari" message rather than silence.

---

## Part B — Main app shell

### B0. Navigation 🟡
7 tabs: Dashboard · Sales Entry · Logs · Analytics · SafeVault · AI Settings · Tools — plus logout.

**Desktop:** horizontal tab bar
**Mobile:** ⚠️ **7 tabs do not fit on a 375px screen.** This is a real layout problem. Options: bottom tab bar with 4 primary + "More", or a scrollable tab strip. Decide during redesign.

**States:** active tab · inactive · logout hover · logging out

---

### B1. Dashboard ⭐ 🟡

**Desktop:** multi-column cards
**Mobile:** single column stack

**States:**
| State | Notes |
|---|---|
| 🔴 **First-run / empty** | No data logged yet — **currently missing.** A brand-new café owner sees an empty dashboard. This is a pitch-day risk. |
| Loading | Skeletons, not spinners |
| Populated — normal | |
| Populated — waste alert | Rust warning treatment |
| Fine risk: low / medium / high | Three distinct gauge states |
| Municipality log CTA: pending / done today | |
| Offline | Cached data + "last updated" stamp |
| Error loading | Retry action |

Sub-components: `DonutChart` (empty/partial/full), `FineRiskGauge` (3 levels), `NeighborhoodBanner`

---

### B2. Sales Entry ⭐ 🟡
*Component: `SalesEntry` — largest component in the app (~800 lines)*

**States:**
| State | Notes |
|---|---|
| Empty / yesterday not logged | |
| Partially filled | |
| Complete — calculation shown | The moment that sells the product |
| Submitting / saved / save failed | |
| Validation error | Negative numbers, impossible values |
| Insufficient history | Needs N days before forecasting works — must say so gracefully |
| WhatsApp report ready | |
| 🔴 Day-type toggle (slow/normal/busy) | Planned, not built |

**Mobile:** number inputs must trigger the **numeric keypad**, and the calculation result must stay visible above the keyboard. Check this on a real phone.

---

### B3. Logs 🟡
*Component: `LogsTab`*

**States:** empty (no logs yet) · loading · populated · filtered · single log detail · PDF generating · PDF ready · export failed · offline

---

### B4. Analytics 🟡
*Components: `WeeklyAnalyticsContent`, `MonthlyAnalyticsContent`*

**States:**
| State | Notes |
|---|---|
| 🔴 **Insufficient data** | Under 7 days logged — charts can't render. Currently undefined behaviour. |
| Weekly view / monthly view | Toggle |
| Loading | |
| Populated — improving / declining | Different emotional treatment |
| Export/share | |

**Mobile:** charts need horizontal scroll or simplification. Desktop chart layouts do not survive 375px.

---

### B5. SafeVault ⭐ 🟡
*Component: `SafeVault`*

**States:**
| State | Notes |
|---|---|
| Empty — no documents | 🔴 Needs a proper first-run design |
| Documents listed | |
| Adding document / uploading / upload failed | |
| Expiry: safe (>30d) / warning (30d) / urgent (14d) / critical (3d) / **expired** | Five distinct visual treatments — this is the feature's whole value |
| Document detail view | |
| Delete confirmation | |

Related: `HalalExpiryTracker`, `FineHistoryLog` (empty/populated)

---

### B6. AI Settings 🟡
*Components: `AIAssistant`, `RecipeSettings`*

**States:** default · editing recipe · saving · saved · AI thinking · AI responded · AI error/rate-limited · offline (AI unavailable)

---

### B7. Tools 🟡
*Component: `ToolsTab`* — contains: `SupplierBook`, `WhatsAppReport`, `MunicipalityLog`, language toggle (English/Arabic), `ThemeToggle`, `NotificationSetup`

**States:** default · Arabic mode (⚠️ **RTL layout — needs a full separate design pass**) · light / dark / auto theme · notifications: not asked / granted / denied / unsupported

---

## Part C — Overlays & global states

| Screen | States | Priority |
|---|---|---|
| **Municipality Log modal** | Empty, filling, validation error, submitting, success, failed | ⭐ |
| **Pro upgrade modal** | Default, plan selected, redirecting | |
| **Notification setup** | Prompt, granted, denied, unsupported | |
| **Toast notifications** | Success, error, info, stacked | |
| **Theme toggle** | Light, dark, auto — ⚠️ **every screen above needs both light and dark versions drawn** | ⭐ |
| 🔴 **Global loading** | App boot / session restore — missing | ⭐ |
| 🔴 **Global error boundary** | White screen of death protection — **missing.** One bad render crashes the whole app in front of a client. | ⭐⭐ |
| 🔴 **Offline banner** | App-wide connectivity indicator | |
| 🔴 **Session expired** | Graceful re-login, don't lose entered data | |
| 🔴 **404 / unknown route** | | |

---

## Part D — Breakpoints

| Name | Width | Priority | Notes |
|---|---|---|---|
| Small mobile | 360–390px | ⭐⭐ **Primary** | Most UAE café staff phones |
| Large mobile | 391–430px | ⭐⭐ | iPhone Pro Max, etc. |
| Tablet | 768–1023px | ⭐ | Counter iPads — realistic for barista use |
| Desktop | 1024–1439px | ⭐ | Owner's laptop, **your pitch screen** |
| Large desktop | 1440px+ | Low | |

**Also test:** landscape phone (barista props phone sideways), iOS safe areas (notch + home indicator), on-screen keyboard covering inputs, and **Instagram's in-app browser**.

---

## Part E — Redesign priority

Ordered by what protects you on pitch day and what a real customer hits first:

| # | Item | Why |
|---|---|---|
| 1 | **Global error boundary** | A crash in front of a client is unrecoverable. Cheap insurance. |
| 2 | **Signup success message** (red box → green) | Your most confusing moment, ~10 min fix |
| 3 | **Empty / first-run states** — dashboard, SafeVault, analytics | Every new customer sees these before they see anything good |
| 4 | **Mobile nav** — 7 tabs don't fit | Structural, affects every screen |
| 5 | **Onboarding flow** | First impression after payment intent |
| 6 | **Sales Entry** | Your core value moment |
| 7 | **Dashboard** | Most-returned-to screen |
| 8 | **SafeVault expiry states** | The five-level treatment is the feature |
| 9 | Analytics insufficient-data state | |
| 10 | Dark mode pass across all screens | |
| 11 | Forgot-password flow | Missing but not blocking |
| 12 | Arabic RTL pass | Large job, defer until a customer needs it |

---

## Part F — Screen count

| Category | Count |
|---|---|
| Unauthenticated screens | 5 |
| Main app tabs | 7 |
| Modals & overlays | 5 |
| Missing screens to build | 5 |
| **Distinct screens** | **~22** |
| **Total states across all screens** | **~120** |
| **× light and dark mode** | **~240 designs** |
| **× 2 primary breakpoints** | **~480 artboards for full coverage** |

**Realistic scope note:** 480 artboards is a design-team quarter, not a solo-founder week. Redesigning everything before your next customer conversation is not the right trade.

The defensible version: do items **1–6** from Part E on mobile, light mode only. That's roughly 25 artboards, covers every screen a prospect actually touches, and eliminates the three ways a demo can visibly break. Dark mode, tablet, Arabic, and the long tail can wait until someone is paying you.
