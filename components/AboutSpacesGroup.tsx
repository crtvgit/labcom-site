"use client";

import AboutSection from "@/components/sections/AboutSection";
import SpacesSection from "@/components/sections/SpacesSection";
import PerimeterSquare from "@/components/PerimeterSquare";
import { motion } from "motion/react";

/**
 * Wraps AboutSection + SpacesSection in a single `position: relative`
 * container so the PerimeterSquare can measure and animate around the
 * combined outer border of both sections as one continuous track.
 *
 * The marginTop that previously lived on AboutSection is hoisted here so
 * the wrapper top edge coincides exactly with AboutSection's border top —
 * keeping the square's centre on the visible border line.
 */
export default function AboutSpacesGroup() {
  return (
    <motion.div 
      style={{ position: "relative", marginTop: "clamp(20px, 4.2vw, 54px)" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* The square travels clockwise around the combined perimeter */}
      <PerimeterSquare duration={62} size={7} />
      <AboutSection />
      <SpacesSection />
    </motion.div>
  );
}
