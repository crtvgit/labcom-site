"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight IntersectionObserver hook — replaces framer-motion's whileInView.
 *
 * Returns a ref to attach to a container. When the container enters the viewport,
 * the hook adds the 'in-view' CSS class to:
 *   1. The container itself, if it has [data-anim]
 *   2. All descendants that have [data-anim]
 *
 * CSS handles the actual transition (see globals.css → [data-anim] rules).
 * The observer disconnects after the first intersection (once: true behaviour).
 *
 * @example
 *   const ref = useInView<HTMLElement>();
 *   return <section ref={ref} data-anim="fade-up">…</section>;
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: HTMLElement[] = [];
    if (el.hasAttribute("data-anim")) targets.push(el);
    el.querySelectorAll<HTMLElement>("[data-anim]").forEach((t) =>
      targets.push(t)
    );
    if (targets.length === 0) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        targets.forEach((t) => t.classList.add("in-view"));
        obs.disconnect();
      },
      { threshold: 0.05, ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
