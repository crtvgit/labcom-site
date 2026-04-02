"use client";

/**
 * Hero section — bordered box with paper texture.
 * Motion: spring entrance stagger + mouse-parallax geo ring.
 */

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from "motion/react";

const HERO_UCB_TEXT = "/assets/logo_universidadecatolica.svg";
const HERO_CHEVRON = "/assets/logo_symbol.svg";
const HERO_WORDMARK = "/assets/logo_labcom.svg";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 22,
      delay: 0.12 + i * 0.13,
    },
  }),
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Mouse parallax for the geo ring ── */
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const ringDx = useTransform(rawX, [0, 1], [-18, 18]);
  const ringDy = useTransform(rawY, [0, 1], [-10, 10]);
  const springX = useSpring(ringDx, { stiffness: 70, damping: 20 });
  const springY = useSpring(ringDy, { stiffness: 70, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    rawX.set(0.5);
    rawY.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="LAB.COM — Cabeçalho principal"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          border: "1px solid var(--border)",
          backgroundColor: "var(--page-bg)",
          backgroundImage: "var(--texture-url)",
          backgroundSize: "var(--texture-size) var(--texture-size)",
          backgroundRepeat: "repeat",
          backgroundBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />
      {/*
       * Dominant gravitational ring — mouse-parallax + slow spin.
       */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          right: "clamp(-120px, -8vw, -20px)",
          top: "50%",
          translateY: "-50%",
          x: springX,
          y: springY,
          width: "clamp(180px, 38vw, 420px)",
          height: "clamp(180px, 38vw, 420px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {/* Outer halo — slow CW spin */}
        <motion.svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            opacity: 0.16,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 38, ease: "linear", repeat: Infinity }}
        >
          <circle cx="200" cy="200" r="197" stroke="#74a8ed" strokeWidth="1.5" />
          <circle
            cx="200"
            cy="200"
            r="155"
            stroke="#74a8ed"
            strokeWidth="0.9"
            strokeDasharray="6 10"
          />
          <line x1="200" y1="3"   x2="200" y2="26"  stroke="#74a8ed" strokeWidth="1.5" />
          <line x1="397" y1="200" x2="374" y2="200" stroke="#74a8ed" strokeWidth="1.5" />
          <line x1="200" y1="397" x2="200" y2="374" stroke="#74a8ed" strokeWidth="1.5" />
          <line x1="3"   y1="200" x2="26"  y2="200" stroke="#74a8ed" strokeWidth="1.5" />
          <circle cx="200" cy="7" r="5" fill="#74a8ed" />
        </motion.svg>

        {/* Inner ring — counter-spin, pulse opacity */}
        <motion.svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
          animate={{ rotate: -360, opacity: [0.08, 0.18, 0.08] }}
          transition={{
            rotate: { duration: 28, ease: "linear", repeat: Infinity },
            opacity: { duration: 9, ease: "easeInOut", repeat: Infinity },
          }}
        >
          <circle cx="200" cy="200" r="106" stroke="#74a8ed" strokeWidth="0.6" />
          <circle cx="200" cy="200" r="58"  stroke="#74a8ed" strokeWidth="0.4" strokeDasharray="3 8" />
        </motion.svg>
      </motion.div>

      {/*
       * .hero-layout — spring stagger entrance for each child.
       */}
      {/* Hero content — z:2, sits ABOVE the triangle (z:1 in page.tsx) */}
      <div
        className="hero-layout"
        style={{
          position: "relative",
          aspectRatio: "954 / 351",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        {/* UCB text */}
        <motion.div
          className="hero-ucb-text-wrap"
          aria-hidden
          style={{ position: "absolute", left: "22.64%", top: "15.93%", width: "59.02%" }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <img src={HERO_UCB_TEXT} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </motion.div>

        {/* Chevron */}
        <motion.div
          className="hero-chevron-wrap"
          aria-hidden
          style={{ position: "absolute", left: "11.43%", top: "26.72%", width: "11.27%" }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <img src={HERO_CHEVRON} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </motion.div>

        {/* LAB.COM wordmark */}
        <motion.div
          className="hero-wordmark-wrap"
          style={{ position: "absolute", left: "22.64%", top: "26.44%", width: "59.06%" }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <img src={HERO_WORDMARK} alt="LAB.COM" style={{ width: "100%", height: "auto", display: "block" }} />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="hero-tagline-wrap"
          style={{
            position: "absolute",
            top: "71.79%",
            left: "20.545%",
            width: "58.91%",
          }}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "clamp(12px, 1.5vw, 20px)",
              fontWeight: 600,
              lineHeight: 1.45,
              color: "#000",
              margin: 0,
            }}
          >
            <span style={{ color: "var(--gray-muted)" }}>
              O espaço de aprendizado prático dos cursos de{" "}
            </span>
            <span style={{ color: "var(--blue-accent)" }}>Comunicação</span>
            <span style={{ color: "var(--gray-muted)" }}> da </span>
            <span style={{ color: "var(--blue-accent)" }}>UCB</span>
            <span style={{ color: "var(--gray-muted)" }}>.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
