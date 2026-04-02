/**
 * Page-level decorative layer — background grid + large static decorations.
 * Server component: zero client JS.
 *
 * NOTE: Geometric animated elements live inside each individual section
 * as absolute overlays — this is necessary because sections have opaque
 * backgrounds that would cover any decoration placed in the z:0 background.
 * Only full-bleed decorations that appear in the page margins belong here.
 */
export default function NotebookBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
      style={{ zIndex: 0 }}
    >
      {/* Notebook_Pattern_Background — full page grid (shows in margins) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/textures/Notebook_Pattern_Background.svg')",
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "top center",
          opacity: 0.7,
        }}
      />

      {/* Circle_Stroke — contact / footer area */}
      <img
        src="/textures/Circle_Stroke.svg"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(600px, 101.3vw, 1297px)",
          height: "auto",
          opacity: 0.55,
        }}
      />
    </div>
  );
}
