"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView as useMotionInView,
  useReducedMotion,
} from "motion/react";
import { SPACE_CARD_BG, ICON_USER } from "@/lib/assets";
import { siteConfig } from "@/lib/siteConfig";

// Espaços editáveis em: lib/siteConfig.ts → espacos
const SPACES = siteConfig.espacos.map((e) => ({
  name: e.nome,
  description: e.descricao,
  capacity: e.capacidade,
  image: e.imagem,
}));

/** 3-D perspective tilt card — spring-physics on mouse move. */
function TiltCard({
  space,
  index,
  isInView,
}: {
  space: (typeof SPACES)[0];
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const rotateX = useTransform(rawY, [0, 1], [7, -7]);
  const rotateY = useTransform(rawX, [0, 1], [-7, 7]);
  const springRotX = useSpring(rotateX, { stiffness: 220, damping: 28 });
  const springRotY = useSpring(rotateY, { stiffness: 220, damping: 28 });
  const imgScale = useSpring(1, { stiffness: 260, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
    imgScale.set(1.08);
  };

  const handleMouseLeave = () => {
    rawX.set(0.5);
    rawY.set(0.5);
    imgScale.set(1);
  };

  return (
    <motion.div
      className="space-card-tilt-wrapper"
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 24,
        delay: 0.08 + index * 0.1,
      }}
    >
      <motion.div
        ref={cardRef}
        className="space-card"
        onMouseMove={reduce ? undefined : handleMouseMove}
        onMouseLeave={reduce ? undefined : handleMouseLeave}
        style={{
          rotateX: reduce ? 0 : springRotX,
          rotateY: reduce ? 0 : springRotY,
          transformStyle: "preserve-3d",
        }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
      >
        <motion.img
          src={space.image || SPACE_CARD_BG}
          alt=""
          aria-hidden
          className="space-card-image"
          style={{ scale: reduce ? 1 : imgScale }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(12, 33, 66, 0.65)",
            backgroundImage: "var(--texture-url)",
            backgroundSize: "var(--texture-size) var(--texture-size)",
            backgroundBlendMode: "multiply",
            mixBlendMode: "multiply",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
          }}
          aria-hidden
        />
        <div className="space-card-overlay z-10" style={{ transform: "translateZ(20px)" }}>
          <h3
            style={{
              fontSize: "clamp(13px, 1.3vw, 16px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.3,
            }}
          >
            {space.name}
          </h3>
          <p
            style={{
              fontSize: "clamp(11px, 1.1vw, 14px)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1.45,
              flex: 1,
            }}
          >
            {space.description}
          </p>
          <div className="flex items-center gap-1.5 mt-auto" style={{ paddingTop: 8 }}>
            <img src={ICON_USER} alt="" aria-hidden style={{ width: 24, height: 24 }} />
            <span
              style={{
                fontSize: "clamp(11px, 1.1vw, 14px)",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              até {space.capacity} pessoas
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SpacesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useMotionInView(sectionRef, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={sectionRef}
      id="espacos"
      aria-labelledby="spaces-heading"
      style={{
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--off-white)",
      }}
    >
      <div className="content-inner py-10 md:py-12 lg:py-14">
        <motion.p
          className="section-eyebrow"
          style={{ marginBottom: "clamp(10px, 1.2vw, 16px)" }}
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        >
          nossos espaços
        </motion.p>

        <motion.h2
          id="spaces-heading"
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.1 }}
          style={{
            fontSize: "clamp(26px, 4vw, 48px)",
            fontWeight: 700,
            lineHeight: 1.12,
            marginBottom: "clamp(22px, 2.8vw, 40px)",
          }}
        >
          <span style={{ color: "var(--blue-accent)" }}>Infraestrutura</span>
          <span> para seus projetos.</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {SPACES.map((space, i) => (
            <TiltCard key={space.name} space={space} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
