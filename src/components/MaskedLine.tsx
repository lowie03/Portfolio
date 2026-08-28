"use client";

import { motion } from "framer-motion";

/**
 * Wraps one line of text so it slides up from behind an invisible edge as it
 * scrolls into view, instead of just fading in. The outer div clips (masks)
 * anything below its own bottom edge — that's the "invisible edge" — and the
 * inner motion.div is what actually moves, starting fully below the mask and
 * animating up to its resting position.
 */
export default function MaskedLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
