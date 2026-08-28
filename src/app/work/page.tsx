import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Every AI/ML project — gated, explained, and shipped where it's needed.",
  openGraph: {
    title: "Work",
    description:
      "Every AI/ML project — gated, explained, and shipped where it's needed.",
  },
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest text-muted">
        Work
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold leading-tight">
        Every project, from first dataset to shipped API.
      </h1>
      <div className="mt-12">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <ProjectCard project={p} index={i} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
