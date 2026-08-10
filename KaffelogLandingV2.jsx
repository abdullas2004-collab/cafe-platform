import React, { useState } from "react";

/* ============================================================
   KAFFELOG — Landing Page v2 ("Flat White")
   Brand-matched to the Kaffelog app:
   bone #F7F4EE · card #FFFFFF · ink #1A1A18 · stone #6E6A5E
   sage #4A5D43 (primary action) · rust #B5502A (accents, sparingly)
   border #E7E1D5 · Fraunces (display) + Inter (UI)
   Signature element: thermal-receipt motif (café-native)
   ============================================================ */

const T = {
  bone: "#F7F4EE",
  card: "#FFFFFF",
  ink: "#1A1A18",
  stone: "#6E6A5E",
  sage: "#4A5D43",
  sageSoft: "#EEF1EA",
  rust: "#B5502A",
  rustSoft: "#F7EBE4",
  border: "#E7E1D5",
};

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
    .kf * { box-sizing: border-box; }
    .kf { font-family: Inter, -apple-system, sans-serif; }
    .kf .display { font-family: Fraunces, Georgia, serif; }
    .kf ::selection { background: ${T.sageSoft}; }
    .kf [id] { scroll-margin-top: 76px; }
    .kf { overflow-x: clip; }
    @media (max-width: 640px) {
      .kf-navlinks { display: none !important; }
    }
    @media (prefers-reduced-motion: reduce) { .kf * { transition: none !important; } }
  `}</style>
);

/* Scroll that works everywhere — including sandboxed previews where
   hash-anchor (#id) navigation is blocked. Respects reduced-motion. */
const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* ---------------- primitives ---------------- */

const Btn = ({ children, kind = "primary", onClick, href, to }) => {
  if (to) {
    onClick = () => goTo(to);
    href = undefined;
  }
  if (onClick) href = undefined;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 22px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    border: "1px solid transparent",
    transition: "background .15s ease",
  };
  const kinds = {
    primary: { background: T.sage, color: "#FFF" },
    ghost: {
      background: "transparent",
      color: T.ink,
      border: `1px solid ${T.border}`,
    },
    ink: { background: T.ink, color: "#FFF" },
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      style={{ ...base, ...kinds[kind], fontFamily: "inherit" }}
    >
      {children}
    </Tag>
  );
};

const Eyebrow = ({ children, tone = "sage" }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: tone === "rust" ? T.rust : T.sage,
      background: tone === "rust" ? T.rustSoft : T.sageSoft,
      padding: "5px 10px",
      borderRadius: 999,
    }}
  >
    {children}
  </span>
);

const Section = ({ children, alt = false, id }) => (
  <section
    id={id}
    style={{
      background: alt ? T.card : T.bone,
      borderTop: `1px solid ${T.border}`,
    }}
  >
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px" }}>
      {children}
    </div>
  </section>
);

/* ---------------- receipt (signature element) ---------------- */

const Receipt = () => (
  <div
    style={{
      width: 240,
      background: "#FFFDF8",
      border: `1px solid ${T.border}`,
      borderRadius: 6,
      padding: "18px 16px 26px",
      fontFamily: "'SF Mono', ui-monospace, Menlo, monospace",
      fontSize: 11.5,
      color: T.ink,
      boxShadow: "0 12px 30px rgba(26,26,24,0.08)",
      transform: "rotate(2deg)",
    }}
  >
    <div style={{ textAlign: "center", fontWeight: 700, letterSpacing: "0.1em" }}>
      KAFFELOG
    </div>
    <div style={{ textAlign: "center", color: T.stone, marginTop: 2 }}>
      TOMORROW'S ORDER · WED 15 JUL
    </div>
    <div style={{ borderTop: `1px dashed ${T.border}`, margin: "10px 0" }} />
    {[
      ["Full-fat milk", "9 L"],
      ["Oat (Oatside)", "2 L"],
      ["Almond", "1 L"],
    ].map(([k, v]) => (
      <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
        <span>{k}</span>
        <span style={{ fontWeight: 700 }}>{v}</span>
      </div>
    ))}
    <div style={{ borderTop: `1px dashed ${T.border}`, margin: "10px 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
      <span>TOTAL</span>
      <span>12 L</span>
    </div>
    <div style={{ color: T.sage, marginTop: 6 }}>▼ 3 L less than today</div>
    <div style={{ color: T.stone, marginTop: 2 }}>Wednesdays run slow.</div>
    <div style={{ textAlign: "center", color: T.stone, marginTop: 12 }}>
      · · · saved AED 21 · · ·
    </div>
  </div>
);

/* ---------------- phone mockup ---------------- */

const Phone = () => (
  <div
    style={{
      width: 280,
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 30,
      padding: 10,
      boxShadow: "0 20px 50px rgba(26,26,24,0.10)",
    }}
  >
    <div style={{ background: T.bone, borderRadius: 22, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.stone, fontWeight: 600 }}>
        <span>9:41</span>
        <span>Tue 14 Jul</span>
      </div>
      <div className="display" style={{ fontSize: 19, fontWeight: 600, marginTop: 12, color: T.ink }}>
        Morning checklist
      </div>
      <div style={{ fontSize: 12, color: T.stone, marginTop: 2 }}>
        Al Warqa branch · opens 7:00
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {[
          ["Fridge temp logged — 3.2°C", true],
          ["Milk counted — 14 L", true],
          ["Espresso dialed — 18g → 36g", true],
          ["Sanitizer buckets refreshed", false],
        ].map(([t, done]) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                flexShrink: 0,
                background: done ? T.sage : "transparent",
                border: `1.5px solid ${done ? T.sage : T.border}`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFF",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {done ? "✓" : ""}
            </span>
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: done ? T.stone : T.ink,
                textDecoration: done ? "line-through" : "none",
                textDecorationColor: T.border,
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          background: T.ink,
          color: "#FFF",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: "0.08em", opacity: 0.7, fontWeight: 600 }}>
          INSPECTION READY
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>
          June hygiene log → PDF
        </div>
      </div>
    </div>
  </div>
);

/* ---------------- nav ---------------- */

const Nav = ({ onGoSignup, onGoLogin }) => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(247,244,238,0.92)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderBottom: `1px solid ${T.border}`,
    }}
  >
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          className="display"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: T.ink,
            color: T.bone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          K
        </div>
        <span className="display" style={{ fontSize: 19, fontWeight: 600, color: T.ink }}>
          Kaffelog
        </span>
      </div>
      <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div className="kf-navlinks" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {[
            ["Features", "features"],
            ["Pricing", "pricing"],
            ["Install", "install"],
          ].map(([l, id]) => (
            <button
              key={l}
              onClick={() => goTo(id)}
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: T.stone,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={onGoLogin}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: T.stone,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          Log in
        </button>
        <Btn kind="ink" onClick={onGoSignup}>Start free trial</Btn>
      </nav>
    </div>
  </header>
);

/* ---------------- hero ---------------- */

const Hero = ({ onGoSignup }) => (
  <section style={{ background: T.bone }}>
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "72px 24px 84px",
        display: "flex",
        flexWrap: "wrap",
        gap: 48,
        alignItems: "center",
      }}
    >
      <div style={{ flex: "1 1 460px", minWidth: 300 }}>
        <Eyebrow>Built in Dubai · for UAE cafés 🇦🇪</Eyebrow>
        <h1
          className="display"
          style={{
            fontSize: "clamp(38px, 5.5vw, 58px)",
            lineHeight: 1.12,
            fontWeight: 600,
            color: T.ink,
            margin: "18px 0 0",
            letterSpacing: "-0.01em",
          }}
        >
          The quiet hour of work
          <br />
          every café owner hates —{" "}
          <span style={{ color: T.rust }}>done.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: T.stone, maxWidth: 460, marginTop: 18 }}>
          Kaffelog counts tomorrow's milk order from your real sales pattern,
          turns fridge-temperature checks into municipality-ready PDF logs, and
          reminds you before your trade licence or staff cards expire.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28, alignItems: "center" }}>
          <Btn onClick={onGoSignup} kind="primary">Start 14-day free trial</Btn>
          <span style={{ fontSize: 14, color: T.stone }}>
            No credit card · Set up in 5 minutes
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 30 }}>
          {["Foodics CSV compatible", "WhatsApp support", "Works on any phone"].map((b) => (
            <span
              key={b}
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: T.ink,
                background: T.card,
                border: `1px solid ${T.border}`,
                padding: "6px 11px",
                borderRadius: 999,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: "1 1 380px",
          minWidth: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Phone />
        <div style={{ paddingTop: 46 }}>
          <Receipt />
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- features ---------------- */

const Features = () => (
  <Section alt id="features">
    <Eyebrow>What it does</Eyebrow>
    <h2
      className="display"
      style={{ fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 600, color: T.ink, margin: "14px 0 0", lineHeight: 1.15 }}
    >
      Three jobs, done at the counter.
    </h2>
    <p style={{ color: T.stone, fontSize: 16, maxWidth: 520, marginTop: 12, lineHeight: 1.6 }}>
      No dashboards you'll never open. Kaffelog handles the tasks that cost
      real money when they slip — from the phone already in your apron.
    </p>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18,
        marginTop: 36,
      }}
    >
      {[
        {
          icon: "🥛",
          title: "Milk, counted for you",
          body:
            "Log yesterday's count in ten seconds. Kaffelog reads your two-week pattern — slow Wednesdays, Ramadan hours — and prints tomorrow's exact order.",
          stat: "Typical waste saved: AED 60–90 / day",
          tone: "sage",
        },
        {
          icon: "📋",
          title: "Inspection-ready, always",
          body:
            "Fridge temps, cleaning schedules, receiving checks — logged at the counter, exported as Dubai Municipality-format PDF logs in one tap.",
          stat: "Inspection prep: 30 seconds, not 3 hours",
          tone: "rust",
        },
        {
          icon: "🗂",
          title: "SafeVault renewals",
          body:
            "Trade licence, food-handler cards, pest-control contracts — stored in one vault that warns you 30, 14, and 3 days before anything expires.",
          stat: "Fines avoided: up to AED 10,000 each",
          tone: "sage",
        },
      ].map((f) => (
        <div
          key={f.title}
          style={{
            background: T.bone,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 26 }}>{f.icon}</div>
          <h3 className="display" style={{ fontSize: 21, fontWeight: 600, color: T.ink, margin: "12px 0 0" }}>
            {f.title}
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: T.stone, marginTop: 8, flex: 1 }}>
            {f.body}
          </p>
          <div
            style={{
              marginTop: 16,
              fontSize: 13,
              fontWeight: 700,
              color: f.tone === "rust" ? T.rust : T.sage,
              background: f.tone === "rust" ? T.rustSoft : T.sageSoft,
              padding: "9px 12px",
              borderRadius: 8,
            }}
          >
            {f.stat}
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ---------------- day timeline ---------------- */

const Day = () => (
  <Section>
    <Eyebrow tone="rust">A day with Kaffelog</Eyebrow>
    <h2
      className="display"
      style={{ fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 600, color: T.ink, margin: "14px 0 28px", lineHeight: 1.15 }}
    >
      From open to close, nothing slips.
    </h2>
    <div style={{ display: "grid", gap: 0 }}>
      {[
        ["6:55", "Barista opens the app", "Morning checklist is waiting. Fridge temp, milk count, dial-in — ticked at the counter."],
        ["14:30", "You check the day from anywhere", "Sales pace vs. last Tuesday, waste so far, and one number: tomorrow's milk order."],
        ["17:00", "Order sent", "12 litres, not 15. The 3 litres you didn't buy is profit you kept."],
        ["Any day", "Inspector walks in", "June's full hygiene log exports as a signed PDF in 30 seconds. Coffee stays hot."],
      ].map(([time, t, b], i, arr) => (
        <div key={time} style={{ display: "flex", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: T.sage,
                background: T.sageSoft,
                borderRadius: 999,
                padding: "5px 10px",
                whiteSpace: "nowrap",
              }}
            >
              {time}
            </div>
            {i < arr.length - 1 && (
              <div style={{ width: 1, flex: 1, background: T.border, margin: "6px 0" }} />
            )}
          </div>
          <div style={{ paddingBottom: i < arr.length - 1 ? 28 : 0 }}>
            <div style={{ fontSize: 16.5, fontWeight: 600, color: T.ink }}>{t}</div>
            <p style={{ fontSize: 14.5, color: T.stone, lineHeight: 1.6, margin: "4px 0 0", maxWidth: 520 }}>
              {b}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

/* ---------------- pricing ---------------- */

const Pricing = ({ onGoSignup }) => (
  <Section alt id="pricing">
    <Eyebrow>Pricing</Eyebrow>
    <h2
      className="display"
      style={{ fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 600, color: T.ink, margin: "14px 0 0", lineHeight: 1.15 }}
    >
      Less than one wasted carton a day.
    </h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 18,
        marginTop: 36,
      }}
    >
      {[
        {
          name: "Starter",
          price: "99",
          desc: "One branch, all three tools.",
          items: ["Milk calculator", "Municipality PDF logs", "SafeVault renewals", "WhatsApp support"],
          hot: false,
        },
        {
          name: "Pro",
          price: "199",
          desc: "For cafés with a team.",
          items: ["Everything in Starter", "Staff accounts & roles", "Foodics CSV import", "Priority support"],
          hot: true,
        },
        {
          name: "Chain",
          price: "499",
          desc: "Multi-location, one view.",
          items: ["Everything in Pro", "Up to 5 branches", "Cross-branch reports", "Onboarding call"],
          hot: false,
        },
      ].map((p) => (
        <div
          key={p.name}
          style={{
            background: p.hot ? T.ink : T.bone,
            color: p.hot ? T.bone : T.ink,
            border: `1px solid ${p.hot ? T.ink : T.border}`,
            borderRadius: 16,
            padding: 26,
            position: "relative",
          }}
        >
          {p.hot && (
            <span
              style={{
                position: "absolute",
                top: -12,
                right: 20,
                background: T.rust,
                color: "#FFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "4px 10px",
                borderRadius: 999,
              }}
            >
              MOST CAFÉS PICK THIS
            </span>
          )}
          <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>{p.name}</div>
          <div style={{ marginTop: 8 }}>
            <span className="display" style={{ fontSize: 40, fontWeight: 600 }}>
              AED {p.price}
            </span>
            <span style={{ fontSize: 14, opacity: 0.65 }}> /month</span>
          </div>
          <p style={{ fontSize: 14, opacity: 0.75, marginTop: 4 }}>{p.desc}</p>
          <div style={{ display: "grid", gap: 9, marginTop: 18 }}>
            {p.items.map((it) => (
              <div key={it} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14 }}>
                <span style={{ color: p.hot ? "#9DB48F" : T.sage, fontWeight: 700 }}>✓</span>
                {it}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22 }}>
            <button
              onClick={onGoSignup}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "12px 0",
                borderRadius: 10,
                fontSize: 14.5,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                background: p.hot ? T.bone : T.ink,
                color: p.hot ? T.ink : T.bone,
              }}
            >
              Start 14-day free trial
            </button>
          </div>
        </div>
      ))}
    </div>
    <p style={{ textAlign: "center", fontSize: 13.5, color: T.stone, marginTop: 20 }}>
      Every plan starts with 14 days free. No credit card. Cancel with one message.
    </p>
  </Section>
);

/* ---------------- install ---------------- */

const Install = () => {
  const [tab, setTab] = useState("ios");
  const steps = {
    ios: [
      ["Open kaffelog.com in Safari", "It must be Safari — not Instagram's or WhatsApp's built-in browser."],
      ["Tap the Share button", "The square with the arrow, at the bottom of the screen."],
      ["Tap “Add to Home Screen”", "Scroll the list a little if you don't see it."],
      ["Tap Add", "Kaffelog now opens full-screen from your home screen, like any app."],
    ],
    android: [
      ["Open kaffelog.com in Chrome", "Not inside another app's browser."],
      ["Tap the ⋮ menu", "Top-right corner of Chrome."],
      ["Tap “Add to Home screen” or “Install app”", "Chrome sometimes shows an install banner — that works too."],
      ["Confirm", "Kaffelog appears on your home screen and opens like a native app."],
    ],
  };
  return (
    <Section id="install">
      <Eyebrow tone="rust">Install in one minute</Eyebrow>
      <h2
        className="display"
        style={{ fontSize: "clamp(28px,3.6vw,40px)", fontWeight: 600, color: T.ink, margin: "14px 0 0", lineHeight: 1.15 }}
      >
        Put Kaffelog on your home screen.
      </h2>
      <p style={{ color: T.stone, fontSize: 15.5, maxWidth: 520, marginTop: 12, lineHeight: 1.6 }}>
        No App Store, no download, no updates to manage. Kaffelog installs
        straight from the browser on any phone your baristas already carry.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 26 }}>
        {[
          ["ios", "🍎 iPhone / iPad"],
          ["android", "🤖 Android"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              border: `1px solid ${tab === k ? T.ink : T.border}`,
              background: tab === k ? T.ink : T.card,
              color: tab === k ? T.bone : T.ink,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 22,
        }}
      >
        {steps[tab].map(([t, b], i) => (
          <div
            key={t}
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 18,
            }}
          >
            <div
              className="display"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: T.sageSoft,
                color: T.sage,
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, marginTop: 10 }}>{t}</div>
            <p style={{ fontSize: 13, color: T.stone, lineHeight: 1.55, margin: "5px 0 0" }}>{b}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- FAQ ---------------- */

const Faq = () => {
  const [open, setOpen] = useState(0);
  const qs = [
    ["Do I need new hardware?", "No. Kaffelog runs on any phone or tablet your team already has. It installs from the browser — no App Store account needed."],
    ["Does it work with Foodics?", "Yes — export your sales CSV from Foodics and import it in one tap. Kaffelog also works fine standalone if you enter one number a day."],
    ["Is my data safe?", "Your data lives in an encrypted cloud database, is never sold, and you can export or delete everything at any time. See the privacy policy below."],
    ["What happens after the trial?", "Pick a plan or walk away — the trial needs no card, so there's nothing to cancel. Your data stays exportable either way."],
  ];
  return (
    <Section alt>
      <Eyebrow>Questions</Eyebrow>
      <div style={{ marginTop: 18, maxWidth: 680 }}>
        {qs.map(([q, a], i) => (
          <div key={q} style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "18px 0",
                fontSize: 16,
                fontWeight: 600,
                color: T.ink,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontFamily: "inherit",
              }}
            >
              {q}
              <span style={{ color: T.stone }}>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p style={{ fontSize: 14.5, color: T.stone, lineHeight: 1.65, margin: "0 0 18px" }}>
                {a}
              </p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ---------------- final CTA ---------------- */

const FinalCta = ({ onGoSignup }) => (
  <section id="trial" style={{ background: T.ink }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
      <h2
        className="display"
        style={{ fontSize: "clamp(30px,4vw,44px)", fontWeight: 600, color: T.bone, lineHeight: 1.15, margin: 0 }}
      >
        Tomorrow's milk order,
        <br />
        counted by tonight.
      </h2>
      <p style={{ color: "#B9B4A6", fontSize: 16, marginTop: 14 }}>
        14 days free · no credit card · set up before your next shift
      </p>
      <div style={{ marginTop: 26, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        <Btn kind="primary" onClick={onGoSignup}>Start free trial</Btn>
        <a
          href="https://wa.me/9710000000000"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "13px 22px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            color: T.bone,
            border: "1px solid #3A3A36",
            textDecoration: "none",
          }}
        >
          Chat on WhatsApp
        </a>
      </div>
    </div>
  </section>
);

/* ---------------- footer ---------------- */

const Footer = ({ openPrivacy }) => (
  <footer style={{ background: T.ink, borderTop: "1px solid #2C2C29" }}>
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "28px 24px",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="display" style={{ fontSize: 17, fontWeight: 600, color: T.bone }}>
          Kaffelog
        </span>
        <span style={{ fontSize: 13, color: "#8D897C" }}>· Built in Dubai 🇦🇪 · © 2026</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center" }}>
        <span style={{ fontSize: 13.5, color: "#B9B4A6" }}>
          Instagram: <span style={{ color: T.bone, fontWeight: 600 }}>@kaffelog</span>
        </span>
        <a href="https://wa.me/9710000000000" style={{ fontSize: 13.5, color: "#B9B4A6", textDecoration: "none" }}>
          WhatsApp support
        </a>
        <a href="mailto:info@kaffelog.com" style={{ fontSize: 13.5, color: "#B9B4A6", textDecoration: "none" }}>
          info@kaffelog.com
        </a>
        <button
          onClick={openPrivacy}
          style={{
            fontSize: 13.5,
            color: "#B9B4A6",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          Privacy policy
        </button>
      </div>
    </div>
  </footer>
);

/* ---------------- privacy modal ---------------- */

const PrivacyModal = ({ onClose }) => {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
  <div
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Privacy policy"
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(26,26,24,0.45)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: T.card,
        borderRadius: 16,
        maxWidth: 640,
        width: "100%",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="display" style={{ fontSize: 24, fontWeight: 600, color: T.ink, margin: 0 }}>
          Privacy policy
        </h3>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: T.stone }}
        >
          ×
        </button>
      </div>
      <div style={{ fontSize: 14, color: T.stone, lineHeight: 1.7, marginTop: 14 }}>
        <p style={{ marginTop: 0 }}><strong style={{ color: T.ink }}>Last updated:</strong> July 2026</p>
        <p><strong style={{ color: T.ink }}>What we collect.</strong> Your name, email, café name, and the operational data you enter (milk counts, temperature logs, document renewal dates). That's it — no contact scraping, no location tracking.</p>
        <p><strong style={{ color: T.ink }}>How we use it.</strong> Only to run Kaffelog for you: calculating orders, generating your PDF logs, and sending renewal reminders. We never sell or share your data with third parties for marketing.</p>
        <p><strong style={{ color: T.ink }}>Where it lives.</strong> Data is stored in an encrypted cloud database (Supabase). Access is protected by your password; we recommend not sharing accounts between staff on the Starter plan.</p>
        <p><strong style={{ color: T.ink }}>Cookies.</strong> We use only essential cookies needed to keep you signed in, plus basic anonymous analytics to see which pages work. No advertising trackers.</p>
        <p><strong style={{ color: T.ink }}>Your rights.</strong> Email <span style={{ color: T.ink }}>info@kaffelog.com</span> at any time to export or permanently delete everything we hold about you. We comply with UAE Federal Decree-Law No. 45 of 2021 on personal data protection.</p>
      </div>
    </div>
  </div>
  );
};

/* ---------------- cookie banner ---------------- */

const CookieBanner = ({ onChoice, openPrivacy }) => (
  <div
    style={{
      position: "fixed",
      bottom: 16,
      left: 16,
      right: 16,
      zIndex: 90,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        boxShadow: "0 14px 40px rgba(26,26,24,0.16)",
        padding: "16px 20px",
        maxWidth: 640,
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ fontSize: 13.5, color: T.stone, margin: 0, lineHeight: 1.5, flex: "1 1 300px" }}>
        We use essential cookies to keep you signed in, and anonymous analytics
        to improve Kaffelog.{" "}
        <button
          onClick={openPrivacy}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            color: T.sage,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13.5,
            fontFamily: "inherit",
            textDecoration: "underline",
          }}
        >
          Privacy policy
        </button>
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onChoice("essential")}
          style={{
            padding: "9px 14px",
            borderRadius: 9,
            fontSize: 13.5,
            fontWeight: 600,
            background: T.card,
            color: T.ink,
            border: `1px solid ${T.border}`,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Essential only
        </button>
        <button
          onClick={() => onChoice("all")}
          style={{
            padding: "9px 14px",
            borderRadius: 9,
            fontSize: 13.5,
            fontWeight: 600,
            background: T.ink,
            color: T.bone,
            border: `1px solid ${T.ink}`,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Accept all
        </button>
      </div>
    </div>
  </div>
);

/* ---------------- page ---------------- */

export default function KaffelogLandingV2({ onGoSignup, onGoLogin } = {}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookieChoice, setCookieChoice] = useState(null);

  // Safe fallbacks so the component still works standalone (e.g. in preview)
  const goSignup = onGoSignup || (() => goTo("trial"));
  const goLogin = onGoLogin || (() => goTo("trial"));

  return (
    <div className="kf" style={{ background: T.bone, minHeight: "100vh" }}>
      <Fonts />
      <Nav onGoSignup={goSignup} onGoLogin={goLogin} />
      <main>
        <Hero onGoSignup={goSignup} />
        <Features />
        <Day />
        <Pricing onGoSignup={goSignup} />
        <Install />
        <Faq />
        <FinalCta onGoSignup={goSignup} />
      </main>
      <Footer openPrivacy={() => setPrivacyOpen(true)} />
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {!cookieChoice && (
        <CookieBanner
          onChoice={setCookieChoice}
          openPrivacy={() => setPrivacyOpen(true)}
        />
      )}
    </div>
  );
}
