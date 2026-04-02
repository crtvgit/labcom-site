"use client";

import { useRef } from "react";
import { motion, useInView as useMotionInView } from "motion/react";

const FORM_URL = "https://forms.cloud.microsoft/r/iAjrCMt6KQ";

export default function ReservaContent() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });

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
        animate={{ rotate: 360 }}
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
        animate={{ rotate: -360 }}
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
          initial={{ opacity: 0, x: -14 }}
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
            initial={{ opacity: 0, x: -24 }}
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
            preencha o formulário
          </motion.h2>

          <motion.a
            href="https://ubecedu.sharepoint.com/:b:/s/Klabs2/IQBfHHLa250JSJVns4hVXKl7Acq7FjYIcHjn8TOl3fGep6U?e=w2OPt0"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 14 }}
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
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.26 }}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Top accent stripe */}
          <div
            style={{
              height: 3,
              background: "linear-gradient(90deg, var(--blue-accent) 0%, var(--blue-light) 100%)",
            }}
            aria-hidden
          />

          {/* Content area */}
          <div
            style={{
              backgroundColor: "var(--off-white)",
              padding: "clamp(28px, 4vw, 56px) clamp(24px, 4vw, 56px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(16px, 2vw, 24px)",
              textAlign: "center",
            }}
          >
            {/* Icon — pulse on load */}
            <motion.div
              aria-hidden
              style={{ lineHeight: 0 }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.36 }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect width="48" height="48" rx="8" fill="var(--blue-accent)" opacity="0.1" />
                <path
                  d="M14 12h20a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z"
                  stroke="var(--blue-accent)" strokeWidth="1.5" fill="none"
                />
                <line x1="18" y1="20" x2="30" y2="20" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="24" x2="30" y2="24" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="28" x2="24" y2="28" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="36" cy="34" r="7" fill="var(--off-white)" stroke="var(--blue-accent)" strokeWidth="1.5" />
                <path d="M33 34l2 2 4-4" stroke="var(--blue-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>

            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.42 }}
            >
              <p style={{
                fontSize: "clamp(14px, 1.6vw, 20px)",
                fontWeight: 600,
                color: "#000",
                margin: 0,
                lineHeight: 1.3,
              }}>
                O formulário será aberto em uma nova aba
              </p>
              <p style={{
                fontSize: "clamp(11px, 1.1vw, 14px)",
                fontWeight: 400,
                color: "var(--gray-muted)",
                margin: 0,
                lineHeight: 1.5,
                maxWidth: 480,
              }}>
                Por restrições de segurança do Microsoft Forms, o preenchimento
                precisa ser feito diretamente no site. Clique abaixo para abrir.
              </p>
            </motion.div>

            <motion.a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.50 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                backgroundColor: "var(--near-black)",
                color: "var(--off-white)",
                fontWeight: 700,
                fontSize: "clamp(13px, 1.4vw, 18px)",
                lineHeight: 1,
                padding: "clamp(12px, 1.4vw, 18px) clamp(20px, 2.4vw, 32px)",
                borderRadius: 4,
                textDecoration: "none",
                letterSpacing: "0.01em",
                cursor: "pointer",
              }}
            >
              <span>Abrir formulário de reserva</span>
              <motion.span
                aria-hidden
                style={{ fontSize: "1.1em" }}
                animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
              >
                ↗
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
