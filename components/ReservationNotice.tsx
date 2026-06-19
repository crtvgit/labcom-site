"use client";

/**
 * ReservationNotice — tarja vermelha de aviso, fixada logo abaixo do
 * cabeçalho. Aparece quando `siteConfig.avisoReservas.ativo` é `true`.
 *
 * Para LIGAR / DESLIGAR e mudar o texto, edite o arquivo:
 *     lib/siteConfig.ts  →  avisoReservas
 *
 * Comportamento:
 *  - Fica grudada no topo (sticky) e acompanha a rolagem — impossível de
 *    não ver.
 *  - NÃO pode ser fechada: enquanto o aviso estiver ligado, a tarja
 *    permanece visível o tempo todo para todos os visitantes.
 *  - Respeita "prefers-reduced-motion": sem animação para quem pediu.
 */

import { motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";

export default function ReservationNotice() {
  const { ativo, titulo, mensagem } = siteConfig.avisoReservas;
  const reduce = useReducedMotion();

  if (!ativo) return null;

  return (
    <motion.div
      role="alert"
      className="reserva-aviso"
      initial={reduce ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
    >
      <div className="reserva-aviso-inner">
        {/* Ícone de alerta pulsante */}
        <motion.span
          className="reserva-aviso-icon"
          aria-hidden
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3 1.5 21h21L12 3Z"
              fill="rgba(255,255,255,0.18)"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line x1="12" y1="9.5" x2="12" y2="14.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="17.6" r="1.15" fill="#fff" />
          </svg>
        </motion.span>

        <p className="reserva-aviso-texto">
          <strong className="reserva-aviso-titulo">{titulo}:</strong>{" "}
          <span className="reserva-aviso-msg">{mensagem}</span>
        </p>
      </div>
    </motion.div>
  );
}
