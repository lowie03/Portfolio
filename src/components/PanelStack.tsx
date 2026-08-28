"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import ShowcaseFrame from "@/components/ShowcaseFrame";

// Height of Nav (sticky, top:0, z-50).
const NAV_H = 56;
// Breathing room between the nav's bottom edge and the top of the tab row —
// without this, the tabs butt directly against the nav and read as part of
// it rather than a separate row sitting below it.
const TAB_GAP = 14;
// Every panel sticks at this SAME value — no staggered offsets. That
// uniformity is what makes panels contiguous: panel i+1 is a later sibling
// in normal document flow directly beneath panel i, both target the exact
// same viewport position once locked, so panel i+1 paints fully over panel
// i the moment it arrives, with nothing in between.
const STICKY_TOP = NAV_H + TAB_GAP;
// Height of the tab band at each panel's own top edge.
const TAB_H = 48;

// Maps each panelColor value to a literal Tailwind class string — has to be
// a lookup table of full class names, not a template string, because
// Tailwind only keeps the underlying CSS variable for a --color-* token if
// it can see a literal class using it somewhere in the source (see the
// comment on these tokens in globals.css).
const PANEL_CLASSES: Record<string, string> = {
  sage: "bg-panel-sage text-panel-sage-fg",
  navy: "bg-panel-navy text-panel-navy-fg",
  cream: "bg-panel-cream text-panel-cream-fg",
  slate: "bg-panel-slate text-panel-slate-fg",
};

// Same pattern as PANEL_CLASSES, for each panel's browser-frame chrome — a
// step lighter than the panel on dark panels, a step darker on light ones,
// so the frame reads as a raised surface rather than either disappearing
// into the panel or fighting with it.
const PANEL_CHROME_CLASSES: Record<string, string> = {
  sage: "bg-panel-sage-chrome text-panel-sage-chrome-fg",
  navy: "bg-panel-navy-chrome text-panel-navy-chrome-fg",
  cream: "bg-panel-cream-chrome text-panel-cream-chrome-fg",
  slate: "bg-panel-slate-chrome text-panel-slate-chrome-fg",
};

/**
 * One project, one element: tab and body are both part of the same sticky
 * <section>, not two separately-positioned mechanisms.
 *
 * The critical detail: the clip-path has to apply to the WHOLE <section>,
 * not just a small decorative tab div inside it. A plain `w-full` panel is a
 * solid opaque rectangle — once panel i+1 locks to the same position as
 * panel i, it would paint over panel i's tab exactly as completely as it
 * paints over panel i's body, since nothing distinguishes them in a plain
 * rectangle. Clipping the whole panel into a flag/sock shape — full width
 * below the tab band, but only this panel's own `1/total` slot *within* the
 * tab band — means panel i+1 has nothing to paint in panel i's tab's slot
 * at all. That's what actually leaves it visible; the slot alone isn't
 * enough without also *not painting* outside it.
 *
 * `zIndex` is the other half of that: it's supplied by PanelStack below,
 * which tracks whether THIS panel has actually reached its own sticky-locked
 * position (top === STICKY_TOP), not just whether it's next in line. See the
 * comment on PanelStack for why that distinction is load-bearing.
 */
