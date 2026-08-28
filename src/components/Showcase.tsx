import { Fragment } from "react";
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
 *
 * The last panel is the one exception to `PANEL_H_VH`: it uses a plain
 * `100vh` instead. Every other panel's `EXTRA_DWELL_VH` of extra box height
 * is never actually seen as scrolled space, because those panels never
 * structurally release — they stay sticky-stuck (just painted over) for the
 * rest of the page. The last panel is the only one that genuinely DOES
 * release and scroll away for real once its dwell ends. If its own box were
 * still `PANEL_H_VH` tall, that extra `EXTRA_DWELL_VH` would reappear as a
 * real, visible blank tail scrolling past AFTER its content — the same
 * dead-space bug relocated from before release to after it. Sizing it to
 * exactly what its content needs removes that tail.
 *
 * That content height (100vh) is deliberately DIFFERENT from every other
 * panel's own box height (`PANEL_H_VH`) — which would break synchronized
 * release if left as-is, because a sticky element's release point, once its
 * containing block's remaining room runs out, tracks at `(containing block's
 * bottom on screen) − (its own height)`. Panels sharing one containing block
 * with the SAME height release in lockstep (same formula, same result); a
 * DIFFERENT height offsets that result by the height difference, so the
 * last panel would start actually moving `EXTRA_DWELL_VH` of scroll later
 * than 1–3 — visually, the tab row coming apart as 1–3 (still counted as
 * released internally, just invisible under the last panel) drag away while
 * the last panel's own, differently-sized box lags behind. The last panel's
 * OWN wrapper div below exists to fix exactly this: it gives the release
 * calculation the same `PANEL_H_VH` that panels 1–3 use, without making the
 * visible, painted panel itself any taller than its content.
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
  const isLast = index === total - 1;
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
  // the bottom edge is pinned to a literal `100vh` — the panel's own
  // CONTENT height — rather than `100%` of the box (which for panels 1-3
  // is the taller `PANEL_H_VH`). The box still needs that extra height to
  // delay the next panel's rise (see the comment on Panel), but nothing
  // should ever actually be PAINTED past the content itself: once these
  // panels finally release, at the very end, a polygon that painted the
  // full `PANEL_H_VH` would keep this panel's own background visible
  // `EXTRA_DWELL_VH` past where its content ends — exposing whichever
  // panel's color happens to be there once it's no longer safely hidden
  // under a later one. Stopping the paint at `100vh` means there is
  // nothing to expose: past the content, this panel simply isn't drawn.
  const clipPath = [
    `${left + 0.1 * slot}% 0`,
    `${left + 0.9 * slot}% 0`,
    `${right}% ${TAB_H}px`,
    `100% ${TAB_H}px`,
    `100% 100vh`,
    `0 100vh`,
    `0 ${TAB_H}px`,
    `${left}% ${TAB_H}px`,
  ].join(", ");

  return (
    <section
      aria-label={project.title}
      className={`sticky w-full overflow-hidden ${PANEL_CLASSES[project.panelColor ?? ""] ?? ""}`}
      style={{
        top: STICKY_TOP,
        height: isLast ? "100vh" : `${PANEL_H_VH}vh`,
        clipPath: `polygon(${clipPath})`,
      }}
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
        {items.map((project, i) => {
          const panel = (
            <Panel project={project} index={i} total={items.length} />
          );
          if (i !== items.length - 1) {
            // Panels 1..N-1: no wrapper, unchanged — they release relative
            // to this shared <section> directly, exactly as before.
            return <Fragment key={project.slug}>{panel}</Fragment>;
          }
          // The last panel only: a plain div with no color, no position, no
          // transform — just `PANEL_H_VH` of flow height — standing in as
          // ITS sticky containing block instead of the shared <section>
          // above. That gives its release calculation the same effective
          // height as panels 1-3 (see the comment on Panel for why that
          // match matters), while the <section> INSIDE it stays sized to
          // its own content (100vh), so nothing taller than its content is
          // ever actually painted. This div is never visible on its own:
          // the sticky panel inside remains opaque and pinned for the
          // div's entire extra height, so its transparent background never
          // shows through.
          return (
            <div key={project.slug} style={{ height: `${PANEL_H_VH}vh` }}>
              {panel}
            </div>
          );
        })}
        {/* All panels share one containing block (this <section>) for their
            sticky release calculation, since they're plain contiguous
            siblings with no per-panel wrapper (except the last, see above)
            — a sticky element's stuck DURATION is governed by how much flow
            space follows it inside its containing block, not by its own
            height. Without any trailing space at all, the last panel would
            lock and release in the same instant, with zero dwell.
            Panels 1..N-1 get their trailing space "for free": the next
            panel's own `PANEL_H_VH` of flow height follows immediately, and
            visually, most of that space isn't dead time at all — it's the
            next panel sliding up and covering this one, which is motion,
            not a pause. The last panel's wrapper div gives it the same
            `PANEL_H_VH` of containing-block room for the release math to
            match — but that's release-SYNCHRONIZATION math, not dwell time;
            the last panel would still lock and release in the same instant
            without any space after ITS wrapper too. This spacer is what
            actually gives it a dwell, sized to `EXTRA_DWELL_VH` (the same
            "pure, nothing-else-happening" reading window every panel gets
            before its handoff begins) rather than a full extra panel-height,
            since there's no next panel here to turn a longer runway into a
            cover animation — it would just be more static dead time. */}
        <div style={{ height: `${EXTRA_DWELL_VH}vh` }} aria-hidden />
      </section>

      {/* A plain, quiet close to the showcase — deliberately NOT a panel:
          no tab, no panel color, no sticky positioning, not full-screen.
          Just page background and a centered link, giving the section a
          clean ending before About begins instead of competing with the
          last panel's own "View project" link.

          `marginTop: -EXTRA_DWELL_VH` pulls this up to meet where the
          panels actually stop being PAINTED, not where their (taller,
          `PANEL_H_VH`) LAYOUT boxes end. Every panel's sticky release is
          still governed by its own full layout height — that's what keeps
          all four synchronized — but the clip-path only paints the first
          100vh of that box (see the comment on Panel's clipPath). Without
          this margin, this section simply follows the layout height, which
          is `EXTRA_DWELL_VH` taller than the last painted pixel, leaving
          that difference as a bare gap of page background. This margin is
          the fixed, constant compensation for that gap — the gap's size
          doesn't depend on the spacer above (both sides of that equation
          contain it, so it cancels out), only on the layout/paint height
          difference itself. */}
      <section
        className="flex items-center justify-center py-16"
        style={{ marginTop: `-${EXTRA_DWELL_VH}vh` }}
      >
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
