"use client";

/**
 * IntroSection — seção de destaque logo abaixo do cabeçalho (substitui o
 * antigo espaço de vídeo). Em vez de um vídeo "em breve", oferece uma frase
 * editorial + três atalhos rápidos (reserva, espaços, calendário).
 *
 * Todo o texto e os atalhos vêm de:
 *     lib/siteConfig.ts  →  destaque
 *
 * Mantém a mesma linguagem visual da Hero (caixa com borda, textura de papel
 * e anéis azuis) para preservar o ritmo da página.
 */

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView as useMotionInView, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";

/** Ícones simples por índice de atalho — reserva, espaços, calendário. */
function ShortcutIcon({ index }: { index: number }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };
  if (index === 0) {
    // Documento com check (reserva)
    return (
      <svg {...common}>
        <rect x="4" y="3" width="13" height="18" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <line x1="7.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7.5" y1="11.5" x2="13.5" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="17.5" cy="17" r="4.5" fill="var(--off-white)" stroke="currentColor" strokeWidth="1.4" />
        <path d="m15.6 17 1.3 1.3 2.3-2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (index === 1) {
    // Grade de espaços
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  // Calendário
  return (
    <svg {...common}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });
  const reduce = useReducedMotion();
  const { etiqueta, fraseInicio, frasePalavraAzul, fraseFim, atalhos } =
    siteConfig.destaque;

  return (
    <section
      ref={sectionRef}
      id="destaque"
      aria-label="Destaque LAB.COM"
      style={{ position: "relative", padding: "1rem" }}
    >
      {/* Caixa de fundo com borda + textura de papel (igual à Hero) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          backgroundColor: "var(--off-white)",
          backgroundImage: "var(--texture-url)",
          backgroundSize: "var(--texture-size) var(--texture-size)",
          backgroundRepeat: "repeat",
          backgroundBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Anel azul decorativo — canto superior direito */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 230,
          height: 230,
          pointerEvents: "none",
          zIndex: 1,
        }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 48, ease: "linear", repeat: Infinity }}
      >
        <svg viewBox="0 0 200 200" fill="none" style={{ width: "100%", height: "100%", opacity: 0.1 }}>
          <circle cx="100" cy="100" r="96" stroke="#74a8ed" strokeWidth="1" strokeDasharray="5 9" />
          <circle cx="100" cy="100" r="62" stroke="#74a8ed" strokeWidth="0.6" />
          <circle cx="100" cy="4" r="4" fill="#74a8ed" />
        </svg>
      </motion.div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(28px, 4vw, 52px) clamp(20px, 3vw, 44px)",
        }}
      >
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(14px, 1.6vw, 22px)" }}
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          {etiqueta}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.1 }}
          style={{
            fontSize: "clamp(22px, 3.4vw, 40px)",
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
            margin: 0,
            marginBottom: "clamp(24px, 3vw, 40px)",
            maxWidth: "20ch",
          }}
        >
          <span>{fraseInicio} </span>
          <span style={{ color: "var(--blue-accent)" }}>{frasePalavraAzul}</span>
          <span> {fraseFim}</span>
        </motion.h2>

        {/* Atalhos rápidos */}
        <div className="intro-atalhos">
          {atalhos.map((atalho, i) => (
            <motion.div
              key={atalho.href}
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.2 + i * 0.1 }}
            >
              <Link href={atalho.href} className="intro-atalho">
                <span className="intro-atalho-icon" aria-hidden>
                  <ShortcutIcon index={i} />
                </span>
                <span className="intro-atalho-titulo">{atalho.titulo}</span>
                <span className="intro-atalho-desc">{atalho.descricao}</span>
                <span className="intro-atalho-seta" aria-hidden>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