function Panel({
  project,
  index,
  total,
  zIndex,
  sectionRef,
}: {
  project: Project;
  index: number;
  total: number;
  zIndex: number;
  sectionRef: (el: HTMLElement | null) => void;
}) {
  const number = String(index + 1).padStart(2, "0");
  const slot = 100 / total; // this panel's horizontal share, in vw
  const left = index * slot;
  const right = left + slot;
  // Trapezoid: flat top inset 10% into the slot on each side, widening to
  // the full slot by the time it reaches the tab band's bottom edge (where
  // it then continues straight out to 100vw — the full-width body).
  // Percent, not vw, for the horizontal coordinates — the panel is exactly
  // w-full, so 100% and 100vw are numerically identical here, but clip-path
  // hit-testing (elementsFromPoint) turned out to disagree with the actual
  // painted shape when the polygon mixed vw with px/%; expressing everything
  // relative to the element's own box removed that mismatch.
  const clipPath = [
    `${left + 0.1 * slot}% 0`,
    `${left + 0.9 * slot}% 0`,
    `${right}% ${TAB_H}px`,
    `100% ${TAB_H}px`,
    `100% 100%`,
    `0 100%`,
    `0 ${TAB_H}px`,
    `${left}% ${TAB_H}px`,
  ].join(", ");

  return (
    <section
      ref={sectionRef}
      aria-label={project.title}
      className={`sticky h-screen w-full overflow-hidden ${PANEL_CLASSES[project.panelColor ?? ""] ?? ""}`}
      style={{ top: STICKY_TOP, clipPath: `polygon(${clipPath})`, zIndex }}
    >
      <div
        className="absolute top-0 flex items-center justify-center"
        style={{ left: `${left}vw`, width: `${slot}vw`, height: TAB_H }}
      >
        <span className="font-mono text-sm font-semibold uppercase tracking-widest">
          <span className="hidden md:inline">Project </span>
          {number}
        </span>
      </div>

      <div
        className="relative flex flex-col justify-center md:flex-row md:items-center md:justify-start md:gap-8"
        style={{ height: `calc(100% - ${TAB_H}px)`, marginTop: TAB_H }}
      >
        <div className="flex flex-col gap-4 px-6 py-8 md:w-[42%] md:py-0 md:pl-16">
          <p className="font-mono text-xs uppercase tracking-widest opacity-70">
            {project.tags.join(" · ")}
          </p>
          <h3 className="font-display text-3xl font-semibold leading-[1.05] md:text-5xl lg:text-6xl">
            {project.title}
          </h3>
          <p className="line-clamp-1 max-w-md text-sm opacity-80 md:text-lg">
            {project.tagline ?? project.description}
          </p>
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex w-fit items-center gap-1 font-mono text-xs uppercase tracking-widest underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            View project ↗
          </Link>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-current/30 px-3 py-1 font-mono text-xs opacity-80"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 px-6 md:mt-0 md:w-[45%] md:px-0 md:pr-16">
          <ShowcaseFrame
            project={project}
            chromeClassName={PANEL_CHROME_CLASSES[project.panelColor ?? ""]}
            sizes="(min-width: 768px) 45vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the accumulating-tabs panel stack, and solves the one problem
 * DOM order + clip-path can't solve on their own: paint order is always
 * "later sibling wins," with no exception for "...unless it hasn't reached
 * its sticky-locked position yet." Every panel shares the same `h-screen`
 * height and the same `top: STICKY_TOP`, so panel i+1 spends its entire
 * pre-lock dwell sliding up through NORMAL document flow, starting off-
 * screen below and rising until its own top reaches STICKY_TOP (the instant
 * it locks). During that whole rise, it's already later in the DOM than the
 * currently-locked panel i — so its clip-path's full-width body (everything
 * below its own top TAB_H px) paints over panel i's content the moment it
 * scrolls into the viewport, mid-screen, well before it's actually in its
 * "joined the tab row" position. That produced exactly the reported bug:
 * project 03's tab floating mid-panel, and titles sliced through by the
 * next panel's body arriving early. It has nothing to do with transforms —
 * `position: sticky` and every panel's computed `transform` were already
 * correct throughout (verified directly); the bug is paint order racing
 * ahead of lock state.
 *
 * The fix: track, per panel, whether it has ACTUALLY reached its locked
 * position — measured directly as `getBoundingClientRect().top <=
 * STICKY_TOP`, read on every scroll event (rAF-batched, so at most once per
 * frame). An unlocked panel gets `zIndex: -1`, sinking it below the default
 * stacking layer that everything else (including the hero section above
 * panel 0) lives in, so it stays hidden behind whatever's currently on top
 * for its entire pre-lock rise. The moment it locks, its z-index flips to a
 * positive, DOM-order-matching value and it snaps into full view —
 * imperceptibly, since at that exact instant its box is pixel-for-pixel
 * where the previous panel's box is.
 *
 * IntersectionObserver looks like the natural tool for "has this element
 * reached a position" and was tried first, but it can't express this
 * condition: `rootMargin` only lets you shrink the root rectangle, so a
 * negative top margin makes an element "intersect" as soon as ANY part of
 * it is below that line — true for nearly the entire pre-lock rise, not
 * just the locked instant. Getting the right condition (top at or above the
 * line) out of IntersectionObserver would mean computing a bottom margin
 * from the live viewport height, recomputed on resize — more moving parts
 * than just reading the rect directly.
 */
export default function PanelStack({ items }: { items: Project[] }) {
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [pinned, setPinned] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    let ticking = false;

    function measure() {
      ticking = false;
      setPinned((prev) => {
        let changed = false;
        const next = prev.map((was, i) => {
          const el = panelRefs.current[i];
          const isPinned = !!el && el.getBoundingClientRect().top <= STICKY_TOP + 0.5;
          if (isPinned !== was) changed = true;
          return isPinned;
        });
        return changed ? next : prev;
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <section id="work" aria-label="Selected work">
      {items.map((project, i) => (
        <Panel
          key={project.slug}
          project={project}
          index={i}
          total={items.length}
          zIndex={pinned[i] ? i + 1 : -1}
          sectionRef={(el) => {
            panelRefs.current[i] = el;
          }}
        />
      ))}
      {/* All panels share one containing block (this <section>) for their
          sticky release calculation, since they're plain contiguous
          siblings with no per-panel wrapper. That's harmless for panels
          1..N-1 — the next panel already covers them before the shared
          release threshold would ever matter — but it means the LAST panel
          would lock and immediately start releasing at the very same
          scroll position, giving it zero dwell time. This spacer (same
          height as one panel) exists purely to extend that shared
          containing block, so the last panel gets the same dwell as every
          other one. It renders nothing and is never meant to be "covered". */}
      <div className="h-screen" aria-hidden />
    </section>
  );
}
