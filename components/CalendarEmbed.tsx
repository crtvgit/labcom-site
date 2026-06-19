"use client";

/**
 * CalendarEmbed — acesso aos calendários de disponibilidade dos espaços.
 *
 * ⚠️  Por que não é mais "embutido"?
 * A Microsoft passou a bloquear a exibição do calendário do Outlook dentro de
 * outros sites (cabeçalho de segurança X-Frame-Options: SAMEORIGIN). O antigo
 * <iframe> ficava em branco. Por isso, cada calendário agora abre em uma nova
 * aba — solução confiável e acessível.
 *
 * Os calendários (nome, descrição e link) são editáveis em:
 *     lib/siteConfig.ts  →  calendarios
 */

import { motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";

const CALENDARS = siteConfig.calendarios;

/** Ícone de calendário decorativo. */
function CalendarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden focusable="false">
      <rect width="48" height="48" rx="8" fill="var(--blue-accent)" opacity="0.1" />
      <rect x="12" y="14" width="24" height="21" rx="2" stroke="var(--blue-accent)" strokeWidth="1.5" fill="none" />
      <line x1="12" y1="21" x2="36" y2="21" stroke="var(--blue-accent)" strokeWidth="1.5" />
      <line x1="18" y1="10" x2="18" y2="17" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="10" x2="30" y2="17" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="24" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="28" cy="28" r="1.5" fill="var(--blue-accent)" />
      <circle cx="20" cy="32.5" r="1.5" fill="var(--blue-accent)" />
      <circle cx="24" cy="32.5" r="1.5" fill="var(--blue-accent)" />
    </svg>
  );
}

export default function CalendarEmbed() {
  const reduce = useReducedMotion();

  return (
    <div className="cal-cards-wrap">
      {/* Aviso acessível explicando o comportamento */}
      <p className="cal-cards-note">
        Selecione um espaço para consultar a disponibilidade. O calendário do
        Outlook abrirá em uma nova aba.
      </p>

      <ul className="cal-cards-grid" role="list">
        {CALENDARS.map((cal, i) => (
          <li key={cal.nome} style={{ listStyle: "none" }}>
            <motion.a
              href={cal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cal-card"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 220, damping: 26, delay: i * 0.08 }}
            >
              <span className="cal-card-stripe" aria-hidden />
              <span className="cal-card-icon" aria-hidden>
                <CalendarIcon />
              </span>
              <h3 className="cal-card-title">{cal.nome}</h3>
              <p className="cal-card-desc">{cal.descricao}</p>
              <span className="cal-card-cta">
                Ver disponibilidade
                <span aria-hidden> ↗</span>
                {/* Texto só para leitores de tela — avisa que abre em nova aba */}
                <span className="sr-only"> (abre o calendário de {cal.nome} em uma nova aba)</span>
              </span>
            </motion.a>
          </li>
        ))}
      </ul>
    </div>
  );
}
