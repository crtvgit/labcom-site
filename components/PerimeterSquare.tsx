"use client";

import { useRef, useEffect } from "react";

interface Props {
  /** Total seconds for one full lap around the perimeter. */
  duration?: number;
  /** Side length of the square in px. */
  size?: number;
}

/**
 * A small square that travels clockwise around the perimeter of its container.
 * Pure vanilla rAF — no framer-motion. ResizeObserver keeps it locked to the
 * container's live dimensions.
 */
export default function PerimeterSquare({ duration = 55, size = 11 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wrap = wrapRef.current;
    const sq = squareRef.current;
    if (!wrap || !sq) return;

    let animId: number;
    let startTime: number | null = null;
    let w = 0;
    let h = 0;

    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      w = width;
      h = height;
      startTime = null; // reset on resize
    });
    obs.observe(wrap);

    const tick = (ts: number) => {
      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(tick);
        return;
      }
      if (startTime === null) startTime = ts;

      const P = 2 * (w + h);
      const elapsed = ((ts - startTime) / 1000) % duration;
      const dist = (elapsed / duration) * P;
      const half = size / 2;

      let x: number;
      let y: number;
      if (dist <= w) {
        x = dist; y = 0;                    // top →
      } else if (dist <= w + h) {
        x = w; y = dist - w;                // right ↓
      } else if (dist <= 2 * w + h) {
        x = w - (dist - w - h); y = h;     // bottom ←
      } else {
        x = 0; y = h - (dist - 2 * w - h); // left ↑
      }

      sq.style.transform = `translate(${x - half}px, ${y - half}px)`;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      obs.disconnect();
    };
  }, [duration, size]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}
      aria-hidden
    >
      <div
        ref={squareRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          border: "1px solid var(--border)",
        }}
      />
    </div>
  );
}
