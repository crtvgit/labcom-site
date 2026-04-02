"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useInView as useMotionInView,
} from "motion/react";

const RESOURCES = [
  {
    title: "Catálogo de Equipamentos",
    desc: "Lista completa dos equipamentos disponíveis para reserva no LAB.COM",
    href: "https://ubecedu.sharepoint.com/:l:/s/Klabs2/JAAOJ-dLd2KBRotuVNM0OyLsAdf4mzK6f3JoMac7wJS_fGI?e=v3b0Ns",
    tag: "sharepoint",
  },
  {
    title: "Kits de Equipamentos",
    desc: "Conjuntos de equipamentos organizados por tipo de produção",
    href: "https://ubecedu.sharepoint.com/:l:/s/Klabs2/JABb3_5cQw-RTroMk6XURzHoAYDyVhc5eKFqPtqq88OsycY?e=K9hg4X",
    tag: "sharepoint",
  },
  {
    title: "Regras Vigentes",
    desc: "Normas regulamentares para uso dos espaços e equipamentos do LAB.COM",
    href: "https://ubecedu.sharepoint.com/:b:/s/Klabs2/IQBfHHLa250JSJVns4hVXKl7Acq7FjYIcHjn8TOl3fGep6U?e=w2OPt0",
    tag: "pdf",
  },
];

function DocIcon({ tag }: { tag: string }) {
  return tag === "pdf" ? (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" aria-hidden
      style={{ display: "block", flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="27" height="33" rx="3.5" stroke="var(--border)" />
      <path d="M6 3h11l5 5v23H6V3z" fill="var(--off-white)" stroke="none" />
      <path d="M17 3v5h5" stroke="var(--border)" strokeWidth="1" fill="none" />
      <rect x="4" y="18" width="20" height="7" rx="1" fill="var(--red-accent)" opacity="0.85" />
      <text x="14" y="24" textAnchor="middle" fontSize="5" fontWeight="700" fill="white" fontFamily="sans-serif">PDF</text>
      <line x1="7" y1="27" x2="21" y2="27" stroke="var(--border)" strokeWidth="0.6" />
      <line x1="7" y1="30" x2="17" y2="30" stroke="var(--border)" strokeWidth="0.6" />
    </svg>
  ) : (
    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" aria-hidden
      style={{ display: "block", flexShrink: 0 }}>
      <rect x="0.5" y="0.5" width="27" height="33" rx="3.5" stroke="var(--border)" />
      <path d="M17 3v5h5" stroke="var(--border)" strokeWidth="1" fill="none" />
      <line x1="7" y1="14" x2="21" y2="14" stroke="var(--border)" strokeWidth="0.8" />
      <line x1="7" y1="18" x2="21" y2="18" stroke="var(--border)" strokeWidth="0.8" />
      <line x1="7" y1="22" x2="17" y2="22" stroke="var(--border)" strokeWidth="0.8" />
      <circle cx="5.5" cy="14" r="1.5" fill="var(--blue-accent)" />
      <circle cx="5.5" cy="18" r="1.5" fill="var(--blue-accent)" />
      <circle cx="5.5" cy="22" r="1.5" fill="var(--blue-accent)" />
    </svg>
  );
}

/** Card with radial spotlight that follows the cursor. */
function SpotlightCard({
  res,
  index,
  isInView,
}: {
  res: (typeof RESOURCES)[0];
  index: number;
  isInView: boolean;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const spotlightBg = useMotionTemplate`
    radial-gradient(200px circle at ${mouseX}px ${mouseY}px,
      rgba(116,168,237,0.13), transparent 80%)
  `;

  return (
    <motion.a
      href={res.href}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card spotlight-card"
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 26,
        delay: 0.1 + index * 0.1,
      }}
      whileHover={{ borderColor: "var(--blue-accent)" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        isHovered.set(1);
      }}
      onMouseLeave={() => isHovered.set(0)}
    >
      {/* Spotlight glow layer */}
      <motion.div
        className="spotlight-glow"
        style={{ background: spotlightBg, opacity: isHovered }}
      />

      <div className="resource-card-icon" style={{ position: "relative", zIndex: 1 }}>
        <DocIcon tag={res.tag} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 1 }}>
        <span className="resource-card-title">{res.title}</span>
        <span className="resource-card-desc">{res.desc}</span>
      </div>

      <motion.div
        className="resource-card-arrow"
        style={{ position: "relative", zIndex: 1 }}
        initial={{ opacity: 0, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <span>abrir</span>
        <span>→</span>
      </motion.div>
    </motion.a>
  );
}

export default function ResourcesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-60px 0px" });

  return (
    <motion.section
      ref={sectionRef}
      aria-labelledby="resources-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--off-white)",
        position: "relative",
      }}
    >
      {/* Counter-rotating dashed rect — motion-driven */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-40px",
          right: "-40px",
          width: 200,
          height: 200,
          pointerEvents: "none",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      >
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block", opacity: 0.14 }}
        >
          <rect x="4" y="4" width="152" height="152" rx="14"
            stroke="#74a8ed" strokeWidth="1.5" strokeDasharray="7 11" />
          <rect x="22" y="22" width="116" height="116" rx="9"
            stroke="#74a8ed" strokeWidth="0.8" />
          <circle cx="80" cy="80" r="9" stroke="#74a8ed" strokeWidth="1" />
          <circle cx="80" cy="80" r="3" fill="#74a8ed" />
        </svg>
      </motion.div>

      {/* Second decoration — floating small ring top-left */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          top: "-20px",
          left: "-20px",
          width: 120,
          height: 120,
          pointerEvents: "none",
        }}
        animate={{
          rotate: 360,
          y: [0, -10, 0],
        }}
        transition={{
          rotate: { duration: 32, ease: "linear", repeat: Infinity },
          y: { duration: 7, ease: "easeInOut", repeat: Infinity },
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", height: "100%", display: "block", opacity: 0.1 }}
        >
          <circle cx="50" cy="50" r="46" stroke="#74a8ed" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="50" cy="50" r="28" stroke="#74a8ed" strokeWidth="0.6" />
          <circle cx="50" cy="4" r="4" fill="#74a8ed" />
        </svg>
      </motion.div>

      <div className="content-inner py-6 md:py-8">
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(8px, 1vw, 14px)" }}
          initial={{ opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          documentos &amp; recursos
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {RESOURCES.map((res, i) => (
            <SpotlightCard key={res.title} res={res} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
