# ProfitGuard AI — Complete Setup Guide
### From zero to live in ~45 minutes

---

## STEP 1 — Create your Supabase database (15 min)

**1.1 Create account**
→ Go to https://supabase.com → Sign up (free)

**1.2 Create new project**
→ Click "New Project"
→ Name: `profitguard-uae`
→ Region: **Middle East (Bahrain)** ← important for UAE data residency
→ Set a strong database password → Save it somewhere
→ Click "Create Project" → wait ~2 minutes

**1.3 Run the SQL schema**
→ In your project, click **SQL Editor** in the left sidebar
→ Click **New query**
→ Open the file `profitguard_supabase_setup.sql` (in this folder)
→ Select all → Copy → Paste into Supabase SQL Editor
→ Click **Run** (green button)
→ You should see: "Success. No rows returned"

**1.4 Get your credentials**
→ Click **Settings** (gear icon, left sidebar) → **API**
→ Copy two things:
  - **Project URL** — looks like: `https://abcdefghij.supabase.co`
  - **anon public key** — starts with: `eyJhbGciOiJIUzI1NiIs...`
→ Keep these — you'll need them in Step 3

---

## STEP 2 — Get your Anthropic API key (5 min)

The AI chat assistant in the app uses Claude. In the Claude artifact it works
automatically, but for your own deployment you need a key.

**2.1 Create account**
→ Go to https://console.anthropic.com → Sign up

**2.2 Add credits**
→ Go to **Billing** → Add $10 (covers ~500 AI conversations)
→ Each message costs roughly AED 0.02

**2.3 Create API key**
→ Click the **key icon** (bottom-left)
→ Click **Create Key** → give it a name: `profitguard-production`
→ **Copy it immediately** — you only see it once
→ Format: `sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx`

---

## STEP 3 — Connect credentials to the app (2 min)

Open `ProfitGuardAI.jsx` and make these 3 changes:

### Change 1 — Supabase URL (line 24)
```js
// BEFORE:
const SUPABASE_URL = "https://your-project.supabase.co";

// AFTER (your actual URL):
const SUPABASE_URL = "https://abcdefghij.supabase.co";
```

### Change 2 — Supabase anon key (line 25)
```js
// BEFORE:
const SUPABASE_KEY = "your-anon-public-key";

// AFTER (your actual key):
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Change 3 — Enable login screen (line ~2107)
```js
// BEFORE:
const [screen, setScreen] = useState("app");

// AFTER:
const [screen, setScreen] = useState("login");
```

That's it. The app now talks to your real database.

---

## STEP 4 — Deploy to the web (10 min)

### Option A — Vercel (recommended, free)

**4.1** Go to https://github.com → Create a new repository → name it `profitguard-ai`

**4.2** Create this folder structure on your computer:
```
profitguard-ai/
  src/
    App.jsx         ← paste ProfitGuardAI.jsx content here (rename default export to App)
  index.html        ← see template below
  package.json      ← see template below
  vite.config.js    ← see template below
```

**4.3 index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>ProfitGuard AI</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**4.4 src/main.jsx**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
```

**4.5 package.json**
```json
{
  "name": "profitguard-ai",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "0.383.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

**4.6 vite.config.js**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**4.7 Deploy**
→ Push to GitHub: `git init && git add . && git commit -m "init" && git push`
→ Go to https://vercel.com → Sign up with GitHub
→ Click **Import** → select `profitguard-ai`
→ Click **Deploy** (no config needed)
→ Vercel gives you a URL: `profitguard-ai-xxx.vercel.app`

### Option B — Share directly from Claude (testing only)

The `.jsx` file works as a Claude artifact right now.
Use it to demo to cafe owners — it shows all features with demo data.
When they want to sign up for real, send them your Vercel URL.

---

## STEP 5 — Set up WhatsApp daily reports (20 min)

This sends the 7am morning summary automatically.

**5.1** Go to https://make.com → Sign up free

**5.2** Create a new scenario

**5.3** Add modules in this order:
```
[Schedule: Daily 03:00 UTC = 07:00 Dubai]
    ↓
[Supabase: Get cafes where plan != 'expired']
    ↓
