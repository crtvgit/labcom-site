"use client";

import { useState } from "react";
import { motion } from "motion/react";

const CALENDARS = [
  {
    id: "crtv",
    label: "CRTV",
    description: "Estúdio de TV com chroma key, ilhas de edição e teleprompter.",
    url: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/c0b7f0e5d28f4128bcec9f53b09845d38669094876541354230/calendar.html",
  },
  {
    id: "radio",
    label: "Rádio",
    description: "Estúdio de rádio e podcast com microfones e mesa de áudio.",
    url: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/3eb6c8664aad41338cfcf874e11a56ef2062506675193543890/calendar.html",
  },
  {
    id: "nfoto",
    label: "N.FOTO",
    description: "Núcleo de fotografia com cicloramas e iluminação profissional.",
    url: "https://outlook.office365.com/owa/calendar/04377dd3fc844e2c8ffa40794bc40ba7@ucb.br/284732e24f574089b47433db68a2cb0710490216399718100738/calendar.html",
  },
] as const;

type CalendarId = (typeof CALENDARS)[number]["id"];

/** Calendar icon — matches the form icon style in ReservaContent */
function CalendarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect width="48" height="48" rx="8" fill="var(--blue-accent)" opacity="0.1" />
      <rect
        x="12" y="14" width="24" height="21" rx="2"
        stroke="var(--blue-accent)" strokeWidth="1.5" fill="none"
      />
      <line x1="12" y1="21" x2="36" y2="21" stroke="var(--blue-accent)" strokeWidth="1.5" />
      <line
        x1="18" y1="10" x2="18" y2="17"
        stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round"
      />
      <line
        x1="30" y1="10" x2="30" y2="17"
        stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round"
      />
      <circle cx="20" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="24" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="28" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="20" cy="32.5" r="1.5" fill="var(--blue-accent)" />
      <circle cx="24" cy="32.5" r="1.5" fill="var(--blue-accent)" />
    </svg>
  );
}

export default function CalendarEmbed() {
  const [active, setActive] = useState<CalendarId>("crtv");

  const activeCal = CALENDARS.find((c) => c.id === active)!;

  return (
    <div>
      {/*
       * ── Desktop view (≥ 768 px) ─────────────────────────────────
       * Tab bar + embedded Outlook iframe.
       * Hidden on mobile via .calendar-desktop-view { display: none }
       * in the @media (max-width: 767px) block of globals.css.
       */}
      <div className="calendar-desktop-view">
        <div
          role="tablist"
          aria-label="Selecione o calendário"
          className="calendar-tab-bar"
          style={{ display: "flex", borderBottom: "1px solid var(--border)" }}
        >
          {CALENDARS.map((cal) => {
            const isActive = active === cal.id;
            return (
              <button
                key={cal.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`calendar-panel-${cal.id}`}
                id={`calendar-tab-${cal.id}`}
                onClick={() => setActive(cal.id)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--blue-accent)"
                    : "2px solid transparent",
                  padding: "clamp(8px, 1vw, 12px) clamp(14px, 2vw, 24px)",
                  fontSize: "clamp(10px, 0.9vw, 12px)",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--blue-accent)" : "var(--gray-muted)",
                  cursor: "pointer",
                  transition: "color 0.18s, border-color 0.18s",
                  lineHeight: 1,
                  marginBottom: "-1px",
                  whiteSpace: "nowrap",
                  fontFamily: "inherit",
                }}
              >
                {cal.label}
              </button>
            );
          })}
        </div>

        {/*
         * All three iframes stay mounted so switching tabs doesn't reload
         * the Outlook page.  .calendar-iframe-wrapper sets the height via CSS.
         * Smooth swipe right/left animations applied via Framer Motion.
         */}
        <div className="calendar-iframe-wrapper" style={{ position: "relative", overflow: "hidden" }}>
          {CALENDARS.map((cal, index) => {
            const activeIndex = CALENDARS.findIndex(c => c.id === active);
            const isActive = active === cal.id;
            let xPos = "0%";
            if (index < activeIndex) xPos = "-100%";
            if (index > activeIndex) xPos = "100%";

            return (
              <motion.div
                key={cal.id}
                role="tabpanel"
                id={`calendar-panel-${cal.id}`}
                aria-labelledby={`calendar-tab-${cal.id}`}
                initial={false}
                animate={{ x: xPos, opacity: isActive ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <iframe
                  src={cal.url}
                  title={`Calendário ${cal.label}`}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/*
       * ── Mobile selector (≤ 767 px) ──────────────────────────────
       *
       * Outlook Calendar embedded in a narrow iframe is nearly unusable on
       * touch screens.  This replaces the iframe with a simple selector
       * that opens the chosen calendar in a full browser tab — the best
       * native experience on iOS and Android.
       *
       * Shown on mobile via .calendar-mobile-selector { display: flex }
       * in the @media (max-width: 767px) block of globals.css.
       */}
      <div
        className="calendar-mobile-selector"
        aria-label="Selecione e abra o calendário"
      >
        {/* Tab-style selector — equal-width, 44 px+ touch targets */}
        <div
          role="tablist"
          aria-label="Selecione o calendário"
          className="cal-sel-tabs"
        >
          {CALENDARS.map((cal) => (
            <button
              key={cal.id}
              role="tab"
              aria-selected={active === cal.id}
              className="cal-sel-tab-btn"
              onClick={() => setActive(cal.id)}
            >
              {cal.label}
            </button>
          ))}
        </div>

        {/* Panel — mirrors the ReservaContent panel design */}
        <div className="cal-sel-panel">
          {/* Blue gradient top stripe */}
          <div className="cal-sel-stripe" aria-hidden />

          <div className="cal-sel-content">
            {/* Calendar icon */}
            <CalendarIcon />

            {/* Calendar name + description */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--blue-accent)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {activeCal.label}
              </p>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "var(--gray-muted)",
                  margin: 0,
                  lineHeight: 1.5,
                  maxWidth: 280,
                }}
              >
                {activeCal.description}
              </p>
            </div>

            {/* CTA — opens the Outlook calendar in a new tab */}
            <a
              href={activeCal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cal-sel-cta"
            >
              <span>Ver disponibilidade</span>
              <span aria-hidden style={{ fontSize: "1.1em" }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
