import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "@/data/projects";
import CountUp from "@/components/CountUp";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <Link
        href="/#work"
        className="font-mono text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
      >
        ← All work
      </Link>

      <p className="mt-10 font-mono text-xs uppercase tracking-widest text-accent">
        {project.tags.join(" · ")}
      </p>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">
        {project.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">{project.description}</p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
        {project.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-line p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {m.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-accent">
              <CountUp value={m.value} />
            </p>
          </div>
        ))}
      </div>

      {project.images && (
        <div
          className={
            project.images.length === 1
              ? "mt-12 max-w-2xl"
              : "mt-12 grid gap-6 md:grid-cols-2"
          }
        >
          {project.images.map((img, i) => (
            <Reveal key={img.src} delay={i * 0.1}>
              <div className="group overflow-hidden rounded-xl border border-line bg-line p-3 shadow-sm">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-line bg-line shadow-[inset_0_1px_4px_rgba(22,24,29,0.08)]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading={i === 0 ? "eager" : "lazy"}
                    className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      <section className="mt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Stack
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-3 py-1 font-mono text-xs"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-12 flex gap-4">
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-accent transition-colors"
        >
          View on GitHub ↗
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
          >
            Live demo ↗
          </a>
        )}
      </div>
    </main>
  );
}