[Supabase: Get yesterday's waste savings for each cafe]
    ↓
[Supabase: Get expiring documents (within 30 days)]
    ↓
[Claude AI: Generate personalised summary message]
    ↓
[HTTP: POST to WhatsApp Business API → send to owner]
```

**5.4 Claude prompt for the Make scenario:**
```
You are ProfitGuard AI. Write a WhatsApp message in under 100 words for {{cafe_name}}.

Yesterday's savings: AED {{savings}}
Milk saved: {{milk_saved}}L
Checklist: {{checklist_score}}/5
Documents expiring: {{expiring_docs}}

Format it exactly like this:
🟢 *ProfitGuard AI — Daily Report*
📅 [today's date]

💰 Yesterday: AED [savings]
🥛 Order [recommended_order]L today (saved [saved]L)
✅ Checklist: [score]/5
[if expiring docs] ⚠️ [doc name] expires in [days] days

_ProfitGuard AI · profitguard.ae_
```

**5.5 WhatsApp Business API**
- Provider: 360dialog.com (€49/month, easiest UAE setup)
- Or use the WhatsApp links in the app (free, manual send)

---

## STEP 6 — First cafe onboarding checklist

Before visiting a cafe, confirm:
- [ ] Supabase database running ✓
- [ ] Vercel app deployed and URL works ✓
- [ ] You've tested signup → onboarding → dashboard on your own phone ✓
- [ ] Make.com automation set up (optional for first week) ✓

At the cafe visit:
- [ ] Show the demo on your phone (5 min)
- [ ] Owner signs up on their phone at your Vercel URL (3 min)
- [ ] Complete onboarding steps together (5 min)
- [ ] Enter trade licence + health card dates into SafeVault (5 min)
- [ ] Show barista the Municipality Log (2 min)
- [ ] Send first WhatsApp report manually that evening (2 min)

---

## STEP 7 — Foodics POS connection

When a cafe wants automatic sales sync (Growth plan feature):

**7.1** Register at https://developers.foodics.com
→ Apply for developer access → wait 2–5 business days

**7.2** When approved, add to your Vercel environment variables:
```
FOODICS_CLIENT_ID=your_client_id
FOODICS_CLIENT_SECRET=your_client_secret
```

**7.3** Add a `/api/foodics-callback` route to your deployment (see Backend.md)

**7.4** Add a "Connect Foodics" button to the Settings tab that opens:
```
https://console.foodics.com/oauth/authorize
  ?client_id=YOUR_CLIENT_ID
  &redirect_uri=https://profitguard.ae/api/foodics-callback
  &response_type=code
  &scope=general.read
```

**7.5** Run a nightly cron job (Vercel Cron or Make.com) to pull yesterday's orders
and write to your `daily_sales` table.

---

## Monthly running costs (at 10 active cafes)

| Service         | Cost         | Notes |
|-----------------|--------------|-------|
| Supabase        | Free         | Up to 50K MAU |
| Vercel          | Free         | Unlimited deployments |
| Anthropic API   | ~AED 20/mo   | ~1,000 AI chat messages |
| 360dialog       | €49/mo       | WhatsApp Business API |
| Make.com        | Free tier    | 1,000 ops/month free |
| **Total**       | **~AED 210** | |
| **Revenue**     | **AED 1,990**| 10 × AED 199/mo |
| **Profit**      | **AED 1,780**| 89% margin |

---

## Credentials to keep safe (never share these)

| Key | Where to find it | Where it goes |
|-----|-----------------|---------------|
| Supabase URL | Settings → API | `ProfitGuardAI.jsx` line 24 |
| Supabase anon key | Settings → API | `ProfitGuardAI.jsx` line 25 |
| Supabase service key | Settings → API | Server only — never in frontend |
| Anthropic API key | console.anthropic.com | Server env var only |
| Foodics client secret | developers.foodics.com | Server env var only |

---

## You're live. What next?

Week 1: Get 3 trial cafes set up manually. Send WhatsApp reports yourself.
Week 2: Automate WhatsApp via Make.com. Add Foodics for any cafe that wants it.
Week 4: Follow up with trial cafes. Convert to AED 199/mo paid plan.
Month 2: Use testimonials to approach 10 more cafes. Enable Growth tier.
Month 6: 50 cafes, MRR AED 10K+. Hire one part-time UAE-based support person.
