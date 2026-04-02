/**
 * Re-renders on every route change (unlike layout.tsx which persists).
 * Pure CSS fade-in via .page-enter keyframe — no framer-motion needed.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter" style={{ width: "100%" }}>
      {children}
    </div>
  );
}
