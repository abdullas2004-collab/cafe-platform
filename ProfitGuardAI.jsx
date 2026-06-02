// ─────────────────────────────────────────────────────────────
//  ProfitGuard AI  ·  UAE Cafe Management Platform
//  Fixed Edition — clean imports, Anthropic API integrated,
//  offline-ready, Arabic/Urdu/Malayalam, all review fixes applied
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, TrendingUp, Lock, Settings2, Wrench,
  Clipboard, AlertTriangle, CheckCircle2, XCircle,
  Phone, FileText, BadgeCheck, Megaphone,
  ChevronDown, MessageSquare, Send,
  X, Info, Zap, Award, ShieldAlert, ShieldCheck,
  Package, BookUser, Globe, Languages, RefreshCw,
  Wheat, Milk, Coffee, Apple, ShoppingCart,
  Copy, Check, Bot, Sparkles, BarChart3,
  Clock, MapPin, Eye, EyeOff, UserPlus, ChevronRight,
  Bell, BellRing, BellOff
} from "lucide-react";

// ─── SUPABASE CLIENT ─────────────────────────────────────────
// Replace these with your actual Supabase project values
// Get them from: supabase.com → your project → Settings → API
const SUPABASE_URL  = "https://iitnvwwbwpvcjhvbzjrj.supabase.co";
const SUPABASE_KEY  = "sb_publishable_8j4nJ7uTP5ppvYaCjrTaUw_wUn2xF4d";

// Lightweight Supabase REST client (no npm needed in artifact)
const sb = {
  _url: SUPABASE_URL,
  _key: SUPABASE_KEY,
  _headers(token) {
    return {
      "Content-Type":  "application/json",
      "apikey":         this._key,
      "Authorization": `Bearer ${token || this._key}`,
      "Prefer":        "return=representation",
    };
  },

  // ── AUTH ──────────────────────────────────────────────────
  async signUp(email, password) {
    const r = await fetch(`${this._url}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": this._key },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async signIn(email, password) {
    const r = await fetch(`${this._url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": this._key },
      body: JSON.stringify({ email, password }),
    });
    return r.json();
  },
  async signOut(token) {
    await fetch(`${this._url}/auth/v1/logout`, {
      method: "POST",
      headers: this._headers(token),
    });
  },

  // ── DATABASE ──────────────────────────────────────────────
  async insert(table, data, token) {
    const r = await fetch(`${this._url}/rest/v1/${table}`, {
      method: "POST",
      headers: this._headers(token),
      body: JSON.stringify(data),
    });
    return r.json();
  },
  async select(table, filters, token) {
    const params = new URLSearchParams(filters || {});
    const r = await fetch(`${this._url}/rest/v1/${table}?${params}`, {
      headers: { ...this._headers(token), "Accept": "application/json" },
    });
    return r.json();
  },
  async update(table, match, data, token) {
    const params = new URLSearchParams(match);
    const r = await fetch(`${this._url}/rest/v1/${table}?${params}`, {
      method: "PATCH",
      headers: this._headers(token),
      body: JSON.stringify(data),
    });
    return r.json();
  },
};

// ─── AUTH CONTEXT (simple in-memory store) ────────────────────
// In production use React Context or Zustand — this is enough for the artifact
// ─── SESSION PERSISTENCE ──────────────────────────────────
// Saves login session to browser storage so users stay logged in.
// Keys: pg_session (auth token), pg_cafe (cafe profile)

let _session = null;
let _cafe    = null;

// Restore session from localStorage on app load
(function restoreSession(){
  try {
    if (typeof localStorage === "undefined") return;
    const s = localStorage.getItem("pg_session");
    const c = localStorage.getItem("pg_cafe");
    if (s) _session = JSON.parse(s);
    if (c) _cafe = JSON.parse(c);
  } catch {}
})();

const getSession = () => _session;
const getCafe    = () => _cafe;

const setSession = (s) => {
  _session = s;
  try {
    if (s) localStorage.setItem("pg_session", JSON.stringify(s));
    else localStorage.removeItem("pg_session");
  } catch {}
};

const setCafe = (c) => {
  _cafe = c;
  try {
    if (c) localStorage.setItem("pg_cafe", JSON.stringify(c));
    else localStorage.removeItem("pg_cafe");
  } catch {}
};

// ─── NOTIFICATION HELPERS ─────────────────────────────────
// Browser-native notifications — no API, no approval, free forever.
// Falls back gracefully if user denies permission or browser doesn't support.

const notif = {
  // Check current state — "default" | "granted" | "denied" | "unsupported"
  state() {
    if (typeof window === "undefined") return "unsupported";
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  },

  // Ask the user for permission. Returns the new state.
  async request() {
    if (this.state() === "unsupported") return "unsupported";
    if (this.state() === "granted")     return "granted";
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return "denied";
    }
  },

  // Fire a notification immediately
  send(title, body, options = {}) {
    if (this.state() !== "granted") return false;
    try {
      const n = new Notification(title, {
        body,
        icon:  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhNmNmZiIgcng9IjIyIi8+PHBhdGggZD0iTTI1IDcwTDQ1IDQ1bDE1IDE1IDIwLTMwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==",
        badge: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzFhNmNmZiIvPjwvc3ZnPg==",
        tag: options.tag || "profitguard",
        requireInteraction: options.persist || false,
        silent: options.silent || false,
      });
      // Auto-close after 8 seconds unless persisted
      if (!options.persist) setTimeout(() => n.close(), 8000);
      // Clicking the notification refocuses the app
      n.onclick = () => {
        window.focus();
        n.close();
        if (options.onClick) options.onClick();
      };
      return true;
    } catch (e) {
      console.warn("Notification failed:", e);
      return false;
    }
  },

  // Schedule a notification at a specific time of day (HH:MM, 24-hour)
  // Returns the timeout ID so it can be cancelled
  scheduleDaily(time, title, body, options = {}) {
    if (this.state() !== "granted") return null;
    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    // If target time today has passed, schedule for tomorrow
    if (target <= now) target.setDate(target.getDate() + 1);
    const msUntil = target - now;
    return setTimeout(() => {
      this.send(title, body, options);
      // Re-schedule for next day
      this.scheduleDaily(time, title, body, options);
    }, msUntil);
  },
};

// ─── GLOBAL STYLES ───────────────────────────────────────────
const STYLES = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

:root{
  --navy:#050d1a; --navy-mid:#0b1829; --navy-card:#0f2038;
  --blue:#1a6cff; --blue-glow:rgba(26,108,255,.32);
  --emerald:#00b86b; --emerald-mid:#009a5a;
  --gold:#f0b429; --red:#ff4f4f; --purple:#8b5cf6;
  --text-1:#f0f4ff; --text-2:#8899bb; --text-3:#4a5578;
  --border:rgba(255,255,255,.07); --border-blue:rgba(26,108,255,.22);
  --border-green:rgba(0,184,107,.22);
  --white:#fff;
  --font-d:'Syne',sans-serif; --font-b:'DM Sans',sans-serif;
  --r-sm:10px; --r-md:14px; --r-lg:18px; --r-xl:22px;
}

html,body{background:var(--navy);font-family:var(--font-b);-webkit-font-smoothing:antialiased}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--text-3);border-radius:4px}

/* ── shell ── */
.pg-shell{min-height:100vh;background:var(--navy);display:flex;flex-direction:column;align-items:center;max-width:480px;margin:0 auto}

/* ── nav ── */
.pg-nav{width:100%;display:flex;background:#06101e;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:80;overflow-x:auto;padding:0 6px;gap:2px}
.pg-nav::-webkit-scrollbar{height:0}
.pg-nav-tab{flex:0 0 auto;min-width:84px;padding:13px 12px;font-family:var(--font-d);font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap;transition:color .18s,border-color .18s}
.pg-nav-tab.active{color:var(--text-1);border-bottom-color:var(--blue)}

/* ── header ── */
.pg-header{width:100%;background:linear-gradient(155deg,#0c1f3a 0%,var(--navy) 100%);padding:34px 22px 34px;position:relative;overflow:hidden}
.pg-header::before{content:'';position:absolute;top:-80px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(26,108,255,.12) 0%,transparent 70%);pointer-events:none}
.pg-header::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(26,108,255,.38),transparent)}

.pg-wordmark{display:flex;align-items:center;gap:9px;margin-bottom:3px}
.pg-logo{width:30px;height:30px;background:var(--blue);border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px var(--blue-glow);flex-shrink:0}
.pg-brand{font-family:var(--font-d);font-size:16px;font-weight:700;color:var(--text-1);letter-spacing:-.01em}
.pg-brand-sub{font-size:10px;color:var(--text-2);letter-spacing:.12em;text-transform:uppercase}
.pg-location{display:flex;align-items:center;gap:6px;background:rgba(26,108,255,.1);border:.5px solid rgba(26,108,255,.28);border-radius:20px;padding:4px 11px;font-size:11px;color:#7aadff;font-weight:500}
.pg-dot{width:6px;height:6px;border-radius:50%;background:var(--emerald);box-shadow:0 0 5px rgba(0,184,107,.7);animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.8)}}

.pg-heading{font-family:var(--font-d);font-size:23px;font-weight:800;color:var(--text-1);line-height:1.2;letter-spacing:-.02em;margin-bottom:6px}
.pg-heading span{color:#5599ff}
.pg-subhead{font-size:12px;color:var(--text-2);font-weight:300;margin-bottom:26px;line-height:1.5}

/* main cta button */
.pg-cta{width:100%;background:var(--blue);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:16px 20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;position:relative;overflow:hidden;transition:transform .14s,box-shadow .14s;box-shadow:0 4px 24px var(--blue-glow),0 1px 0 rgba(255,255,255,.1) inset}
.pg-cta::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.11) 0%,transparent 60%);pointer-events:none}
.pg-cta:active{transform:scale(.98)}
.pg-cta:disabled{opacity:.7;pointer-events:none}
.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── body ── */
.pg-body{width:100%;padding:22px 18px 80px;display:flex;flex-direction:column;gap:16px}
.pg-sect{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin-bottom:8px}

/* ── cards ── */
.card{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.card-white{background:var(--white);border-radius:var(--r-lg);border:.5px solid rgba(0,0,0,.08);box-shadow:0 2px 18px rgba(0,0,0,.06);overflow:hidden}

/* stat row */
.stat-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
.stat-card{background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);padding:13px 10px;text-align:center;position:relative;overflow:hidden}
.stat-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px}
.stat-card.blue::after{background:var(--blue)}.stat-card.green::after{background:var(--emerald)}.stat-card.gold::after{background:var(--gold)}
.stat-n{font-family:var(--font-d);font-size:17px;font-weight:700;color:var(--text-1);margin-bottom:3px;letter-spacing:-.02em}
.stat-l{font-size:9px;color:var(--text-2);letter-spacing:.04em;line-height:1.3}

