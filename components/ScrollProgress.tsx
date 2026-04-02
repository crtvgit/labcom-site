"use client";

import { useScroll, useSpring, motion } from "motion/react";

/**
 * Fixed 2 px spring-smoothed progress bar at the very top of the viewport.
 * Uses motion useScroll + useSpring for a polished, physics-based fill.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "var(--blue-accent)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 200,
        pointerEvents: "none",
      }}
    />
  );
}
