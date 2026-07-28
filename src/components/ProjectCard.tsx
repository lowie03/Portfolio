import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative overflow-hidden block border-t border-line px-4 mx-4 py-10 rounded-xl transition-colors hover:bg-surface"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-px bg-accent/60 opacity-0 transition-all duration-700 ease-out group-hover:left-full group-hover:opacity-100"
      />
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")}
        </p>
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          {project.tags.join(" · ")}
        </p>
      </div>
      <h3 className="mt-3 font-display text-3xl font-semibold group-hover:text-accent transition-colors">
        {project.title}
      </h3>
      <p className="mt-3 max-w-2xl text-muted">{project.description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {project.metrics.map((m) => (
          <span
            key={m.label}
            className="rounded-full border border-line px-3 py-1 font-mono text-xs"
          >
            {m.label}: <span className="text-accent">{m.value}</span>
          </span>
        ))}
      </div>
    </Link>
  );
}
