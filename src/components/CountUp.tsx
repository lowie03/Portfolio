"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function CountUp({ value }: { value: string }) {
  // extract leading number; keep suffix like "%" — non-numeric values just render
  const match = value.match(/^([\d.]+)(.*)$/);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const display = useTransform(motionVal, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (inView && match) {
      animate(motionVal, parseFloat(match[1]), { duration: 1.2, ease: "easeOut" });
    }
  }, [inView, match, motionVal]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {match[2]}
    </span>
  );
}