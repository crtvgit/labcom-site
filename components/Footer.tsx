"use client";

import { useInView } from "@/lib/useInView";
import { UCB_LOGO } from "@/lib/assets";

export default function Footer() {
  const ref = useInView<HTMLDivElement>({ rootMargin: "-40px 0px" });

  return (
    <footer
      className="relative border-t border-b"
      style={{ borderColor: "var(--border)", minHeight: 140, overflow: "hidden" }}
    >
      {/* Paper texture background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--off-white)",
          backgroundImage: "var(--texture-url)",
          backgroundSize: "var(--texture-size) var(--texture-size)",
          backgroundRepeat: "repeat",
          backgroundBlendMode: "multiply",
        }}
        aria-hidden
      />

      {/*
       * Concentric pulsing rings — footer "breathes" as a closing orbit.
       * Each ring uses its own CSS class for the staggered pulse.
       * No transform on the SVG itself — only on the wrapper div.
       */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          bottom: -180,
          transform: "translateX(-50%)",
          width: 480,
          height: 480,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <circle className="geo-pr-1" cx="240" cy="240" r="90"  stroke="#74a8ed" strokeWidth="1.2" />
          <circle className="geo-pr-2" cx="240" cy="240" r="155" stroke="#74a8ed" strokeWidth="0.9" />
          <circle className="geo-pr-3" cx="240" cy="240" r="230" stroke="#74a8ed" strokeWidth="0.7" />
          <circle className="geo-pr-1" cx="240" cy="240" r="6"   fill="#74a8ed" />
        </svg>
      </div>

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center px-4"
        style={{ minHeight: 140, paddingTop: 32, paddingBottom: 32, gap: 4 }}
      >
        <div data-anim="fade-up">
          <a
            href="https://ucb.catolica.edu.br/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Universidade Católica de Brasília — site oficial"
            style={{
              display: "inline-block",
              lineHeight: 0,
              opacity: 1,
              transition: "opacity 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.7";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
            }}
          >
            <img
              src={UCB_LOGO}
              alt="Universidade Católica de Brasília"
              style={{
                height: "clamp(36px, 4vw, 52px)",
                width: "auto",
                maxWidth: 280,
                objectFit: "contain",
                display: "block",
              }}
            />
          </a>
        </div>
        <p
          data-anim="fade-up"
          data-delay="1"
          className="text-center"
          style={{
            fontSize: 10,
            color: "var(--gray-muted)",
            lineHeight: 1.5,
            marginTop: 4,
          }}
        >
          2026 — LABORATÓRIOS DE COMUNICAÇÃO DOS CURSOS DE COMUNICAÇÃO SOCIAL
          DA UNIVERSIDADE CATÓLICA DE BRASÍLIA
          <br />
          SITE PRODUZIDO E ORGANIZADO POR CIRO ARAUJO
        </p>
      </div>
    </footer>
  );
}
