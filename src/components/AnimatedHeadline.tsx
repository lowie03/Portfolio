"use client";

import { motion } from "framer-motion";

export default function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <h1 className="mt-6 font-display text-5xl font-semibold leading-tight md:text-7xl">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}