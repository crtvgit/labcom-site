"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView as useMotionInView, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/siteConfig";

// Números editáveis em: lib/siteConfig.ts → numeros
const STATS = siteConfig.numeros.map((n) => ({ value: n.valor, label: n.descricao }));

/** Spring-physics counter — counts 0 → value when visible. */
function AnimatedCounter({ value }: { value: string }) {
  const numericPart = parseInt(value, 10);
  const suffix = value.slice(String(numericPart).length);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setCount(numericPart);
          return;
        }
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOut cubic
          setCount(Math.round(eased * numericPart));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [numericPart]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px 0px" });
  const reduce = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="sobre"
      aria-labelledby="about-heading"
      style={{
        border: "1px solid var(--border)",
        backgroundColor: "var(--off-white)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Concentric rings watermark — slow CCW spin */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          right: "clamp(-160px, -12vw, -30px)",
          top: "50%",
          translateY: "-50%",
          width: "clamp(220px, 42vw, 500px)",
          height: "clamp(220px, 42vw, 500px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        <svg
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block", opacity: 0.1 }}
        >
          <circle cx="240" cy="240" r="238" stroke="#74a8ed" strokeWidth="1.2" />
          <circle cx="240" cy="240" r="192" stroke="#74a8ed" strokeWidth="0.8" strokeDasharray="4 10" />
          <circle cx="240" cy="240" r="132" stroke="#74a8ed" strokeWidth="0.6" />
          <circle cx="240" cy="240" r="72"  stroke="#74a8ed" strokeWidth="0.4" strokeDasharray="3 7" />
          <circle cx="240" cy="8"   r="5"   fill="#74a8ed" />
          <circle cx="472" cy="240" r="5"   fill="#74a8ed" />
        </svg>
      </motion.div>

      <div className="content-inner py-10 md:py-12 lg:py-14" style={{ position: "relative", zIndex: 1 }}>
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(12px, 1.4vw, 18px)" }}
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.05 }}
        >
          sobre o LAB.COM
        </motion.p>

        <div
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
          style={{ alignItems: "flex-start" }}
        >
          {/* Left column */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <motion.h2
              id="about-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.12 }}
              style={{
                fontSize: "clamp(26px, 4vw, 48px)",
                fontWeight: 700,
                lineHeight: 1.12,
                marginBottom: "clamp(16px, 2.2vw, 28px)",
              }}
            >
              <span>Onde a </span>
              <span style={{ color: "var(--blue-accent)" }}>comunicação</span>
              <span> ganha vida.</span>
            </motion.h2>

            <motion.ul
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 140, damping: 22, delay: 0.22 }}
              style={{
                fontSize: "clamp(13px, 1.3vw, 16px)",
                fontWeight: 400,
                lineHeight: 1.65,
                paddingLeft: "1.25em",
                color: "#000",
                display: "flex",
                flexDirection: "column",
                gap: "0.75em",
              }}
            >
              <li>
                O LAB.COM é o laboratório de práticas integradas dos cursos de
                Comunicação da Universidade Católica de Brasília. Um espaço
                pensado para dar aos estudantes acesso a equipamentos e
                ambientes profissionais.
              </li>
              <li>
                Dos estúdios de rádio e TV às salas de fotografia e edição, o
                LAB.COM reúne toda a infraestrutura que você precisa para
                desenvolver projetos reais durante a graduação e pós-graduação.
              </li>
            </motion.ul>
          </div>

          {/* Right column — stats grid */}
          <div
            className="about-stats-grid grid grid-cols-2 gap-3 shrink-0"
            style={{ width: "clamp(300px, 35%, 380px)" }}
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-box"
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                  delay: 0.28 + i * 0.09,
                }}
                whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 28 } }}
              >
                <span
                  style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    fontWeight: 700,
                    color: "var(--blue-accent)",
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter value={stat.value} />
                </span>
                <span
                  style={{
                    fontSize: "clamp(10px, 0.9vw, 12px)",
                    fontWeight: 400,
                    color: "var(--gray-muted)",
                    lineHeight: 1.2,
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
