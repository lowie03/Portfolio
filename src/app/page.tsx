import { projects } from "@/data/projects";
import AnimatedHeadline from "@/components/AnimatedHeadline";
import Showcase from "@/components/Showcase";
import MaskedLine from "@/components/MaskedLine";

export default function Home() {
  return (
    <main>
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          Available for new work · Nigeria (WAT)
        </p>
        <AnimatedHeadline text="I build AI for problems I can see out the window" />
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Machine learning with its feet on the ground. Gated, explained, and
          shipped where it's needed
        </p>
        <div className="mt-10 flex gap-4">
          <a
            href="#work"
            className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-accent transition-colors"
          >
            View work
          </a>
          <a
            href="mailto:praiseg203@gmail.com"
            className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-ink transition-colors"
          >
            Let's talk
          </a>
        </div>
      </section>

      <Showcase projects={projects} />

      <section
        id="about"
        className="mx-auto max-w-5xl border-t border-line px-6 py-24"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          About
        </p>
        <div className="mt-6 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <MaskedLine>
              <p className="text-lg leading-relaxed">
                I&apos;ve always enjoyed figuring out how things work. That
                curiosity is what pulled me into machine learning, and before
                long, I found myself asking bigger questions, not just can I
                build a model that works? but can I build one that people can
                actually rely on?
              </p>
            </MaskedLine>
            <MaskedLine delay={0.12}>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                That question shapes the way I approach every project. I enjoy
                taking ideas from the first dataset all the way to a working
                product, whether that means training machine learning models,
                building computer vision systems, developing LLM and RAG
                applications, deploying APIs, or designing the interface people
                interact with. For me, the exciting part isn&apos;t just the
                model, it&apos;s bringing every piece together into something
                useful.
              </p>
            </MaskedLine>
            <MaskedLine delay={0.24}>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                I&apos;m especially drawn to problems where AI can create real
                impact. I want to build intelligent systems that are practical,
                trustworthy, and genuinely improve people&apos;s lives. Every
                project teaches me something new, and that&apos;s what keeps me
                building.
              </p>
            </MaskedLine>
          </div>
          <div className="font-mono text-sm md:sticky md:top-24 md:self-start">
            <p className="text-xs uppercase tracking-widest text-muted">
              Toolbox
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "PyTorch",
                "scikit-learn",
                "FastAPI",
                "ONNX Runtime",
                "React / Next.js",
                "Docker",
              ].map((t) => (
                <li key={t} className="border-b border-line pb-2">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-5xl border-t border-line px-6 py-24"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          Let's talk
        </p>
        <h2 className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight">
          Whether it’s a project, collaboration, or an opportunity to build
          something great, I’d love to hear from you.
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="mailto:praiseg203@gmail.com"
            className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper hover:bg-accent transition-colors"
          >
            Email
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-ink transition-colors"
          >
            View resume
          </a>
          <a
            href="https://github.com/lowie03"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/praise-godwin-a6a339263"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest hover:border-ink transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <p className="mt-16 border-t border-line pt-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} Godwin Praise
        </p>
      </section>
    </main>
  );
}
