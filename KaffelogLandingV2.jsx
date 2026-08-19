import React, { useState } from "react";

/* ============================================================
   KAFFELOG — Website v3 ("Operations Desk")
   Rebuilt on the validated Kaffelog Design System:
   soot black / warm paper / rust / sage / red-amber status
   IBM Plex Sans (UI) + IBM Plex Mono (numbers, labels, dates)
   + Newsreader serif (money figures, editorial emphasis)
   Hard 1.5–2px rules, flat surfaces, modular status cells,
   droplet brand mark. No shadows except floating receipt cards.
   ============================================================ */

const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
};

/* ---------------- tokens + global rules ---------------- */

const Fonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap');

    .kf2 {
      --brown-900:#1E1B18; --brown-800:#26221E; --brown-700:#332E28;
      --stone-600:#6E675E; --stone-400:#9C9184; --stone-300:#B4ACA0; --stone-200:#C9C4B8;
      --paper-300:#DAD5C8; --paper-200:#E8E4DB; --paper-100:#F6F3EC; --paper-050:#FDFCF8;
      --rust-700:#7E3D18; --rust-600:#9A4A1E; --rust-400:#C9762E; --rust-200:#E8B27A;
      --sage-700:#3E5449; --sage-600:#5C7268; --sage-200:#C7D3CC;
      --red-700:#8A2E22; --red-600:#B03A2E; --red-200:#E9C3BC;
      --font-sans:'IBM Plex Sans', system-ui, sans-serif;
      --font-mono:'IBM Plex Mono', ui-monospace, monospace;
      --font-serif:'Newsreader', Georgia, serif;
      background: var(--paper-200);
      color: var(--brown-900);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      overflow-x: clip;
    }
    .kf2 *, .kf2 *::before, .kf2 *::after { box-sizing: border-box; }
    .kf2 a { color: var(--rust-600); text-decoration: none; }
    .kf2 a:hover { color: var(--rust-400); }
    .kf2 [id] { scroll-margin-top: 68px; }
    .kf2 button { font-family: inherit; }
    .kf2-tnum { font-variant-numeric: tabular-nums; }

    @media (max-width: 860px) {
      .kf2-navlinks { display: none !important; }
      .kf2-topbar { display: none !important; }
      .kf2-g3 { grid-template-columns: 1fr !important; }
      .kf2-g2 { grid-template-columns: 1fr !important; }
      .kf2-g4 { grid-template-columns: 1fr 1fr !important; }
      .kf2-hero-grid { grid-template-columns: 1fr !important; }
      .kf2-hero-figure { min-height: 260px !important; margin-top: 28px; }
      .kf2-h1 { font-size: 38px !important; }
      .kf2-split { flex-direction: column !important; }
      .kf2-cta-row { flex-direction: column !important; align-items: flex-start !important; gap: 18px !important; }
    }
    @media (prefers-reduced-motion: reduce) { .kf2 * { transition: none !important; } }
  `}</style>
);

/* ---------------- brand mark ---------------- */

const Mark = ({ size = 30, dark = false }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 3C16 3 6.5 15.2 6.5 21.4C6.5 26.6 10.75 29.6 16 29.6C21.25 29.6 25.5 26.6 25.5 21.4C25.5 15.2 16 3 16 3Z"
        stroke={dark ? "var(--paper-100)" : "var(--brown-900)"}
        strokeWidth="1.6"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        right: -1,
        bottom: -1,
        width: size * 0.3,
        height: size * 0.3,
        background: "var(--rust-400)",
      }}
    />
  </div>
);

const Wordmark = ({ size = 18, dark = false }) => (
  <span
    style={{
      fontFamily: "var(--font-sans)",
      fontWeight: 700,
      fontSize: size,
      letterSpacing: "-0.02em",
      color: dark ? "var(--paper-100)" : "var(--brown-900)",
    }}
  >
    Kaffelog
  </span>
);

/* ---------------- primitives ---------------- */

const Btn = ({ children, variant = "dark", onClick, href, style }) => {
  const variants = {
    dark: { background: "var(--brown-900)", color: "var(--paper-100)", border: "1.5px solid var(--brown-900)" },
    paper: { background: "var(--paper-100)", color: "var(--brown-900)", border: "1.5px solid var(--paper-100)" },
    rust: { background: "var(--rust-600)", color: "var(--paper-100)", border: "1.5px solid var(--rust-600)" },
    outline: { background: "transparent", color: "inherit", border: "1.5px solid currentColor" },
  };
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 28px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 15,
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    ...variants[variant],
    ...style,
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} style={base}>
      {children}
    </Tag>
  );
};

const Overline = ({ children, tone = "rust" }) => (
  <div
    style={{
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: tone === "rust" ? "var(--rust-600)" : tone === "inverse" ? "var(--rust-400)" : "var(--stone-600)",
    }}
  >
    {children}
  </div>
);

/* Section heading: 01 · Title ————————— META, hairline rule beneath */
const Heading = ({ n, title, meta, dark = false }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: 16,
      borderBottom: `2px solid ${dark ? "rgba(240,235,225,.24)" : "var(--brown-900)"}`,
      paddingBottom: 14,
    }}
  >
    {n && (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.22em", color: "var(--rust-600)" }}>
        {n}
      </span>
    )}
    <span
      style={{
        fontWeight: 700,
        fontSize: "clamp(22px, 2.6vw, 27px)",
        letterSpacing: "-0.02em",
        color: dark ? "var(--paper-100)" : "var(--brown-900)",
      }}
    >
      {title}
    </span>
    {meta && (
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.14em",
          color: dark ? "var(--stone-400)" : "var(--stone-600)",
          marginLeft: "auto",
        }}
      >
        {meta}
      </span>
    )}
  </div>
);

/* photographic slot — real image if src given, textured placeholder otherwise */
const Photo = ({ src, alt, label, minHeight = 320 }) => (
  <div style={{ position: "relative", minHeight, height: "100%", overflow: "hidden", background: "var(--brown-800)" }}>
    {src ? (
      <img
        src={src}
        alt={alt || ""}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          padding: 18,
          background:
            "repeating-linear-gradient(135deg, var(--brown-800), var(--brown-800) 10px, var(--brown-700) 10px, var(--brown-700) 11px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--stone-400)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    )}
  </div>
);

/* status pill matching the SafeVault vocabulary */
const StatusPill = ({ status }) => {
  const map = {
    success: { bg: "rgba(92,114,104,.14)", text: "var(--sage-700)", border: "var(--sage-600)", label: "SAFE" },
    warning: { bg: "rgba(201,118,46,.16)", text: "#8A4E1D", border: "var(--rust-400)", label: "DUE SOON" },
    error: { bg: "rgba(176,58,46,.14)", text: "var(--red-700)", border: "var(--red-600)", label: "NEEDS ATTENTION" },
  };
  const s = map[status];
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.1em",
        padding: "5px 10px",
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
};

const StatusRow = ({ label, meta, status, cornerColor }) => (
  <div style={{ display: "flex", border: "2px solid var(--brown-900)", marginTop: -2 }}>
    <div style={{ width: 10, background: cornerColor }} />
    <div
      style={{
        flex: 1,
        padding: "13px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        background: "var(--paper-050)",
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 14.5 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--stone-600)", marginTop: 3 }}>{meta}</div>
      </div>
      <StatusPill status={status} />
    </div>
  </div>
);

/* the receipt — signature café-native device */
const Receipt = ({ rotate = 2 }) => (
  <div
    style={{
      width: 250,
      background: "var(--paper-100)",
      color: "var(--brown-900)",
      padding: "18px 16px",
      fontFamily: "var(--font-mono)",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 20px 44px rgba(0,0,0,.4)",
      position: "relative",
    }}
  >
    <div style={{ position: "absolute", left: -7, top: -7, width: 14, height: 14, background: "var(--rust-400)" }} />
    <div style={{ textAlign: "center", fontSize: 9.5, letterSpacing: "0.2em", fontWeight: 600 }}>TOMORROW'S MILK ORDER</div>
    <div style={{ borderTop: "1px dashed var(--brown-900)", margin: "12px 0" }} />
    <div style={{ display: "grid", gap: 8, fontSize: 11.5 }}>
      {[["WHOLE MILK", "38 L"], ["OAT", "12 L"], ["ALMOND", "4 L"]].map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{k}</span>
          <span className="kf2-tnum" style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
    <div style={{ borderTop: "1px dashed var(--brown-900)", margin: "12px 0" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 8, letterSpacing: "0.16em", color: "var(--stone-600)" }}>EST. SAVING</span>
      <span style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--rust-600)" }}>AED 72</span>
    </div>
    <div style={{ textAlign: "center", fontSize: 9, color: "var(--stone-600)", marginTop: 10 }}>اليوم جاهز</div>
  </div>
);

/* ---------------- top utility bar ---------------- */

const TopBar = () => (
  <div
    className="kf2-topbar"
    style={{
      background: "var(--brown-900)",
      color: "var(--stone-400)",
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "0.16em",
    }}
  >
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "8px 24px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>KAFFELOG — THE CALM SYSTEM BEHIND THE CAFÉ</span>
      <span>DUBAI · SHARJAH · AJMAN</span>
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
      background: "var(--paper-100)",
      borderBottom: "2px solid var(--brown-900)",
    }}
  >
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 24px",
        height: 62,
        display: "flex",
        alignItems: "center",
        gap: 30,
      }}
    >
      <button
        onClick={() => goTo("top")}
        style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <Mark size={26} />
        <Wordmark />
      </button>
      <nav className="kf2-navlinks" style={{ display: "flex", alignItems: "center", gap: 26 }}>
        {[["How it works", "how-it-works"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Install", "install"]].map(([l, id]) => (
          <button
            key={l}
            onClick={() => goTo(id)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--stone-600)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {l}
          </button>
        ))}
      </nav>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
        <button
          onClick={onGoLogin}
          style={{ fontSize: 13.5, fontWeight: 600, color: "var(--stone-600)", background: "none", border: "none", cursor: "pointer" }}
        >
          Log in
        </button>
        <Btn variant="rust" onClick={onGoSignup} style={{ padding: "10px 22px", fontSize: 13.5, borderRadius: 0 }}>
          Start Free Trial →
        </Btn>
      </div>
    </div>
  </header>
);

/* ---------------- hero ---------------- */

const Hero = ({ onGoSignup, images }) => (
  <section id="top" style={{ background: "var(--brown-900)", color: "var(--paper-100)", position: "relative", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        right: -20,
        top: -50,
        fontFamily: "var(--font-serif)",
        fontSize: "min(30vw, 380px)",
        lineHeight: 1,
        color: "rgba(240,235,225,.045)",
        pointerEvents: "none",
      }}
    >
      54L
    </div>
    <div
      className="kf2-hero-grid"
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: 40,
        padding: "76px 24px 0",
        position: "relative",
      }}
    >
      <div>
        <Overline tone="inverse">FOR INDEPENDENT CAFÉS IN THE UAE</Overline>
        <h1
          className="kf2-h1"
          style={{
            margin: "18px 0 0",
            fontSize: "clamp(34px, 4.6vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
          }}
        >
          Know how much milk to order tomorrow.
          <br />
          <span style={{ color: "var(--stone-400)" }}>Keep your municipality paperwork ready.</span>
        </h1>
        <p style={{ margin: "20px 0 0", fontSize: 16.5, color: "var(--stone-400)", lineHeight: 1.65, maxWidth: 500 }}>
          Kaffelog tells you tomorrow's exact milk order, turns daily hygiene checks into
          inspection-ready Dubai Municipality PDFs, and warns you before your trade licence
          or staff cards expire.
        </p>
        <div className="kf2-cta-row" style={{ display: "flex", gap: 14, marginTop: 32, alignItems: "center", flexWrap: "wrap" }}>
          <Btn variant="paper" onClick={onGoSignup}>Start Free Trial — No Card Needed</Btn>
          <button
            onClick={() => goTo("how-it-works")}
            style={{
              border: "1.5px solid rgba(240,235,225,.4)",
              background: "transparent",
              color: "var(--paper-100)",
              padding: "14px 26px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14.5,
              cursor: "pointer",
            }}
          >
            See how it works
          </button>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--stone-400)", marginTop: 20 }}>
          14 DAYS FREE · CANCEL WITH ONE MESSAGE · NO APP STORE
        </div>
      </div>
      <div className="kf2-hero-figure" style={{ position: "relative", minHeight: 420 }}>
        <Photo src={images.hero} label="Barista at the machine — straight-on, evenly lit" minHeight={420} />
        <div style={{ position: "absolute", right: 0, bottom: -18, zIndex: 2 }}>
          <Receipt />
        </div>
      </div>
    </div>
    <div
      style={{
        borderTop: "1px solid rgba(240,235,225,.16)",
        marginTop: 56,
        display: "flex",
        flexWrap: "wrap",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.16em",
        color: "var(--stone-400)",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", display: "flex", flexWrap: "wrap" }}>
        {["MILK ORDERING", "MUNICIPALITY LOGS", "SAFEVAULT"].map((t) => (
          <div key={t} style={{ padding: "12px 24px", borderRight: "1px solid rgba(240,235,225,.16)" }}>{t}</div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 24px" }}>اليوم جاهز</div>
      </div>
    </div>
  </section>
);

/* ---------------- cost of doing nothing ---------------- */

const CostOfNothing = () => (
  <section style={{ background: "var(--paper-200)" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "64px 24px 60px" }}>
      <Heading n="01" title="The cost of doing nothing" meta="EVERY MONTH, INVISIBLY" />
      <div className="kf2-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
        {[
          ["1,800", "–2,700 AED", "LOST TO MILK WASTE,\nEVERY MONTH", "var(--brown-900)"],
          ["Hours", "", "ASSEMBLING PAPERWORK THE MORNING\nAN INSPECTOR WALKS IN", "var(--brown-900)"],
          ["10,000", " AED", "IN FINES FROM ONE\nMISSED RENEWAL DATE", "var(--red-600)"],
        ].map(([big, small, label, color], i) => (
          <div
            key={label}
            style={{
              padding: "30px 30px 32px 0",
              borderRight: i < 2 ? "1.5px solid var(--brown-900)" : "none",
              paddingLeft: i > 0 ? 30 : 0,
            }}
          >
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 48, lineHeight: 1, color, fontStyle: big === "Hours" ? "italic" : "normal" }}>
              {big}
              <span style={{ fontSize: 20, color: "var(--stone-600)" }}>{small}</span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--stone-600)", marginTop: 14, lineHeight: 1.8, whiteSpace: "pre-line" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px dashed var(--brown-900)", paddingTop: 18, marginTop: 8 }}>
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--brown-700)" }}>
          None of this is your fault. It's admin competing with running a café — and it always loses.
        </span>
      </div>
    </div>
  </section>
);

/* ---------------- three jobs ---------------- */

const jobs = [
  { n: "01", tone: "var(--sage-600)", title: "Milk Ordering", body: "Log yesterday's count in 10 seconds. Get tomorrow's exact order.", to: "milk-ordering", route: "/MILK-ORDERING" },
  { n: "02", tone: "var(--rust-400)", title: "Compliance Logs", body: "Fridge checks done at the counter. Exports as a Dubai Municipality PDF.", to: "compliance", route: "/COMPLIANCE" },
  { n: "03", tone: "var(--red-600)", title: "SafeVault", body: "Every licence and expiry in one place. Warned at 30, 14, and 3 days out.", to: "safevault", route: "/SAFEVAULT" },
];

const ThreeJobs = () => (
  <section id="how-it-works" style={{ background: "var(--paper-200)" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "8px 24px 64px" }}>
      <Heading n="02" title="Three jobs, one app" />
      <div className="kf2-g3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", border: "2px solid var(--brown-900)", borderTop: "none" }}>
        {jobs.map((j, i) => (
          <div
            key={j.title}
            style={{
              padding: "28px 26px 26px",
              borderRight: i < 2 ? "1.5px solid var(--brown-900)" : "none",
              background: "var(--paper-100)",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", right: 0, top: 0, width: 16, height: 16, background: j.tone }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.18em", color: "var(--stone-600)" }}>JOB {j.n}</div>
            <div style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em", marginTop: 12 }}>{j.title}</div>
            <div style={{ fontSize: 14, color: "var(--stone-600)", lineHeight: 1.65, marginTop: 10, minHeight: 44 }}>{j.body}</div>
            <button
              onClick={() => goTo(j.to)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "none",
                borderTop: "1.5px solid var(--brown-900)",
                marginTop: 18,
                paddingTop: 12,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.16em",
                color: "var(--rust-600)",
                cursor: "pointer",
              }}
            >
              {j.route} →
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- CTA strip (reused between detail sections) ---------------- */

const CtaStrip = ({ line, onGoSignup, corner = "var(--rust-400)" }) => (
  <div
    style={{
      background: "var(--brown-900)",
      color: "var(--paper-100)",
      padding: "36px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap",
      position: "relative",
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: 16, background: corner }} />
    <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 23 }}>{line}</span>
      <Btn variant="paper" onClick={onGoSignup} style={{ padding: "13px 26px", fontSize: 14.5 }}>Start Free Trial →</Btn>
    </div>
  </div>
);

/* ---------------- milk ordering detail ---------------- */

const MilkOrdering = ({ onGoSignup, images }) => (
  <section id="milk-ordering" style={{ background: "var(--paper-100)", borderTop: "2px solid var(--brown-900)" }}>
    <div className="kf2-g2 kf2-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 1fr" }}>
      <div style={{ padding: "64px 40px 56px 24px" }}>
        <Overline>JOB 01 — MILK ORDERING</Overline>
        <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.8vw,44px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.06 }}>
          Stop guessing how much milk to order.
        </h2>
        <p style={{ margin: "16px 0 0", fontSize: 16.5, color: "var(--stone-600)", lineHeight: 1.65, maxWidth: 440 }}>
          Log yesterday's count. Get tomorrow's exact order, in litres, by milk type.
        </p>
        <Btn onClick={onGoSignup} style={{ marginTop: 26 }}>Start Free Trial</Btn>
      </div>
      <div style={{ minHeight: 340 }}>
        <Photo src={images.milk} label="Owner counting cartons in the milk fridge" minHeight={340} />
      </div>
    </div>
    <div className="kf2-g2" style={{ borderTop: "2px solid var(--brown-900)", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--brown-900)", color: "var(--paper-100)" }}>
      <div style={{ padding: "40px 24px", borderRight: "1px solid rgba(240,235,225,.18)" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 46, lineHeight: 1 }}>
          1,800–2,700<span style={{ fontSize: 18, color: "var(--stone-400)" }}> AED/MO</span>
        </div>
        <div style={{ fontSize: 14.5, color: "var(--stone-200)", marginTop: 12, lineHeight: 1.65, maxWidth: 380 }}>
          Waste doesn't show up on any receipt. That's why it never gets fixed.
        </div>
      </div>
      <div style={{ padding: "40px 24px" }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 46, lineHeight: 1, color: "var(--rust-200)" }}>
          60–90<span style={{ fontSize: 18, color: "var(--stone-400)" }}> AED/DAY</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", color: "var(--stone-400)", marginTop: 14 }}>
          TYPICAL SAVING ONCE THE PATTERN SETTLES
        </div>
      </div>
    </div>
    <div className="kf2-g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "2px solid var(--brown-900)" }}>
      <div style={{ padding: "30px 26px", borderRight: "1.5px solid var(--brown-900)", background: "var(--paper-050)" }}>
        <Overline>WHY TRUST THE NUMBER</Overline>
        <div style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--brown-700)", marginTop: 12 }}>
          It reads your rolling pattern — slow Wednesdays, busy weekends, Ramadan hours — not a
          generic average. It learns <em>your</em> café, not "a café."
        </div>
      </div>
      <div style={{ padding: "30px 26px", background: "var(--paper-050)" }}>
        <Overline>THE 10-SECOND HABIT</Overline>
        <div style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--brown-700)", marginTop: 12 }}>
          <strong>Before:</strong> guess, over-order, throw away — or under-order and turn people away.
          <br />
          <strong>After:</strong> type one number, get one answer.
        </div>
      </div>
    </div>
    <CtaStrip line="Less than one wasted carton a day." onGoSignup={onGoSignup} corner="var(--sage-600)" />
  </section>
);

/* ---------------- compliance detail ---------------- */

const Compliance = ({ onGoSignup, images }) => (
  <section id="compliance" style={{ background: "var(--paper-100)", borderTop: "2px solid var(--brown-900)" }}>
    <div className="kf2-g2 kf2-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      <div style={{ padding: "64px 40px 56px 24px" }}>
        <Overline>JOB 02 — MUNICIPALITY LOGS</Overline>
        <h2 style={{ margin: "16px 0 0", fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
          Inspection-ready in 30 seconds,{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>not the morning of.</span>
        </h2>
        <p style={{ margin: "16px 0 0", fontSize: 16.5, color: "var(--stone-600)", lineHeight: 1.65, maxWidth: 460 }}>
          Fridge temps, cleaning schedules, and receiving checks — logged at the counter as they happen.
        </p>
        <div style={{ marginTop: 22, borderLeft: "4px solid var(--rust-400)", background: "var(--paper-050)", padding: "16px 20px", fontSize: 14, color: "var(--brown-700)", lineHeight: 1.7, maxWidth: 480 }}>
          You know the scene: the paper folder, filled in retroactively, often the morning an
          inspector walks in. It's not a personal failing — it's universal. It's also fixable.
        </div>
        <Btn onClick={onGoSignup} style={{ marginTop: 24 }}>Start Free Trial</Btn>
      </div>
      <div style={{ minHeight: 340 }}>
        <Photo src={images.compliance} label="Barista ticking the checklist at the counter" minHeight={340} />
      </div>
    </div>
    <div className="kf2-g2 kf2-split" style={{ borderTop: "2px solid var(--brown-900)", display: "grid", gridTemplateColumns: "1.15fr 1fr", background: "var(--brown-900)" }}>
      <div style={{ padding: "44px 24px", display: "flex", alignItems: "center" }}>
        <div style={{ background: "var(--paper-050)", width: "100%", padding: 24, position: "relative", color: "var(--brown-900)" }}>
          <div style={{ position: "absolute", right: -8, top: -8, width: 16, height: 16, background: "var(--rust-400)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid var(--brown-900)", paddingBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15.5 }}>Hygiene Log — August 2026</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", color: "var(--stone-600)" }}>DUBAI MUNICIPALITY FORMAT · PDF</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 14, display: "grid", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 50px 50px", gap: 8, color: "var(--stone-600)", fontSize: 9, letterSpacing: "0.1em" }}>
              <span>DATE</span><span>CHECK</span><span>VALUE</span><span>SIGNED</span>
            </div>
            {[
              ["01 AUG", "Fridge 1 — display", "3.4°C", "L.H."],
              ["01 AUG", "Fridge 2 — milk store", "4.1°C", "L.H."],
              ["01 AUG", "Clean-down — counter", "06:15", "A.R."],
              ["01 AUG", "Receiving — dairy", "07:28", "A.R."],
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 50px 50px", gap: 8, borderTop: "1px solid rgba(30,27,24,.14)", paddingTop: 8 }}>
                {row.map((c, j) => <span key={j}>{c}</span>)}
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--stone-600)", marginTop: 14, borderTop: "1px dashed var(--brown-900)", paddingTop: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <span>31 PAGES · COMPLETE</span><span>EXPORTED 31 AUG 18:04</span>
          </div>
        </div>
      </div>
      <div style={{ padding: "44px 24px", color: "var(--paper-100)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, borderLeft: "1px solid rgba(240,235,225,.18)" }}>
        <div>
          <Overline tone="inverse">WHAT THE BARISTA SEES</Overline>
          <div style={{ fontSize: 14.5, lineHeight: 1.7, marginTop: 10, color: "var(--stone-200)" }}>
            A checklist. Nothing more. Tick fridge temps and clean-downs at the counter, between customers.
          </div>
        </div>
        <div style={{ borderTop: "1px dashed rgba(240,235,225,.3)", paddingTop: 26 }}>
          <Overline tone="inverse">WHAT THE OWNER SEES</Overline>
          <div style={{ fontSize: 14.5, lineHeight: 1.7, marginTop: 10, color: "var(--stone-200)" }}>
            A month of records — dated, signed, complete. Exportable anytime.
          </div>
        </div>
      </div>
    </div>
    <CtaStrip line="Tick the list. Kaffelog handles the paperwork." onGoSignup={onGoSignup} />
  </section>
);

/* ---------------- safevault detail ---------------- */

const vaultRows = [
  { label: "Trade Licence", meta: "28 days remaining", status: "success", corner: "var(--sage-600)" },
  { label: "Ahmed — Food Handler Card", meta: "14 days remaining", status: "warning", corner: "var(--rust-400)" },
  { label: "Pest Control Contract", meta: "3 days remaining", status: "error", corner: "var(--red-600)" },
  { label: "Halal Certificate", meta: "111 days remaining", status: "success", corner: "var(--sage-600)" },
  { label: "Tenancy Contract", meta: "144 days remaining", status: "success", corner: "var(--sage-600)" },
];

const SafeVault = ({ onGoSignup }) => (
  <section id="safevault" style={{ background: "var(--paper-100)", borderTop: "2px solid var(--brown-900)" }}>
    <div style={{ background: "var(--brown-900)", color: "var(--paper-100)", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -20, bottom: -60, fontFamily: "var(--font-serif)", fontSize: 220, lineHeight: 1, color: "rgba(176,58,46,.16)", pointerEvents: "none" }}>10K</div>
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        <Overline tone="inverse">JOB 03 — SAFEVAULT</Overline>
        <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,3.8vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, maxWidth: "19ch" }}>
          One missed renewal date. Up to{" "}
          <span style={{ color: "var(--red-600)", background: "var(--paper-100)", padding: "0 10px" }}>AED 10,000.</span>
        </h2>
        <p style={{ margin: "16px 0 0", fontSize: 16.5, color: "var(--stone-400)", lineHeight: 1.65 }}>
          Every licence, tracked. Warned at 30 days, 14 days, and 3 days out.
        </p>
      </div>
    </div>
    <div className="kf2-g2 kf2-split" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
      <div style={{ padding: "40px 24px 40px 24px" }}>
        <Overline>WHAT SAFEVAULT TRACKS</Overline>
        <div style={{ marginTop: 16 }}>
          {vaultRows.map((r) => (
            <StatusRow key={r.label} label={r.label} meta={r.meta} status={r.status} cornerColor={r.corner} />
          ))}
        </div>
      </div>
      <div style={{ padding: "40px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        <div>
          <Overline>THIS HAPPENS TO CAREFUL OWNERS TOO</Overline>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, lineHeight: 1.45, marginTop: 12, color: "var(--brown-700)" }}>
            It isn't carelessness. It's just a date nobody was watching — while you were running a café.
          </div>
        </div>
        <div style={{ border: "2px solid var(--brown-900)", background: "var(--paper-050)", padding: 22 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--stone-600)" }}>THE THREE WARNINGS</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
            <div style={{ flex: 1, height: 3, background: "var(--sage-600)" }} />
            <div style={{ width: 13, height: 13, background: "var(--sage-600)", flexShrink: 0 }} />
            <div style={{ flex: 1, height: 3, background: "var(--rust-400)" }} />
            <div style={{ width: 13, height: 13, background: "var(--rust-400)", flexShrink: 0 }} />
            <div style={{ flex: 0.6, height: 3, background: "var(--red-600)" }} />
            <div style={{ width: 13, height: 13, background: "var(--red-600)", flexShrink: 0 }} />
            <div style={{ flex: 0.3, height: 3, background: "var(--red-600)" }} />
            <div style={{ width: 17, height: 17, border: "2.5px solid var(--brown-900)", background: "var(--paper-100)", flexShrink: 0 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--stone-600)", marginTop: 12 }}>
            <span>30 DAYS</span><span>14 DAYS</span><span>3 DAYS</span><span>RENEWAL</span>
          </div>
        </div>
      </div>
    </div>
    <CtaStrip line="Never watch a date again." onGoSignup={onGoSignup} corner="var(--red-600)" />
  </section>
);

/* ---------------- fits what you use / built for here ---------------- */

const FitsBuilt = () => (
  <section style={{ background: "var(--paper-200)", borderTop: "2px solid var(--brown-900)" }}>
    <div className="kf2-g2" style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", border: "2px solid var(--brown-900)" }}>
      <div style={{ padding: "34px 30px", borderRight: "1.5px solid var(--brown-900)" }}>
        <Overline>03 — FITS WHAT YOU USE</Overline>
        <div style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em", marginTop: 14, lineHeight: 1.3 }}>
          Kaffelog sits beside your POS. It never touches payments.
        </div>
        <div style={{ fontSize: 14.5, color: "var(--stone-600)", lineHeight: 1.7, marginTop: 12 }}>
          Import sales from Foodics, or type one number a day if you don't use a POS. No new
          hardware. No staff training beyond "tick the list."
        </div>
      </div>
      <div style={{ padding: "34px 30px", background: "var(--brown-900)", color: "var(--paper-100)" }}>
        <Overline tone="inverse">04 — BUILT FOR HERE</Overline>
        <div style={{ fontWeight: 700, fontSize: 21, letterSpacing: "-0.02em", marginTop: 14, lineHeight: 1.3 }}>
          Toast and Square handle sales. They don't know what a Dubai Municipality hygiene log looks like.
        </div>
        <div style={{ fontSize: 14.5, color: "var(--stone-400)", lineHeight: 1.7, marginTop: 12 }}>
          5,000+ independent cafés in the UAE. Built for this market specifically — Dubai, Sharjah, Ajman.
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- pricing ---------------- */

const tiers = [
  { name: "STARTER", price: "99", items: ["One branch", "All three core tools", "English & Arabic"], hot: false },
  { name: "PRO", price: "199", items: ["Everything in Starter", "Staff accounts & roles", "Foodics import", "Priority support"], hot: true },
  { name: "CHAIN", price: "499", items: ["Up to 5 branches", "Cross-branch reports", "Onboarding call"], hot: false },
];

const Pricing = ({ onGoSignup }) => {
  const [open, setOpen] = useState(0);
  const qs = [
    ["What happens after the trial?", "Pick a plan or walk away. Your records export either way."],
    ["Do I need a card to start?", "No. Café name and a phone number."],
    ["Can I cancel anytime?", "One WhatsApp message. That's it."],
    ["More than 5 branches?", "Talk to us — we'll price it honestly."],
  ];
  return (
    <section id="pricing" style={{ background: "var(--paper-100)", borderTop: "2px solid var(--brown-900)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 24px 0", textAlign: "center" }}>
        <h2 style={{ margin: "0 auto", fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: "22ch" }}>
          AED 99/month is less than{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>one wasted carton of milk a day.</span>
        </h2>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", color: "var(--stone-600)", marginTop: 16 }}>
          14-DAY FREE TRIAL · NO CARD REQUIRED · CANCEL WITH ONE MESSAGE
        </div>
      </div>
      <div className="kf2-g3" style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 0", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
        {tiers.map((p) => (
          <div
            key={p.name}
            style={{
              border: "2px solid var(--brown-900)",
              background: p.hot ? "var(--brown-900)" : "var(--paper-050)",
              color: p.hot ? "var(--paper-100)" : "var(--brown-900)",
              padding: "30px 28px",
              position: "relative",
              transform: p.hot ? "translateY(-10px)" : "none",
            }}
          >
            {p.hot && (
              <div style={{ position: "absolute", top: 0, right: 0, background: "var(--rust-400)", color: "var(--brown-900)", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", padding: "6px 12px" }}>
                MOST CAFÉS START HERE
              </div>
            )}
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: p.hot ? "var(--stone-400)" : "var(--stone-600)" }}>{p.name}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 50, marginTop: 12, lineHeight: 1, color: p.hot ? "var(--rust-200)" : "var(--brown-900)" }}>AED {p.price}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", color: p.hot ? "var(--stone-400)" : "var(--stone-600)", marginTop: 6 }}>PER MONTH</div>
            <div style={{ borderTop: `1px dashed ${p.hot ? "rgba(240,235,225,.3)" : "var(--brown-900)"}`, margin: "20px 0" }} />
            <div style={{ fontSize: 14, lineHeight: 2 }}>
              {p.items.map((it) => <div key={it}>{it}</div>)}
            </div>
            <button
              onClick={onGoSignup}
              style={{
                display: "block",
                width: "100%",
                marginTop: 24,
                textAlign: "center",
                padding: 12,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                border: p.hot ? "none" : "2px solid var(--brown-900)",
                background: p.hot ? "var(--paper-100)" : "transparent",
                color: p.hot ? "var(--brown-900)" : "var(--brown-900)",
              }}
            >
              Start Free Trial
            </button>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1180, margin: "34px auto 0", padding: "0 24px" }}>
        <div style={{ borderLeft: "4px solid var(--sage-600)", background: "var(--paper-050)", padding: "15px 20px", fontSize: 14 }}>
          Every plan includes all three core tools — milk ordering, compliance logs, and SafeVault.{" "}
          <strong>Starter isn't a stripped demo.</strong>
        </div>
      </div>
      <div id="faq" style={{ maxWidth: 1180, margin: "0 auto", padding: "44px 24px 60px" }}>
        <Overline>QUESTIONS</Overline>
        <div style={{ marginTop: 12, maxWidth: 680 }}>
          {qs.map(([q, a], i) => (
            <div key={q} style={{ borderBottom: "1.5px solid var(--brown-900)" }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "16px 0",
                  fontSize: 15.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                {q}
                <span style={{ color: "var(--stone-600)", fontFamily: "var(--font-mono)" }}>{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p style={{ fontSize: 14, color: "var(--stone-600)", lineHeight: 1.65, margin: "0 0 18px" }}>{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
    <section id="install" style={{ background: "var(--paper-200)", borderTop: "2px solid var(--brown-900)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px 64px" }}>
        <Heading n="05" title="Install in one minute" />
        <p style={{ color: "var(--stone-600)", fontSize: 15, maxWidth: 540, marginTop: 18, lineHeight: 1.65 }}>
          No App Store, no download, no updates to manage. Kaffelog installs straight from the
          browser on any phone your baristas already carry.
        </p>
        <div style={{ display: "flex", gap: 0, marginTop: 24 }}>
          {[["ios", "iPhone / iPad"], ["android", "Android"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              style={{
                padding: "11px 22px",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "2px solid var(--brown-900)",
                marginLeft: k === "android" ? -2 : 0,
                background: tab === k ? "var(--brown-900)" : "var(--paper-050)",
                color: tab === k ? "var(--paper-100)" : "var(--brown-900)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="kf2-g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: 22, border: "2px solid var(--brown-900)", borderLeft: "none" }}>
          {steps[tab].map(([t, b], i) => (
            <div key={t} style={{ padding: 20, borderLeft: "1.5px solid var(--brown-900)", background: "var(--paper-050)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--rust-600)" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{t}</div>
              <p style={{ fontSize: 12.5, color: "var(--stone-600)", lineHeight: 1.55, margin: "6px 0 0" }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- founder note ---------------- */

const Founder = () => (
  <section style={{ background: "var(--paper-200)" }}>
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px 56px" }}>
      <div style={{ borderTop: "1px dashed var(--brown-900)", paddingTop: 22 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 20, lineHeight: 1.5, color: "var(--brown-700)", maxWidth: "56ch" }}>
          Milk waste, inspection panic, missed renewals. Kaffelog answers exactly those three
          things. Nothing more.
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- trial / final CTA ---------------- */

const Trial = ({ onGoSignup, images }) => {
  const [cafeName, setCafeName] = useState("");
  const [contact, setContact] = useState("");
  const [branches, setBranches] = useState("1");

  return (
    <section id="trial" style={{ background: "var(--paper-100)", borderTop: "2px solid var(--brown-900)" }}>
      <div style={{ height: 200, position: "relative" }}>
        <Photo src={images.trial} label="Café counter, morning light — wide banner crop" minHeight={200} />
        <div style={{ position: "absolute", left: 24, bottom: -16, background: "var(--rust-400)", color: "var(--brown-900)", fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.16em", padding: "8px 14px" }}>
          14 DAYS · FREE
        </div>
      </div>
      <div className="kf2-g2" style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", padding: "56px 24px 64px", gap: 40 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Start free. No card.{" "}
            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400 }}>Cancel with one message.</span>
          </h2>
          <div style={{ marginTop: 34, borderTop: "1px dashed var(--brown-900)", paddingTop: 26 }}>
            <Overline>WHAT HAPPENS NEXT</Overline>
            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {[
                "You're in your dashboard in under a minute",
                "Log today's milk count",
                "We start learning your pattern from day one",
              ].map((t, i) => (
                <div key={t} style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--rust-600)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 14.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 18, maxWidth: 440 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--stone-600)", marginBottom: 7 }}>CAFÉ NAME</div>
            <input
              value={cafeName}
              onChange={(e) => setCafeName(e.target.value)}
              placeholder="e.g. Mirdif Roast House"
              style={{ width: "100%", border: "2px solid var(--brown-900)", background: "var(--paper-050)", padding: "12px 15px", fontSize: 14.5, fontFamily: "inherit", color: "var(--brown-900)" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--stone-600)", marginBottom: 7 }}>PHONE OR EMAIL</div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="05x xxx xxxx"
              style={{ width: "100%", border: "2px solid var(--brown-900)", background: "var(--paper-050)", padding: "12px 15px", fontSize: 14.5, fontFamily: "inherit", color: "var(--brown-900)" }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.16em", color: "var(--stone-600)", marginBottom: 7 }}>BRANCHES</div>
            <div style={{ display: "flex" }}>
              {["1", "2–5", "5+"].map((b, i) => (
                <button
                  key={b}
                  onClick={() => setBranches(b)}
                  style={{
                    border: "2px solid var(--brown-900)",
                    marginLeft: i > 0 ? -2 : 0,
                    padding: "10px 24px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12.5,
                    cursor: "pointer",
                    background: branches === b ? "var(--brown-900)" : "var(--paper-050)",
                    color: branches === b ? "var(--paper-100)" : "var(--brown-900)",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <Btn variant="rust" onClick={onGoSignup} style={{ justifyContent: "center", marginTop: 6 }}>
            Start My Free Trial →
          </Btn>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: "var(--stone-600)", textAlign: "center" }}>
            14 DAYS FREE · NO CREDIT CARD · ENGLISH &amp; ARABIC
          </div>
        </div>
      </div>
      <div style={{ background: "var(--brown-900)", color: "var(--paper-100)", padding: "44px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 20, height: 20, background: "var(--rust-400)" }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "clamp(24px,3vw,32px)", letterSpacing: "-0.03em", lineHeight: 1.15 }}>
              Start free. No card.
              <br />
              Cancel with one message.
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--stone-400)", marginTop: 12 }}>
              14 DAYS FREE · ENGLISH &amp; ARABIC · اليوم جاهز
            </div>
          </div>
          <Btn variant="paper" onClick={onGoSignup} style={{ padding: "16px 32px", fontSize: 15 }}>Start Free Trial →</Btn>
        </div>
      </div>
    </section>
  );
};

/* ---------------- footer ---------------- */

const Footer = ({ openPrivacy }) => (
  <footer style={{ background: "var(--paper-200)", borderTop: "2px solid var(--brown-900)" }}>
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        display: "flex",
        flexWrap: "wrap",
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        letterSpacing: "0.1em",
        color: "var(--stone-600)",
      }}
    >
      <div style={{ padding: "16px 24px", borderRight: "1.5px solid var(--brown-900)" }}>KAFFELOG · BASED IN DUBAI, UAE</div>
      <a href="https://wa.me/9710000000000" style={{ padding: "16px 24px", borderRight: "1.5px solid var(--brown-900)", color: "var(--stone-600)" }}>WHATSAPP</a>
      <a href="mailto:info@kaffelog.com" style={{ padding: "16px 24px", borderRight: "1.5px solid var(--brown-900)", color: "var(--stone-600)" }}>INFO@KAFFELOG.COM</a>
      <span style={{ padding: "16px 24px", borderRight: "1.5px solid var(--brown-900)" }}>@KAFFELOG</span>
      <button
        onClick={openPrivacy}
        style={{ padding: "16px 24px", background: "none", border: "none", borderRight: "1.5px solid var(--brown-900)", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", letterSpacing: "inherit", color: "var(--stone-600)" }}
      >
        PRIVACY POLICY
      </button>
      <div style={{ flex: 1 }} />
      <div style={{ padding: "16px 24px" }}>EN / ع</div>
    </div>
  </footer>
);

/* ---------------- privacy modal ---------------- */

const PrivacyModal = ({ onClose }) => {
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
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
      style={{ position: "fixed", inset: 0, background: "rgba(30,27,24,0.55)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--paper-050)", border: "2px solid var(--brown-900)", maxWidth: 640, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 30 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid var(--brown-900)", paddingBottom: 14 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Privacy policy</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--stone-600)" }}>×</button>
        </div>
        <div style={{ fontSize: 14, color: "var(--brown-700)", lineHeight: 1.7, marginTop: 16 }}>
          <p style={{ marginTop: 0 }}><strong>Last updated:</strong> July 2026</p>
          <p><strong>What we collect.</strong> Your name, email, café name, and the operational data you enter (milk counts, temperature logs, document renewal dates). That's it — no contact scraping, no location tracking.</p>
          <p><strong>How we use it.</strong> Only to run Kaffelog for you: calculating orders, generating your PDF logs, and sending renewal reminders. We never sell or share your data with third parties for marketing.</p>
          <p><strong>Where it lives.</strong> Data is stored in an encrypted cloud database (Supabase). Access is protected by your password; we recommend not sharing accounts between staff on the Starter plan.</p>
          <p><strong>Cookies.</strong> We use only essential cookies needed to keep you signed in, plus basic anonymous analytics to see which pages work. No advertising trackers.</p>
          <p><strong>Your rights.</strong> Email info@kaffelog.com at any time to export or permanently delete everything we hold about you. We comply with UAE Federal Decree-Law No. 45 of 2021 on personal data protection.</p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- cookie banner ---------------- */

const CookieBanner = ({ onChoice, openPrivacy }) => (
  <div style={{ position: "fixed", bottom: 16, left: 16, right: 16, zIndex: 90, display: "flex", justifyContent: "center" }}>
    <div style={{ background: "var(--paper-050)", border: "2px solid var(--brown-900)", boxShadow: "0 14px 40px rgba(30,27,24,.2)", padding: "16px 20px", maxWidth: 640, width: "100%", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: 13, color: "var(--brown-700)", margin: 0, lineHeight: 1.5, flex: "1 1 300px" }}>
        We use essential cookies to keep you signed in, and anonymous analytics to improve Kaffelog.{" "}
        <button onClick={openPrivacy} style={{ background: "none", border: "none", padding: 0, color: "var(--rust-600)", fontWeight: 700, cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
          Privacy policy
        </button>
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onChoice("essential")} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 700, background: "var(--paper-050)", color: "var(--brown-900)", border: "1.5px solid var(--brown-900)", cursor: "pointer" }}>
          Essential only
        </button>
        <button onClick={() => onChoice("all")} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 700, background: "var(--brown-900)", color: "var(--paper-100)", border: "1.5px solid var(--brown-900)", cursor: "pointer" }}>
          Accept all
        </button>
      </div>
    </div>
  </div>
);

/* ---------------- page ---------------- */

const IMAGES = {
  hero: "/images/hero.png",
  milk: "/images/milk.png",
  compliance: "/images/compliance.png",
  trial: "/images/trial.png",
};

export default function KaffelogLandingV2({ onGoSignup, onGoLogin } = {}) {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [cookieChoice, setCookieChoice] = useState(null);

  const goSignup = onGoSignup || (() => goTo("trial"));
  const goLogin = onGoLogin || (() => goTo("trial"));

  return (
    <div className="kf2">
      <Fonts />
      <TopBar />
      <Nav onGoSignup={goSignup} onGoLogin={goLogin} />
      <main>
        <Hero onGoSignup={goSignup} images={IMAGES} />
        <CostOfNothing />
        <ThreeJobs />
        <MilkOrdering onGoSignup={goSignup} images={IMAGES} />
        <Compliance onGoSignup={goSignup} images={IMAGES} />
        <SafeVault onGoSignup={goSignup} />
        <FitsBuilt />
        <Pricing onGoSignup={goSignup} />
        <Install />
        <Founder />
        <Trial onGoSignup={goSignup} images={IMAGES} />
      </main>
      <Footer openPrivacy={() => setPrivacyOpen(true)} />
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {!cookieChoice && <CookieBanner onChoice={setCookieChoice} openPrivacy={() => setPrivacyOpen(true)} />}
    </div>
  );
}
