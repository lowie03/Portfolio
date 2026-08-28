import Link from "next/link";
import type { Project } from "@/data/projects";
import PanelStack from "@/components/PanelStack";

// Fixed display order for the homepage showcase specifically — separate
// from the data file's own order (which still governs /work) — so light and
// dark panels alternate and each handoff visibly registers.
const SHOWCASE_ORDER = [
  "pneumonia-detection",
  "plant-disease-detector",
  "academic-outcome-predictor",
  "corper-desk",
];

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
      <PanelStack items={items} />

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