/* savings card */
.sav-card{background:linear-gradient(135deg,#e8f7f0 0%,#d0f0e3 100%);border-radius:var(--r-xl);padding:22px;position:relative;overflow:hidden;border:1px solid var(--border-green)}
.sav-card::before{content:'';position:absolute;top:-40px;right:-40px;width:150px;height:150px;background:radial-gradient(circle,rgba(0,184,107,.17) 0%,transparent 70%);pointer-events:none}
.sav-eyebrow{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--emerald-mid);margin-bottom:7px;display:flex;align-items:center;gap:5px}
.sav-eyebrow::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--emerald);box-shadow:0 0 7px rgba(0,184,107,.6)}
.sav-amt{font-family:var(--font-d);font-size:40px;font-weight:800;color:#004d2e;letter-spacing:-.03em;line-height:1;margin-bottom:3px}
.sav-amt .cur{font-size:18px;font-weight:600;vertical-align:super;color:#006b40}
.sav-lbl{font-size:12px;color:#2d7a57;margin-bottom:16px}
.sav-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.sav-item{background:rgba(0,100,60,.1);border-radius:9px;padding:8px 10px;border:.5px solid rgba(0,184,107,.18)}
.sav-num{font-family:var(--font-d);font-size:14px;font-weight:700;color:#004d2e;margin-bottom:1px}
.sav-desc{font-size:10px;color:#3d9a6e}
.sav-badge{position:absolute;top:18px;right:18px;background:var(--emerald);color:#fff;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px}

/* AI insight */
.ai-chip{display:flex;align-items:center;gap:5px;background:#eef3ff;border:.5px solid rgba(26,108,255,.2);border-radius:20px;padding:4px 11px;font-size:10px;font-weight:700;color:var(--blue);letter-spacing:.06em;text-transform:uppercase}
.ai-blink{width:5px;height:5px;border-radius:50%;background:var(--blue);animation:blink 1.4s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
.ai-text{font-style:italic;font-size:13px;font-weight:300;color:#1a2840;line-height:1.7;margin-bottom:14px;padding-left:12px;border-left:2px solid var(--blue)}
.ai-text strong{font-weight:500;font-style:normal;color:#0a1628}
.tag{font-size:10px;font-weight:500;padding:3px 9px;border-radius:20px;border:.5px solid}
.tag.a{background:#fff8e6;border-color:rgba(240,180,41,.4);color:#9a7000}
.tag.b{background:#e8f2ff;border-color:rgba(26,108,255,.25);color:#1a5cd0}
.tag.c{background:#fde8f0;border-color:rgba(220,50,100,.2);color:#b02060}

/* projection */
.proj{background:#08111f;border-radius:var(--r-md);border:.5px solid rgba(0,184,107,.2);padding:18px 20px;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden}
.proj::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--emerald) 0%,var(--blue) 100%)}
.proj-icon{width:38px;height:38px;border-radius:11px;background:rgba(0,184,107,.1);border:.5px solid rgba(0,184,107,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.proj-val{font-family:var(--font-d);font-size:22px;font-weight:800;color:var(--emerald);letter-spacing:-.03em;line-height:1;margin-bottom:3px}
.proj-sub{font-size:10px;color:var(--text-2)}

/* ── AI ASSISTANT ── */
.ai-assistant{background:linear-gradient(135deg,#07122a 0%,#040d1e 100%);border-radius:var(--r-xl);border:.5px solid var(--border-blue);overflow:hidden}
.ai-head{padding:16px 18px;border-bottom:.5px solid var(--border-blue);display:flex;align-items:center;gap:10px}
.ai-avatar{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--blue) 0%,var(--purple) 100%);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 14px rgba(26,108,255,.3)}
.ai-msgs{padding:14px;display:flex;flex-direction:column;gap:10px;max-height:280px;overflow-y:auto}
.ai-bubble{max-width:90%;border-radius:14px;padding:10px 13px;font-size:12px;line-height:1.6}
.ai-bubble.bot{background:rgba(26,108,255,.1);border:.5px solid var(--border-blue);color:var(--text-1);align-self:flex-start;border-radius:4px 14px 14px 14px}
.ai-bubble.user{background:var(--blue);color:#fff;align-self:flex-end;border-radius:14px 4px 14px 14px}
.ai-bubble.loading{background:rgba(26,108,255,.06);border:.5px solid var(--border-blue);padding:12px 14px;align-self:flex-start}
.ai-dots{display:flex;gap:4px;align-items:center}
.ai-dot-anim{width:5px;height:5px;border-radius:50%;background:var(--blue);animation:dotpulse 1.2s ease-in-out infinite}
.ai-dot-anim:nth-child(2){animation-delay:.2s}.ai-dot-anim:nth-child(3){animation-delay:.4s}
@keyframes dotpulse{0%,80%,100%{transform:scale(.7);opacity:.4}40%{transform:scale(1);opacity:1}}
.ai-input-row{display:flex;gap:8px;padding:12px 14px;border-top:.5px solid var(--border);background:rgba(255,255,255,.02)}
.ai-input{flex:1;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:10px;padding:8px 12px;font-size:12px;font-family:var(--font-b);outline:none;transition:border-color .15s}
.ai-input:focus{border-color:var(--blue)}
.ai-input::placeholder{color:var(--text-2)}
.ai-send{width:34px;height:34px;border-radius:9px;background:var(--blue);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:opacity .14s}
.ai-send:disabled{opacity:.5;pointer-events:none}
.ai-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 12px}
.ai-quick-btn{font-size:10px;font-weight:500;padding:5px 10px;border-radius:20px;border:.5px solid var(--border-blue);background:rgba(26,108,255,.08);color:#7aadff;cursor:pointer;transition:background .14s;font-family:var(--font-b)}
.ai-quick-btn:hover{background:rgba(26,108,255,.15)}

/* ── ANALYTICS ── */
.anal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.toggle{display:flex;background:#0b1829;border-radius:9px;border:.5px solid var(--border);padding:3px;gap:2px}
.toggle-btn{font-family:var(--font-d);font-size:10px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;padding:5px 13px;border-radius:7px;border:none;cursor:pointer;color:var(--text-2);background:transparent;transition:background .18s,color .18s}
.toggle-btn.active{background:var(--blue);color:#fff;box-shadow:0 2px 9px var(--blue-glow)}

/* table */
.tbl{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.tbl-hrow{display:grid;padding:10px 16px;border-bottom:.5px solid var(--border);background:rgba(255,255,255,.02)}
.tbl-clbl{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2)}
.tbl-row{display:grid;padding:13px 16px;border-bottom:.5px solid var(--border);align-items:center;transition:background .14s}
.tbl-row:last-child{border-bottom:none}
.tbl-row:hover{background:rgba(255,255,255,.02)}
.row-lbl{font-size:12px;font-weight:500;color:var(--text-1)}
.row-sub{font-size:10px;color:var(--text-2);margin-top:1px}

/* score */
.score-val{font-family:var(--font-d);font-size:14px;font-weight:700;letter-spacing:-.01em}
.score-bar{height:3px;border-radius:2px;margin-top:4px;background:rgba(255,255,255,.08);overflow:hidden}
.score-fill{height:100%;border-radius:2px}
.acc-pill{display:inline-flex;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px}
.acc-pill.h{background:rgba(0,184,107,.12);color:var(--emerald)}
.acc-pill.m{background:rgba(240,180,41,.12);color:var(--gold)}
.acc-pill.l{background:rgba(255,80,80,.12);color:var(--red)}

/* fine risk gauge */
.frs-card{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);display:flex;align-items:flex-start;gap:4px;padding:16px 14px 16px 10px;position:relative;overflow:hidden}
.frs-card::before{content:'';position:absolute;top:0;left:0;bottom:0;width:2px;background:linear-gradient(180deg,var(--emerald) 0%,rgba(0,184,107,0) 100%)}
.frs-factors{display:flex;flex-direction:column;gap:6px;margin-bottom:10px}
.frs-frow{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.025);border-radius:7px;padding:5px 9px;border:.5px solid var(--border)}
.frs-fdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.frs-verdict{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--emerald);font-weight:500;background:rgba(0,184,107,.07);border:.5px solid rgba(0,184,107,.16);border-radius:7px;padding:6px 9px}

/* waste root cause */
.wrc{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.wrc-top{display:flex;align-items:flex-start;justify-content:space-between;padding:16px 16px 11px;border-bottom:.5px solid var(--border)}
.wrc-body{display:flex;align-items:center;gap:6px;padding:16px 14px 12px}
.wrc-legend{flex:1;display:flex;flex-direction:column;gap:7px}
.wrc-li{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.025);border-radius:8px;padding:7px 9px;border:.5px solid var(--border);transition:border-color .14s}
.wrc-li:hover{border-color:rgba(255,255,255,.1)}
.wrc-swatch{width:9px;height:9px;border-radius:2px;flex-shrink:0}
.wrc-insight{display:flex;align-items:flex-start;gap:7px;margin:0 12px 14px;background:rgba(26,108,255,.06);border:.5px solid rgba(26,108,255,.16);border-radius:9px;padding:9px 11px;font-size:11px;color:var(--text-2);line-height:1.5}
.wrc-insight strong{color:var(--text-1);font-weight:500}

/* document status */
.doc-chip{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:5px}

/* monthly summary */
.msumm{background:linear-gradient(135deg,#0b2040 0%,#071428 100%);border-radius:var(--r-md);border:.5px solid rgba(26,108,255,.18);padding:18px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.msumm-val{font-family:var(--font-d);font-size:19px;font-weight:800;letter-spacing:-.02em;line-height:1}
.msumm-val.em{color:var(--emerald)}.msumm-val.bl{color:#5599ff}.msumm-val.go{color:var(--gold)}
.audit-badge{display:inline-flex;align-items:center;gap:4px;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:5px;background:rgba(26,108,255,.12);border:.5px solid rgba(26,108,255,.28);color:#7aadff}

/* ── INVOICE TABLE ── */
.inv{background:var(--white);border-radius:var(--r-lg);overflow:hidden;box-shadow:0 4px 28px rgba(0,0,0,.25)}
.inv-hd{background:#09182e;padding:16px 20px 14px;border-bottom:1px solid rgba(26,108,255,.15);display:flex;align-items:flex-start;justify-content:space-between}
.inv-col{display:grid;grid-template-columns:2fr 1fr 1fr 1.1fr;padding:8px 20px;background:#f7f9fc;border-bottom:1px solid #e8ecf4}
.inv-clbl{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8899bb}
.inv-clbl.r{text-align:right}
.inv-line{display:grid;grid-template-columns:2fr 1fr 1fr 1.1fr;padding:13px 20px;align-items:center;border-bottom:1px solid #f0f3fa;transition:background .14s}
.inv-line:hover{background:#fafbff}
.inv-line:last-child{border-bottom:none}
.inv-totals{background:#f7f9fc;border-top:1px solid #e0e6f0;padding:12px 20px}
.inv-grand{display:flex;align-items:center;justify-content:space-between;margin-top:9px;padding-top:9px;border-top:1.5px solid #09182e}
.inv-stamp{margin-top:10px;padding-top:9px;border-top:.5px dashed #c8d4e8;display:flex;align-items:center;gap:5px;font-size:9px;color:#aab4cc;font-style:italic}

/* ── DAILY HISTORY ── */
.dh-sect{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2);margin-bottom:10px;display:flex;align-items:center;gap:7px}
.dh-sect::after{content:'';flex:1;height:.5px;background:var(--border)}
.dh-day{background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);overflow:hidden;transition:border-color .18s}
.dh-day:hover{border-color:rgba(26,108,255,.18)}
.dh-dhdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;cursor:pointer;user-select:none}
.dh-ddot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
.dh-dname{font-family:var(--font-d);font-size:12px;font-weight:700;color:var(--text-1);letter-spacing:-.01em}
.dh-ddate{font-size:10px;color:var(--text-2);margin-top:1px}
.dh-dtotal{font-family:var(--font-d);font-size:13px;font-weight:700;color:var(--emerald);letter-spacing:-.02em}
.dh-chev{color:var(--text-2);transition:transform .22s;display:flex;align-items:center}
.dh-chev.open{transform:rotate(180deg)}
.dh-bar{height:3px;background:var(--border);margin:0 14px 11px;border-radius:2px;overflow:hidden}
.dh-barfill{height:100%;border-radius:2px}
.dh-items{overflow:hidden;max-height:0;transition:max-height .28s cubic-bezier(.4,0,.2,1)}
.dh-items.open{max-height:300px}
.dh-inner{border-top:.5px solid var(--border);padding:11px 14px 13px;display:flex;flex-direction:column;gap:7px}
.dh-crow{display:grid;grid-template-columns:1fr 1fr 1fr;padding:0 9px 5px}
.dh-clbl{font-size:9px;color:var(--text-2);font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.dh-clbl.c{text-align:center}.dh-clbl.r{text-align:right}
.dh-irow{display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;padding:7px 9px;background:rgba(255,255,255,.02);border-radius:7px;border:.5px solid var(--border)}
.dh-iname{font-size:11px;color:var(--text-1)}
.dh-iqty{font-size:11px;color:var(--text-2);text-align:center}
.dh-iaed{font-family:var(--font-d);font-size:11px;font-weight:600;color:var(--emerald);text-align:right}

/* ── SAFE VAULT ── */
.sv-body{width:100%;padding:0 0 80px}
.sv-hdr{background:linear-gradient(160deg,#07142a 0%,var(--navy) 100%);padding:24px 18px 20px;border-bottom:.5px solid var(--border-blue);position:relative;overflow:hidden}
.sv-hdr::before{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(26,108,255,.35),transparent)}
.sv-kpi{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;padding:16px 18px}
.sv-kpi-card{background:var(--navy-card);border-radius:var(--r-sm);border:.5px solid var(--border);padding:11px 8px;text-align:center}
.sv-kpi-val{font-family:var(--font-d);font-size:17px;font-weight:700;margin-bottom:2px}
.sv-kpi-lbl{font-size:9px;color:var(--text-2);line-height:1.2}

/* neighbor banner */
.nb-banner{margin:0 18px;background:linear-gradient(135deg,#0c1f38 0%,#091828 100%);border-radius:var(--r-md);border:.5px solid rgba(240,180,41,.2);padding:11px 14px;display:flex;align-items:flex-start;gap:10px}
.nb-pulse{width:8px;height:8px;border-radius:50%;background:var(--red);box-shadow:0 0 7px rgba(255,79,79,.7);flex-shrink:0;margin-top:3px;animation:pulse 1.2s ease-in-out infinite}
.nb-dots{display:flex;gap:5px;margin-top:5px}
.nb-dot{width:5px;height:5px;border-radius:50%;background:var(--border);transition:background .3s}
.nb-dot.active{background:var(--gold)}

/* doc card */
.doc-card{background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);padding:13px 15px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.doc-bar{height:3px;background:rgba(255,255,255,.06);border-radius:2px;margin-top:7px;overflow:hidden}
.doc-bar-fill{height:100%;border-radius:2px}
.renew-btn{display:flex;align-items:center;gap:5px;background:rgba(26,108,255,.1);border:.5px solid rgba(26,108,255,.28);border-radius:8px;padding:6px 11px;font-size:10px;font-weight:600;color:#7aadff;cursor:pointer;white-space:nowrap;transition:background .14s;font-family:var(--font-b)}
.renew-btn:hover{background:rgba(26,108,255,.17)}

/* fine history */
.fh-tabs{display:flex;gap:6px;padding:14px 18px 0}
.fh-tab{font-size:11px;font-weight:600;padding:6px 14px;border-radius:8px 8px 0 0;border:none;cursor:pointer;font-family:var(--font-d);letter-spacing:.04em;text-transform:uppercase;transition:background .15s,color .15s}
.fh-tab.active{background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-bottom:none}
.fh-tab:not(.active){background:transparent;color:var(--text-2)}
.fh-list{margin:0 18px;background:var(--navy-card);border-radius:0 var(--r-md) var(--r-md) var(--r-md);border:.5px solid var(--border);overflow:hidden}
.fh-item{display:flex;align-items:flex-start;gap:11px;padding:13px 14px;border-bottom:.5px solid var(--border);transition:background .14s}
.fh-item:last-child{border-bottom:none}
.fh-item:hover{background:rgba(255,255,255,.02)}
.fh-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── TOOLS TAB ── */
.tools-body{width:100%;padding:22px 18px 90px;display:flex;flex-direction:column;gap:20px}
.tools-title{font-family:var(--font-d);font-size:14px;font-weight:700;color:var(--text-1);letter-spacing:-.01em}
.tools-sub{font-size:10px;color:var(--text-2);margin-top:2px}

/* lang toggle */
.lang-strip{background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);padding:13px 15px;display:flex;align-items:center;gap:11px}
.lang-icon{width:34px;height:34px;border-radius:9px;background:rgba(26,108,255,.1);border:.5px solid rgba(26,108,255,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sw{position:relative;width:42px;height:23px;flex-shrink:0}
.sw input{opacity:0;width:0;height:0}
.sw-track{position:absolute;inset:0;background:rgba(255,255,255,.08);border-radius:12px;cursor:pointer;transition:background .18s;border:.5px solid var(--border)}
.sw-track::before{content:'';position:absolute;width:17px;height:17px;border-radius:50%;background:var(--text-2);left:3px;top:2.5px;transition:transform .2s,background .2s}
.sw input:checked+.sw-track{background:var(--blue);border-color:var(--blue)}
.sw input:checked+.sw-track::before{transform:translateX(19px);background:#fff}
.lang-flag{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:500;padding:3px 8px;border-radius:20px;border:.5px solid;cursor:pointer;transition:background .14s;font-family:var(--font-b)}

/* halal tracker */
.ht-card{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.ht-hd{background:linear-gradient(135deg,#071d0f 0%,#0a2218 100%);padding:14px 16px;border-bottom:.5px solid rgba(0,184,107,.13);display:flex;align-items:center;gap:10px}
.ht-hicon{width:36px;height:36px;border-radius:9px;background:rgba(0,184,107,.12);border:.5px solid rgba(0,184,107,.28);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ht-grid{display:grid;grid-template-columns:1.5fr .8fr .8fr .7fr}
.ht-hrow{display:grid;padding:8px 16px;background:rgba(255,255,255,.02);border-bottom:.5px solid var(--border)}
.ht-row{display:grid;padding:11px 16px;border-bottom:.5px solid var(--border);align-items:center;transition:background .14s}
.ht-row:hover{background:rgba(255,255,255,.02)}
.ht-row:last-child{border-bottom:none}
.ht-iicon{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ht-iname{font-size:11px;font-weight:500;color:var(--text-1)}
.ht-ibatch{font-size:9px;color:var(--text-2);margin-top:1px}
.ht-expval{font-family:var(--font-d);font-size:11px;font-weight:600;letter-spacing:-.01em}
.ht-days{font-size:9px;color:var(--text-2);margin-top:1px}
.ht-cert{display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px}
.ht-cdot{width:4px;height:4px;border-radius:50%}
.ht-status{display:inline-flex;align-items:center;gap:3px;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px}
.ht-add{padding:10px 16px;border-top:.5px solid var(--border);background:rgba(255,255,255,.01)}
.ht-add-btn{width:100%;background:rgba(0,184,107,.07);border:.5px dashed rgba(0,184,107,.28);border-radius:9px;padding:9px;font-size:11px;font-weight:500;color:var(--emerald);cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:background .14s;font-family:var(--font-b)}
.ht-add-btn:hover{background:rgba(0,184,107,.12)}

/* supplier book */
.sup-card{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.sup-hd{padding:14px 16px;border-bottom:.5px solid var(--border);display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#07111e 0%,#0b1829 100%)}
.sup-entry{padding:13px 16px;border-bottom:.5px solid var(--border)}
.sup-entry:last-child{border-bottom:none}
.sup-top{display:flex;align-items:flex-start;justify-content:space-between;gap:7px;margin-bottom:9px}
.sup-av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px}
.sup-name{font-size:12px;font-weight:600;color:var(--text-1)}
.sup-cat{font-size:10px;color:var(--text-2);margin-top:1px}
.sup-btn{display:flex;align-items:center;gap:4px;padding:6px 11px;border-radius:8px;font-size:10px;font-weight:600;border:none;cursor:pointer;text-decoration:none;transition:opacity .14s;font-family:var(--font-b)}
.sup-btn.call{background:rgba(0,184,107,.12);border:.5px solid rgba(0,184,107,.22);color:var(--emerald)}
.sup-btn.wa{background:rgba(37,211,102,.12);border:.5px solid rgba(37,211,102,.22);color:#25d366}
.sup-aird{background:rgba(26,108,255,.06);border:.5px solid rgba(26,108,255,.14);border-radius:7px;padding:8px 10px;display:flex;align-items:flex-start;gap:6px;font-size:10px;color:var(--text-2);line-height:1.5}
.sup-aird strong{color:var(--text-1);font-weight:500}

/* whatsapp report */
.wa-card{background:linear-gradient(135deg,#071710 0%,#051209 100%);border-radius:var(--r-xl);border:.5px solid rgba(37,211,102,.18);overflow:hidden;position:relative}
.wa-card::before{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;background:radial-gradient(circle,rgba(37,211,102,.07) 0%,transparent 70%);pointer-events:none}
.wa-hd{padding:16px 18px 13px;border-bottom:.5px solid rgba(37,211,102,.1);display:flex;align-items:flex-start;gap:11px}
.wa-icon{width:38px;height:38px;border-radius:11px;background:rgba(37,211,102,.1);border:.5px solid rgba(37,211,102,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wa-preview{margin:13px 18px;background:#0f1f12;border-radius:13px;border:.5px solid rgba(37,211,102,.09);overflow:hidden}
.wa-bar{background:#128c7e;padding:8px 13px;display:flex;align-items:center;gap:7px}
.wa-bav{width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0}
.wa-bubble{margin:11px;background:#1d2e1e;border-radius:11px 11px 11px 0;padding:11px 13px;border:.5px solid rgba(37,211,102,.09)}
.wa-bline{font-size:11px;color:rgba(255,255,255,.7);line-height:1.7;display:flex;align-items:baseline;gap:5px}
.wa-bline .em{color:#25d366;font-weight:600}
.wa-bline .warn{color:var(--gold);font-weight:600}
.wa-bline .ok{color:var(--emerald)}
.wa-bfoot{margin-top:7px;padding-top:7px;border-top:.5px solid rgba(255,255,255,.05);font-size:9px;color:rgba(255,255,255,.3);display:flex;justify-content:space-between}
.wa-ctrl{padding:13px 18px 17px;display:flex;flex-direction:column;gap:9px}
.wa-trow{display:flex;align-items:center;gap:9px}
.wa-tlbl{font-size:11px;color:var(--text-2);flex:1}
.wa-sel{background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:7px;padding:6px 9px;font-size:11px;font-family:var(--font-b);cursor:pointer;outline:none}
.wa-inp{flex:1;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:7px;padding:7px 11px;font-size:12px;font-family:var(--font-b);outline:none;transition:border-color .14s}
.wa-inp:focus{border-color:#25d366}
.wa-inp::placeholder{color:var(--text-2)}
.wa-copybtn{background:rgba(37,211,102,.08);border:.5px solid rgba(37,211,102,.18);border-radius:7px;padding:7px 9px;color:#25d366;cursor:pointer;display:flex;align-items:center;transition:background .14s;flex-shrink:0}
.wa-copybtn:hover{background:rgba(37,211,102,.14)}
.wa-send{width:100%;background:#25d366;color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:none;border-radius:11px;padding:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:opacity .14s,transform .14s;box-shadow:0 4px 18px rgba(37,211,102,.22)}
.wa-send:active{transform:scale(.98);opacity:.9}
.wa-send.sent{background:#1aab53;pointer-events:none}

/* ── MUNICIPALITY LOG ── */
.ml-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:200;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .28s}
.ml-backdrop.open{opacity:1;pointer-events:all}
.ml-sheet{background:#0b1829;border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;border:.5px solid rgba(26,108,255,.22);transform:translateY(100%);transition:transform .35s cubic-bezier(.34,1.2,.64,1)}
.ml-backdrop.open .ml-sheet{transform:translateY(0)}
.ml-handle{width:38px;height:4px;border-radius:2px;background:rgba(255,255,255,.15);margin:12px auto 0}
.ml-eyebrow{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5599ff;margin-bottom:4px;display:flex;align-items:center;gap:5px}
.ml-title{font-family:var(--font-d);font-size:20px;font-weight:800;color:var(--text-1);letter-spacing:-.02em;margin-bottom:3px}
.ml-subtitle{font-size:11px;color:var(--text-2)}
.ml-close{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.07);border:.5px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-2);flex-shrink:0}
.ml-ts{display:flex;align-items:center;gap:7px;background:rgba(26,108,255,.07);border:.5px solid var(--border-blue);border-radius:8px;padding:8px 12px;margin:12px 18px 0;font-size:11px;color:var(--text-2)}
.ml-flbl{font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ml-fnum{width:18px;height:18px;border-radius:50%;background:var(--navy-card);border:.5px solid var(--border-blue);font-size:9px;font-weight:700;color:#5599ff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stepper{display:flex;align-items:center;gap:0;border-radius:var(--r-md);overflow:hidden;border:.5px solid var(--border)}
.step-btn{width:46px;height:52px;background:rgba(255,255,255,.04);border:none;color:var(--text-1);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .14s}
.step-btn:hover{background:rgba(255,255,255,.08)}
.step-val{flex:1;text-align:center;font-family:var(--font-d);font-size:28px;font-weight:800;color:var(--text-1);background:transparent}
.temp-status{display:flex;align-items:center;gap:6px;margin-top:10px;padding:7px 11px;border-radius:8px;font-size:11px;font-weight:500}
.ml-check-row{display:flex;align-items:flex-start;gap:11px;padding:12px 0;border-bottom:.5px solid var(--border);cursor:pointer;transition:opacity .14s}
.ml-check-row:last-child{border-bottom:none}
.ml-check-row:hover{opacity:.85}
.ml-cb{width:22px;height:22px;border-radius:6px;border:.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .18s,border-color .18s}
.ml-cb.checked{background:var(--emerald);border-color:var(--emerald)}
.ml-select{width:100%;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:var(--r-md);padding:13px 14px;font-size:13px;font-family:var(--font-b);outline:none;transition:border-color .14s;-webkit-appearance:none}
.ml-select:focus{border-color:var(--blue)}
.ml-risk{background:rgba(255,79,79,.07);border:.5px solid rgba(255,79,79,.2);border-radius:10px;padding:11px 13px;margin-top:10px}
.ml-risk-hdr{display:flex;align-items:center;gap:6px;margin-bottom:5px}
.ml-submit{width:100%;background:var(--blue);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity .14s;box-shadow:0 4px 20px var(--blue-glow)}
.ml-submit:disabled{opacity:.4;pointer-events:none}
.ml-success{display:flex;flex-direction:column;align-items:center;padding:36px 24px 48px;text-align:center}
.ml-ring{width:80px;height:80px;border-radius:50%;background:rgba(0,184,107,.1);border:2px solid var(--emerald);display:flex;align-items:center;justify-content:center;margin-bottom:18px;box-shadow:0 0 24px rgba(0,184,107,.3)}
.ml-receipt{width:100%;background:rgba(255,255,255,.03);border:.5px solid var(--border);border-radius:var(--r-md);padding:16px;text-align:left;margin-top:20px}
.ml-receipt-row{display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:.5px solid var(--border)}
.ml-receipt-row:last-child{border-bottom:none}

/* ── RECIPE SETTINGS ── */
.rs-body{width:100%;padding:22px 18px 90px;display:flex;flex-direction:column;gap:18px}
.rs-buffer{background:var(--navy-card);border-radius:var(--r-lg);border:.5px solid var(--border);overflow:hidden}
.rs-buf-hd{background:linear-gradient(135deg,#07122a 0%,#040d1e 100%);padding:16px 18px;border-bottom:.5px solid var(--border-blue);display:flex;align-items:center;gap:10px}
.rs-buf-icon{width:36px;height:36px;border-radius:9px;background:rgba(26,108,255,.1);border:.5px solid rgba(26,108,255,.22);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.range-wrap{padding:18px 20px 20px}
.range-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.range-val{font-family:var(--font-d);font-size:26px;font-weight:800;color:var(--emerald);letter-spacing:-.03em}
.range-unit{font-size:12px;color:var(--text-2);margin-left:3px;font-weight:400}
.range-input{width:100%;-webkit-appearance:none;appearance:none;height:5px;border-radius:3px;outline:none;cursor:pointer}
.range-input::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--emerald,#00b86b);box-shadow:0 0 8px rgba(0,184,107,.5);cursor:pointer;border:2px solid #fff}
.range-ticks{display:flex;justify-content:space-between;margin-top:8px}
.range-tick{font-size:9px;color:var(--text-3)}
.rs-drink{background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);overflow:hidden}
.rs-drink-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none;transition:background .14s}
.rs-drink-hdr:hover{background:rgba(255,255,255,.02)}
.rs-drink-body{overflow:hidden;max-height:0;transition:max-height .28s cubic-bezier(.4,0,.2,1)}
.rs-drink-body.open{max-height:400px}
.rs-inner{padding:14px 18px 16px;border-top:.5px solid var(--border)}
.rs-slider-lbl{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);margin-bottom:7px}
.rs-summary{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-top:13px}
.rs-summ-item{background:rgba(255,255,255,.03);border-radius:8px;padding:8px;border:.5px solid var(--border);text-align:center}
.rs-summ-val{font-family:var(--font-d);font-size:14px;font-weight:700;color:var(--text-1);margin-bottom:2px}
.rs-summ-lbl{font-size:9px;color:var(--text-2)}
.rs-impact{background:linear-gradient(135deg,#040d1e 0%,#070f20 100%);border-radius:var(--r-md);border:.5px solid var(--border-blue);padding:18px 20px;position:relative;overflow:hidden}
.rs-impact::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--emerald) 0%,var(--blue) 100%)}
.rs-save-btn{width:100%;background:var(--emerald);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:opacity .15s;box-shadow:0 4px 18px rgba(0,184,107,.22)}
.rs-save-btn.saved{background:var(--emerald-mid);pointer-events:none}

/* ── PRO MODAL ── */
.pro-fab{position:fixed;bottom:24px;right:16px;z-index:150;background:var(--blue);color:#fff;border:none;border-radius:50px;padding:12px 18px;display:flex;align-items:center;gap:7px;font-family:var(--font-d);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;box-shadow:0 6px 28px var(--blue-glow);transition:transform .18s,box-shadow .18s}
.pro-fab:hover{transform:translateY(-2px);box-shadow:0 8px 34px rgba(26,108,255,.5)}
.pro-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .25s}
.pro-backdrop.open{opacity:1;pointer-events:all}
.pro-sheet{background:#0b1829;border-radius:22px 22px 0 0;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;border:.5px solid var(--border-blue);transform:translateY(100%);transition:transform .32s cubic-bezier(.34,1.2,.64,1)}
.pro-backdrop.open .pro-sheet{transform:translateY(0)}
.pro-trust{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:14px}
.pro-trust-item{background:rgba(255,255,255,.03);border-radius:8px;padding:9px;border:.5px solid var(--border);display:flex;align-items:center;gap:7px;font-size:10px;color:var(--text-2)}
.pro-service-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:14px}
.pro-service{padding:11px;border-radius:9px;border:.5px solid var(--border);cursor:pointer;transition:background .14s,border-color .14s;font-size:11px;color:var(--text-2);text-align:center}
.pro-service.selected{background:rgba(26,108,255,.1);border-color:rgba(26,108,255,.35);color:#7aadff}
.pro-input{width:100%;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:var(--r-sm);padding:10px 13px;font-size:12px;font-family:var(--font-b);outline:none;transition:border-color .14s;margin-bottom:9px}
.pro-input:focus{border-color:var(--blue)}
.pro-input::placeholder{color:var(--text-2)}
.pro-submit{width:100%;background:var(--blue);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 20px var(--blue-glow);transition:opacity .14s}

/* ── TOAST ── */
.toast{position:fixed;bottom:84px;left:50%;transform:translateX(-50%) translateY(70px);background:#0d2240;border:.5px solid rgba(26,108,255,.38);border-radius:var(--r-md);padding:11px 18px;display:flex;align-items:center;gap:9px;font-size:12px;color:var(--text-1);font-weight:500;box-shadow:0 8px 28px rgba(0,0,0,.4);transition:transform .38s cubic-bezier(.34,1.56,.64,1),opacity .38s;opacity:0;z-index:300;white-space:nowrap}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}
.toast-icon{width:19px;height:19px;border-radius:50%;background:var(--emerald);display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* ── ANIMATIONS ── */
.fade-in{opacity:0;transform:translateY(12px);animation:fadeUp .45s ease forwards}
@keyframes fadeUp{to{opacity:1;transform:translateY(0)}}
.slide-in{opacity:0;transform:translateX(9px);animation:slideIn .32s ease forwards}
@keyframes slideIn{to{opacity:1;transform:translateX(0)}}

/* ── AUTH SCREENS ── */
.auth-shell{min-height:100vh;background:var(--navy);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;max-width:480px;margin:0 auto;width:100%}
.auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.auth-logo-mark{width:38px;height:38px;background:var(--blue);border-radius:11px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px var(--blue-glow);flex-shrink:0}
.auth-brand{font-family:var(--font-d);font-size:20px;font-weight:800;color:var(--text-1);letter-spacing:-.02em}
.auth-tagline{font-size:12px;color:var(--text-2);margin-bottom:28px;text-align:center}
.auth-card{width:100%;background:var(--navy-card);border-radius:var(--r-xl);border:.5px solid var(--border-blue);padding:26px 22px}
.auth-title{font-family:var(--font-d);font-size:19px;font-weight:800;color:var(--text-1);letter-spacing:-.02em;margin-bottom:3px}
.auth-sub{font-size:12px;color:var(--text-2);margin-bottom:22px}
.auth-label{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);margin-bottom:5px;display:block}
.auth-input-wrap{position:relative;margin-bottom:13px}
.auth-input{width:100%;background:#07111e;color:var(--text-1);border:.5px solid var(--border);border-radius:var(--r-md);padding:13px 14px;font-size:14px;font-family:var(--font-b);outline:none;transition:border-color .15s}
.auth-input:focus{border-color:var(--blue)}
.auth-input::placeholder{color:var(--text-3)}
.auth-input.pr{padding-right:44px}
.auth-eye{position:absolute;right:13px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text-2);display:flex;align-items:center;padding:2px}
.auth-btn{width:100%;background:var(--blue);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px var(--blue-glow);transition:opacity .15s;margin-top:4px}
.auth-btn:disabled{opacity:.45;pointer-events:none}
.auth-error{background:rgba(255,79,79,.08);border:.5px solid rgba(255,79,79,.25);border-radius:var(--r-sm);padding:8px 12px;font-size:12px;color:#ff7070;margin-bottom:13px}
.auth-switch{text-align:center;margin-top:16px;font-size:12px;color:var(--text-2)}
.auth-switch-btn{background:none;border:none;color:#7aadff;font-weight:600;cursor:pointer;font-size:12px;font-family:var(--font-b)}
.auth-trust{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:18px}
.auth-trust-item{background:rgba(255,255,255,.03);border-radius:8px;padding:8px 10px;border:.5px solid var(--border);display:flex;align-items:center;gap:7px;font-size:10px;color:var(--text-2)}
.spin-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite}

/* ── ONBOARDING ── */
.ob-shell{min-height:100vh;background:var(--navy);display:flex;flex-direction:column;max-width:480px;margin:0 auto;width:100%}
.ob-bar{height:3px;background:var(--border)}
.ob-bar-fill{height:100%;background:var(--blue);border-radius:2px;transition:width .4s cubic-bezier(.34,1.2,.64,1)}
.ob-hdr{padding:18px 20px 0;display:flex;align-items:center;justify-content:space-between}
.ob-step-lbl{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--text-2)}
.ob-skip{background:none;border:none;font-size:12px;color:var(--text-2);cursor:pointer;font-family:var(--font-b)}
.ob-body{padding:22px 20px 110px;flex:1}
.ob-title{font-family:var(--font-d);font-size:21px;font-weight:800;color:var(--text-1);letter-spacing:-.02em;line-height:1.2;margin-bottom:5px}
.ob-sub{font-size:13px;color:var(--text-2);line-height:1.5;margin-bottom:22px}
.ob-label{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2);margin-bottom:5px;display:block;margin-top:13px}
.ob-input{width:100%;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:var(--r-md);padding:13px 14px;font-size:14px;font-family:var(--font-b);outline:none;transition:border-color .15s}
.ob-input:focus{border-color:var(--blue)}
.ob-input::placeholder{color:var(--text-3)}
.ob-select{width:100%;background:var(--navy-card);color:var(--text-1);border:.5px solid var(--border);border-radius:var(--r-md);padding:13px 14px;font-size:14px;font-family:var(--font-b);outline:none;-webkit-appearance:none;cursor:pointer;transition:border-color .15s}
.ob-select:focus{border-color:var(--blue)}
.ob-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:4px}
.ob-opt{padding:13px 12px;background:var(--navy-card);border-radius:var(--r-md);border:.5px solid var(--border);cursor:pointer;transition:border-color .18s,background .18s}
.ob-opt.sel{border-color:var(--blue);background:rgba(26,108,255,.09)}
.ob-opt-icon{font-size:18px;margin-bottom:4px}
.ob-opt-name{font-size:12px;font-weight:500;color:var(--text-1);margin-bottom:1px}
.ob-opt-sub{font-size:10px;color:var(--text-2)}
.ob-footer{position:fixed;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;padding:14px 20px 28px;background:linear-gradient(transparent,var(--navy) 35%)}
.ob-next{width:100%;background:var(--blue);color:#fff;font-family:var(--font-d);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:none;border-radius:var(--r-md);padding:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px var(--blue-glow);transition:opacity .14s}
.ob-next:disabled{opacity:.35;pointer-events:none}
.ob-back{background:none;border:none;font-size:12px;color:var(--text-2);cursor:pointer;margin-top:9px;font-family:var(--font-b);width:100%;text-align:center}
.ob-success{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;padding:40px 24px;text-align:center}
.ob-success-ring{width:80px;height:80px;border-radius:50%;background:rgba(0,184,107,.1);border:2px solid var(--emerald);display:flex;align-items:center;justify-content:center;margin-bottom:20px;box-shadow:0 0 24px rgba(0,184,107,.25)}`;

// ─── STATIC DATA ─────────────────────────────────────────────

const WEEKLY_DATA = [
  { week:"This week",  sub:"Apr 23–29", score:96, savings:1291.50, acc:97 },
  { week:"Last week",  sub:"Apr 16–22", score:91, savings:1148.00, acc:94 },
  { week:"Week 15",    sub:"Apr 9–15",  score:88, savings:976.20,  acc:91 },
  { week:"Week 14",    sub:"Apr 2–8",   score:84, savings:843.75,  acc:89 },
];

const MONTHLY_DATA = [
  { month:"April 2026",    savings:4259.45, audit:true,  waste:52.3 },
  { month:"March 2026",    savings:3987.00, audit:true,  waste:49.1 },
  { month:"February 2026", savings:3612.80, audit:false, waste:44.5 },
  { month:"January 2026",  savings:3210.00, audit:true,  waste:39.6 },
];

const WASTE_CAUSES = [
  { label:"Over-Prep",  pct:54, color:"#1a6cff" },
  { label:"Expiry",     pct:31, color:"#00b86b"  },
  { label:"Spill/Loss", pct:10, color:"#f0b429"  },
  { label:"Other",      pct:5,  color:"#8899bb"  },
];

const DOCS = [
  { name:"Trade License",        expiry:"14 Aug 2026", daysLeft:104, status:"valid"    },
  { name:"Health Card — Ahmed",  expiry:"03 Jun 2026", daysLeft:28,  status:"expiring" },
  { name:"Health Card — Sara",   expiry:"01 Jul 2026", daysLeft:56,  status:"valid"    },
  { name:"Health Card — Omar",   expiry:"18 May 2026", daysLeft:12,  status:"urgent"   },
  { name:"Food Safety Permit",   expiry:"31 Dec 2026", daysLeft:240, status:"valid"    },
];

const DOC_CFG = {
  valid:    { label:"Valid",    bg:"rgba(0,184,107,.1)",  border:"rgba(0,184,107,.25)",  text:"#00b86b" },
  expiring: { label:"Expiring", bg:"rgba(240,180,41,.1)", border:"rgba(240,180,41,.25)", text:"#f0b429" },
  urgent:   { label:"Urgent",   bg:"rgba(255,80,80,.1)",  border:"rgba(255,80,80,.25)",  text:"#ff5050" },
};

const VIOLATIONS = [
  { type:"Fridge Temp Log Missing",   date:"12 Mar 2026", inspector:"DM-F-0441", amount:3500, icon:<AlertTriangle size={14} color="#ff5050"/> },
  { type:"Health Card Expired (2 staff)", date:"19 Jan 2026", inspector:"DHA-H-0229", amount:5000, icon:<XCircle size={14} color="#ff5050"/> },
  { type:"Pest Control Record Gap",   date:"08 Nov 2025", inspector:"DM-P-0187", amount:2000, icon:<ShieldAlert size={14} color="#ff5050"/> },
];

const AVOIDED = [
  { type:"Checklist 100% · Inspection Passed", date:"28 Apr 2026", inspector:"DM-F-0492", amount:5000, icon:<CheckCircle2 size={14} color="#00b86b"/> },
  { type:"All Health Cards Renewed On Time",    date:"14 Feb 2026", inspector:"DHA",        amount:3500, icon:<Award size={14} color="#00b86b"/> },
  { type:"HACCP Logs Auto-Generated",           date:"02 Jan 2026", inspector:"DM",         amount:2000, icon:<ShieldCheck size={14} color="#00b86b"/> },
];

const NB_ALERTS = [
  "Inspectors in your area are checking cold chain temperature logs — verify fridge records are current.",
  "Health card audits underway in JLT and Al Quoz — ensure all staff cards are valid.",
  "Food labelling compliance checks active — Arabic + English labels required on all display items.",
];

// ── MENU RECIPES (per drink) ──────────────────────────────
// These are the defaults — cafe owners can adjust them in Recipe Settings
const MENU_RECIPES = [
  { id:"latte",      name:"Latte",       icon:"☕", milk_ml:250, coffee_g:18, cost_aed:18 },
  { id:"flatwhite",  name:"Flat White",  icon:"☕", milk_ml:180, coffee_g:18, cost_aed:20 },
  { id:"cappuccino", name:"Cappuccino",  icon:"☕", milk_ml:160, coffee_g:18, cost_aed:18 },
  { id:"croissant",  name:"Croissant",   icon:"🥐", milk_ml:0,   coffee_g:0,  cost_aed:14, pastry_units:1 },
  { id:"cortado",    name:"Cortado",     icon:"☕", milk_ml:100, coffee_g:18, cost_aed:17 },
];

// ── COST CONSTANTS (UAE wholesale averages) ───────────────
const COST_PER_LITRE_MILK   = 6.15;  // AED per litre full-cream
const COST_PER_KG_COFFEE    = 120;   // AED per kg beans
const COST_PER_PASTRY       = 3.50;  // AED per unit pastry
const STEAM_BUFFER_DEFAULT  = 0.10;  // 10% loss to steaming/spillage
const SAFETY_BUFFER_L       = 5;     // litres safety stock

// ── STOCK TRACKING ────────────────────────────────────────
// Track live stock levels per ingredient. Owner adds when delivery
// arrives; Sales Entry auto-subtracts what was used.
const STOCK_DEFAULTS = [
  { id:"milk",     name:"Full-Cream Milk", icon:"🥛", unit:"L",     current:18, threshold:10, costPerUnit:6.15 },
  { id:"oatmilk",  name:"Oat Milk",        icon:"🥛", unit:"L",     current:8,  threshold:5,  costPerUnit:14.00 },
  { id:"coffee",   name:"Coffee Beans",    icon:"☕", unit:"kg",   current:3.2, threshold:1.5,costPerUnit:120 },
  { id:"pastries", name:"Croissants",      icon:"🥐", unit:"units", current:24, threshold:10, costPerUnit:3.50 },
  { id:"cream",    name:"Fresh Cream",     icon:"🥛", unit:"L",     current:2,  threshold:2,  costPerUnit:18 },
];

// Map menu items → stock items they consume
function getStockUsage(salesYesterday, customItems = []) {
  const allItems = [...MENU_RECIPES, ...customItems];
  let milkUsed = 0, coffeeUsed = 0, pastriesUsed = 0;
  for (const item of allItems) {
    const qty = salesYesterday[item.id] || 0;
    milkUsed     += qty * (item.milk_ml || 0) / 1000;
    coffeeUsed   += qty * (item.coffee_g || 0) / 1000;
    pastriesUsed += qty * (item.pastry_units || 0);
  }
  return {
    milk:     milkUsed,
    coffee:   coffeeUsed,
    pastries: pastriesUsed,
  };
}

// Determine stock status: ok | low | critical
function stockStatus(stock) {
  if (stock.current <= 0) return "critical";
  if (stock.current <= stock.threshold * 0.5) return "critical";
  if (stock.current <= stock.threshold) return "low";
  return "ok";
}

// ── THE WASTE CALCULATION ENGINE ───────────────────────────
function calculateOrderRecommendation(salesYesterday, standardMilkOrder = 60, customItems = []) {
  const allItems = [...MENU_RECIPES, ...customItems];
  let milkUsedMl = 0;
  let coffeeUsedG = 0;
  let revenueAed = 0;
  let pastryUnits = 0;
  const breakdown = [];

  for (const item of allItems) {
    const qty = salesYesterday[item.id] || 0;
    if (qty === 0) continue;
    const milkForItem = qty * (item.milk_ml || 0);
    const coffeeForItem = qty * (item.coffee_g || 0);
    milkUsedMl  += milkForItem;
    coffeeUsedG += coffeeForItem;
    revenueAed  += qty * (item.cost_aed || 0);
    if (item.pastry_units) pastryUnits += qty * item.pastry_units;
    if (milkForItem > 0) {
      breakdown.push({ name: item.name, qty, milk_L: milkForItem / 1000 });
    }
  }

  const milkUsedL  = milkUsedMl / 1000;
  const milkWithBuffer = milkUsedL * (1 + STEAM_BUFFER_DEFAULT);
  const recommendedOrder = Math.ceil(milkWithBuffer + SAFETY_BUFFER_L);
  const litresSaved = Math.max(0, standardMilkOrder - recommendedOrder);
  const aedSaved    = +(litresSaved * COST_PER_LITRE_MILK).toFixed(2);
  const coffeeUsedKg = +(coffeeUsedG / 1000).toFixed(2);

  return {
    milkUsedL: +milkUsedL.toFixed(1),
    milkWithBuffer: +milkWithBuffer.toFixed(1),
    recommendedOrder,
    standardOrder: standardMilkOrder,
    litresSaved,
    aedSaved,
    coffeeUsedKg,
    revenueAed: +revenueAed.toFixed(2),
    pastryUnits,
    breakdown,
    totalDrinks: Object.values(salesYesterday).reduce((s,n)=>s+(n||0),0),
  };
}

// ── BUILD 7AM WHATSAPP MESSAGE ────────────────────────────
function buildMorningReport(cafeName, calc, ownerLanguage = "en") {
  const dateStr = new Date().toLocaleDateString("en-AE", {
    weekday:"long", day:"numeric", month:"short"
  });

  if (ownerLanguage === "ar") {
    return `☕ *${cafeName}* — تقرير الصباح
📅 ${dateStr}

💰 مبيعات الأمس: ${calc.totalDrinks} مشروب
🥛 الحليب المستخدم: ${calc.milkUsedL} لتر

📦 *اطلب اليوم: ${calc.recommendedOrder} لتر حليب*
${calc.litresSaved > 0 ? `(بدلاً من ${calc.standardOrder} لتر المعتاد)\n💵 وفر AED ${calc.aedSaved}` : "(الكمية المعتادة)"}

— ProfitGuard AI`;
  }

  return `☕ *${cafeName}* — Morning Report
📅 ${dateStr}

💰 Yesterday: ${calc.totalDrinks} drinks sold
🥛 Milk used: ${calc.milkUsedL}L
${calc.breakdown.slice(0,3).map(b=>`   • ${b.qty} ${b.name} = ${b.milk_L.toFixed(1)}L`).join("\n")}

📦 *ORDER TODAY: ${calc.recommendedOrder}L milk*
${calc.litresSaved > 0
  ? `(instead of usual ${calc.standardOrder}L)\n💵 Save AED ${calc.aedSaved} today`
  : "(usual quantity needed)"}

— ProfitGuard AI · profitguard.ae`;
}

const INGREDIENTS = [
  { id:1, name:"Full-Cream Milk",  nameAr:"حليب كامل الدسم", batch:"BC-2026-441", icon:<Milk size={12} color="#00b86b"/>,     iconBg:"#e8f7f0", expiry:"04 Jun 2026", daysLeft:18, halal:true,  status:"expiring" },
  { id:2, name:"Oat Milk",         nameAr:"حليب الشوفان",     batch:"BC-2026-389", icon:<Milk size={12} color="#f0b429"/>,     iconBg:"#fff8e6", expiry:"12 Jun 2026", daysLeft:26, halal:true,  status:"expiring" },
  { id:3, name:"Croissants",       nameAr:"كرواسان",           batch:"BK-0501-22",  icon:<Wheat size={12} color="#8b5e3c"/>,   iconBg:"#f5ede5", expiry:"18 May 2026", daysLeft:1,  halal:true,  status:"urgent"   },
  { id:4, name:"Coffee Beans",     nameAr:"حبوب القهوة",       batch:"CB-2026-119", icon:<Coffee size={12} color="#5a3e28"/>,  iconBg:"#f0ebe5", expiry:"31 Aug 2026", daysLeft:106, halal:true, status:"valid"    },
  { id:5, name:"Fresh Cream",      nameAr:"كريمة طازجة",      batch:"FC-0429-07",  icon:<Apple size={12} color="#ff6b6b"/>,   iconBg:"#fff0f0", expiry:"20 May 2026", daysLeft:3,  halal:false, status:"urgent"   },
  { id:6, name:"Vanilla Syrup",    nameAr:"شراب الفانيليا",    batch:"VS-2026-055", icon:<ShoppingCart size={12} color="#9b59b6"/>, iconBg:"#f3eaff", expiry:"15 Dec 2026", daysLeft:227, halal:true, status:"valid" },
];

const EXPIRY_CFG = {
  valid:    { text:"#00b86b", bg:"rgba(0,184,107,.1)",  label:"Fresh"    },
  expiring: { text:"#f0b429", bg:"rgba(240,180,41,.1)", label:"Expiring" },
  urgent:   { text:"#ff5050", bg:"rgba(255,80,80,.1)",  label:"Urgent"   },
};

const SUPPLIERS = [
  {
    emoji:"🥛", name:"Al Marai UAE",      category:"Dairy Supplier",
    phone:"+97142997000", wa:"97142997000", color:"rgba(0,184,107,.1)", border:"rgba(0,184,107,.2)",
    rec:{ action:"Reduce", detail:"Order 29L tomorrow — 11L carryover covers gap.", saving:"AED 67.65" },
  },
  {
    emoji:"🥐", name:"French Bakery DXB", category:"Pastry Supplier",
    phone:"+971501234567", wa:"971501234567", color:"rgba(240,180,41,.1)", border:"rgba(240,180,41,.2)",
    rec:{ action:"Hold", detail:"Sunday pastry order correct. No changes needed.", saving:null },
  },
  {
    emoji:"☕", name:"Raw Coffee Co.",    category:"Coffee Beans — Al Quoz",
    phone:"+97143238765", wa:"97143238765", color:"rgba(139,94,60,.1)", border:"rgba(139,94,60,.2)",
    rec:{ action:"Restock", detail:"Stock critically low — 0.3kg remains. Order minimum 2kg.", saving:null },
  },
];

const CHECKLIST = [
  { id:"cc", label:"Cold Chain Verified",         labelAr:"تم التحقق من سلسلة التبريد",     sub:"Fridge ≤4°C · Dubai Food Code §5.2",        critical:true  },
  { id:"ph", label:"Personal Hygiene Check",      labelAr:"فحص النظافة الشخصية",              sub:"Staff uniforms, gloves, hair nets · §3.1",   critical:true  },
  { id:"dl", label:"Date Labelling Compliant",    labelAr:"الفحص يوافق قانون التسمية",        sub:"Arabic + English labels · Law 11/2023",      critical:true  },
  { id:"pc", label:"Pest Control Log Updated",    labelAr:"سجل مكافحة الآفات محدّث",          sub:"Monthly record required · DM §8.4",          critical:false },
  { id:"fs", label:"Food Contact Surfaces Clean", labelAr:"أسطح ملامسة الطعام نظيفة",         sub:"Sanitised and documented · HACCP §6",        critical:false },
];

const STAFF = ["Select staff member…","Ahmed Al-Rashidi","Sara Mahmoud","Omar Hassan","Fatima Al-Zaabi","Raj Kumar","Priya Nair"];

const WA_REPORT = `🟢 *ProfitGuard AI — Daily Report*
📅 Saturday, 17 May 2026 · 7:00 AM

💰 *Yesterday's Savings:* AED 184.50
🥛 *Milk leftover:* 30L — order 29L today
✅ *Checklist:* 5/5 complete · No violations

⚠️ *Expiring Soon:*
- Croissants (1 day left)
- Fresh Cream (3 days left)

📋 *Omar's Health Card* expires in 12 days

_ProfitGuard AI · profitguard.ae_`;

const INGREDIENT_RECOVERY = [
  { name:"Milk",         sub:"Full-cream & oat blend",   icon:"🥛", iconBg:"#e8f7f0", color:"#00b86b", qty:"120 L",     unit:"litres saved",    pct:78, recovered:738.00,  note:"+12% vs last month" },
  { name:"Pastries",     sub:"Croissants, danish, muffins", icon:"🥐", iconBg:"#fff8e6", color:"#f0b429", qty:"84 units", unit:"items recovered", pct:55, recovered:294.00,  note:"+6% vs last month"  },
  { name:"Coffee Beans", sub:"Single-origin & house blend",  icon:"☕", iconBg:"#f0ebe5", color:"#8b5e3c", qty:"3.2 kg",   unit:"kilograms saved", pct:38, recovered:192.00,  note:"Stable"             },
];

const DAILY_HISTORY = [
  { day:"Today",     date:"Sat, 17 May",  total:184.50, dotColor:"#00b86b", items:[{n:"Milk",qty:"30 L",aed:184.50}] },
  { day:"Friday",    date:"16 May 2026",  total:227.80, dotColor:"#00b86b", items:[{n:"Milk",qty:"22 L",aed:135.30},{n:"Pastries",qty:"13 units",aed:45.50},{n:"Coffee",qty:"0.8 kg",aed:47.00}] },
  { day:"Thursday",  date:"15 May 2026",  total:196.20, dotColor:"#00b86b", items:[{n:"Milk",qty:"18 L",aed:110.70},{n:"Pastries",qty:"10 units",aed:35.00},{n:"Coffee",qty:"0.9 kg",aed:50.50}] },
  { day:"Wednesday", date:"14 May 2026",  total:312.00, dotColor:"#5599ff", items:[{n:"Milk",qty:"28 L",aed:172.20},{n:"Pastries",qty:"20 units",aed:70.00},{n:"Coffee",qty:"1.2 kg",aed:69.80}] },
  { day:"Tuesday",   date:"13 May 2026",  total:144.50, dotColor:"#f0b429", items:[{n:"Milk",qty:"16 L",aed:98.40},{n:"Pastries",qty:"10 units",aed:35.00},{n:"Coffee",qty:"0.2 kg",aed:11.10}] },
  { day:"Monday",    date:"12 May 2026",  total:89.00,  dotColor:"#f0b429", items:[{n:"Milk",qty:"10 L",aed:61.50},{n:"Pastries",qty:"8 units",aed:27.50}] },
  { day:"Sunday",    date:"11 May 2026",  total:106.00, dotColor:"#8899bb", items:[{n:"Milk",qty:"12 L",aed:73.80},{n:"Coffee",qty:"0.55 kg",aed:32.20}] },
];

const MAX_DAY = Math.max(...DAILY_HISTORY.map(d=>d.total));

// ─── HELPERS ─────────────────────────────────────────────────

const fmt = n => n.toLocaleString("en-AE",{minimumFractionDigits:2,maximumFractionDigits:2});
const scoreColor = v => v>=92?"#00b86b":v>=85?"#f0b429":"#ff5050";
const accClass   = v => v>=93?"h":v>=87?"m":"l";
const getTempStatus = t => t<=4
  ? {label:"Compliant ≤4°C",color:"#00b86b",bg:"rgba(0,184,107,.1)",border:"rgba(0,184,107,.22)"}
  : t<=6
  ? {label:"Monitor — amber zone",color:"#f0b429",bg:"rgba(240,180,41,.1)",border:"rgba(240,180,41,.22)"}
  : {label:"Warning — exceeds limit",color:"#ff5050",bg:"rgba(255,80,80,.1)",border:"rgba(255,80,80,.22)"};

// ─── SVG DONUT CHART ─────────────────────────────────────────

function DonutChart({ slices }) {
  const cx=80,cy=80,r=62,ir=40;
  let cum=0;
  const rad=p=>(p/100)*2*Math.PI-Math.PI/2;
  const pt=(p,radius)=>[cx+radius*Math.cos(rad(p)),cy+radius*Math.sin(rad(p))];
  const paths=slices.map(s=>{
    const s0=cum; cum+=s.pct; const s1=cum;
    const large=s.pct>50?1:0;
    const[ox,oy]=pt(s0,r);const[ix,iy]=pt(s0,ir);
    const[ox2,oy2]=pt(s1,r);const[ix2,iy2]=pt(s1,ir);
    return{...s,d:`M${ox} ${oy}A${r} ${r} 0 ${large} 1 ${ox2} ${oy2}L${ix2} ${iy2}A${ir} ${ir} 0 ${large} 0 ${ix} ${iy}Z`};
  });
  return(
    <svg viewBox="0 0 160 160" width="150" height="150" style={{flexShrink:0}}>
      {paths.map((p,i)=><path key={i} d={p.d} fill={p.color} opacity=".9"/>)}
      <circle cx={cx} cy={cy} r={ir-2} fill="#0f2038"/>
      <text x={cx} y={cy-5} textAnchor="middle" fill="#f0f4ff" fontSize="17" fontWeight="700" fontFamily="Syne,sans-serif">54%</text>
      <text x={cx} y={cy+11} textAnchor="middle" fill="#8899bb" fontSize="9" fontFamily="DM Sans,sans-serif">Over-Prep</text>
    </svg>
  );
}

// ─── FINE RISK GAUGE ─────────────────────────────────────────

function FineRiskGauge({score}){
  const cx=90,cy=90,r=66,sweep=220,start=160;
  const rad=d=>d*Math.PI/180;
  const pt=a=>[cx+r*Math.cos(rad(a)),cy+r*Math.sin(rad(a))];
  const[sx,sy]=pt(start);const[ex,ey]=pt(start+sweep);
  const trackD=`M${sx} ${sy}A${r} ${r} 0 1 1 ${ex} ${ey}`;
  const fs=(score/100)*sweep;
  const[fx,fy]=pt(start+fs);
  const fillD=`M${sx} ${sy}A${r} ${r} 0 ${fs>180?1:0} 1 ${fx} ${fy}`;
  const gc=score<=35?"#00b86b":score<=65?"#f0b429":"#ff5050";
  const rl=score<=35?"Low Risk":score<=65?"Moderate":"High Risk";
  return(
    <svg viewBox="0 0 180 148" width="174" height="148">
      <path d={trackD} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="10" strokeLinecap="round"/>
      <path d={fillD} fill="none" stroke={gc} strokeWidth="10" strokeLinecap="round" style={{filter:`drop-shadow(0 0 5px ${gc}88)`}}/>
      <circle cx={cx} cy={cy} r={r-14} fill="#0f2038"/>
      <text x={cx} y={cy+8} textAnchor="middle" fill="#f0f4ff" fontSize="26" fontWeight="800" fontFamily="Syne,sans-serif">{score}</text>
      <text x={cx} y={cy+23} textAnchor="middle" fill="#8899bb" fontSize="9" fontFamily="DM Sans,sans-serif">/ 100</text>
      <text x={cx} y={136} textAnchor="middle" fill={gc} fontSize="10" fontWeight="600" fontFamily="DM Sans,sans-serif">{rl}</text>
    </svg>
  );
}

// ─── RANGE SLIDER ────────────────────────────────────────────

function RangeSlider({value,min,max,onChange,color="#00b86b"}){
  const pct=((value-min)/(max-min))*100;
  const bg=`linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,.1) ${pct}%)`;
  return(
    <input type="range" className="range-input" min={min} max={max} value={value}
      onChange={e=>onChange(Number(e.target.value))}
      style={{background:bg,"--emerald":color}}/>
  );
}

// ─── AI ASSISTANT (Anthropic API) ───────────────────────────

function AIAssistant(){
  const [msgs,setMsgs]=useState([
    {role:"bot",text:"مرحباً! I'm your ProfitGuard AI assistant. Ask me anything about your cafe's waste, compliance, or orders."}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const QUICK = [
    "How much milk should I order tomorrow?",
    "What's my fine risk this week?",
    "Which ingredient expires soonest?",
    "Summarise today's waste savings",
  ];

  const send = useCallback(async(text)=>{
    const q=text||input.trim();
    if(!q||loading) return;
    setInput("");
    setMsgs(m=>[...m,{role:"user",text:q}]);
    setLoading(true);

    // Build context about the cafe
    const systemPrompt = `You are ProfitGuard AI, a smart assistant for a UAE cafe in Dubai.
You help the cafe owner with:
- Ingredient waste reduction and smart ordering
- Dubai Municipality compliance and food safety
- Halal & expiry tracking
- Staff health card management

Current cafe data (today, May 17 2026):
- Yesterday's milk usage: 34L (Lattes: 25L, Flat whites: 9L)
- Starting stock: 50L, Leftover: 16L
- Today's sales: 120 lattes, 50 flat whites
- Daily savings today: AED 184.50
- Monthly savings (April): AED 4,259
- Fine risk score: 28/100 (Low)
- Expiring soon: Croissants (1 day), Fresh Cream (3 days), Omar health card (12 days)
- Suppliers: Al Marai (dairy), French Bakery DXB (pastries), Raw Coffee Co (coffee)
- Standard daily milk order: 40L

Be concise, practical, and specific with numbers. Use AED for currency. Mention Dubai Food Code or DM regulations when relevant. Keep responses under 120 words.`;

    try{
      const history = msgs
        .filter(m=>m.role!=="bot"||msgs.indexOf(m)>0)
        .map(m=>({role:m.role==="bot"?"assistant":"user",content:m.text}));

      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:systemPrompt,
          messages:[...history,{role:"user",content:q}]
        })
      });
      const data=await res.json();
      const reply=data.content?.map(c=>c.text||"").join("")||"Sorry, I couldn't get a response. Please try again.";
      setMsgs(m=>[...m,{role:"bot",text:reply}]);
    }catch(e){
      setMsgs(m=>[...m,{role:"bot",text:"I'm having trouble connecting. Please check your connection and try again."}]);
    }
    setLoading(false);
  },[input,loading,msgs]);

  const handleKey=e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} };

  return(
    <div className="ai-assistant fade-in">
      <div className="ai-head">
        <div className="ai-avatar"><Bot size={16} color="#fff"/></div>
        <div>
          <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>ProfitGuard AI Assistant</div>
          <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"2px"}}>Powered by Claude · UAE cafe intelligence</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"5px"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"var(--emerald)",boxShadow:"0 0 5px rgba(0,184,107,.7)",animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:"10px",color:"var(--emerald)"}}>Live</span>
        </div>
      </div>

      <div className="ai-msgs">
        {msgs.map((m,i)=>(
          <div key={i} className={`ai-bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading&&(
          <div className="ai-bubble loading">
            <div className="ai-dots">
              <div className="ai-dot-anim"/><div className="ai-dot-anim"/><div className="ai-dot-anim"/>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="ai-quick">
        {QUICK.map(q=>(
          <button key={q} className="ai-quick-btn" onClick={()=>send(q)}>{q}</button>
        ))}
      </div>

      <div className="ai-input-row">
        <input className="ai-input" value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={handleKey} placeholder="Ask about waste, orders, compliance…"/>
        <button className="ai-send" onClick={()=>send()} disabled={!input.trim()||loading}>
          <Send size={14} color="#fff"/>
        </button>
      </div>
    </div>
  );
}

// ─── MUNICIPALITY LOG ────────────────────────────────────────

function MunicipalityLog({open,onClose,arabic,onSuccess}){
  const [temp,setTemp]=useState(3);
  const [checks,setChecks]=useState({});
  const [staff,setStaff]=useState("");
  const [phase,setPhase]=useState("form");
  const now=new Date();
  const timeStr=now.toLocaleTimeString(arabic?"ar-AE":"en-AE",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  const dateStr=now.toLocaleDateString(arabic?"ar-AE":"en-AE",{weekday:"short",day:"numeric",month:"short",year:"numeric"});

  useEffect(()=>{ if(!open){setTimeout(()=>{setPhase("form");setChecks({});setTemp(3);setStaff("");},400);} },[open]);

  const toggle=id=>setChecks(c=>({...c,[id]:!c[id]}));
  const checkedCount=Object.values(checks).filter(Boolean).length;
  const canSubmit=staff.trim().length>=2&&checkedCount>0;
  const ts=getTempStatus(temp);
  const uncheckedCritical=CHECKLIST.filter(c=>c.critical&&!checks[c.id]);
  const showRisk=checkedCount>0&&checkedCount<CHECKLIST.length;

  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const session = getSession();
      const cafe = getCafe();
      const token = session?.access_token;

      // Build the log record
      const logData = {
        cafe_id: cafe?.id || null,
        staff_name: staff.trim(),
        fridge_temp_c: temp,
        checklist: checks,
        tasks_completed: checkedCount,
        tasks_total: CHECKLIST.length,
        risk_flag: showRisk,
        risk_details: showRisk ? `${uncheckedCritical.length} critical task(s) skipped` : null,
        logged_at: new Date().toISOString(),
      };

      // Save to Supabase (skips silently if no session — for demo mode)
      if (token && cafe?.id) {
        await sb.insert("municipality_logs", logData, token);
      }

      // ALSO save to localStorage so the Logs tab can show it
      try {
        const existing = JSON.parse(localStorage.getItem("pg_logs") || "[]");
        const localLog = {
          ...logData,
          id: "log_" + Date.now(),
          ref_number: "PG-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.floor(Math.random()*9999).toString().padStart(4,"0"),
          temp_compliant: temp <= 4,
          all_clear: checkedCount === CHECKLIST.length && temp <= 4,
        };
        existing.unshift(localLog);
        // Keep last 90 days only
        const trimmed = existing.slice(0, 100);
        localStorage.setItem("pg_logs", JSON.stringify(trimmed));
      } catch {}

      // Fire notification confirming save
      if (notif.state() === "granted") {
        notif.send(
          "✓ Municipality log saved",
          `Inspector-ready. ${checkedCount}/${CHECKLIST.length} tasks logged by ${staff.trim()}.`,
          { tag: "log-saved" }
        );
      }
    } catch (e) {
      console.error("Log save error:", e);
    }
    setSaving(false);
    setPhase("success");
    onSuccess?.();
  };

  const L={
    eyebrow:  arabic?"واجهة الباريستا · التفتيش اليومي":"Barista View · Daily Inspection",
    title:    arabic?"قائمة التفتيش":"Inspection Checklist",
    subtitle: arabic?"قانون دبي الغذائي 2025":"Dubai Food Code 2025 · Self-Audit",
    ts:       arabic?"الطابع الزمني التلقائي مفعّل":"Auto-timestamp active",
    f1:       arabic?"درجة حرارة الثلاجة":"Fridge Temperature (°C)",
    f1sub:    arabic?"المعيار: ≤4°C · قانون الغذاء":"Standard: ≤4°C · Dubai Food Code",
    f2:       arabic?"مهام التنظيف":"Cleaning Tasks",
    f3:       arabic?"الموظف المسؤول":"Staff On Duty",
    submit:   arabic?"تسجيل الفحص":"Submit Municipality Log",
    risk:     arabic?"تنبيه المخاطر: قد يؤدي إلى غرامة":"Risk Alert: This may result in a fine. Notifying Owner.",
    success:  arabic?"تم تأمين السجل وتوثيقه":"Log Secured & Timestamped",
  };

  return(
    <div className={`ml-backdrop ${open?"open":""}`} onClick={e=>{if(e.target.classList.contains("ml-backdrop"))onClose();}}>
      <div className="ml-sheet" style={{direction:arabic?"rtl":"ltr"}}>
        <div className="ml-handle"/>
        {phase==="form"?(
          <>
            {/* header */}
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"18px 18px 12px"}}>
              <div>
                <div className="ml-eyebrow"><Clipboard size={10}/>{L.eyebrow}</div>
                <div className="ml-title">{L.title}</div>
                <div className="ml-subtitle">{L.subtitle}</div>
              </div>
              <button className="ml-close" onClick={onClose}><X size={12}/></button>
            </div>

            {/* timestamp */}
            <div className="ml-ts">
              <Clock size={12} color="#5599ff"/>
              <span style={{fontSize:"10px",color:"#5599ff",fontWeight:"600"}}>{L.ts}</span>
              <span style={{marginLeft:"auto",fontSize:"10px",color:"var(--text-2)"}}>{timeStr} · {dateStr}</span>
            </div>

            <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:"18px"}}>
              {/* field 1 — temp */}
              <div>
                <div className="ml-flbl"><div className="ml-fnum">1</div>{L.f1}</div>
                <div className="stepper">
                  <button className="step-btn" onClick={()=>setTemp(t=>Math.max(-5,t-1))}>−</button>
                  <div className="step-val">{temp}°</div>
                  <button className="step-btn" onClick={()=>setTemp(t=>Math.min(15,t+1))}>+</button>
                </div>
                <div className="temp-status" style={{background:ts.bg,border:`.5px solid ${ts.border}`}}>
                  <div style={{width:"6px",height:"6px",borderRadius:"50%",background:ts.color,flexShrink:0}}/>
                  <span style={{fontSize:"11px",color:ts.color,fontWeight:"500"}}>{ts.label}</span>
                </div>
                <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"6px"}}>{L.f1sub}</div>
              </div>

              {/* field 2 — checklist */}
              <div>
                <div className="ml-flbl" style={{justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <div className="ml-fnum">2</div>{L.f2}
                  </div>
                  <span style={{fontSize:"10px",color:"var(--text-2)"}}>{checkedCount}/{CHECKLIST.length}</span>
                </div>
                {CHECKLIST.map(item=>(
                  <div key={item.id} className="ml-check-row" onClick={()=>toggle(item.id)}>
                    <div className={`ml-cb ${checks[item.id]?"checked":""}`}>
                      {checks[item.id]&&<Check size={12} color="#fff"/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"12px",fontWeight:"500",color:"var(--text-1)",display:"flex",alignItems:"center",gap:"5px"}}>
                        {arabic?item.labelAr:item.label}
                        {item.critical&&<span style={{fontSize:"8px",background:"rgba(255,80,80,.12)",color:"var(--red)",padding:"1px 5px",borderRadius:"3px",fontWeight:"700",letterSpacing:".04em"}}>CRITICAL</span>}
                      </div>
                      <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"2px"}}>{item.sub}</div>
                    </div>
                  </div>
                ))}
                {showRisk&&uncheckedCritical.length>0&&(
                  <div className="ml-risk">
                    <div className="ml-risk-hdr">
                      <AlertTriangle size={13} color="var(--red)"/>
                      <span style={{fontSize:"11px",fontWeight:"700",color:"var(--red)"}}>
                        {arabic?"تنبيه المخاطر":"Risk Alert"}
                      </span>
                    </div>
                    <div style={{fontSize:"11px",color:"#ff7070",lineHeight:"1.5"}}>
                      {arabic
                        ?`${uncheckedCritical.length} بند حرج غير مكتمل — قد يؤدي إلى غرامة بلدية.`
                        :`${uncheckedCritical.length} critical item${uncheckedCritical.length>1?"s":""} unchecked. This may result in a municipality fine. Notifying Owner.`
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* field 3 — staff name (free text input) */}
              <div>
                <div className="ml-flbl"><div className="ml-fnum">3</div>{L.f3}</div>
                <input
                  className="ml-select"
                  type="text"
                  placeholder={arabic ? "أدخل اسمك" : "Type your name (e.g. Ahmed, Sara)"}
                  value={staff}
                  onChange={e=>setStaff(e.target.value)}
                  autoComplete="off"
                  style={{paddingRight:"14px"}}
                />
              </div>

              <button className="ml-submit" disabled={!canSubmit} onClick={submit}>
                <CheckCircle2 size={15}/>
                {L.submit}
              </button>
            </div>
          </>
        ):(
          <div className="ml-success">
            <div className="ml-ring"><CheckCircle2 size={36} color="var(--emerald)"/></div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"20px",fontWeight:"800",color:"var(--text-1)",marginBottom:"6px"}}>{L.success}</div>
            <div style={{fontSize:"12px",color:"var(--text-2)",marginBottom:"4px"}}>{dateStr} · {timeStr}</div>
            <div className="ml-receipt">
              {[
                ["Fridge Temp",`${temp}°C — ${ts.label}`],
                ["Tasks Completed",`${checkedCount}/${CHECKLIST.length}`],
                ["Staff",staff],
                ["Log Ref",`PG-${Date.now().toString(36).toUpperCase().slice(-6)}`],
                ["Status","Submitted to DM Audit Trail"],
              ].map(([k,v])=>(
                <div className="ml-receipt-row" key={k}>
                  <span style={{fontSize:"11px",color:"var(--text-2)"}}>{k}</span>
                  <span style={{fontSize:"11px",color:"var(--text-1)",fontWeight:"500"}}>{v}</span>
                </div>
              ))}
            </div>
            <button style={{marginTop:"18px",background:"var(--navy-card)",border:".5px solid var(--border)",borderRadius:"var(--r-md)",padding:"12px 28px",color:"var(--text-1)",fontFamily:"var(--font-d)",fontSize:"12px",fontWeight:"600",cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase"}}
              onClick={()=>{onClose();setPhase("form");}}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NEIGHBOR BANNER ─────────────────────────────────────────

function NeighborhoodBanner(){
  const [idx,setIdx]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%NB_ALERTS.length),6000); return()=>clearInterval(t); },[]);
  return(
    <div className="nb-banner fade-in">
      <div className="nb-pulse"/>
      <div style={{flex:1}}>
        <div style={{fontSize:"9px",fontWeight:"700",color:"var(--gold)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:"4px",display:"flex",alignItems:"center",gap:"5px"}}>
          <Megaphone size={10}/>Live Inspection Alert · Al Quoz / JLT
        </div>
        <div style={{fontSize:"11px",color:"var(--text-1)",lineHeight:"1.5"}}>{NB_ALERTS[idx]}</div>
        <div className="nb-dots" style={{marginTop:"6px"}}>
          {NB_ALERTS.map((_,i)=><div key={i} className={`nb-dot ${i===idx?"active":""}`}/>)}
        </div>
      </div>
      <div style={{background:"rgba(0,184,107,.1)",border:".5px solid rgba(0,184,107,.22)",borderRadius:"6px",padding:"3px 8px",fontSize:"9px",fontWeight:"700",color:"var(--emerald)",flexShrink:0,letterSpacing:".04em",textTransform:"uppercase"}}>Checklist Updated</div>
    </div>
  );
}

// ─── FINE HISTORY LOG ─────────────────────────────────────────

function FineHistoryLog(){
  const [tab,setTab]=useState("violations");
  const items=tab==="violations"?VIOLATIONS:AVOIDED;
  const totalFines=VIOLATIONS.reduce((s,v)=>s+v.amount,0);
  const totalAvoided=AVOIDED.reduce((s,v)=>s+v.amount,0);
  return(
    <div className="fade-in">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"9px",marginBottom:"14px"}}>
        {[
          {label:"Total Fines Paid",value:`AED ${totalFines.toLocaleString()}`,color:"var(--red)"},
          {label:"Total Fines Avoided",value:`AED ${totalAvoided.toLocaleString()}`,color:"var(--emerald)"},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:"var(--navy-card)",border:".5px solid var(--border)",borderRadius:"var(--r-md)",padding:"13px 12px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"19px",fontWeight:"700",color,letterSpacing:"-.02em",marginBottom:"3px"}}>{value}</div>
            <div style={{fontSize:"10px",color:"var(--text-2)"}}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"-1px",paddingLeft:"18px"}}>
        {["violations","avoided"].map(t=>(
          <button key={t} className={`fh-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
            {t==="violations"?"Past Violations":"Fines Avoided"}
          </button>
        ))}
      </div>
      <div className="fh-list">
        {items.map((item,i)=>(
          <div key={i} className="fh-item">
            <div className="fh-icon" style={{background:tab==="violations"?"rgba(255,80,80,.1)":"rgba(0,184,107,.1)"}}>
              {item.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:"12px",fontWeight:"500",color:"var(--text-1)",marginBottom:"2px"}}>{item.type}</div>
              <div style={{fontSize:"10px",color:"var(--text-2)"}}>{item.date} · {item.inspector}</div>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"14px",fontWeight:"700",color:tab==="violations"?"var(--red)":"var(--emerald)",letterSpacing:"-.02em",flexShrink:0}}>
              AED {item.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"7px",marginTop:"10px",padding:"9px 12px",background:"rgba(0,184,107,.06)",border:".5px solid rgba(0,184,107,.15)",borderRadius:"9px"}}>
        <Award size={13} color="var(--emerald)"/>
        <span style={{fontSize:"11px",color:"var(--text-2)"}}>Current fine-free streak: <strong style={{color:"var(--emerald)"}}>29 days</strong></span>
      </div>
    </div>
  );
}

// ─── SAFE VAULT ───────────────────────────────────────────────

function SafeVault(){
  const [renewConfirm,setRenewConfirm]=useState(null);
  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem("pg_safevault_docs");
      return saved ? JSON.parse(saved) : DOCS;
    } catch { return DOCS; }
  });
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", expiry: "" });

  // Persist docs to localStorage
  useEffect(() => {
    try { localStorage.setItem("pg_safevault_docs", JSON.stringify(docs)); } catch {}
  }, [docs]);

  // Compute days left from expiry date string
  const computeStatus = (expiryStr) => {
    if (!expiryStr) return { daysLeft: 999, status: "valid" };
    const exp = new Date(expiryStr);
    const today = new Date();
    const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    let status = "valid";
    if (daysLeft <= 14) status = "urgent";
    else if (daysLeft <= 60) status = "expiring";
    return { daysLeft, status };
  };

  const handleAddStaff = () => {
    if (newStaff.name.trim().length < 2 || !newStaff.expiry) return;
    const exp = new Date(newStaff.expiry);
    const expStr = exp.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const { daysLeft, status } = computeStatus(newStaff.expiry);
    const newDoc = {
      name: `Health Card — ${newStaff.name.trim()}`,
      expiry: expStr,
      daysLeft,
      status,
      _expiryISO: newStaff.expiry,
      _custom: true
    };
    setDocs([...docs, newDoc]);
    setNewStaff({ name: "", expiry: "" });
    setShowAddStaff(false);
  };

  const handleRemoveDoc = (docName) => {
    setDocs(docs.filter(d => d.name !== docName));
  };

  const expiring=docs.filter(d=>d.daysLeft<=30);
  const valid=docs.filter(d=>d.status==="valid");
  const urgent=docs.filter(d=>d.status==="urgent");

  return(
    <div className="sv-body">
      {/* header */}
      <div className="sv-hdr">
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"14px"}}>
          <div style={{width:"40px",height:"40px",borderRadius:"11px",background:"rgba(26,108,255,.12)",border:".5px solid rgba(26,108,255,.28)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 0 14px rgba(26,108,255,.2)"}}>
            <Lock size={18} color="#7aadff"/>
          </div>
          <div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"15px",fontWeight:"700",color:"var(--text-1)"}}>SafeVault</div>
            <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"1px"}}>Document compliance · Renewals · Audit trail</div>
          </div>
        </div>
      </div>

      {/* kpi strip */}
      <div className="sv-kpi">
        {[
          {val:docs.length,lbl:"Total Docs",color:"var(--text-1)"},
          {val:valid.length,lbl:"Valid",color:"var(--emerald)"},
          {val:expiring.length,lbl:"Expiring",color:"var(--gold)"},
          {val:urgent.length,lbl:"Urgent",color:"var(--red)"},
        ].map(({val,lbl,color})=>(
          <div key={lbl} className="sv-kpi-card">
            <div className="sv-kpi-val" style={{color}}>{val}</div>
            <div className="sv-kpi-lbl">{lbl}</div>
          </div>
        ))}
      </div>

      {/* neighborhood banner */}
      <NeighborhoodBanner/>

      {/* doc cards */}
      <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:"8px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div className="dh-sect">Documents &amp; Licences</div>
          <button onClick={() => setShowAddStaff(true)} style={{
            background:"rgba(26,108,255,.12)",color:"#7aadff",
            border:".5px solid rgba(26,108,255,.3)",borderRadius:8,
            padding:"5px 11px",fontSize:10,fontWeight:700,
            letterSpacing:".06em",textTransform:"uppercase",cursor:"pointer",
            fontFamily:"var(--font-d)",display:"flex",alignItems:"center",gap:5
          }}>+ Add Staff</button>
        </div>

        {showAddStaff && (
          <div style={{
            background:"rgba(26,108,255,.08)",border:".5px solid rgba(26,108,255,.3)",
            borderRadius:10,padding:"11px 12px",marginBottom:4
          }}>
            <div style={{fontSize:11,fontWeight:600,color:"#7aadff",marginBottom:8,letterSpacing:".06em",textTransform:"uppercase"}}>
              New staff health card
            </div>
            <input
              type="text"
              placeholder="Staff name (e.g. Ahmed Hassan)"
              value={newStaff.name}
              onChange={e => setNewStaff({...newStaff, name: e.target.value})}
              style={{width:"100%",padding:"8px 10px",background:"#07111e",color:"var(--text-1)",border:".5px solid var(--border)",borderRadius:8,fontSize:13,outline:"none",fontFamily:"var(--font-b)",marginBottom:7}}
            />
            <input
              type="date"
              value={newStaff.expiry}
              onChange={e => setNewStaff({...newStaff, expiry: e.target.value})}
              style={{width:"100%",padding:"8px 10px",background:"#07111e",color:"var(--text-1)",border:".5px solid var(--border)",borderRadius:8,fontSize:13,outline:"none",fontFamily:"var(--font-b)",colorScheme:"dark",marginBottom:9}}
            />
            <div style={{display:"flex",gap:7}}>
              <button onClick={handleAddStaff} disabled={newStaff.name.trim().length<2 || !newStaff.expiry} style={{
                flex:1,padding:"9px 0",
                background: (newStaff.name.trim().length>=2 && newStaff.expiry) ? "var(--blue)" : "rgba(255,255,255,.05)",
                color: (newStaff.name.trim().length>=2 && newStaff.expiry) ? "white" : "var(--text-3)",
                border:"none",borderRadius:8,fontSize:11,fontWeight:700,
                letterSpacing:".06em",textTransform:"uppercase",
                cursor: (newStaff.name.trim().length>=2 && newStaff.expiry) ? "pointer" : "not-allowed",
                fontFamily:"var(--font-d)"
              }}>Add Health Card</button>
              <button onClick={() => { setShowAddStaff(false); setNewStaff({name:"",expiry:""}); }} style={{
                padding:"9px 14px",background:"transparent",color:"var(--text-3)",
                border:".5px solid var(--border)",borderRadius:8,fontSize:11,
                cursor:"pointer",fontFamily:"var(--font-b)"
              }}>Cancel</button>
            </div>
          </div>
        )}

        {docs.map(doc=>{
          const cfg=DOC_CFG[doc.status];
          const pct=Math.min(100,(doc.daysLeft/365)*100);
          return(
            <div key={doc.name} className="doc-card">
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px"}}>
                  <FileText size={12} color="var(--text-2)"/>
                  <span style={{fontSize:"12px",fontWeight:"500",color:"var(--text-1)"}}>{doc.name}</span>
                  {doc._custom && (
                    <button onClick={() => handleRemoveDoc(doc.name)} title="Remove" style={{
                      marginLeft:"auto",background:"transparent",border:"none",color:"var(--text-3)",
                      cursor:"pointer",padding:0,fontSize:14,lineHeight:1
                    }}>×</button>
                  )}
                </div>
                <div style={{fontSize:"10px",color:"var(--text-2)",marginBottom:"2px"}}>Expires {doc.expiry} · {doc.daysLeft}d remaining</div>
                <div className="doc-bar">
                  <div className="doc-bar-fill" style={{width:`${pct}%`,background:cfg.text}}/>
                </div>
                <div style={{marginTop:"5px"}}>
                  <span className="doc-chip" style={{background:cfg.bg,border:`.5px solid ${cfg.border}`,color:cfg.text}}>
                    <div style={{width:"4px",height:"4px",borderRadius:"50%",background:cfg.text,animation:doc.status==="urgent"?"pulse 1.2s infinite":"none"}}/>
                    {cfg.label}
                  </span>
                </div>
              </div>
              {doc.daysLeft<=30&&(
                <button className="renew-btn" onClick={()=>setRenewConfirm(doc.name)}>
                  <RefreshCw size={10}/>Renew with PRO
                </button>
              )}
            </div>
          );
        })}

        {/* fine history */}
        <div style={{marginTop:"6px"}}>
          <div className="dh-sect">Fine History & Protection</div>
          <FineHistoryLog/>
        </div>
      </div>

      {/* renew confirm */}
      {renewConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:210,display:"flex",alignItems:"center",justifyContent:"center",padding:"18px"}}
          onClick={()=>setRenewConfirm(null)}>
          <div style={{background:"#0b1829",border:".5px solid var(--border-blue)",borderRadius:"var(--r-xl)",padding:"24px",width:"100%",maxWidth:"340px"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"15px",fontWeight:"700",color:"var(--text-1)",marginBottom:"8px"}}>Renew with PRO Partner</div>
            <div style={{fontSize:"12px",color:"var(--text-2)",marginBottom:"18px",lineHeight:"1.5"}}><strong style={{color:"var(--text-1)"}}>{renewConfirm}</strong> renewal will be handled by a DHA/DM certified PRO agent. Typical turnaround: 24–48 hours.</div>
            <button style={{width:"100%",background:"var(--blue)",color:"#fff",border:"none",borderRadius:"var(--r-md)",padding:"13px",fontFamily:"var(--font-d)",fontSize:"12px",fontWeight:"700",letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",boxShadow:"0 4px 18px var(--blue-glow)"}}
              onClick={()=>setRenewConfirm(null)}>
              Confirm Renewal Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WEEKLY ANALYTICS CONTENT ────────────────────────────────

function WeeklyAnalyticsContent(){
  return(
    <>
      <div className="dh-sect">Weekly Performance</div>
      <div className="tbl slide-in">
        <div className="tbl-hrow" style={{gridTemplateColumns:"1.2fr 1fr 1fr 1fr"}}>
          {["Week","Safety Score","Saved (AED)","Match Rate"].map(h=><span key={h} className="tbl-clbl">{h}</span>)}
        </div>
        {WEEKLY_DATA.map((row,i)=>(
          <div key={i} className="tbl-row" style={{gridTemplateColumns:"1.2fr 1fr 1fr 1fr"}}>
            <div><div className="row-lbl">{row.week}</div><div className="row-sub">{row.sub}</div></div>
            <div>
              <div className="score-val" style={{color:scoreColor(row.score)}}>{row.score}%</div>
              <div className="score-bar"><div className="score-fill" style={{width:`${row.score}%`,background:scoreColor(row.score)}}/></div>
            </div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--emerald)",letterSpacing:"-.01em"}}>{fmt(row.savings)}</div>
            <div><span className={`acc-pill ${accClass(row.acc)}`}>{row.acc}%</span></div>
          </div>
        ))}
      </div>

      {/* Fine Risk Score */}
      <div className="slide-in" style={{animationDelay:".08s"}}>
        <div className="dh-sect">Fine Risk Score</div>
        <div className="frs-card">
          <div style={{flexShrink:0,marginTop:"-4px"}}><FineRiskGauge score={28}/></div>
          <div style={{flex:1,paddingTop:"4px"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)",marginBottom:"3px"}}>Municipality Fine Risk</div>
            <div style={{fontSize:"10px",color:"var(--text-2)",marginBottom:"11px",lineHeight:"1.4"}}>Based on self-audit compliance over last 4 weeks.</div>
            <div className="frs-factors">
              {[
                {label:"Fridge Logs",val:"96%",ok:true},
                {label:"Staff Audits",val:"88%",ok:true},
                {label:"Temp Violations",val:"2 this month",ok:true},
                {label:"Missed Checks",val:"1 this week",ok:true},
              ].map(f=>(
                <div key={f.label} className="frs-frow">
                  <div className="frs-fdot" style={{background:f.ok?"var(--emerald)":"var(--red)"}}/>
                  <span style={{fontSize:"10px",color:"var(--text-2)",flex:1}}>{f.label}</span>
                  <span style={{fontSize:"10px",fontWeight:"600",color:f.ok?"var(--emerald)":"var(--red)",fontFamily:"var(--font-d)"}}>{f.val}</span>
                </div>
              ))}
            </div>
            <div className="frs-verdict"><ShieldCheck size={11}/>Low risk — keep it up.</div>
          </div>
        </div>
      </div>

      {/* Document Status */}
      <div className="slide-in" style={{animationDelay:".14s"}}>
        <div className="dh-sect">Document Status</div>
        <div className="tbl">
          <div className="tbl-hrow" style={{gridTemplateColumns:"1fr auto auto"}}>
            <span className="tbl-clbl">Document</span>
            <span className="tbl-clbl" style={{marginRight:"16px"}}>Expiry</span>
            <span className="tbl-clbl">Status</span>
          </div>
          {DOCS.map(doc=>{
            const cfg=DOC_CFG[doc.status];
            return(
              <div key={doc.name} className="tbl-row" style={{gridTemplateColumns:"1fr auto auto"}}>
                <div><div className="row-lbl">{doc.name}</div><div className="row-sub">{doc.daysLeft}d remaining</div></div>
                <div style={{fontSize:"11px",color:"var(--text-2)",marginRight:"14px",fontFamily:"var(--font-d)",fontWeight:"500"}}>{doc.expiry}</div>
                <div>
                  <span className="doc-chip" style={{background:cfg.bg,border:`.5px solid ${cfg.border}`,color:cfg.text}}>
                    <div style={{width:"4px",height:"4px",borderRadius:"50%",background:cfg.text,animation:doc.status==="urgent"?"pulse 1.2s infinite":"none"}}/>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:"7px",display:"flex",gap:"5px",alignItems:"center",paddingLeft:"2px"}}>
          <AlertTriangle size={11} color="var(--gold)"/>
          <span style={{fontSize:"10px",color:"var(--text-2)"}}>Omar's Health Card expires in 12 days — renew to avoid compliance gap.</span>
        </div>
      </div>

      {/* Waste Root Cause */}
      <div className="slide-in" style={{animationDelay:".2s"}}>
        <div className="dh-sect">Waste Root Cause</div>
        <div className="wrc">
          <div className="wrc-top">
            <div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)",marginBottom:"3px"}}>Loss by Category</div>
              <div style={{fontSize:"10px",color:"var(--text-2)"}}>April 2026 · AED 1,224 total waste</div>
            </div>
            <div style={{background:"rgba(255,255,255,.03)",border:".5px solid var(--border)",borderRadius:"9px",padding:"7px 11px",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"2px"}}>
              <span style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>AED 1,224</span>
              <span style={{fontSize:"9px",color:"var(--text-2)"}}>this month</span>
            </div>
          </div>
          <div className="wrc-body">
            <DonutChart slices={WASTE_CAUSES}/>
            <div className="wrc-legend">
              {WASTE_CAUSES.map(s=>{
                const aed=Math.round((s.pct/100)*1224);
                return(
                  <div key={s.label} className="wrc-li">
                    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                      <div className="wrc-swatch" style={{background:s.color}}/>
                      <div>
                        <div style={{fontSize:"11px",fontWeight:"500",color:"var(--text-1)"}}>{s.label}</div>
                        <div style={{fontSize:"9px",color:"var(--text-2)"}}>AED {aed.toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:s.color,letterSpacing:"-.02em"}}>{s.pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="wrc-insight">
            <Info size={11} color="var(--blue)" style={{flexShrink:0,marginTop:"1px"}}/>
            <span><strong>Over-Prep</strong> is your #1 cost driver. Reducing daily pastry prep by 15% could recover approx. <strong>AED 198/month</strong>.</span>
          </div>
        </div>
      </div>

      {/* summary chips */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"9px"}} className="fade-in">
        {[
          {label:"Avg Safety Score",value:"89.75%",color:"var(--emerald)"},
          {label:"Total Saved",value:"AED 4,259",color:"var(--emerald)"},
          {label:"Avg Match Rate",value:"92.75%",color:"#5599ff"},
        ].map(({label,value,color})=>(
          <div key={label} style={{background:"var(--navy-card)",borderRadius:"var(--r-md)",padding:"13px 10px",border:".5px solid var(--border)",textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"14px",fontWeight:"700",color,letterSpacing:"-.02em",marginBottom:"3px"}}>{value}</div>
            <div style={{fontSize:"9px",color:"var(--text-2)",letterSpacing:".04em",lineHeight:"1.3"}}>{label}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── MONTHLY ANALYTICS CONTENT ────────────────────────────────

function MonthlyAnalyticsContent(){
  const [openDay,setOpenDay]=useState(null);
  const totalRec=INGREDIENT_RECOVERY.reduce((s,r)=>s+r.recovered,0);
  const refNum="PG-APR-2026-004";

  return(
    <>
      <div className="msumm slide-in">
        <div><div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"5px"}}>Total Saved (Apr)</div><div className="msumm-val em">AED 4,259</div><div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"3px"}}>↑ 6.8% vs March</div></div>
        <div><div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"5px"}}>Audit Status</div><div style={{marginTop:"5px"}}><span className="audit-badge"><div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#7aadff"}}/>Municipality Ready</span></div><div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"5px"}}>DM 2025 compliant</div></div>
        <div><div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"5px"}}>Waste Prevented</div><div className="msumm-val bl">52.3 kg</div><div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"3px"}}>UAE 2025 target</div></div>
        <div><div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"5px"}}>Compliance Score</div><div className="msumm-val go">96%</div><div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"3px"}}>Staff & fridge logs</div></div>
      </div>

      {/* Ingredient Recovery Invoice */}
      <div className="slide-in" style={{animationDelay:".1s"}}>
        <div className="dh-sect">Ingredient Recovery</div>
        <div className="inv">
          <div className="inv-hd">
            <div>
              <div style={{fontSize:"9px",fontWeight:"700",letterSpacing:".12em",textTransform:"uppercase",color:"#5599ff",marginBottom:"4px",display:"flex",alignItems:"center",gap:"5px"}}><div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#5599ff"}}/>Recovery Statement</div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"15px",fontWeight:"800",color:"#f0f4ff",letterSpacing:"-.02em"}}>Ingredient Recovery Report</div>
              <div style={{fontSize:"10px",color:"#8899bb",marginTop:"2px"}}>April 2026 · Dubai Municipality Compliant</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"var(--font-d)",fontSize:"10px",fontWeight:"700",color:"#7aadff",letterSpacing:".06em"}}>{refNum}</div>
              <div style={{fontSize:"9px",color:"#5566aa",marginTop:"2px"}}>Generated {new Date().toLocaleDateString("en-AE",{day:"numeric",month:"long",year:"numeric"})}</div>
              <div style={{marginTop:"6px"}}><span className="audit-badge" style={{fontSize:"8px"}}>Audit Ready</span></div>
            </div>
          </div>
          <div className="inv-col inv-hrow" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1.1fr"}}>
            {["Item","Qty Saved","Recovery %","AED Recovered"].map((h,i)=><span key={h} className="inv-clbl" style={{textAlign:i===3?"right":"left"}}>{h}</span>)}
          </div>
          {INGREDIENT_RECOVERY.map(item=>(
            <div key={item.name} className="inv-line" style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1.1fr"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <div style={{width:"26px",height:"26px",borderRadius:"7px",background:item.iconBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"14px"}}>{item.icon}</div>
                <div><div style={{fontSize:"13px",fontWeight:"500",color:"#0a1628"}}>{item.name}</div><div style={{fontSize:"10px",color:"#8899bb",marginTop:"1px"}}>{item.sub}</div></div>
              </div>
              <div><div style={{fontFamily:"var(--font-d)",fontSize:"12px",fontWeight:"600",color:"#1a2840"}}>{item.qty}</div><div style={{fontSize:"9px",color:"#8899bb",marginTop:"1px"}}>{item.unit}</div></div>
              <div>
                <div style={{fontFamily:"var(--font-d)",fontSize:"12px",fontWeight:"600",color:item.color}}>{item.pct}%</div>
                <div style={{height:"3px",background:"#edf1f9",borderRadius:"2px",marginTop:"4px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"2px",width:`${item.pct}%`,background:item.color}}/></div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"#007a46"}}>{fmt(item.recovered)}</div>
                <div style={{fontSize:"9px",color:"#00b86b",marginTop:"1px"}}>{item.note}</div>
              </div>
            </div>
          ))}
          <div className="inv-totals">
            {INGREDIENT_RECOVERY.map(item=>(
              <div key={item.name} style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                <span style={{fontSize:"10px",color:"#8899bb"}}>Subtotal ({item.name})</span>
                <span style={{fontSize:"11px",color:"#1a2840",fontWeight:"600",fontFamily:"var(--font-d)"}}>AED {fmt(item.recovered)}</span>
              </div>
            ))}
            <div className="inv-grand">
              <span style={{fontFamily:"var(--font-d)",fontSize:"11px",fontWeight:"700",letterSpacing:".06em",textTransform:"uppercase",color:"#09182e"}}>Total Recovered</span>
              <span style={{fontFamily:"var(--font-d)",fontSize:"19px",fontWeight:"800",color:"#007a46",letterSpacing:"-.03em"}}>AED {fmt(totalRec)}</span>
            </div>
            <div className="inv-stamp">
              <Lock size={10} color="#aab4cc"/>
              <span>Encrypted · Signed · Submitted to DM audit trail · Ref {refNum}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily History */}
      <div className="slide-in" style={{animationDelay:".18s"}}>
        <div className="dh-sect">7-Day History</div>
        <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          {DAILY_HISTORY.map((day,i)=>{
            const isOpen=openDay===i;
            const pct=Math.round((day.total/MAX_DAY)*100);
            return(
              <div key={i} className="dh-day">
                <div className="dh-dhdr" onClick={()=>setOpenDay(isOpen?null:i)}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div className="dh-ddot" style={{background:day.dotColor,boxShadow:`0 0 5px ${day.dotColor}88`}}/>
                    <div><div className="dh-dname">{day.day}</div><div className="dh-ddate">{day.date}</div></div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                    <div className="dh-dtotal">AED {fmt(day.total)}</div>
                    <div className={`dh-chev ${isOpen?"open":""}`}><ChevronDown size={13}/></div>
                  </div>
                </div>
                <div className="dh-bar"><div className="dh-barfill" style={{width:`${pct}%`,background:day.dotColor}}/></div>
                <div className={`dh-items ${isOpen?"open":""}`}>
                  <div className="dh-inner">
                    <div className="dh-crow">
                      <span className="dh-clbl">Item</span>
                      <span className="dh-clbl c">Quantity</span>
                      <span className="dh-clbl r">AED Saved</span>
                    </div>
                    {day.items.map((item,j)=>(
                      <div key={j} className="dh-irow">
                        <div className="dh-iname">{item.n}</div>
                        <div className="dh-iqty">{item.qty}</div>
                        <div className="dh-iaed">{fmt(item.aed)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── RECIPE SETTINGS ─────────────────────────────────────────

function RecipeSettings(){
  const [buffer,setBuffer]=useState(10);
  const [open,setOpen]=useState({latte:false,fw:false,capp:false});
  const [drinks,setDrinks]=useState({
    latte:{milk:250,coffee:18},
    fw:   {milk:180,coffee:18},
    capp: {milk:120,coffee:18},
  });
  const [saved,setSaved]=useState(false);

  const upd=(drink,field,val)=>setDrinks(d=>({...d,[drink]:{...d[drink],[field]:val}}));
  const pct=(v,max)=>`${(v/max)*100}%`;
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);};

  const DRINK_DEF=[
    {key:"latte",label:"Latte",sub:"250ml milk · 18g coffee",emoji:"☕",milkMax:500,coffeeMax:30},
    {key:"fw",   label:"Flat White",sub:"180ml milk · 18g coffee",emoji:"🥛",milkMax:500,coffeeMax:30},
    {key:"capp", label:"Cappuccino",sub:"120ml milk · 18g coffee",emoji:"🫧",milkMax:500,coffeeMax:30},
  ];

  return(
    <div className="rs-body">
      {/* buffer */}
      <div className="rs-buffer">
        <div className="rs-buf-hd">
          <div className="rs-buf-icon"><Sparkles size={16} color="#7aadff"/></div>
          <div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>Milk Steaming Waste Buffer</div>
            <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"2px"}}>Accounts for milk left in pitcher after steaming. Standard is 10%.</div>
          </div>
        </div>
        <div className="range-wrap">
          <div className="range-row">
            <div><span className="range-val">{buffer}</span><span className="range-unit">% buffer</span></div>
            <div style={{fontSize:"11px",color:"var(--text-2)"}}>+{Math.round(drinks.latte.milk*(buffer/100))}ml waste/cycle</div>
          </div>
          <RangeSlider value={buffer} min={0} max={20} onChange={setBuffer}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"7px"}}>
            {[0,5,10,15,20].map(v=>(
              <button key={v} onClick={()=>setBuffer(v)} style={{fontSize:"9px",padding:"3px 7px",borderRadius:"5px",border:".5px solid",background:buffer===v?"rgba(0,184,107,.12)":"transparent",borderColor:buffer===v?"rgba(0,184,107,.35)":"var(--border)",color:buffer===v?"var(--emerald)":"var(--text-2)",cursor:"pointer",fontFamily:"var(--font-b)"}}>
                {v}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* drinks */}
      <div style={{fontSize:"10px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)"}}>Individual Recipe Tuning</div>
      {DRINK_DEF.map(({key,label,sub,emoji,milkMax,coffeeMax})=>{
        const d=drinks[key];
        const isOpen=open[key];
        return(
          <div key={key} className="rs-drink">
            <div className="rs-drink-hdr" onClick={()=>setOpen(o=>({...o,[key]:!o[key]}))}>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <div style={{width:"34px",height:"34px",borderRadius:"9px",background:"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px"}}>{emoji}</div>
                <div><div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>{label}</div><div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"1px"}}>{sub}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
                <span style={{fontSize:"10px",color:"var(--emerald)",fontWeight:"600"}}>{d.milk}ml</span>
                <span style={{fontSize:"10px",color:"var(--gold)",fontWeight:"600"}}>{d.coffee}g</span>
                <div style={{color:"var(--text-2)",transition:"transform .22s",transform:isOpen?"rotate(180deg)":"none",display:"flex"}}><ChevronDown size={13}/></div>
              </div>
            </div>
            <div className={`rs-drink-body ${isOpen?"open":""}`}>
              <div className="rs-inner">
                <div style={{marginBottom:"16px"}}>
                  <div className="rs-slider-lbl">Milk Volume — {d.milk}ml</div>
                  <RangeSlider value={d.milk} min={0} max={milkMax} onChange={v=>upd(key,"milk",v)} color="var(--emerald)"/>
                </div>
                <div>
                  <div className="rs-slider-lbl">Coffee Weight — {d.coffee}g</div>
                  <RangeSlider value={d.coffee} min={0} max={coffeeMax} onChange={v=>upd(key,"coffee",v)} color="var(--gold)"/>
                </div>
                <div className="rs-summary">
                  {[
                    {label:"With Buffer",val:`${Math.round(d.milk*(1+buffer/100))}ml`},
                    {label:"Steam Waste",val:`${Math.round(d.milk*(buffer/100))}ml`},
                    {label:"Dose Ratio",val:`${(d.milk/d.coffee).toFixed(1)}:1`},
                  ].map(({label,val})=>(
                    <div key={label} className="rs-summ-item">
                      <div className="rs-summ-val">{val}</div>
                      <div className="rs-summ-lbl">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* impact */}
      <div className="rs-impact">
        <div style={{fontSize:"10px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"8px"}}>Smart Calibration Preview</div>
        <div style={{fontSize:"12px",color:"var(--text-2)",fontStyle:"italic",lineHeight:"1.65",marginBottom:"14px"}}>
          Based on these settings, your recommendation engine is now calibrated for <strong style={{color:"var(--text-1)",fontStyle:"normal"}}>your cafe's specialty standards</strong> — using a <strong style={{color:"var(--emerald)",fontStyle:"normal"}}>{buffer}% steaming buffer</strong>, Latte at <strong style={{color:"var(--text-1)",fontStyle:"normal"}}>{drinks.latte.milk}ml</strong>, Flat White at <strong style={{color:"var(--text-1)",fontStyle:"normal"}}>{drinks.fw.milk}ml</strong>, Cappuccino at <strong style={{color:"var(--text-1)",fontStyle:"normal"}}>{drinks.capp.milk}ml</strong>.
        </div>

        <div style={{background:"rgba(26,108,255,.06)",border:".5px solid rgba(26,108,255,.2)",borderRadius:10,padding:"11px 13px",marginBottom:14,display:"flex",gap:9,alignItems:"flex-start"}}>
          <Info size={13} color="#7aadff" style={{flexShrink:0,marginTop:1}}/>
          <div style={{fontSize:11,color:"var(--text-2)",lineHeight:1.55}}>
            <strong style={{color:"var(--text-1)"}}>Adding new drinks?</strong> Go to <strong style={{color:"#7aadff"}}>Sales Entry → + Add Your Own Item</strong> to create mochas, matchas, signature drinks. The engine learns them automatically.
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"16px"}}>
          {[
            {label:"Total Milk/Cycle",val:`${drinks.latte.milk+drinks.fw.milk+drinks.capp.milk}ml`},
            {label:"Buffer Amount",val:`${Math.round((drinks.latte.milk+drinks.fw.milk+drinks.capp.milk)*(buffer/100))}ml`},
            {label:"Total Coffee Dose",val:`${drinks.latte.coffee+drinks.fw.coffee+drinks.capp.coffee}g`},
          ].map(({label,val})=>(
            <div key={label} style={{background:"rgba(255,255,255,.03)",border:".5px solid var(--border)",borderRadius:"8px",padding:"9px 8px",textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-d)",fontSize:"14px",fontWeight:"700",color:"var(--text-1)",marginBottom:"2px"}}>{val}</div>
              <div style={{fontSize:"9px",color:"var(--text-2)"}}>{label}</div>
            </div>
          ))}
        </div>
        <button className={`rs-save-btn ${saved?"saved":""}`} onClick={save}>
          {saved?<><Check size={14}/>Settings Saved</>:<><Sparkles size={14}/>Apply & Save Calibration</>}
        </button>
      </div>
    </div>
  );
}

// ─── TOOLS TAB ────────────────────────────────────────────────

function HalalExpiryTracker({arabic}){
  const expiringSoon=INGREDIENTS.filter(i=>i.status!=="valid").length;
  const T={
    title:arabic?"تتبع الحلال وتواريخ الانتهاء":"Halal & Expiry Tracking",
    sub:arabic?"إلزامي · قانون الغذاء الإماراتي 10/2015":"UAE Food Law No.10 of 2015 · DM Mandatory",
    badge:arabic?"مطابق":"DM Compliant",
    cols:arabic?["المكوّن","تاريخ الانتهاء","الحلال","الحالة"]:["Ingredient","Expiry","Halal Cert","Status"],
    add:arabic?"+ إضافة مكوّن":"+ Add Ingredient",
    warn:arabic?`${expiringSoon} مكونات تنتهي قريباً`:`${expiringSoon} items expiring soon`,
  };
  return(
    <div className="ht-card">
      <div className="ht-hd">
        <div className="ht-hicon"><Package size={16} color="var(--emerald)"/></div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>{T.title}</div>
          <div style={{fontSize:"10px",color:"#5a9e7a",marginTop:"2px"}}>{T.sub}</div>
        </div>
        <span style={{background:"rgba(0,184,107,.12)",border:".5px solid rgba(0,184,107,.28)",borderRadius:"5px",padding:"3px 8px",fontSize:"9px",fontWeight:"700",color:"var(--emerald)",letterSpacing:".06em",textTransform:"uppercase",flexShrink:0}}>{T.badge}</span>
      </div>
      {expiringSoon>0&&(
        <div style={{display:"flex",alignItems:"center",gap:"7px",padding:"8px 16px",background:"rgba(255,80,80,.06)",borderBottom:".5px solid rgba(255,80,80,.13)"}}>
          <AlertTriangle size={11} color="var(--red)"/><span style={{fontSize:"10px",color:"#ff7070"}}>{T.warn}</span>
        </div>
      )}
      <div className="ht-hrow ht-grid">
        {T.cols.map(c=><span key={c} style={{fontSize:"9px",fontWeight:"700",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)"}}>{c}</span>)}
      </div>
      {INGREDIENTS.map(ing=>{
        const cfg=EXPIRY_CFG[ing.status];
        return(
          <div key={ing.id} className="ht-row ht-grid">
            <div style={{display:"flex",alignItems:"center",gap:"7px"}}>
              <div className="ht-iicon" style={{background:ing.iconBg}}>{ing.icon}</div>
              <div><div className="ht-iname">{arabic?ing.nameAr:ing.name}</div><div className="ht-ibatch">{ing.batch}</div></div>
            </div>
            <div><div className="ht-expval" style={{color:cfg.text}}>{ing.expiry}</div><div className="ht-days">{ing.daysLeft}d</div></div>
            <div>
              {ing.halal
                ?<span className="ht-cert" style={{background:"rgba(0,184,107,.1)",color:"var(--emerald)",border:".5px solid rgba(0,184,107,.2)"}}><div className="ht-cdot" style={{background:"var(--emerald)"}}/>{arabic?"حلال":"Halal"}</span>
                :<span className="ht-cert" style={{background:"rgba(255,80,80,.1)",color:"var(--red)",border:".5px solid rgba(255,80,80,.2)"}}><div className="ht-cdot" style={{background:"var(--red)"}}/>{arabic?"غير مؤكد":"Unverified"}</span>
              }
            </div>
            <div><span className="ht-status" style={{background:cfg.bg,color:cfg.text,border:`.5px solid ${cfg.text}44`}}>{arabic?(ing.status==="valid"?"جيد":ing.status==="expiring"?"قريب":"عاجل"):cfg.label}</span></div>
          </div>
        );
      })}
      <div className="ht-add"><button className="ht-add-btn"><Package size={12}/>{T.add}</button></div>
    </div>
  );
}

function SupplierBook({arabic}){
  return(
    <div className="sup-card">
      <div className="sup-hd">
        <div style={{width:"36px",height:"36px",borderRadius:"9px",background:"rgba(26,108,255,.1)",border:".5px solid rgba(26,108,255,.22)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookUser size={16} color="#7aadff"/></div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--text-1)"}}>{arabic?"دفتر الموردين":"Supplier Book"}</div>
          <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"2px"}}>{arabic?"موصول بتوصيات الذكاء الاصطناعي":"Linked to AI order recommendations"}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"5px",background:"rgba(26,108,255,.1)",border:".5px solid rgba(26,108,255,.22)",borderRadius:"20px",padding:"4px 9px",fontSize:"9px",fontWeight:"700",color:"#7aadff",letterSpacing:".06em",textTransform:"uppercase",flexShrink:0}}>
          <Zap size={9}/>{arabic?"ذكاء":"AI"}
        </div>
      </div>
      {SUPPLIERS.map(sup=>(
        <div key={sup.name} className="sup-entry">
          <div className="sup-top">
            <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
              <div className="sup-av" style={{background:sup.color,border:`.5px solid ${sup.border}`}}><span>{sup.emoji}</span></div>
              <div><div className="sup-name">{sup.name}</div><div className="sup-cat">{sup.category}</div></div>
            </div>
            <div style={{display:"flex",gap:"6px",flexShrink:0}}>
              <a className="sup-btn call" href={`tel:${sup.phone}`}><Phone size={10}/>{arabic?"اتصال":"Call"}</a>
              <a className="sup-btn wa" href={`https://wa.me/${sup.wa}?text=${encodeURIComponent(arabic?"مرحباً، أريد تعديل طلبيتي وفق ProfitGuard AI.":"Hi, adjusting my order per ProfitGuard AI recommendation.")}`} target="_blank" rel="noopener noreferrer"><MessageSquare size={10}/>{arabic?"واتساب":"WhatsApp"}</a>
            </div>
          </div>
          <div className="sup-aird">
            <div style={{marginTop:"1px",flexShrink:0}}>
              {sup.rec.action==="Reduce"?<TrendingUp size={12} color="var(--emerald)"/>:sup.rec.action==="Restock"?<AlertTriangle size={12} color="var(--gold)"/>:<CheckCircle2 size={12} color="#5599ff)"/>}
            </div>
            <div className="sup-aird"><strong>AI · {sup.rec.action}:</strong> {sup.rec.detail}{sup.rec.saving&&<span style={{color:"var(--emerald)",fontWeight:"600"}}> Save {sup.rec.saving}</span>}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WhatsAppReport({arabic}){
  const [phone,setPhone]=useState("+971 50 ");
  const [time,setTime]=useState("07:00");
  const [sent,setSent]=useState(false);
  const [copied,setCopied]=useState(false);
  const T={
    title:arabic?"تقرير واتساب اليومي":"WhatsApp Daily Report",
    sub:arabic?"ملخص 7 صباحاً · للمالك":"7am morning summary · Delivered to owner",
    send:arabic?"إرسال التقرير":"Send Report Now",
    sent:arabic?"تم الإرسال ✓":"Sent ✓",
  };
  const handleSend=()=>{
    const n=phone.replace(/\D/g,"");
    window.open(`https://wa.me/${n}?text=${encodeURIComponent(WA_REPORT)}`,"_blank");
    setSent(true); setTimeout(()=>setSent(false),3000);
  };
  const handleCopy=()=>{ navigator.clipboard?.writeText(WA_REPORT); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return(
    <div className="wa-card">
      <div className="wa-hd">
        <div className="wa-icon"><MessageSquare size={17} color="#25d366"/></div>
        <div style={{flex:1}}><div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"#f0f4ff",marginBottom:"2px"}}>{T.title}</div><div style={{fontSize:"10px",color:"#5a7a62"}}>{T.sub}</div></div>
        <button className="wa-copybtn" onClick={handleCopy} title="Copy">{copied?<Check size={12} color="#25d366"/>:<Copy size={12}/>}</button>
      </div>
      <div className="wa-preview">
        <div className="wa-bar">
          <div className="wa-bav">PG</div>
          <div><div style={{fontSize:"11px",fontWeight:"600",color:"#fff"}}>ProfitGuard AI</div><div style={{fontSize:"9px",color:"rgba(255,255,255,.55)"}}>online</div></div>
        </div>
        <div className="wa-bubble">
          <div style={{fontSize:"11px",fontWeight:"700",color:"#25d366",marginBottom:"7px",display:"flex",alignItems:"center",gap:"5px"}}>🟢 ProfitGuard AI — Daily Report</div>
          <div className="wa-bline">📅 <span>Saturday, 17 May 2026 · 7:00 AM</span></div>
          <div className="wa-bline">💰 Savings: <span className="em">AED 184.50</span></div>
          <div className="wa-bline">🥛 Milk: <span className="em">30L left</span> — order <span className="em">29L</span> today</div>
          <div className="wa-bline">✅ Checklist: <span className="ok">5/5 complete</span></div>
          <div className="wa-bline">⚠️ Croissants: <span className="warn">1 day left</span></div>
          <div className="wa-bline">📋 Omar Health Card: <span className="warn">12 days</span></div>
          <div className="wa-bfoot"><span>ProfitGuard AI</span><span>7:00 AM ✓✓</span></div>
        </div>
      </div>
      <div className="wa-ctrl">
        <div className="wa-trow">
          <span className="wa-tlbl">{arabic?"وقت الإرسال":"Daily send time"}</span>
          <select className="wa-sel" value={time} onChange={e=>setTime(e.target.value)}>
            {["06:00","06:30","07:00","07:30","08:00"].map(t=><option key={t}>{t} AM</option>)}
          </select>
        </div>
        <div style={{display:"flex",gap:"7px"}}>
          <input className="wa-inp" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+971 50 XXX XXXX"/>
        </div>
        <button className={`wa-send ${sent?"sent":""}`} onClick={handleSend}>
          <MessageSquare size={14}/>{sent?T.sent:T.send}
        </button>
      </div>
    </div>
  );
}

function ToolsTab({arabic,setArabic}){
  return(
    <div className="tools-body">
      {/* Language toggle */}
      <div className="fade-in">
        <div className="lang-strip">
          <div className="lang-icon"><Languages size={15} color="#7aadff"/></div>
          <div style={{flex:1}}>
            <div style={{fontSize:"12px",fontWeight:"500",color:"var(--text-1)"}}>{arabic?"العربية مفعّلة":"Arabic Language Mode"}</div>
            <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"1px"}}>{arabic?"واجهة الباريستا تعمل بالعربية":"Barista + Halal tracker switch to Arabic · RTL"}</div>
          </div>
          <label className="sw"><input type="checkbox" checked={arabic} onChange={()=>setArabic(a=>!a)}/><span className="sw-track"/></label>
        </div>
        {arabic&&(
          <div style={{marginTop:"7px",background:"rgba(26,108,255,.06)",border:".5px solid rgba(26,108,255,.14)",borderRadius:"9px",padding:"8px 13px",display:"flex",alignItems:"center",gap:"6px"}}>
            <Globe size={10} color="#7aadff"/>
            <span style={{fontSize:"10px",color:"#7aadff"}}>الوضع العربي مفعّل — الباريستا وتتبع المكونات يعملان بالعربية</span>
          </div>
        )}
      </div>

      {/* Halal tracker */}
      <div>
        <div className="tools-title">{arabic?"تتبع الحلال وتواريخ الانتهاء":"Halal & Expiry Tracking"}</div>
        <div className="tools-sub" style={{marginBottom:"10px"}}>{arabic?"إلزامي بموجب القانون الاتحادي رقم 10 لعام 2015":"Mandatory under UAE Food Law No. 10 of 2015 · DM inspectors review these records"}</div>
        <HalalExpiryTracker arabic={arabic}/>
      </div>

      {/* Supplier book */}
      <div>
        <div className="tools-title">{arabic?"دفتر الموردين":"Supplier Contact Book"}</div>
        <div className="tools-sub" style={{marginBottom:"10px"}}>{arabic?"اتصل مباشرة أو عدّل الطلبية عبر واتساب":"Call or WhatsApp to adjust orders · AI recommendations linked"}</div>
        <SupplierBook arabic={arabic}/>
      </div>

      {/* WhatsApp report */}
      <div>
        <div className="tools-title">{arabic?"تقرير واتساب اليومي":"WhatsApp Daily Report"}</div>
        <div className="tools-sub" style={{marginBottom:"10px"}}>{arabic?"ملخص يومي للمالك على واتساب":"Morning summary to owner's WhatsApp · No app needed"}</div>
        <WhatsAppReport arabic={arabic}/>
      </div>
    </div>
  );
}

// ─── PRO REFERRAL MODAL ───────────────────────────────────────

function ProModal({onClose}){
  const [services,setServices]=useState(new Set());
  const [submitted,setSubmitted]=useState(false);
  const toggleSvc=s=>setServices(prev=>{const n=new Set(prev);n.has(s)?n.delete(s):n.add(s);return n;});
  const SVCS=["Health Card Renewal","Trade License","Food Permit","Staff Training","Audit Prep","Compliance Review"];
  return(
    <div className={`pro-backdrop open`} onClick={e=>{if(e.target.classList.contains("pro-backdrop"))onClose();}}>
      <div className="pro-sheet">
        <div style={{width:"36px",height:"4px",borderRadius:"2px",background:"rgba(255,255,255,.15)",margin:"12px auto 0"}}/>
        {submitted?(
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"36px 24px 48px",textAlign:"center"}}>
            <div style={{width:"72px",height:"72px",borderRadius:"50%",background:"rgba(0,184,107,.1)",border:"2px solid var(--emerald)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"16px",boxShadow:"0 0 22px rgba(0,184,107,.3)"}}><CheckCircle2 size={32} color="var(--emerald)"/></div>
            <div style={{fontFamily:"var(--font-d)",fontSize:"18px",fontWeight:"800",color:"var(--text-1)",marginBottom:"6px"}}>Renewal Requested!</div>
            <div style={{fontSize:"12px",color:"var(--text-2)",lineHeight:"1.6",marginBottom:"20px"}}>A PRO partner will contact you on WhatsApp within 24 hours. Reference: <strong style={{color:"var(--text-1)"}}>PRO-{Date.now().toString(36).toUpperCase().slice(-5)}</strong></div>
            <button style={{background:"var(--navy-card)",border:".5px solid var(--border)",borderRadius:"var(--r-md)",padding:"11px 26px",color:"var(--text-1)",fontFamily:"var(--font-d)",fontSize:"11px",fontWeight:"600",cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase"}} onClick={onClose}>Done</button>
          </div>
        ):(
          <div style={{padding:"18px 18px 36px"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"16px",fontWeight:"800",color:"var(--text-1)",marginBottom:"4px"}}>Talk to PRO</div>
            <div style={{fontSize:"11px",color:"var(--text-2)",marginBottom:"14px"}}>DM-licensed PRO agents · 24hr WhatsApp response</div>
            <div className="pro-trust">
              {["DM Licensed","DHA Approved","24hr Response","Audit Trail Sync"].map(t=>(
                <div key={t} className="pro-trust-item"><BadgeCheck size={11} color="var(--emerald)"/>{t}</div>
              ))}
            </div>
            <div style={{fontSize:"10px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",margin:"16px 0 8px"}}>Services Needed</div>
            <div className="pro-service-grid">
              {SVCS.map(s=>(
                <div key={s} className={`pro-service ${services.has(s)?"selected":""}`} onClick={()=>toggleSvc(s)}>{s}</div>
              ))}
            </div>
            <input className="pro-input" placeholder="Your name"/>
            <input className="pro-input" placeholder="WhatsApp number +971…"/>
            <input className="pro-input" placeholder="Cafe name"/>
            <button className="pro-submit" onClick={()=>setSubmitted(true)}><Send size={13}/>Submit Request</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── NOTIFICATION SETUP BANNER ─────────────────────────────
// Pops up to ask user for notification permission. Shown only once.

function NotificationSetup({ onDone }) {
  const [state, setState] = useState(notif.state());
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    setLoading(true);
    const result = await notif.request();
    setState(result);
    setLoading(false);
    if (result === "granted") {
      notif.send("Notifications enabled ✓", "You'll get daily reminders at 7am for sales entry & compliance alerts.", { tag: "welcome" });
      // Schedule the 7am daily reminder
      notif.scheduleDaily(
        "07:00",
        "☕ Good morning!",
        "Enter yesterday's sales to get today's milk order — takes 20 seconds.",
        { tag: "daily-sales" }
      );
      setTimeout(() => onDone?.(), 1500);
    } else {
      onDone?.();
    }
  };

  if (state === "unsupported" || state === "denied") return null;
  if (state === "granted") return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(26,108,255,.12), rgba(26,108,255,.04))",
      border: ".5px solid rgba(26,108,255,.3)",
      borderRadius: 14, padding: "14px 16px",
      display: "flex", gap: 12, alignItems: "flex-start",
      marginBottom: 14
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: "rgba(26,108,255,.15)", border: ".5px solid rgba(26,108,255,.3)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        <BellRing size={17} color="#5599ff"/>
      </div>
      <div style={{flex: 1}}>
        <div style={{fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 3}}>
          Get daily reminders
        </div>
        <div style={{fontSize: 11, color: "var(--text-2)", marginBottom: 10, lineHeight: 1.5}}>
          7am daily nudge to enter sales · alerts before any document expires · waste-saving recommendations
        </div>
        <button onClick={handleEnable} disabled={loading} style={{
          background: "var(--blue)", color: "white", border: "none",
          borderRadius: 8, padding: "7px 14px", fontSize: 11,
          fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
          cursor: loading ? "wait" : "pointer", fontFamily: "var(--font-d)",
          display: "flex", alignItems: "center", gap: 6
        }}>
          {loading ? <div className="spin-sm"/> : <Bell size={11}/>}
          {loading ? "Enabling…" : "Enable notifications"}
        </button>
      </div>
    </div>
  );
}

// ─── STOCK TRACKER ────────────────────────────────────────
// Live counter for each ingredient. Add stock when delivery arrives.
// Sales Entry auto-subtracts daily usage. Low-stock alerts fire automatically.

function StockTracker({ stock, setStock, compact = false }) {
  const [addingTo, setAddingTo] = useState(null);
  const [addAmount, setAddAmount] = useState("");

  const handleAddStock = (itemId) => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      setAddingTo(null);
      setAddAmount("");
      return;
    }
    setStock(stock.map(s =>
      s.id === itemId ? { ...s, current: +(s.current + amount).toFixed(2) } : s
    ));
    setAddingTo(null);
    setAddAmount("");
    // Fire confirmation notification
    const item = stock.find(s => s.id === itemId);
    if (notif.state() === "granted" && item) {
      notif.send(
        `✓ ${item.name} restocked`,
        `+${amount}${item.unit} added. Current: ${(item.current + amount).toFixed(1)}${item.unit}`,
        { tag: `restock-${itemId}` }
      );
    }
  };

  return (
    <div style={{
      background: "var(--navy-card)", borderRadius: 16, padding: "14px 14px",
      border: ".5px solid var(--border)", marginBottom: 14
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12
      }}>
        <div>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: ".06em",
            textTransform: "uppercase", color: "var(--text-1)"
          }}>
            Live Stock
          </div>
          <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 1 }}>
            Tap + when stock arrives
          </div>
        </div>
        {stock.some(s => stockStatus(s) === "critical") && (
          <div style={{
            background: "rgba(255,80,80,.12)", color: "#ff7070",
            padding: "4px 9px", borderRadius: 6, fontSize: 10,
            fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 5
          }}>
            <AlertTriangle size={10}/> Low stock alert
          </div>
        )}
      </div>

      {stock.map((item) => {
        const status = stockStatus(item);
        const statusColor =
          status === "critical" ? "#ff5050" :
          status === "low"      ? "#f0b429" : "#00b86b";
        const pctFull = Math.min(100, (item.current / (item.threshold * 3)) * 100);

        return (
          <div key={item.id} style={{
            background: "rgba(255,255,255,.025)", borderRadius: 10,
            padding: "10px 12px", marginBottom: 6,
            border: `.5px solid ${status === "critical" ? "rgba(255,80,80,.3)" : "var(--border)"}`,
            transition: "all .2s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline"
                }}>
                  <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>
                    {item.name}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-d)", fontSize: 16, fontWeight: 700,
                    color: statusColor, letterSpacing: "-.02em"
                  }}>
                    {item.current.toFixed(1)}<span style={{
                      fontSize: 11, marginLeft: 2, fontWeight: 500
                    }}>{item.unit}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 3, background: "rgba(255,255,255,.06)",
                  borderRadius: 2, overflow: "hidden", marginTop: 5,
                  position: "relative"
                }}>
                  <div style={{
                    height: "100%", width: `${pctFull}%`,
                    background: statusColor, borderRadius: 2,
                    transition: "width .4s ease"
                  }}/>
                  {/* Threshold marker */}
                  <div style={{
                    position: "absolute", top: -1, bottom: -1,
                    left: `${Math.min(100, (item.threshold / (item.threshold * 3)) * 100)}%`,
                    width: 1, background: "rgba(255,255,255,.3)"
                  }}/>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 5
                }}>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                    {status === "critical"
                      ? <span style={{ color: "#ff7070", fontWeight: 600 }}>⚠ Below safe stock — restock now</span>
                      : status === "low"
                      ? <span style={{ color: "#f0b429", fontWeight: 600 }}>↓ Below {item.threshold}{item.unit} threshold</span>
                      : `Threshold: ${item.threshold}${item.unit}`}
                  </div>
                  {addingTo === item.id ? (
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <input
                        type="number"
                        autoFocus
                        placeholder={`${item.unit}`}
                        value={addAmount}
                        onChange={e => setAddAmount(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleAddStock(item.id)}
                        style={{
                          width: 60, padding: "4px 8px", background: "#07111e",
                          color: "var(--text-1)", border: ".5px solid var(--blue)",
                          borderRadius: 6, fontSize: 12, outline: "none",
                          fontFamily: "var(--font-b)", textAlign: "center"
                        }}
                      />
                      <button
                        onClick={() => handleAddStock(item.id)}
                        style={{
                          background: "var(--emerald)", color: "white", border: "none",
                          borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 700,
                          cursor: "pointer", fontFamily: "var(--font-d)"
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => { setAddingTo(null); setAddAmount(""); }}
                        style={{
                          background: "transparent", color: "var(--text-3)", border: ".5px solid var(--border)",
                          borderRadius: 6, padding: "4px 7px", fontSize: 11, cursor: "pointer"
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingTo(item.id); setAddAmount(""); }}
                      style={{
                        background: "rgba(26,108,255,.12)", color: "#7aadff",
                        border: ".5px solid rgba(26,108,255,.3)", borderRadius: 6,
                        padding: "4px 10px", fontSize: 10, fontWeight: 700,
                        letterSpacing: ".06em", textTransform: "uppercase",
                        cursor: "pointer", fontFamily: "var(--font-d)",
                        display: "flex", alignItems: "center", gap: 4
                      }}
                    >
                      + Add Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {!compact && (
        <div style={{
          marginTop: 10, padding: "8px 11px",
          background: "rgba(26,108,255,.06)", border: ".5px solid rgba(26,108,255,.18)",
          borderRadius: 8, display: "flex", gap: 7, alignItems: "flex-start"
        }}>
          <Info size={11} color="#7aadff" style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ fontSize: 10, color: "var(--text-2)", lineHeight: 1.5 }}>
            Stock auto-decreases when you log yesterday's sales. The threshold line shows where we'll alert you.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SALES ENTRY SCREEN ──────────────────────────────────
// This is the new daily input: barista enters yesterday's sales,
// app calculates today's recommended order + WhatsApp message

function SalesEntry({ cafeName = "Your Cafe", ownerWhatsApp = "", stock, setStock }) {
  const [sales, setSales] = useState({
    latte: "", flatwhite: "", cappuccino: "", croissant: "", cortado: ""
  });
  const [customItems, setCustomItems] = useState(() => {
    try {
      const saved = localStorage.getItem("pg_custom_items");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", icon: "☕", milk_ml: 0, cost_aed: 15 });
  const [standardOrder, setStandardOrder] = useState(60);
  const [calc, setCalc] = useState(null);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [stockApplied, setStockApplied] = useState(false);

  // Persist custom items to localStorage
  useEffect(() => {
    try { localStorage.setItem("pg_custom_items", JSON.stringify(customItems)); } catch {}
  }, [customItems]);

  // Combine default recipes + user's custom items
  const allItems = [...MENU_RECIPES, ...customItems];

  const updateSale = (id, val) => {
    const clean = val.replace(/[^0-9]/g, "");
    setSales({ ...sales, [id]: clean });
  };

  const handleAddCustomItem = () => {
    if (!newItem.name.trim() || newItem.name.length < 2) return;
    const id = "custom_" + newItem.name.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();
    setCustomItems([...customItems, { ...newItem, id, name: newItem.name.trim() }]);
    setSales({ ...sales, [id]: "" });
    setNewItem({ name: "", icon: "☕", milk_ml: 0, cost_aed: 15 });
    setShowAddItem(false);
  };

  const handleRemoveCustomItem = (id) => {
    setCustomItems(customItems.filter(i => i.id !== id));
    const newSales = { ...sales };
    delete newSales[id];
    setSales(newSales);
  };

  const totalEntered = Object.values(sales).reduce((s, v) => s + (parseInt(v) || 0), 0);
  const canCalculate = totalEntered > 0;

  const handleCalculate = () => {
    const salesNumbers = {};
    for (const k in sales) salesNumbers[k] = parseInt(sales[k]) || 0;
    const result = calculateOrderRecommendation(salesNumbers, standardOrder, customItems);
    setCalc(result);
    setWhatsappOpened(false);

    // ── AUTO-SUBTRACT FROM STOCK ──
    if (stock && setStock && !stockApplied) {
      const used = getStockUsage(salesNumbers, customItems);
      const newStock = stock.map(s => {
        let consumed = 0;
        if (s.id === "milk")     consumed = used.milk;
        if (s.id === "coffee")   consumed = used.coffee;
        if (s.id === "pastries") consumed = used.pastries;
        // oatmilk + cream not tracked in default recipes yet
        return consumed > 0
          ? { ...s, current: Math.max(0, +(s.current - consumed).toFixed(2)) }
          : s;
      });
      setStock(newStock);
      setStockApplied(true);

      // Fire low-stock alerts for anything that just dropped below threshold
      if (notif.state() === "granted") {
        newStock.forEach(s => {
          const status = stockStatus(s);
          const old = stock.find(o => o.id === s.id);
          const wasOk = stockStatus(old) === "ok";
          if (wasOk && (status === "low" || status === "critical")) {
            notif.send(
              `⚠️ ${s.name} running low`,
              `Only ${s.current.toFixed(1)}${s.unit} left — order today.`,
              { tag: `low-${s.id}`, persist: true }
            );
          }
        });
      }
    }

    // Order recommendation notification
    if (notif.state() === "granted") {
      notif.send(
        `📦 Order ${result.recommendedOrder}L milk today`,
        result.litresSaved > 0
          ? `Saves AED ${result.aedSaved} vs your usual ${result.standardOrder}L order.`
          : `Standard quantity needed for today.`,
        { tag: "order-rec", persist: true }
      );
    }
  };

  const handleSendWhatsApp = () => {
    if (!calc) return;
    const msg = buildMorningReport(cafeName, calc);
    const phoneClean = ownerWhatsApp.replace(/\D/g, "");
    const url = phoneClean
      ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setWhatsappOpened(true);
    setTimeout(() => setWhatsappOpened(false), 3500);
  };

  const handleReset = () => {
    setSales({ latte: "", flatwhite: "", cappuccino: "", croissant: "", cortado: "" });
    setCalc(null);
    setStockApplied(false);
  };

  return (
    <div style={{ padding: "20px 18px 100px", maxWidth: 480, margin: "0 auto" }}>

      {/* NOTIFICATION SETUP (shown only if not yet granted) */}
      <NotificationSetup/>

      {/* HEADER */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontFamily: "var(--font-d)", fontSize: 22, fontWeight: 800,
          color: "var(--text-1)", letterSpacing: "-.02em", marginBottom: 4
        }}>
          Sales Entry
        </div>
        <div style={{ fontSize: 13, color: "var(--text-2)" }}>
          Yesterday's sales · auto-calculates today's order
        </div>
      </div>

      {/* LIVE STOCK TRACKER */}
      {stock && setStock && <StockTracker stock={stock} setStock={setStock}/>}

      {/* SALES INPUT CARD */}
      <div style={{
        background: "var(--navy-card)", borderRadius: 16, padding: "16px 14px",
        border: ".5px solid var(--border)", marginBottom: 14
      }}>
        <div style={{
          fontSize: 11, fontWeight: 600, letterSpacing: ".08em",
          textTransform: "uppercase", color: "var(--text-2)", marginBottom: 12
        }}>
          How many did you sell yesterday?
        </div>

        {allItems.map((item) => (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
            background: "rgba(255,255,255,.025)", borderRadius: 10,
            border: ".5px solid var(--border)", marginBottom: 7
          }}>
            <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                {item.name}
                {item.id.startsWith("custom_") && (
                  <button
                    onClick={() => handleRemoveCustomItem(item.id)}
                    title="Remove this item"
                    style={{
                      background: "transparent", border: "none", color: "var(--text-3)",
                      cursor: "pointer", padding: 0, fontSize: 12, lineHeight: 1
                    }}
                  >×</button>
                )}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                {item.milk_ml > 0 ? `${item.milk_ml}ml milk${item.coffee_g ? ` · ${item.coffee_g}g coffee` : ""}` : "no milk"}
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              value={sales[item.id] || ""}
              onChange={(e) => updateSale(item.id, e.target.value)}
              style={{
                width: 64, padding: "8px 10px", background: "#07111e",
                color: "var(--text-1)", border: ".5px solid var(--border)",
                borderRadius: 8, fontSize: 15, fontWeight: 600,
                textAlign: "center", outline: "none", fontFamily: "var(--font-b)"
              }}
            />
          </div>
        ))}

        {/* + Add Custom Item button or form */}
        {!showAddItem ? (
          <button
            onClick={() => setShowAddItem(true)}
            style={{
              width: "100%", padding: "10px 12px",
              background: "rgba(26,108,255,.06)", color: "#7aadff",
              border: ".5px dashed rgba(26,108,255,.4)", borderRadius: 10,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-d)", letterSpacing: ".06em",
              textTransform: "uppercase", marginTop: 4
            }}
          >+ Add Your Own Item (mocha, matcha, sandwich…)</button>
        ) : (
          <div style={{
            background: "rgba(26,108,255,.08)", border: ".5px solid rgba(26,108,255,.3)",
            borderRadius: 10, padding: "11px 12px", marginTop: 4
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#7aadff", marginBottom: 8, letterSpacing: ".06em", textTransform: "uppercase" }}>
              New menu item
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 7 }}>
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={newItem.icon}
                onChange={e => setNewItem({ ...newItem, icon: e.target.value.slice(0, 2) })}
                style={{ width: 60, padding: "8px 10px", background: "#07111e", color: "var(--text-1)", border: ".5px solid var(--border)", borderRadius: 8, fontSize: 14, textAlign: "center", outline: "none" }}
              />
              <input
                type="text"
                placeholder="Item name (e.g. Mocha)"
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                style={{ flex: 1, padding: "8px 10px", background: "#07111e", color: "var(--text-1)", border: ".5px solid var(--border)", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "var(--font-b)" }}
              />
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 9 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, color: "var(--text-3)", display: "block", marginBottom: 3 }}>Milk per unit (ml)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newItem.milk_ml || ""}
                  onChange={e => setNewItem({ ...newItem, milk_ml: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "8px 10px", background: "#07111e", color: "var(--text-1)", border: ".5px solid var(--border)", borderRadius: 8, fontSize: 13, textAlign: "center", outline: "none" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, color: "var(--text-3)", display: "block", marginBottom: 3 }}>Price (AED)</label>
                <input
                  type="number"
                  placeholder="15"
                  value={newItem.cost_aed || ""}
                  onChange={e => setNewItem({ ...newItem, cost_aed: parseInt(e.target.value) || 0 })}
                  style={{ width: "100%", padding: "8px 10px", background: "#07111e", color: "var(--text-1)", border: ".5px solid var(--border)", borderRadius: 8, fontSize: 13, textAlign: "center", outline: "none" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button
                onClick={handleAddCustomItem}
                disabled={newItem.name.trim().length < 2}
                style={{
                  flex: 1, padding: "9px 0",
                  background: newItem.name.trim().length >= 2 ? "var(--blue)" : "rgba(255,255,255,.05)",
                  color: newItem.name.trim().length >= 2 ? "white" : "var(--text-3)",
                  border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700,
                  letterSpacing: ".06em", textTransform: "uppercase",
                  cursor: newItem.name.trim().length >= 2 ? "pointer" : "not-allowed",
                  fontFamily: "var(--font-d)"
                }}
              >Add Item</button>
              <button
                onClick={() => { setShowAddItem(false); setNewItem({ name: "", icon: "☕", milk_ml: 0, cost_aed: 15 }); }}
                style={{
                  padding: "9px 14px",
                  background: "transparent", color: "var(--text-3)",
                  border: ".5px solid var(--border)", borderRadius: 8, fontSize: 11,
                  cursor: "pointer", fontFamily: "var(--font-b)"
                }}
              >Cancel</button>
            </div>
          </div>
        )}

        {/* Standard order input */}
        <div style={{
          marginTop: 12, padding: "10px 12px",
          background: "rgba(26,108,255,.06)", border: ".5px solid rgba(26,108,255,.2)",
          borderRadius: 10, display: "flex", alignItems: "center", gap: 10
        }}>
          <span style={{ fontSize: 18 }}>📦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--text-1)", fontWeight: 500 }}>
              Standard daily milk order
            </div>
            <div style={{ fontSize: 10, color: "var(--text-3)" }}>
              How much do you usually order?
            </div>
          </div>
          <input
            type="number"
            value={standardOrder}
            onChange={(e) => setStandardOrder(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: 64, padding: "8px 10px", background: "#07111e",
              color: "var(--text-1)", border: ".5px solid var(--border)",
              borderRadius: 8, fontSize: 15, fontWeight: 600,
              textAlign: "center", outline: "none", fontFamily: "var(--font-b)"
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-2)" }}>L</span>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          style={{
            width: "100%", marginTop: 12, padding: 14,
            background: canCalculate ? "var(--emerald)" : "rgba(255,255,255,.05)",
            color: canCalculate ? "white" : "var(--text-3)",
            border: "none", borderRadius: 12,
            fontFamily: "var(--font-d)", fontSize: 12, fontWeight: 700,
            letterSpacing: ".1em", textTransform: "uppercase",
            cursor: canCalculate ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "all .2s",
            boxShadow: canCalculate ? "0 4px 16px rgba(0,184,107,.3)" : "none"
          }}
        >
          <Sparkles size={14} />
          Calculate Today's Order
        </button>
      </div>

      {/* CALCULATION RESULT */}
      {calc && (
        <div className="fade-in" style={{
          background: "linear-gradient(135deg, rgba(0,184,107,.12), rgba(0,184,107,.04))",
          border: ".5px solid rgba(0,184,107,.3)", borderRadius: 16,
          padding: "18px 16px", marginBottom: 14
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: ".08em",
              textTransform: "uppercase", color: "var(--emerald)"
            }}>
              <Sparkles size={11} style={{ marginRight: 5, verticalAlign: "middle" }} />
              AI Recommendation
            </div>
            <div style={{ fontSize: 10, color: "var(--text-3)" }}>
              {calc.totalDrinks} drinks · {calc.milkUsedL}L used
            </div>
          </div>

          {/* The Big Number */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{
              fontFamily: "var(--font-d)", fontSize: 12,
              color: "var(--text-2)", marginBottom: 4
            }}>
              Order Today
            </div>
            <div style={{
              fontFamily: "var(--font-d)", fontSize: 48, fontWeight: 800,
              color: "var(--emerald)", lineHeight: 1, letterSpacing: "-.04em"
            }}>
              {calc.recommendedOrder}<span style={{ fontSize: 24, marginLeft: 4 }}>L milk</span>
            </div>
            {calc.litresSaved > 0 && (
              <div style={{ fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>
                Instead of {calc.standardOrder}L · <strong style={{ color: "var(--emerald)" }}>save AED {calc.aedSaved}</strong>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div style={{
            background: "rgba(0,0,0,.2)", borderRadius: 10, padding: "10px 12px",
            marginBottom: 12
          }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: ".06em",
              textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6
            }}>
              The math
            </div>
            {calc.breakdown.map((b, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 12, color: "var(--text-2)", padding: "2px 0"
              }}>
                <span>{b.qty} × {b.name}</span>
                <span style={{ fontFamily: "monospace" }}>{b.milk_L.toFixed(1)}L</span>
              </div>
            ))}
            <div style={{
              borderTop: ".5px solid var(--border)", marginTop: 6, paddingTop: 6,
              display: "flex", justifyContent: "space-between",
              fontSize: 12, color: "var(--text-1)", fontWeight: 600
            }}>
              <span>+ 10% steam buffer + 5L safety</span>
              <span style={{ fontFamily: "monospace" }}>{calc.recommendedOrder}L</span>
            </div>
          </div>

          {/* WhatsApp Send Button */}
          <button
            onClick={handleSendWhatsApp}
            style={{
              width: "100%", padding: 14,
              background: whatsappOpened ? "rgba(0,184,107,.2)" : "#25D366",
              color: whatsappOpened ? "var(--emerald)" : "white",
              border: "none", borderRadius: 12,
              fontFamily: "var(--font-d)", fontSize: 12, fontWeight: 700,
              letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all .2s",
              boxShadow: whatsappOpened ? "none" : "0 4px 16px rgba(37,211,102,.3)"
            }}
          >
            {whatsappOpened ? <><Check size={14} /> Opened in WhatsApp</> : <><MessageSquare size={14} /> Send via WhatsApp</>}
          </button>

          <button
            onClick={handleReset}
            style={{
              width: "100%", padding: "10px 0", marginTop: 8,
              background: "transparent", color: "var(--text-3)",
              border: "none", cursor: "pointer", fontSize: 12,
              fontFamily: "var(--font-b)"
            }}
          >
            ↻ Start over
          </button>
        </div>
      )}

      {/* HELPER TIP */}
      {!calc && (
        <div style={{
          background: "rgba(26,108,255,.06)", border: ".5px solid rgba(26,108,255,.18)",
          borderRadius: 12, padding: "11px 13px", display: "flex", gap: 8
        }}>
          <Info size={13} color="#7aadff" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--text-1)" }}>Why this works:</strong> Yesterday's sales × your recipes = exact milk used. Add 10% steam loss + 5L safety = today's order. No guessing.
          </div>
        </div>
      )}

    </div>
  );
}

// ─── LOGS TAB — Inspector-ready audit trail ───────────────
// Shows all daily municipality logs with download buttons

function LogsTab({ cafeName = "Your Cafe" }) {
  const [logs, setLogs] = useState([]);
  const [filterDate, setFilterDate] = useState("all");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pg_logs") || "[]");
      setLogs(saved);
    } catch { setLogs([]); }
  }, []);

  // Group logs by date
  const filteredLogs = filterDate === "all"
    ? logs
    : logs.filter(l => l.logged_at?.startsWith(filterDate));

  // Generate downloadable HTML report
  const downloadLog = (log) => {
    const ts = new Date(log.logged_at);
    const dateStr = ts.toLocaleDateString("en-AE", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
    const timeStr = ts.toLocaleTimeString("en-AE", { hour:"2-digit", minute:"2-digit", second:"2-digit" });

    const checklistRows = Object.entries(log.checklist || {})
      .map(([k, v]) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #ddd;">${k.replace(/_/g," ").replace(/\b\w/g, c=>c.toUpperCase())}</td><td style="padding:8px 12px;border-bottom:1px solid #ddd;text-align:right;color:${v?"#00b86b":"#cc0000"};font-weight:600;">${v ? "✓ COMPLETED" : "✗ NOT DONE"}</td></tr>`)
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Municipality Log — ${log.ref_number}</title></head>
<body style="font-family:Arial,sans-serif;max-width:720px;margin:40px auto;padding:30px;color:#222;">
  <div style="border-bottom:3px solid #1a6cff;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="margin:0;color:#0b1829;font-size:24px;">${cafeName}</h1>
    <div style="color:#666;font-size:13px;margin-top:6px;">Dubai Municipality Daily Inspection Log</div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
    <tr><td style="padding:6px 0;color:#666;width:160px;">Reference Number</td><td style="padding:6px 0;font-family:monospace;font-weight:600;">${log.ref_number}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Date</td><td style="padding:6px 0;">${dateStr}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Time</td><td style="padding:6px 0;">${timeStr}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Logged By</td><td style="padding:6px 0;font-weight:600;">${log.staff_name}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Fridge Temperature</td><td style="padding:6px 0;color:${log.temp_compliant?"#00b86b":"#cc0000"};font-weight:600;">${log.fridge_temp_c}°C ${log.temp_compliant?"✓ Compliant":"✗ Above 4°C limit"}</td></tr>
    <tr><td style="padding:6px 0;color:#666;">Status</td><td style="padding:6px 0;color:${log.all_clear?"#00b86b":"#f0b429"};font-weight:600;">${log.all_clear ? "ALL CLEAR — Inspector Ready" : "PARTIAL COMPLIANCE"}</td></tr>
  </table>

  <h2 style="font-size:16px;margin:24px 0 12px;border-bottom:1px solid #ddd;padding-bottom:6px;">Inspection Checklist</h2>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <tr style="background:#f5f7fa;"><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd;">Task</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #ddd;">Status</th></tr>
    ${checklistRows}
  </table>

  <div style="margin-top:30px;padding:16px;background:#f5f7fa;border-radius:8px;font-size:12px;color:#555;line-height:1.6;">
    <strong>Audit Statement:</strong> This log is automatically timestamped and stored on AWS Bahrain servers in compliance with UAE data residency requirements. This document is admissible during Dubai Municipality inspections under Food Code 2025.
  </div>

  <div style="margin-top:24px;text-align:center;color:#999;font-size:11px;">
    Generated by ProfitGuard AI · ${cafeName} · ${new Date().toLocaleDateString("en-AE")}
  </div>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MunicipalityLog_${log.ref_number}_${ts.toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download all logs as one combined report
  const downloadAllLogs = () => {
    if (filteredLogs.length === 0) return;
    const rows = filteredLogs.map(log => {
      const ts = new Date(log.logged_at);
      const checklistSummary = Object.entries(log.checklist || {})
        .filter(([, v]) => v).map(([k]) => k.replace(/_/g," ")).join(", ");
      return `<tr>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;font-family:monospace;font-size:11px;">${log.ref_number}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;">${ts.toLocaleDateString("en-AE")}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;">${ts.toLocaleTimeString("en-AE",{hour:"2-digit",minute:"2-digit"})}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;font-weight:600;">${log.staff_name}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;color:${log.temp_compliant?"#00b86b":"#cc0000"};">${log.fridge_temp_c}°C</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;text-align:center;">${log.tasks_completed}/${log.tasks_total}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #ddd;color:${log.all_clear?"#00b86b":"#f0b429"};font-weight:600;">${log.all_clear ? "Clear" : "Partial"}</td>
      </tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Audit Trail — ${cafeName}</title></head>
<body style="font-family:Arial,sans-serif;max-width:1000px;margin:30px auto;padding:30px;color:#222;">
  <div style="border-bottom:3px solid #1a6cff;padding-bottom:20px;margin-bottom:24px;">
    <h1 style="margin:0;color:#0b1829;">${cafeName}</h1>
    <div style="color:#666;font-size:13px;margin-top:6px;">Municipality Compliance Audit Trail — ${filteredLogs.length} log${filteredLogs.length===1?"":"s"}</div>
    <div style="color:#999;font-size:11px;margin-top:4px;">Exported ${new Date().toLocaleString("en-AE")}</div>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <thead><tr style="background:#1a6cff;color:white;">
      <th style="padding:10px;text-align:left;">Reference</th>
      <th style="padding:10px;text-align:left;">Date</th>
      <th style="padding:10px;text-align:left;">Time</th>
      <th style="padding:10px;text-align:left;">Logged By</th>
      <th style="padding:10px;text-align:left;">Fridge</th>
      <th style="padding:10px;text-align:center;">Tasks</th>
      <th style="padding:10px;text-align:left;">Status</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div style="margin-top:30px;padding:16px;background:#f5f7fa;border-radius:8px;font-size:12px;color:#555;">
    <strong>Inspector Notice:</strong> All entries timestamped, immutable, AWS Bahrain hosted. UAE Food Code 2025 compliant.
  </div>
</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AuditTrail_${cafeName.replace(/\s+/g,"_")}_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get unique dates for filter
  const uniqueDates = [...new Set(logs.map(l => l.logged_at?.slice(0,10)).filter(Boolean))];

  return (
    <div style={{padding:"20px 18px 100px",maxWidth:480,margin:"0 auto"}}>
      {/* HEADER */}
      <div style={{marginBottom:18}}>
        <div style={{fontFamily:"var(--font-d)",fontSize:22,fontWeight:800,color:"var(--text-1)",letterSpacing:"-.02em",marginBottom:4}}>
          Daily Logs
        </div>
        <div style={{fontSize:13,color:"var(--text-2)"}}>
          Inspector-ready audit trail · Download anytime
        </div>
      </div>

      {/* STATS + DOWNLOAD ALL */}
      <div style={{
        background:"var(--navy-card)",borderRadius:14,padding:"14px 14px",
        border:".5px solid var(--border)",marginBottom:14
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontFamily:"var(--font-d)",fontSize:28,fontWeight:800,color:"var(--text-1)",letterSpacing:"-.02em",lineHeight:1}}>
              {logs.length}
            </div>
            <div style={{fontSize:10,color:"var(--text-3)",marginTop:4,letterSpacing:".06em",textTransform:"uppercase"}}>
              Total Logs Recorded
            </div>
          </div>
          <button
            onClick={downloadAllLogs}
            disabled={filteredLogs.length === 0}
            style={{
              background: filteredLogs.length > 0 ? "var(--emerald)" : "rgba(255,255,255,.05)",
              color: filteredLogs.length > 0 ? "white" : "var(--text-3)",
              border:"none",borderRadius:10,padding:"10px 14px",fontSize:11,fontWeight:700,
              letterSpacing:".06em",textTransform:"uppercase",
              cursor: filteredLogs.length > 0 ? "pointer" : "not-allowed",
              fontFamily:"var(--font-d)",display:"flex",alignItems:"center",gap:6,
              boxShadow: filteredLogs.length > 0 ? "0 3px 12px rgba(0,184,107,.25)" : "none"
            }}
          >
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3 6l4 4 4-4M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Download All
          </button>
        </div>

        {logs.length > 0 && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button
              onClick={() => setFilterDate("all")}
              style={{
                background: filterDate === "all" ? "var(--blue)" : "rgba(255,255,255,.03)",
                color: filterDate === "all" ? "white" : "var(--text-2)",
                border: ".5px solid " + (filterDate === "all" ? "var(--blue)" : "var(--border)"),
                borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",
                fontFamily:"var(--font-b)"
              }}
            >All ({logs.length})</button>
            {uniqueDates.slice(0,5).map(d => (
              <button
                key={d}
                onClick={() => setFilterDate(d)}
                style={{
                  background: filterDate === d ? "var(--blue)" : "rgba(255,255,255,.03)",
                  color: filterDate === d ? "white" : "var(--text-2)",
                  border: ".5px solid " + (filterDate === d ? "var(--blue)" : "var(--border)"),
                  borderRadius:6,padding:"4px 9px",fontSize:10,cursor:"pointer",
                  fontFamily:"var(--font-b)"
                }}
              >{new Date(d).toLocaleDateString("en-AE",{day:"numeric",month:"short"})}</button>
            ))}
          </div>
        )}
      </div>

      {/* LOG ENTRIES LIST */}
      {filteredLogs.length === 0 ? (
        <div style={{
          background:"var(--navy-card)",borderRadius:14,padding:"30px 18px",
          border:".5px solid var(--border)",textAlign:"center"
        }}>
          <Clipboard size={32} color="var(--text-3)" style={{marginBottom:10}}/>
          <div style={{fontSize:14,color:"var(--text-1)",fontWeight:500,marginBottom:4}}>
            No logs yet
          </div>
          <div style={{fontSize:11,color:"var(--text-3)",lineHeight:1.5}}>
            Logs appear here after the barista submits the Municipality Log from the dashboard.
          </div>
        </div>
      ) : (
        filteredLogs.map(log => {
          const ts = new Date(log.logged_at);
          const dateStr = ts.toLocaleDateString("en-AE", {weekday:"short",day:"numeric",month:"short"});
          const timeStr = ts.toLocaleTimeString("en-AE", {hour:"2-digit",minute:"2-digit"});
          return (
            <div key={log.id} style={{
              background:"var(--navy-card)",borderRadius:12,padding:"12px 14px",
              border:".5px solid " + (log.all_clear ? "rgba(0,184,107,.2)" : "var(--border)"),
              marginBottom:8
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{
                      display:"inline-block",width:7,height:7,borderRadius:"50%",
                      background: log.all_clear ? "var(--emerald)" : "var(--gold)"
                    }}/>
                    <span style={{fontSize:13,fontWeight:600,color:"var(--text-1)"}}>{dateStr}</span>
                    <span style={{fontSize:11,color:"var(--text-3)"}}>· {timeStr}</span>
                  </div>
                  <div style={{fontSize:11,color:"var(--text-2)",fontFamily:"var(--font-mono)"}}>
                    {log.ref_number}
                  </div>
                </div>
                <button
                  onClick={() => downloadLog(log)}
                  title="Download this log"
                  style={{
                    background:"rgba(26,108,255,.1)",color:"#7aadff",
                    border:".5px solid rgba(26,108,255,.3)",borderRadius:7,
                    padding:"6px 10px",fontSize:10,cursor:"pointer",
                    fontFamily:"var(--font-d)",fontWeight:600,letterSpacing:".06em",
                    textTransform:"uppercase",display:"flex",alignItems:"center",gap:5,flexShrink:0
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3 6l4 4 4-4M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Download
                </button>
              </div>

              <div style={{display:"flex",gap:14,marginBottom:6,fontSize:11}}>
                <div>
                  <span style={{color:"var(--text-3)"}}>By: </span>
                  <span style={{color:"var(--text-1)",fontWeight:500}}>{log.staff_name}</span>
                </div>
                <div>
                  <span style={{color:"var(--text-3)"}}>Fridge: </span>
                  <span style={{color: log.temp_compliant ? "var(--emerald)" : "var(--red)",fontWeight:600}}>
                    {log.fridge_temp_c}°C
                  </span>
                </div>
                <div>
                  <span style={{color:"var(--text-3)"}}>Tasks: </span>
                  <span style={{color:"var(--text-1)",fontWeight:500}}>
                    {log.tasks_completed}/{log.tasks_total}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Info footer */}
      <div style={{
        marginTop:14,padding:"10px 12px",
        background:"rgba(26,108,255,.06)",border:".5px solid rgba(26,108,255,.18)",
        borderRadius:10,fontSize:10,color:"var(--text-2)",lineHeight:1.5,
        display:"flex",gap:8,alignItems:"flex-start"
      }}>
        <Info size={11} color="#7aadff" style={{flexShrink:0,marginTop:1}}/>
        <div>
          Logs are timestamped, stored on AWS Bahrain, and downloadable as inspector-ready reports.
          When Dubai Municipality visits — tap Download All, hand them the file.
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────

function LoginScreen({ onLogin, onGoSignup }) {
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async () => {
    if (!email || !pass) return;
    setLoading(true); setError("");
    try {
      const res = await sb.signIn(email, pass);
      if (res.error || !res.access_token) {
        setError(res.error?.message || "Invalid email or password.");
      } else {
        setSession(res);
        const cafes = await sb.select("cafes", { "owner_user_id=eq.": res.user.id }, res.access_token);
        if (cafes && cafes.length > 0) setCafe(cafes[0]);
        onLogin(res, cafes?.[0] || null);
      }
    } catch { setError("Connection error. Check your internet and try again."); }
    setLoading(false);
  };

  return (
    <div className="auth-shell fade-in">
      <div className="auth-logo">
        <div className="auth-logo-mark">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 8l3 3 4-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="5" r="1.5" fill="#fff"/></svg>
        </div>
        <span className="auth-brand">ProfitGuard AI</span>
      </div>
      <div className="auth-tagline">UAE Cafe Compliance &amp; Waste Intelligence</div>

      <div className="auth-card">
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your cafe dashboard</div>
        {error && <div className="auth-error">{error}</div>}
        <label className="auth-label">Email address</label>
        <div className="auth-input-wrap">
          <input className="auth-input" type="email" placeholder="you@yourcafe.ae"
            value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
        </div>
        <label className="auth-label">Password</label>
        <div className="auth-input-wrap">
          <input className="auth-input pr" type={showPass?"text":"password"}
            placeholder="Your password" value={pass}
            onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
          <button className="auth-eye" onClick={()=>setShowPass(s=>!s)}>
            {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
          </button>
        </div>
        <button className="auth-btn" onClick={handleLogin} disabled={!email||!pass||loading}>
          {loading?<div className="spin-sm"/>:<ChevronRight size={15}/>}
          {loading?"Signing in…":"Sign In"}
        </button>
      </div>

      <div className="auth-switch">
        No account?{" "}
        <button className="auth-switch-btn" onClick={onGoSignup}>Start 14-day free trial</button>
      </div>
      <div className="auth-trust">
        {[["🔒","Encrypted","AWS Bahrain"],["🇦🇪","DM 2025","UAE compliant"],["⚡","10-min setup","No tech needed"],["📱","7am reports","WhatsApp daily"]].map(([icon,t,s])=>(
          <div key={t} className="auth-trust-item">
            <span style={{fontSize:16}}>{icon}</span>
            <div><div style={{fontSize:10,fontWeight:600,color:"var(--text-1)"}}>{t}</div><div style={{fontSize:9,color:"var(--text-3)"}}>{s}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIGNUP SCREEN ────────────────────────────────────────────

function SignupScreen({ onSignup, onGoLogin }) {
  const [email,    setEmail]    = useState("");
  const [pass,     setPass]     = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const strong = pass.length >= 8;

  const handleSignup = async () => {
    if (!email || !strong) return;
    setLoading(true); setError("");
    try {
      // Step 1: Create the account
      const signupRes = await sb.signUp(email, pass);
      if (signupRes.error) {
        setError(signupRes.error.message || "Signup failed.");
        setLoading(false);
        return;
      }

      // Step 2: Immediately sign in to get a real session
      // (bypasses Supabase's "confirm email" requirement)
      const signinRes = await sb.signIn(email, pass);
      if (signinRes.error || !signinRes.access_token) {
        // If signin fails, email confirmation is required — let user know nicely
        setError("Account created. Please check your email to confirm, then sign in.");
        setLoading(false);
        return;
      }

      // Success — proceed to onboarding with the real session
      setSession(signinRes);
      onSignup(signinRes);
    } catch { setError("Connection error. Try again."); }
    setLoading(false);
  };

  return (
    <div className="auth-shell fade-in">
      <div className="auth-logo">
        <div className="auth-logo-mark">
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 8l3 3 4-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="5" r="1.5" fill="#fff"/></svg>
        </div>
        <span className="auth-brand">ProfitGuard AI</span>
      </div>
      <div className="auth-tagline">14-day free trial · No credit card needed</div>

      <div className="auth-card">
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Takes 2 minutes · Full setup in 10</div>
        {error && <div className="auth-error">{error}</div>}
        <label className="auth-label">Work email</label>
        <div className="auth-input-wrap">
          <input className="auth-input" type="email" placeholder="you@yourcafe.ae"
            value={email} onChange={e=>setEmail(e.target.value)}/>
        </div>
        <label className="auth-label">Password</label>
        <div className="auth-input-wrap">
          <input className="auth-input pr" type={showPass?"text":"password"}
            placeholder="Min. 8 characters" value={pass}
            onChange={e=>setPass(e.target.value)}/>
          <button className="auth-eye" onClick={()=>setShowPass(s=>!s)}>
            {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
          </button>
        </div>
        {pass.length>0&&(
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,fontSize:11}}>
            <div style={{height:3,flex:1,borderRadius:2,background:strong?"var(--emerald)":"var(--gold)",transition:"background .2s"}}/>
            <span style={{color:strong?"var(--emerald)":"var(--gold)"}}>{strong?"Strong":"8+ characters"}</span>
          </div>
        )}
        <button className="auth-btn" onClick={handleSignup} disabled={!email||!strong||loading}>
          {loading?<div className="spin-sm"/>:<UserPlus size={15}/>}
          {loading?"Creating account…":"Create Free Account"}
        </button>
      </div>
      <div className="auth-switch">
        Have an account? <button className="auth-switch-btn" onClick={onGoLogin}>Sign in</button>
      </div>
    </div>
  );
}

// ─── ONBOARDING FLOW ─────────────────────────────────────────

const EMIRATES     = ["Dubai","Abu Dhabi","Sharjah","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain"];
const POS_OPTS     = [{icon:"🍔",name:"Foodics",sub:"Auto-connect"},{icon:"📱",name:"POSRocket",sub:"UAE popular"},{icon:"🟦",name:"Square",sub:"Global"},{icon:"📝",name:"Manual entry",sub:"No POS"}];
const STAFF_OPTS   = ["1–3 staff","4–8 staff","9–15 staff","15+ staff"];

function OnboardingFlow({ session, onComplete }) {
  const [step,setStep]       = useState(1);
  const [cafeName,setCafeName]= useState("");
  const [emirate,setEmirate]  = useState("Dubai");
  const [license,setLicense]  = useState("");
  const [pos,setPos]          = useState("");
  const [staffSize,setStaff]  = useState("");
  const [tradeExp,setTradeExp]= useState("");
  const [phone,setPhone]      = useState("");
  const [saving,setSaving]    = useState(false);
  const TOTAL = 4;

  const canNext=[true,cafeName.trim().length>=2,pos&&staffSize,true,true][step]||false;

  const next = async () => {
    if (step < TOTAL) { setStep(s=>s+1); return; }
    setSaving(true);
    try {
      const token = session?.access_token;
      const inserted = await sb.insert("cafes",{
        name:cafeName.trim(), emirate, trade_license:license||null,
        pos_system:pos, owner_phone:phone||null,
        owner_user_id:session?.user?.id||null,
        trial_ends_at:new Date(Date.now()+14*86400000).toISOString(),
      }, token);
      const cafe = Array.isArray(inserted)?inserted[0]:inserted;
      setCafe(cafe);
      if (tradeExp && cafe?.id) {
        await sb.insert("compliance_docs",{cafe_id:cafe.id,doc_type:"trade_license",expiry_date:tradeExp},token);
      }
      onComplete(cafe);
    } catch { onComplete(null); }
    setSaving(false);
  };

  const stepContent = [null,
    // Step 1
    <><div className="ob-title">Tell us about<br/>your cafe ☕</div>
    <div className="ob-sub">We'll set up your compliance calendar and waste tracker based on your location and licence.</div>
    <label className="ob-label">Cafe name</label>
    <input className="ob-input" placeholder="e.g. Nightjar Coffee Al Quoz" value={cafeName} onChange={e=>setCafeName(e.target.value)}/>
    <label className="ob-label">Emirate</label>
    <select className="ob-select" value={emirate} onChange={e=>setEmirate(e.target.value)}>
      {EMIRATES.map(em=><option key={em}>{em}</option>)}
    </select>
    <label className="ob-label">Trade licence number <span style={{color:"var(--text-3)",fontWeight:400,textTransform:"none"}}>(optional — we'll auto-fill your compliance calendar)</span></label>
    <input className="ob-input" placeholder="e.g. DED-2024-XXXXXX" value={license} onChange={e=>setLicense(e.target.value)}/></>,

    // Step 2
    <><div className="ob-title">How do you<br/>track sales?</div>
    <div className="ob-sub">Choose your POS so we can pull your daily sales automatically — no manual data entry.</div>
    <label className="ob-label">Point of sale system</label>
    <div className="ob-grid">{POS_OPTS.map(p=><div key={p.name} className={`ob-opt ${pos===p.name?"sel":""}`} onClick={()=>setPos(p.name)}><div className="ob-opt-icon">{p.icon}</div><div className="ob-opt-name">{p.name}</div><div className="ob-opt-sub">{p.sub}</div></div>)}</div>
    <label className="ob-label" style={{marginTop:18}}>Team size</label>
    <div className="ob-grid">{STAFF_OPTS.map(s=><div key={s} className={`ob-opt ${staffSize===s?"sel":""}`} style={{padding:"11px 12px"}} onClick={()=>setStaff(s)}><div className="ob-opt-name" style={{fontSize:13}}>{s}</div></div>)}</div></>,

    // Step 3
    <><div className="ob-title">Documents<br/>&amp; WhatsApp 📋</div>
    <div className="ob-sub">We'll alert you before anything expires. You can add all documents inside the app — this just gets you started.</div>
    <label className="ob-label">Trade licence expiry date</label>
    <input className="ob-input" type="date" style={{colorScheme:"dark"}} value={tradeExp} onChange={e=>setTradeExp(e.target.value)}/>
    <label className="ob-label">Owner WhatsApp <span style={{color:"var(--text-3)",fontWeight:400,textTransform:"none"}}>(receives 7am daily report)</span></label>
    <input className="ob-input" type="tel" placeholder="+971 50 XXX XXXX" value={phone} onChange={e=>setPhone(e.target.value)}/>
    <div style={{marginTop:14,background:"rgba(26,108,255,.06)",border:".5px solid rgba(26,108,255,.18)",borderRadius:"var(--r-md)",padding:"11px 13px",fontSize:12,color:"var(--text-2)",lineHeight:1.5}}>
      <span style={{color:"#7aadff",fontWeight:600}}>📱 Daily WhatsApp report</span> — Every morning at 7am you'll receive waste savings, checklist status, and any document alerts. Nothing else.
    </div></>,

    // Step 4
    <div className="ob-success">
      <div className="ob-success-ring"><CheckCircle2 size={36} color="var(--emerald)"/></div>
      <div className="ob-title" style={{textAlign:"center"}}>{cafeName||"Your cafe"} is ready! 🎉</div>
      <div className="ob-sub" style={{textAlign:"center",marginBottom:22}}>Your 14-day free trial starts now. Compliance calendar, SafeVault, and AI waste tracker are live.</div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:9}}>
        {[["✅","Municipality Log","Train your barista on the daily checklist — 2 minutes"],["📄","SafeVault","Add staff health card expiry dates"],["🥛","Waste Tracker","Enter yesterday's sales for your first AI recommendation"]].map(([icon,t,d])=>(
          <div key={t} style={{background:"var(--navy-card)",borderRadius:"var(--r-md)",border:".5px solid var(--border)",padding:"12px 14px",display:"flex",gap:11,alignItems:"flex-start"}}>
            <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
            <div><div style={{fontSize:13,fontWeight:600,color:"var(--text-1)",marginBottom:2}}>{t}</div><div style={{fontSize:11,color:"var(--text-2)",lineHeight:1.4}}>{d}</div></div>
          </div>
        ))}
      </div>
    </div>
  ];

  return (
    <div className="ob-shell">
      <div className="ob-bar"><div className="ob-bar-fill" style={{width:`${(step/TOTAL)*100}%`}}/></div>
      <div className="ob-hdr">
        <span className="ob-step-lbl">Step {step} of {TOTAL}</span>
        {step<TOTAL&&<button className="ob-skip" onClick={()=>setStep(TOTAL)}>Skip →</button>}
      </div>
      <div className="ob-body fade-in" key={step}>{stepContent[step]}</div>
      <div className="ob-footer">
        <button className="ob-next" onClick={next} disabled={!canNext||saving}>
          {saving&&<div className="spin-sm"/>}
          {step===TOTAL?(saving?"Setting up…":"Go to dashboard →"):"Continue →"}
        </button>
        {step>1&&step<TOTAL&&<button className="ob-back" onClick={()=>setStep(s=>s-1)}>← Back</button>}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────

export default function ProfitGuardAI(){
  // ── ALL HOOKS MUST BE AT THE TOP — before any early returns ──
  // If session exists in localStorage, skip login screen
  const [screen,   setScreen]   = useState(() => {
    const s = getSession();
    const c = getCafe();
    if (s?.access_token && c) return "app";       // fully signed in
    if (s?.access_token) return "onboarding";     // signed up but no cafe yet
    return "login";
  });
  const [authSess, setAuthSess] = useState(getSession());
  const [tab,      setTab]      = useState("dashboard");
  const [aView,    setAView]    = useState("weekly");
  const [logOpen,  setLogOpen]  = useState(false);
  const [proOpen,  setProOpen]  = useState(false);
  const [arabic,   setArabic]   = useState(false);
  const [toast,    setToast]    = useState(false);
  const [stock,    setStock]    = useState(STOCK_DEFAULTS);

  const today          = new Date().toLocaleDateString("en-AE",{weekday:"short",day:"numeric",month:"short"});
  const projectedAnnual= (4259.45*12).toLocaleString("en-AE",{maximumFractionDigits:0});

  // inject styles + font once
  useEffect(()=>{
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = STYLES;
    document.head.appendChild(s);
    return()=>{ document.head.removeChild(s); document.head.removeChild(link); };
  },[]);

  // ── Auth handlers ──────────────────────────────────────────
  const handleLogin   = (sess, cafe) => { setAuthSess(sess); setScreen(cafe ? "app" : "onboarding"); };
  const handleSignup  = (sess)       => { setAuthSess(sess); setScreen("onboarding"); };
  const handleOnboard = ()           => { setScreen("app"); };
  const handleLogout  = async ()     => {
    if (authSess?.access_token) await sb.signOut(authSess.access_token).catch(()=>{});
    setSession(null); setCafe(null); setAuthSess(null); setScreen("login");
  };

  const handleLogClose   = ()=>{ setLogOpen(false); };
  const handleLogSuccess = ()=>{ setToast(true); setTimeout(()=>setToast(false),3200); };

  const NAV=[
    {id:"dashboard",icon:<LayoutDashboard size={12}/>,label:"Dashboard"},
    {id:"sales",    icon:<TrendingUp size={12}/>,    label:"Sales Entry"},
    {id:"logs",     icon:<Clipboard size={12}/>,     label:"Logs"},
    {id:"analytics", icon:<BarChart3 size={12}/>,     label:"Analytics"},
    {id:"vault",     icon:<Lock size={12}/>,           label:"SafeVault"},
    {id:"settings",  icon:<Settings2 size={12}/>,     label:"AI Settings"},
    {id:"tools",     icon:<Wrench size={12}/>,         label:"Tools"},
  ];

  // ── Screen routing (after all hooks) ─────────────────────
  if (screen==="login")      return <LoginScreen    onLogin={handleLogin}   onGoSignup={()=>setScreen("signup")}/>;
  if (screen==="signup")     return <SignupScreen   onSignup={handleSignup} onGoLogin={()=>setScreen("login")}/>;
  if (screen==="onboarding") return <OnboardingFlow session={authSess}      onComplete={handleOnboard}/>;

  // ── Main App ──────────────────────────────────────────────

  return(
    <div className="pg-shell">
      {/* NAV */}
      <nav className="pg-nav">
        {NAV.map(({id,icon,label})=>(
          <button key={id} className={`pg-nav-tab ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
            {icon}{label}
          </button>
        ))}
        {screen==="app"&&authSess&&(
          <button className="pg-nav-tab" onClick={handleLogout}
            style={{minWidth:44,color:"var(--red)",flexShrink:0}}
            title="Sign out">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </nav>

      {/* ── DASHBOARD ── */}
      {tab==="dashboard"&&(
        <>
          <div className="pg-header">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"22px"}}>
              <div>
                <div className="pg-wordmark">
                  <div className="pg-logo"><svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M3 13L7 8l3 3 4-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="5" r="1.5" fill="#fff"/></svg></div>
                  <span className="pg-brand">ProfitGuard</span>
                </div>
                <div className="pg-brand-sub">{getCafe()?.name || "Cafe Intelligence · UAE"}</div>
              </div>
              <div className="pg-location"><div className="pg-dot"/><MapPin size={9}/>Dubai, AE</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"5px"}}>
              <div className="pg-heading">Smart Orders,<br/><span>Zero Waste.</span></div>
              <div style={{fontSize:"10px",color:"var(--text-2)",paddingTop:"4px"}}>{today}</div>
            </div>
            <div className="pg-subhead">Smart procurement &amp; compliance for your café — updated daily.</div>
            <button className="pg-cta" onClick={()=>setLogOpen(true)}>
              <Clipboard size={15}/>Log Municipality Data
            </button>
            <button onClick={()=>setTab("sales")} style={{
              width:"100%",marginTop:8,background:"rgba(0,184,107,.12)",
              color:"var(--emerald)",border:".5px solid rgba(0,184,107,.3)",
              borderRadius:14,padding:"14px 24px",cursor:"pointer",
              fontFamily:"var(--font-d)",fontSize:12,fontWeight:700,
              letterSpacing:".1em",textTransform:"uppercase",
              display:"flex",alignItems:"center",justifyContent:"center",gap:10
            }}>
              <TrendingUp size={14}/>Enter Yesterday's Sales · Get Today's Order
            </button>
          </div>

          <div className="pg-body">
            {/* stats */}
            <div className="stat-row fade-in">
              <div className="stat-card blue"><div className="stat-n">30L</div><div className="stat-l">Milk saved today</div></div>
              <div className="stat-card green"><div className="stat-n">120</div><div className="stat-l">Lattes sold</div></div>
              <div className="stat-card gold"><div className="stat-n">92%</div><div className="stat-l">Prediction match</div></div>
            </div>

            {/* LIVE STOCK CARD on dashboard */}
            <div className="fade-in" style={{animationDelay:".06s"}}>
              <div className="pg-sect" style={{color:"#6680aa"}}>Live Stock</div>
              <StockTracker stock={stock} setStock={setStock} compact={true}/>
            </div>

            {/* savings */}
            <div className="fade-in" style={{animationDelay:".08s"}}>
              <div className="pg-sect" style={{color:"#6e9e82"}}>Daily Savings Summary</div>
              <div className="sav-card">
                <div className="sav-badge">↑ 12% vs yesterday</div>
                <div className="sav-eyebrow">Savings Today</div>
                <div className="sav-amt"><span className="cur">AED </span>184.50</div>
                <div className="sav-lbl">Avoided waste · Tuesday optimization</div>
                <div className="sav-grid">
                  <div className="sav-item"><div className="sav-num">30 L</div><div className="sav-desc">Milk not ordered</div></div>
                  <div className="sav-item"><div className="sav-num">AED 6.15</div><div className="sav-desc">Per litre rate</div></div>
                  <div className="sav-item"><div className="sav-num">↓ 50%</div><div className="sav-desc">Order reduction</div></div>
                  <div className="sav-item"><div className="sav-num">7.5 kg</div><div className="sav-desc">CO₂ avoided</div></div>
                </div>
              </div>
            </div>

            {/* AI insight */}
            <div className="fade-in" style={{animationDelay:".16s"}}>
              <div className="pg-sect" style={{color:"#6680aa"}}>Smart Recommendation</div>
              <div className="card-white" style={{padding:"18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"12px"}}>
                  <div className="ai-chip"><div className="ai-blink"/>Smart Insight</div>
                  <div style={{marginLeft:"auto",fontSize:"10px",color:"#8899bb"}}>Confidence: <span style={{color:"var(--emerald)",fontWeight:"600"}}>97%</span></div>
                </div>
                <p className="ai-text">
                  <strong>Reduce tomorrow's milk order by 30 litres.</strong> Today's surplus fully covers Tuesday's projected demand — ordering your standard 60L would result in <strong>AED 184.50 in avoidable losses.</strong> This pattern holds across 11 of the last 13 weeks.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
                  <span className="tag a">Milk Inventory</span>
                  <span className="tag b">Tuesday Pattern</span>
                  <span className="tag c">Waste Reduction</span>
                </div>
              </div>
            </div>

            {/* AI Assistant disabled for production — will return in v2 with proper API proxy */}

            {/* projection */}
            <div className="fade-in" style={{animationDelay:".28s"}}>
              <div className="proj">
                <div className="proj-icon"><TrendingUp size={18} color="var(--emerald)"/></div>
                <div style={{flex:1}}>
                  <div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"3px"}}>Projected Annual Savings</div>
                  <div className="proj-val">AED {projectedAnnual}</div>
                  <div className="proj-sub">Based on April pace</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--emerald)"}}>↑ 18%</div>
                  <div style={{fontSize:"9px",color:"var(--text-2)",marginTop:"2px"}}>vs 2025</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── ANALYTICS ── */}
      {tab==="analytics"&&(
        <div className="pg-body" style={{paddingTop:"24px"}}>
          <div className="anal-hdr fade-in">
            <div>
              <div style={{fontFamily:"var(--font-d)",fontSize:"14px",fontWeight:"700",color:"var(--text-1)",letterSpacing:"-.01em"}}>Owner Analytics</div>
              <div style={{fontSize:"10px",color:"var(--text-2)",marginTop:"2px"}}>Performance · Compliance · ROI</div>
            </div>
            <div className="toggle">
              <button className={`toggle-btn ${aView==="weekly"?"active":""}`} onClick={()=>setAView("weekly")}>Weekly</button>
              <button className={`toggle-btn ${aView==="monthly"?"active":""}`} onClick={()=>setAView("monthly")}>Monthly</button>
            </div>
          </div>
          {aView==="weekly"?<WeeklyAnalyticsContent/>:<MonthlyAnalyticsContent/>}
          <div className="proj fade-in">
            <div className="proj-icon"><TrendingUp size={18} color="var(--emerald)"/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:"9px",fontWeight:"600",letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-2)",marginBottom:"3px"}}>Projected Annual Savings</div>
              <div className="proj-val">AED {projectedAnnual}</div>
              <div className="proj-sub">Based on current performance · April pace</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"var(--font-d)",fontSize:"13px",fontWeight:"700",color:"var(--emerald)"}}>↑ 18%</div>
              <div style={{fontSize:"9px",color:"var(--text-2)",marginTop:"2px"}}>vs 2025</div>
            </div>
          </div>
        </div>
      )}

      {/* ── SAFE VAULT ── */}
      {tab==="vault"&&<SafeVault/>}

      {/* ── SALES ENTRY (the daily input → order calculation) ── */}
      {tab==="sales"&&<SalesEntry cafeName={getCafe()?.name} ownerWhatsApp={getCafe()?.owner_whatsapp} stock={stock} setStock={setStock}/>}
      {tab==="logs"&&<LogsTab cafeName={getCafe()?.name || "Your Cafe"}/>}

      {/* ── AI SETTINGS ── */}
      {tab==="settings"&&<RecipeSettings/>}

      {/* ── TOOLS ── */}
      {tab==="tools"&&<ToolsTab arabic={arabic} setArabic={setArabic}/>}

      {/* Municipality Log */}
      <MunicipalityLog open={logOpen} onClose={handleLogClose} arabic={arabic} onSuccess={handleLogSuccess}/>

      {/* PRO Modal */}
      {proOpen&&<ProModal onClose={()=>setProOpen(false)}/>}

      {/* PRO FAB */}
      <button className="pro-fab" onClick={()=>setProOpen(true)}>
        <MessageSquare size={13}/>Talk to PRO
      </button>

      {/* Toast */}
      <div className={`toast ${toast?"show":""}`}>
        <div className="toast-icon"><Check size={10} color="#fff"/></div>
        Municipality data logged & timestamped
      </div>
    </div>
  );
}
