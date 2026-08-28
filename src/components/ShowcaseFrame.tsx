"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
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
 * site's existing fade-up-scale pattern via <Reveal scale>), hover tilt, and
 * an optional two-image crossfade.
 *
 * No scroll parallax here (there used to be one, driven by Framer Motion's
 * useScroll — it's gone now). The showcase's own sticky-stacking scroll
 * motion is the section's centerpiece; a second, independent scroll-linked
 * transform on the frame inside it was a competing motion, not a
 * complementary one, and dropping it isn't a compromise — one clear motion
 * reads better than two overlapping ones.
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
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 800 }}
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
    </Reveal>
  );
}
