# Kaffelog — Product Overview

**What it is:** A daily operations app for independent cafés in the UAE.
**Who it's for:** Owner-operators of single cafés and small local chains in Dubai, Sharjah, and Ajman.
**What it costs:** AED 99–499/month, 14-day free trial, no card required.
**Where it runs:** kaffelog.com — installs to any phone's home screen from the browser. No App Store.

---

## 1. The one-sentence version

Kaffelog tells a café owner how much milk to order tomorrow, turns their daily hygiene checks into inspection-ready Dubai Municipality PDF logs, and warns them before their trade licence or staff cards expire.

---

## 2. The problem

A café owner in the UAE loses money in three quiet ways that nobody bills them for:

**Milk waste.** Ordering is done by feel. Order too much and cartons expire; order too little and you turn customers away. A mid-size café throws away roughly **AED 1,500–2,000 a month** in milk without ever seeing it as a line item, because waste doesn't appear on any receipt.

**Inspection paperwork.** Dubai Municipality requires food businesses to keep temperature logs, cleaning records, and receiving checks. Most cafés keep these in a paper folder that's filled in retroactively — often the morning an inspector walks in. Assembling a month of records under pressure takes hours and still looks improvised.

**Expiring documents.** Trade licence, food-handler cards, pest-control contracts, tenancy — each with its own renewal date and its own fine for lapsing. Fines can reach **AED 10,000**, and they're triggered by nothing more than a date nobody was watching.

None of this is anyone's fault. It's admin work that competes with actually running a café, and it always loses.

---

## 3. What Kaffelog does

### Milk ordering, calculated
The owner logs yesterday's count in about ten seconds. Kaffelog reads the rolling pattern — slow Wednesdays, busy weekends, Ramadan hours — and produces tomorrow's exact order in litres, broken down by milk type. The output is deliberately shaped like a till receipt, because that's the object every café owner already trusts.

*Typical saving: AED 60–90 per day.*

### Municipality logs as PDFs
Fridge temperatures, cleaning schedules, and receiving checks are recorded on a phone at the counter as they happen. At any point, the month exports as a Dubai Municipality-format PDF, complete and dated.

*Inspection prep drops from hours to about 30 seconds.*

### SafeVault renewal tracking
Every operating document lives in one place with its expiry date. Kaffelog warns at 30 days, 14 days, and 3 days before anything lapses.

*Avoids fines of up to AED 10,000 each.*

---

## 4. What else is in the app

Beyond the three core jobs, the product includes: a daily dashboard with waste and fine-risk indicators, weekly and monthly analytics, a supplier contact book, WhatsApp-formatted daily reports, recipe/portion settings, a halal certificate expiry tracker, a fine history log, an AI assistant for operational questions, English/Arabic language support, and light/dark themes.

---

## 5. Who it's for (and who it isn't)

**Best fit:**
- Independent, single-location cafés — the owner is on-site and makes decisions alone
- Small local chains of 2–5 branches
- Specialty coffee shops that care about consistency and margins
- Newly opened cafés setting up their systems from scratch

**Poor fit:**
- Large international chains — they have enterprise systems already
- Restaurants with complex kitchens — Kaffelog is built around café operations, not full food service
- Businesses outside the UAE — the compliance formats are Dubai Municipality-specific

---

## 6. How it fits with what they already use

Kaffelog **sits beside the POS, it doesn't replace it.** It never touches payments. Sales data can be imported from a Foodics CSV export, or entered manually as a single number per day if the café doesn't use a POS at all.

No new hardware. No staff training beyond "tick the list." The barista sees a checklist; that's the entire interface for them.

---

## 7. Pricing

| Plan | Price | For |
|---|---|---|
| **Starter** | AED 99/month | One branch, all three core tools |
| **Pro** | AED 199/month | Adds staff accounts, roles, Foodics import, priority support |
| **Chain** | AED 499/month | Up to 5 branches, cross-branch reports, onboarding call |

14-day free trial on every plan, no credit card. Cancel with one message.

**The framing that works:** AED 99/month is less than one wasted carton of milk a day.

---

## 8. Why it exists

Kaffelog was built by Abdulla, a 21-year-old founder in Mirdif, Dubai, after talking to café owners across the emirate and finding the same three complaints in every conversation. It is built specifically for the UAE — global tools like Toast and Square handle sales, but none of them know what a Dubai Municipality hygiene log looks like.

The product is complete and live. It currently has **no paying customers** — it is in the go-to-market stage, not the building stage.

---

## 9. Technical summary

| | |
|---|---|
| **Type** | Progressive Web App (installs from browser, works like a native app) |
| **Frontend** | React + Vite |
| **Backend** | Supabase (auth + Postgres) |
| **Hosting** | Vercel, auto-deploy from GitHub |
| **Domain** | kaffelog.com |
| **Offline** | Service worker; core screens work without connectivity |
| **Languages** | English, Arabic (plus Urdu/Malayalam strings) |
| **Running cost** | ~USD 24/month total |

---

## 10. Contact

- **Website:** kaffelog.com
- **Email:** info@kaffelog.com
- **Instagram:** @kaffelog
- **WhatsApp:** support link on site
- **Based in:** Dubai, UAE 🇦🇪

---

## 11. Positioning in one line, three ways

**To a café owner:** "It tells you how much milk to order tomorrow and keeps your municipality paperwork ready."

**To an investor or buyer:** "Vertical SaaS for UAE café operations — compliance plus cost control, in a market with 5,000+ independent cafés and no localised competitor."

**To a developer:** "A React PWA on Supabase that does forecasting, PDF compliance logs, and document expiry tracking for a single vertical in a single market."
