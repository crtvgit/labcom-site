"use client";

import { useRef } from "react";
import { motion, useInView as useMotionInView } from "motion/react";

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });

  return (
    <section
      id="contatos"
      aria-labelledby="contact-heading"
      style={{ position: "relative" }}
    >
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          marginLeft: "clamp(1rem, 12.8vw, 164px)",
          marginRight: "clamp(1rem, 12.7vw, 162px)",
          border: "1px solid var(--border)",
          borderBottom: "none",
          backgroundColor: "var(--off-white)",
          backgroundImage: "var(--texture-url)",
          backgroundSize: "var(--texture-size) var(--texture-size)",
          backgroundRepeat: "repeat",
          backgroundBlendMode: "multiply",
          overflow: "visible",
        }}
      >
        {/* BG_Logo_Effect */}
        <img
          src="/textures/BG_Logo_Effect.svg"
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "-5%",
            width: "110%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Animated ring — top-right corner, very slow orbit */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: 220,
            height: 220,
            pointerEvents: "none",
            zIndex: 2,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, ease: "linear", repeat: Infinity }}
        >
          <svg viewBox="0 0 200 200" fill="none"
            style={{ width: "100%", height: "100%", opacity: 0.1 }}>
            <circle cx="100" cy="100" r="96" stroke="#74a8ed" strokeWidth="1" strokeDasharray="5 9" />
            <circle cx="100" cy="100" r="62" stroke="#74a8ed" strokeWidth="0.6" />
            <circle cx="100" cy="4" r="4" fill="#74a8ed" />
          </svg>
        </motion.div>

        {/* Text content */}
        <div
          className="content-inner py-10 md:py-12 lg:py-16"
          style={{ position: "relative", zIndex: 2 }}
        >
          <motion.p
            className="section-eyebrow text-center"
            style={{ marginBottom: "clamp(10px, 1.2vw, 14px)" }}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.05 }}
          >
            contatos
          </motion.p>

          <motion.p
            id="contact-heading"
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.14 }}
            style={{
              fontSize: "clamp(22px, 3.2vw, 48px)",
              fontWeight: 700,
              lineHeight: 1,
              marginBottom: "clamp(14px, 2vw, 28px)",
            }}
          >
            <span style={{ color: "var(--gray-muted)" }}>Para outras </span>
            <span style={{ color: "var(--blue-accent)" }}>dúvidas</span>
            <span style={{ color: "var(--gray-muted)" }}>:</span>
          </motion.p>

          {/* ── Contact info row ── */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.22 }}
            style={{
              marginBottom: "clamp(24px, 3.8vw, 40px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(16px, 2.4vw, 24px)",
            }}
          >
            {/* Email row */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 14px)" }}>
              <motion.svg
                width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden
                style={{ flexShrink: 0, opacity: 0.45 }}
                whileHover={{ opacity: 0.9, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="#74a8ed" strokeWidth="1.3" />
                <path d="M2 7l8 5 8-5" stroke="#74a8ed" strokeWidth="1.3" strokeLinecap="round" />
              </motion.svg>
              <motion.a
                href="mailto:crtv@ucb.br"
                className="contact-email-link"
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                style={{
                  display: "block",
                  fontSize: "clamp(20px, 2.8vw, 42px)",
                  fontWeight: 500,
                  color: "#000",
                  textDecoration: "none",
                  lineHeight: 1.25,
                  transition: "color 0.2s",
                }}
              >
                crtv@ucb.br
              </motion.a>
            </div>

            {/* Phone row */}
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 1vw, 14px)" }}>
              <motion.svg
                width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden
                style={{ flexShrink: 0, opacity: 0.45 }}
                whileHover={{ opacity: 0.9, rotate: 12 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                <path
                  d="M4 3h3.5l1.5 3.5-2 1.2a9 9 0 0 0 3.8 3.8l1.2-2L15.5 11 16 14.5A1.5 1.5 0 0 1 14.5 16C8.1 16 4 11.9 4 5.5A1.5 1.5 0 0 1 4 3z"
                  stroke="#74a8ed" strokeWidth="1.3" strokeLinejoin="round" fill="none"
                />
              </motion.svg>
              <motion.p
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                style={{
                  fontSize: "clamp(18px, 2.5vw, 36px)",
                  fontWeight: 500,
                  color: "#000",
                  margin: 0,
                  cursor: "default",
                }}
              >
                3356-9226
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.32 }}
            style={{ marginBottom: "clamp(14px, 1.8vw, 24px)" }}
          >
            {/* Hours heading with clock icon */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(6px, 0.8vw, 10px)",
              marginBottom: "clamp(8px, 1vw, 14px)",
            }}>
              <motion.svg
                width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden
                style={{ flexShrink: 0, opacity: 0.45 }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
              >
                <circle cx="9" cy="9" r="7.5" stroke="#74a8ed" strokeWidth="1.2" />
                <path d="M9 5v4l2.5 2.5" stroke="#74a8ed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
              <p
                style={{
                  fontSize: "clamp(14px, 1.8vw, 26px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                <span style={{ color: "var(--gray-muted)" }}>
                  horário de atendimento ao{" "}
                </span>
                <span style={{ color: "var(--blue-accent)" }}>público</span>
                <span style={{ color: "var(--gray-muted)" }}>:</span>
              </p>
            </div>

            <div
              className="inline-flex flex-col gap-2"
              style={{ fontSize: "clamp(13px, 1.5vw, 22px)", fontWeight: 500 }}
            >
              <motion.div
                className="flex justify-between gap-12"
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.40 }}
              >
                <span style={{ color: "#000" }}>seg. – ter.</span>
                <span style={{ color: "var(--blue-accent)" }}>08:30 – 17:30</span>
              </motion.div>
              <motion.div
                className="flex justify-between gap-12"
                initial={{ opacity: 0, x: -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.48 }}
              >
                <span style={{ color: "#000" }}>sexta-feira</span>
                <span style={{ color: "var(--blue-accent)" }}>08:30 – 16:30</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
