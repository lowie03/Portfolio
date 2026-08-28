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

// How much LONGER each panel's own box is than one viewport, purely to
// stretch out its dwell — see the comment on Panel for the full reasoning.
const EXTRA_DWELL_VH = 60;
const PANEL_H_VH = 100 + EXTRA_DWELL_VH;

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

// Fixed display order for the homepage showcase specifically — separate
// from the data file's own order (which still governs /work) — so light and
// dark panels alternate and each handoff visibly registers.
const SHOWCASE_ORDER = [
  "pneumonia-detection",
  "plant-disease-detector",
  "academic-outcome-predictor",
  "corper-desk",
];

/**
 * One project, one element: tab and body are both part of the same sticky
 * <section>, not two separately-positioned mechanisms. Every panel sticks
 * at the identical `top: STICKY_TOP` — panels are direct, contiguous
 * siblings in normal flow, so there is nowhere for a gap to open, and later
 * panels simply paint over earlier ones by ordinary DOM order (no z-index
 * needed). While panel i+1 is still rising toward its lock position, it's
 * later in the DOM than panel i, so it paints over whatever of panel i it
 * overlaps — that overlap-while-rising IS the sliding-sheet effect, not a
 * bug to hide.
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
 * enough without also *not painting* outside it. The tab itself is drawn
 * `position: absolute; top: 0` relative to the panel's own box, so while a
 * panel is rising pre-lock, its tab rides along at its own top edge — which
 * is exactly where it belongs once locked, so there's nothing separate to
 * keep in sync.
 *
 * `PANEL_H_VH` (each panel's own box height, taller than one viewport) is
 * what fixes a real timing bug: with every panel exactly `100vh` tall (one
 * viewport), panel i+1's rise into view starts only ~`STICKY_TOP`px of
 * scroll after panel i locks — because panel height and viewport height
 * were the same number, so "how far into panel i's dwell before i+1
 * appears" and "how far panel i+1 has to travel to lock" were the same
 * distance, leaving no room for a covering-free dwell in between. Panel i+1
 * would spend nearly its ENTIRE rise already overlapping panel i, slicing
 * across its title partway through — the "premature overpainting" bug.
 * Making each panel `EXTRA_DWELL_VH` taller than a viewport, while keeping
 * the VISIBLE content sized to exactly one viewport (`calc(100vh -
 * TAB_H)`, not a percentage of the panel's own taller height), pushes panel
 * i+1's flow-start further down the document without changing anything
 * about the lock/release math (both still land on the exact same scroll
 * position — the panels are still perfectly contiguous, uniform height, no
 * gap). The result: panel i dwells untouched for `EXTRA_DWELL_VH` of scroll,
 * THEN panel i+1 spends the natural ~one-viewport-height it takes to rise
 * from off-screen to locked visibly sliding up and covering it — the
 * intended motion, just no longer starting while panel i is still meant to
 * be read.
 */
function Panel({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
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
  // relative to the element's own box removed that mismatch. Vertically,
  // "100%" still means the bottom of the panel's own (now taller) box —
  // that's fine, since nothing below the first viewport-height of it is
  // ever visible anyway.
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
      aria-label={project.title}
      className={`sticky w-full overflow-hidden ${PANEL_CLASSES[project.panelColor ?? ""] ?? ""}`}
      style={{ top: STICKY_TOP, height: `${PANEL_H_VH}vh`, clipPath: `polygon(${clipPath})` }}
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
        style={{ height: `calc(100vh - ${TAB_H}px)`, marginTop: TAB_H }}
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

export default function Showcase({ projects }: { projects: Project[] }) {
  // Only projects with both an image and a panelColor are showcase-ready —
  // e.g. MarketSabi has neither yet, so it's absent here but still appears
  // in full on /work. Ordered by SHOWCASE_ORDER, not the data file's own
  // order, so light/dark panels alternate.
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const items = SHOWCASE_ORDER.map((slug) => bySlug.get(slug)).filter(
    (p): p is Project => Boolean(p && p.image && p.panelColor),
  );

  return (
    <>
      <section id="work" aria-label="Selected work">
        {items.map((project, i) => (
          <Panel
            key={project.slug}
            project={project}
            index={i}
            total={items.length}
          />
        ))}
        {/* All panels share one containing block (this <section>) for their
            sticky release calculation, since they're plain contiguous
            siblings with no per-panel wrapper. That's harmless for panels
            1..N-1 — the next panel already covers them before the shared
            release threshold would ever matter — but it means the LAST panel
            would lock and immediately start releasing at the very same
            scroll position, giving it zero dwell time. This spacer (same
            height as one panel, including its extra dwell) exists purely to
            extend that shared containing block, so the last panel gets the
            same dwell as every other one. It renders nothing and is never
            meant to be "covered". */}
        <div style={{ height: `${PANEL_H_VH}vh` }} aria-hidden />
      </section>

      {/* A plain, quiet close to the showcase — deliberately NOT a panel:
          no tab, no panel color, no sticky positioning, not full-screen.
          Just page background and a centered link, giving the section a
          clean ending before About begins instead of competing with the
          last panel's own "View project" link. */}
      <section className="flex items-center justify-center py-16">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink underline underline-offset-4 transition-colors hover:text-accent"
        >
          See all work
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </section>
    </>
  );
}
