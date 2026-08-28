"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  scale = false,
}: {
  children: React.ReactNode;
  delay?: number;
  /** Also rise from a slight scale-down (0.97 -> 1) instead of just fading
   *  and sliding up — a touch more "arrival" for content that deserves a
   *  bit more presence, like the homepage showcase screenshots. */
  scale?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: scale ? 0.97 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}