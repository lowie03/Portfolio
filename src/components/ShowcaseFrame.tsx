"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/data/projects";
import BrowserFrame from "@/components/BrowserFrame";
import Reveal from "@/components/Reveal";

// How long the first image holds before crossfading, and how long the
// crossfade itself takes. No loop back to the first image — for a project
// like Pneumonia Detection, the second capture is the point (a completed
// result), and cycling back to an empty form would undo it.
const HOLD_MS = 1200;
const FADE_MS = 600;
// Total upward drift across the panel's dwell (the 40-60px asked for).
const PARALLAX_PX = 50;
// Max hover tilt, in degrees — "a few degrees at most".
const TILT_DEG = 4;

/** Shown in the screenshot slot when a project has no image yet — a deliberate
 *  placeholder (the project's initials, faint) rather than a blank box. */
function ImagePlaceholder({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-display text-5xl font-semibold opacity-15">
        {initials}
      </span>
    </div>
  );
}

/**
 * The one client leaf for a panel's screenshot: entrance reveal (reusing the
 * site's existing fade-up-scale pattern via <Reveal scale>), scroll
 * parallax, hover tilt, and an optional two-image crossfade.
 *
 * Both the parallax translateY and the hover tilt's rotateX/rotateY/
 * perspective are applied to ONE single motion.div — the innermost element,
 * wrapping BrowserFrame directly, with nothing transformed between it and
 * the panel's own sticky <section>. They were previously split across two
 * nested motion.divs; a 3D transform (rotateX/rotateY/perspective) on an
 * intermediate wrapper inside an `overflow-hidden` + `clip-path` sticky
 * ancestor risks GPU-layer promotion escaping that ancestor's clipping in
 * some browsers. This consolidation removes that risk, though it turned out
 * NOT to be the cause of a since-fixed tab-row bug that looked similar —
 * that one was a paint-order race between sticky lock state and DOM order,
 * unrelated to transforms (see the comment on PanelStack). Framer Motion
 * combines multiple style keys (y, rotateX, rotateY, transformPerspective)
 * into a single CSS `transform` on one element, so nothing is lost by
 * merging them — it's strictly fewer transformed layers either way.
 *
 * Scroll parallax uses Framer Motion's scroll-progress + transform, which is
 * RAF-batched and applies only `transform: translateY(...)` — never `top`
 * or `margin`, so it never triggers layout. The scroll-progress measurement
 * itself lives on a plain, untransformed wrapper (`trackRef`) specifically
 * so the transform this component applies doesn't feed back into the
 * measurement it's derived from.
 */
export default function ShowcaseFrame({
  project,
  chromeClassName,
  sizes,
}: {
  project: Project;
  chromeClassName?: string;
  sizes: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [PARALLAX_PX / 2, -PARALLAX_PX / 2],
  );

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * TILT_DEG * 2);
    rotateX.set(py * -TILT_DEG * 2);
  }
  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // Crossfade timer — only ever armed once, and only if there's a second
  // image at all. Projects with a single image never touch this state, so
  // adding image2 to a project later is the only change needed to opt in.
  const triggeredRef = useRef(false);
  const [showSecond, setShowSecond] = useState(false);

  return (
    <Reveal scale>
      <div ref={trackRef}>
        <motion.div
          style={{ y, rotateX, rotateY, transformPerspective: 800 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          onViewportEnter={() => {
            if (triggeredRef.current || !project.image2) return;
            triggeredRef.current = true;
            setTimeout(() => setShowSecond(true), HOLD_MS);
          }}
          viewport={{ once: true, margin: "-80px" }}
          className="transition-shadow duration-300 hover:shadow-2xl"
        >
          <BrowserFrame demo={project.demo} chromeClassName={chromeClassName}>
            {project.image ? (
              <div className="relative h-full w-full">
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes={sizes}
                  className="object-cover transition-opacity ease-out"
                  style={{
                    opacity: project.image2 && showSecond ? 0 : 1,
                    transitionDuration: `${FADE_MS}ms`,
                  }}
                />
                {project.image2 && (
                  <Image
                    src={project.image2.src}
                    alt={project.image2.alt}
                    fill
                    sizes={sizes}
                    className="object-cover transition-opacity ease-out"
                    style={{
                      opacity: showSecond ? 1 : 0,
                      transitionDuration: `${FADE_MS}ms`,
                    }}
                  />
                )}
              </div>
            ) : (
              <ImagePlaceholder title={project.title} />
            )}
          </BrowserFrame>
        </motion.div>
      </div>
    </Reveal>
  );
}
