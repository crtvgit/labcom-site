"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView as useMotionInView } from "motion/react";
import CalendarEmbed from "@/components/CalendarEmbed";

const DOTS_COLS = 4;
const DOTS_ROWS = 5;

export default function CalendarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });

  return (
    <section
      ref={sectionRef}
      id="calendario"
      aria-labelledby="calendar-heading"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--off-white)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot matrix — staggered pop-in per dot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "clamp(20px, 3vw, 40px)",
          right: "clamp(20px, 4vw, 52px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 90 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 90, height: 114, display: "block" }}
        >
          {Array.from({ length: DOTS_COLS }).flatMap((_, col) =>
            Array.from({ length: DOTS_ROWS }).map((_, row) => {
              const delay = 0.04 + (col * DOTS_ROWS + row) * 0.06;
              return (
                <motion.circle
                  key={`${col}-${row}`}
                  cx={col * 22 + 11}
                  cy={row * 22 + 11}
                  r="3"
                  fill="#74a8ed"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 0.18 } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay,
                  }}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Floating ring bottom-left */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: 180,
          height: 180,
          pointerEvents: "none",
          zIndex: 0,
        }}
        animate={{
          rotate: 360,
          y: [0, -12, 0],
        }}
        transition={{
          rotate: { duration: 44, ease: "linear", repeat: Infinity },
          y: { duration: 10, ease: "easeInOut", repeat: Infinity },
        }}
      >
        <svg viewBox="0 0 160 160" fill="none" style={{ width: "100%", height: "100%", opacity: 0.1 }}>
          <circle cx="80" cy="80" r="76" stroke="#74a8ed" strokeWidth="1" />
          <circle cx="80" cy="80" r="52" stroke="#74a8ed" strokeWidth="0.6" strokeDasharray="4 8" />
          <circle cx="80" cy="4" r="4" fill="#74a8ed" />
          <circle cx="156" cy="80" r="4" fill="#74a8ed" />
        </svg>
      </motion.div>

      <div className="content-inner py-6 md:py-8 lg:py-10" style={{ position: "relative", zIndex: 1 }}>
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(12px, 1.4vw, 18px)" }}
          initial={{ opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          calendário de reservas
        </motion.p>

        <div className="flex flex-wrap items-center gap-4 mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.12 }}
          >
            <Link
              href="/#reserva"
              className="reserva-cta-btn magnetic"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(8px, 1vw, 12px)",
                backgroundColor: "var(--near-black)",
                color: "var(--off-white)",
                fontWeight: 700,
                fontSize: "clamp(15px, 1.6vw, 22px)",
                lineHeight: 1,
                padding: "clamp(14px, 1.5vw, 20px) clamp(14px, 1.5vw, 20px)",
                borderRadius: 4,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden
                style={{ flexShrink: 0, opacity: 0.75 }}>
                <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
                <line x1="2" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.2" />
                <line x1="6" y1="1" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="12" y1="1" x2="12" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="6.5" cy="12" r="1" fill="currentColor" />
                <circle cx="9.5" cy="12" r="1" fill="currentColor" />
                <circle cx="12.5" cy="12" r="1" fill="currentColor" />
              </svg>
              <span>faça sua reserva!</span>
              <motion.span
                aria-hidden
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                style={{ display: "inline-block" }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          <motion.p
            id="calendar-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.22 }}
            style={{
              fontSize: "clamp(10px, 1vw, 14px)",
              fontWeight: 300,
              color: "#000",
            }}
          >
            *Mediante observância das normas regulamentares pertinentes
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.28 }}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 4,
            overflow: "hidden",
            backgroundColor: "var(--off-white)",
          }}
        >
          <CalendarEmbed />
        </motion.div>
      </div>
    </section>
  );
}
