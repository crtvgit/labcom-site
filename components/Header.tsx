"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LOGO_SYMBOL,
  LOGO_TYPEFACE,
  ICON_HAMBURGER,
  ICON_CLOSE,
} from "@/lib/assets";

const NAV_ITEMS = [
  { label: "sobre", href: "/#sobre", cta: false },
  { label: "calendário", href: "/#calendario", cta: false },
  { label: "faça sua reserva", href: "/#reserva", cta: true },
  { label: "contatos", href: "/#contatos", cta: false },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = () => setIsOpen(false);

  return (
    <header
      className={`header-root${isOpen ? " open" : ""}`}
      aria-label="Navegação principal"
    >
      {/* ── Top bar ── */}
      <div className="header-top-bar">
        {/* Logo — CSS slide-down entrance */}
        <div className="header-logo-anim">
          <Link
            href="/"
            className="header-logo"
            onClick={handleNavClick}
            aria-label="LAB.COM — Início"
          >
            <img
              src={LOGO_SYMBOL}
              alt=""
              aria-hidden
              style={{
                height: "clamp(24px, 2.8vw, 36px)",
                width: "auto",
                flexShrink: 0,
              }}
            />
            <img
              src={LOGO_TYPEFACE}
              alt="LAB.COM"
              style={{
                height: "clamp(24px, 2.8vw, 36px)",
                width: "auto",
                flexShrink: 0,
              }}
            />
          </Link>
        </div>

        {/* Right side — CSS slide-down entrance */}
        <div className="header-right header-right-anim">
          <Link
            href="/#reserva"
            className="header-reserva-link"
            onClick={handleNavClick}
          >
            <span>Faça as reservas</span>
            <span className="header-reserva-arrow" aria-hidden>→</span>
          </Link>
          <div className="header-divider" aria-hidden />

          {/* Hamburger — CSS crossfade between two overlapping icons */}
          <button
            className="header-menu-btn"
            onClick={() => setIsOpen((v) => !v)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
          >
            <span
              style={{
                position: "relative",
                display: "flex",
                width: 22,
                height: 22,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={ICON_HAMBURGER}
                alt=""
                aria-hidden
                style={{
                  position: "absolute",
                  width: 22,
                  height: "auto",
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen
                    ? "scale(0.7) rotate(30deg)"
                    : "scale(1) rotate(0deg)",
                  transition: "opacity 0.18s, transform 0.18s",
                }}
              />
              <img
                src={ICON_CLOSE}
                alt=""
                aria-hidden
                style={{
                  position: "absolute",
                  width: 22,
                  height: "auto",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen
                    ? "scale(1) rotate(0deg)"
                    : "scale(0.7) rotate(-30deg)",
                  transition: "opacity 0.18s, transform 0.18s",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ── Curtain nav (revealed on open) ── */}
      <nav
        className="header-nav"
        aria-label="Menu expandido"
        aria-hidden={!isOpen}
      >
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className={`header-nav-item${item.cta ? " header-nav-cta" : ""}`}
            onClick={handleNavClick}
            tabIndex={isOpen ? 0 : -1}
            style={{ transition: "transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)" }}
            onMouseEnter={(e) => {
              if (item.cta) {
                e.currentTarget.style.transform = "scale(1.03) translateX(6px)";
              } else {
                e.currentTarget.style.transform = "translateX(8px)";
              }
            }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
          >
            <span className="header-nav-num">0{i + 1}.</span>
            <span className="header-nav-label">{item.label}</span>
            <span className="header-nav-arrow" aria-hidden>
              →
            </span>
          </Link>
        ))}
        <div className="header-nav-spacer" />
        <div className="header-nav-footer" aria-hidden={!isOpen} style={{ paddingBottom: "clamp(24px, 5vh, 48px)" }}>
          <span className="header-nav-footer-brand">LAB.COM</span>
          <span className="header-nav-footer-location">
            Universidade Católica de Brasília
          </span>
        </div>
      </nav>
    </header>
  );
}
