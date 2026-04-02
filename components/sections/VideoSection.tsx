"use client";

import { useRef } from "react";
import { motion, useInView as useMotionInView } from "motion/react";

/**
 * Video embed placeholder — intentional editorial holding card.
 * Motion: pulsing play button, animated accent rings, section entrance.
 */
export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });

  return (
    <section
      ref={sectionRef}
      id="video"
      aria-label="Vídeo institucional"
      style={{
        position: "relative",
        padding: "1rem",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
      <motion.div
        style={{ padding: "clamp(8px, 1vw, 14px)", position: "relative", zIndex: 2 }}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 160, damping: 24, delay: 0.1 }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(16px, 2vw, 24px)",
            position: "relative",
            overflow: "hidden",
          }}
          aria-label="Área reservada para vídeo institucional"
        >
          <img
            src="/video_thumbnail.png"
            alt="Vídeo Institucional"
            aria-hidden
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(12, 33, 66, 0.75)",
              backgroundImage: "var(--texture-url)",
              backgroundSize: "var(--texture-size) var(--texture-size)",
              backgroundBlendMode: "multiply",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
            aria-hidden
          />
          {/* Subtle diagonal grid lines */}
          <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
            <defs>
              <pattern id="video-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#video-grid)" />
          </svg>

          {/* Animated blue accent rings — top-right */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: "1px solid #74a8ed",
              opacity: 0.12,
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "1px solid #74a8ed",
              opacity: 0.06,
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
          />

          {/* Second ring cluster — bottom-left */}
          <motion.div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -80,
              left: -80,
              width: 240,
              height: 240,
              borderRadius: "50%",
              border: "1px solid #74a8ed",
              opacity: 0.07,
            }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.07, 0.13, 0.07] }}
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity, delay: 2 }}
          />

          {/* Play button — pulsing outer ring + scale hover */}
          <motion.div
            style={{
              position: "relative",
              zIndex: 1,
            }}
            whileHover={{ scale: 1.12 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
          >
            {/* Pulsing outer halo */}
            <motion.div
              aria-hidden
              style={{
                position: "absolute",
                inset: -16,
                borderRadius: "50%",
                border: "1px solid rgba(116,168,237,0.3)",
              }}
              animate={{ scale: [1, 1.28, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, ease: "easeOut", repeat: Infinity }}
            />
            <div
              style={{
                width: "clamp(52px, 6vw, 72px)",
                height: "clamp(52px, 6vw, 72px)",
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden
                style={{ marginLeft: 3 }}>
                <path d="M6 4L18 11L6 18V4Z" fill="#74a8ed" opacity="0.9" />
              </svg>
            </div>
          </motion.div>

          {/* Label */}
          <motion.div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              position: "relative",
              zIndex: 1,
            }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p style={{
              fontSize: "clamp(11px, 1vw, 13px)",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              margin: 0,
              lineHeight: 1,
            }}>
              Vídeo institucional
            </p>
            <p style={{
              fontSize: "clamp(10px, 0.85vw, 12px)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.18)",
              margin: 0,
              lineHeight: 1,
            }}>
              Em breve
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
