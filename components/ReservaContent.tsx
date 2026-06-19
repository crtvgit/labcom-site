"use client";

import { useRef } from "react";
import { motion, useInView as useMotionInView, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";

const REGRAS_URL = siteConfig.links.regrasVigentes;

/* ── Ícones por tipo de reserva ─────────────────────────────── */
function SalaIcon() {
  // Porta / sala de aula
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden focusable="false">
      <rect width="48" height="48" rx="8" fill="var(--blue-accent)" opacity="0.1" />
      <path d="M16 13h16v22H16z" stroke="var(--blue-accent)" strokeWidth="1.5" fill="none" />
      <path d="M13 35h22" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="28.5" cy="24" r="1.6" fill="var(--blue-accent)" />
    </svg>
  );
}

function EquipamentoIcon() {
  // Câmera / equipamento
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden focusable="false">
      <rect width="48" height="48" rx="8" fill="var(--blue-accent)" opacity="0.1" />
      <path
        d="M13 18h5l2-3h8l2 3h5a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z"
        stroke="var(--blue-accent)" strokeWidth="1.5" fill="none" strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="5" stroke="var(--blue-accent)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

type Opcao = {
  key: string;
  titulo: string;
  descricao: string;
  formulario: string;
  bloqueada: boolean;
  Icon: () => React.ReactElement;
};

/** Um cartão de reserva — estado "disponível" ou "bloqueado". */
function ReservaCard({
  opcao,
  isInView,
  delay,
  reduce,
}: {
  opcao: Opcao;
  isInView: boolean;
  delay: number;
  reduce: boolean | null;
}) {
  const { titulo, descricao, formulario, bloqueada, Icon } = opcao;

  return (
    <motion.div
      className="reserva-opcao"
      initial={reduce ? false : { opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 160, damping: 22, delay }}
    >
      {/* Faixa de destaque no topo */}
      <div className="reserva-opcao-stripe" aria-hidden />

      <div className="reserva-opcao-body">
        <div aria-hidden style={{ lineHeight: 0 }}>
          <Icon />
        </div>

        <h3 className="reserva-opcao-titulo">{titulo}</h3>

        {bloqueada && (
          <span className="reserva-bloqueada-badge">
            {siteConfig.avisoReservas.titulo}
          </span>
        )}

        <p className="reserva-opcao-desc">
          {bloqueada ? siteConfig.avisoReservas.mensagem : descricao}
        </p>

        {bloqueada ? (
          <button
            type="button"
            className="reserva-bloqueada-btn"
            disabled
            aria-disabled="true"
          >
            <span aria-hidden>🔒</span>
            <span>Reservas bloqueadas</span>
          </button>
        ) : (
          <motion.a
            href={formulario}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark reserva-opcao-cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Abrir formulário</span>
            <span className="sr-only"> de {titulo} (abre em nova aba)</span>
            <motion.span
              aria-hidden
              style={{ fontSize: "1.1em" }}
              animate={reduce ? undefined : { x: [0, 4, 0], y: [0, -4, 0] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
            >
              ↗
            </motion.span>
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

export default function ReservaContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });
  const reduce = useReducedMotion();

  // O bloqueio (avisoReservas.ativo) afeta APENAS equipamentos e laboratórios.
  // As reservas de salas de aula continuam disponíveis normalmente.
  const bloqueado = siteConfig.avisoReservas.ativo;

  const opcoes: Opcao[] = [
    {
      key: "salas",
      titulo: siteConfig.reservas.salas.titulo,
      descricao: siteConfig.reservas.salas.descricao,
      formulario: siteConfig.reservas.salas.formulario,
      bloqueada: false, // salas nunca são bloqueadas
      Icon: SalaIcon,
    },
    {
      key: "equipamentos",
      titulo: siteConfig.reservas.equipamentos.titulo,
      descricao: siteConfig.reservas.equipamentos.descricao,
      formulario: siteConfig.reservas.equipamentos.formulario,
      bloqueada: bloqueado, // equipamentos seguem o aviso de bloqueio
      Icon: EquipamentoIcon,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="reserva"
      aria-labelledby="reserva-heading"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--off-white)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Rotating ring — top-left, partially clipped */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", left: -90, top: -90, width: 340, height: 340, pointerEvents: "none", zIndex: 0 }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 42, ease: "linear", repeat: Infinity }}
      >
        <svg
          viewBox="0 0 320 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block", opacity: 0.14 }}
        >
          <circle cx="160" cy="160" r="157" stroke="#74a8ed" strokeWidth="1.3" />
          <circle cx="160" cy="160" r="122" stroke="#74a8ed" strokeWidth="0.8" strokeDasharray="5 9" />
          <circle cx="160" cy="8" r="5" fill="#74a8ed" />
          <circle cx="312" cy="160" r="5" fill="#74a8ed" />
        </svg>
      </motion.div>

      {/* Second ring — bottom-right corner */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", right: -60, bottom: -60, width: 240, height: 240, pointerEvents: "none", zIndex: 0 }}
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
      >
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block", opacity: 0.1 }}
        >
          <circle cx="100" cy="100" r="96" stroke="#74a8ed" strokeWidth="1" strokeDasharray="4 9" />
          <circle cx="100" cy="100" r="64" stroke="#74a8ed" strokeWidth="0.6" />
          <circle cx="100" cy="4" r="4" fill="#74a8ed" />
        </svg>
      </motion.div>

      <div className="content-inner py-8 md:py-10 lg:py-12" style={{ position: "relative", zIndex: 1 }}>
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(10px, 1.2vw, 14px)" }}
          initial={reduce ? false : { opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          formulário de reserva
        </motion.p>

        <div
          className="flex flex-wrap items-center justify-between gap-4"
          style={{ marginBottom: "clamp(20px, 2.4vw, 36px)" }}
        >
          <motion.h2
            id="reserva-heading"
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.1 }}
            style={{
              fontSize: "clamp(26px, 4vw, 48px)",
              fontWeight: 700,
              color: "var(--blue-accent)",
              lineHeight: 1,
              margin: 0,
            }}
          >
            escolha o tipo de reserva
          </motion.h2>

          <motion.a
            href={REGRAS_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.18 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "var(--red-accent)",
              color: "#fff",
              fontWeight: 400,
              fontSize: "clamp(13px, 1.5vw, 20px)",
              padding: "clamp(7px, 0.8vw, 10px) clamp(12px, 1.5vw, 18px)",
              borderRadius: 4,
              textDecoration: "none",
              whiteSpace: "nowrap",
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            regras vigentes
            <span className="sr-only"> (abre em nova aba)</span>
          </motion.a>
        </div>

        <div className="reserva-opcoes">
          {opcoes.map((opcao, i) => (
            <ReservaCard
              key={opcao.key}
              opcao={opcao}
              isInView={isInView}
              delay={0.26 + i * 0.1}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
