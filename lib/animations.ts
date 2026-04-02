/**
 * Animation system — CSS-based (framer-motion removed for performance).
 *
 * Scroll-triggered animations: add [data-anim="fade-up|fade|scale-up|slide-left"]
 * to elements and use the useInView hook from @/lib/useInView.
 *
 * Stagger delays: add [data-delay="1"…"6"] alongside [data-anim].
 *
 * Mount-time animations (hero, header): use CSS classes .hero-item,
 * .header-logo-anim, .header-right-anim, .page-enter defined in globals.css.
 *
 * See: app/globals.css → "CSS ANIMATION SYSTEM" section.
 */

export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)" as const;
