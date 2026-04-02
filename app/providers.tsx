/**
 * Providers wrapper — simplified after framer-motion removal.
 * AnimatePresence and NavDirCtx no longer needed; page transitions
 * are handled by CSS .page-enter animation in template.tsx.
 *
 * File kept for future providers (auth, theme, etc.).
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
