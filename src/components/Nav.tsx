import Link from "next/link";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display font-semibold tracking-tight">
          Godwin Praise
        </Link>
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted hover:text-ink transition-colors">
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/lowie03"
            target="_blank"
            rel="noreferrer"
            className="text-muted hover:text-ink transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}