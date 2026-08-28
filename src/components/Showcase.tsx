import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import BrowserFrame from "@/components/BrowserFrame";
import Reveal from "@/components/Reveal";

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

// Fixed display order for the homepage showcase specifically — separate
// from the data file's own order (which still governs /work) — so light and
// dark panels alternate and each handoff visibly registers.
const SHOWCASE_ORDER = [
  "plant-disease-detector",
  "pneumonia-detection",
  "corper-desk",
  "academic-outcome-predictor",
];

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
 * One project, one element: tab and body are both part of the same sticky
 * <section>, not two separately-positioned mechanisms. Every panel sticks
 * at the identical `top: NAV_H` — panels are direct, contiguous siblings in
 * normal flow, so there is nowhere for a gap to open, and later panels
 * simply paint over earlier ones by ordinary DOM order (no z-index needed).
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
      aria-label={project.title}
      className={`sticky h-screen w-full overflow-hidden ${PANEL_CLASSES[project.panelColor ?? ""] ?? ""}`}
      style={{ top: STICKY_TOP, clipPath: `polygon(${clipPath})` }}
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
        className="relative md:flex md:items-center md:gap-8"
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
          <Reveal scale>
            <BrowserFrame
              demo={project.demo}
              chromeClassName={PANEL_CHROME_CLASSES[project.panelColor ?? ""]}
            >
              {project.image ? (
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder title={project.title} />
              )}
            </BrowserFrame>
          </Reveal>
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
            height as one panel) exists purely to extend that shared
            containing block, so the last panel gets the same dwell as every
            other one. It renders nothing and is never meant to be "covered". */}
        <div className="h-screen" aria-hidden />
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
