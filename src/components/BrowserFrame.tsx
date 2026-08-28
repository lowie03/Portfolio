/** Strips protocol and path from a URL, leaving just the host — "https://foo.vercel.app/bar" -> "foo.vercel.app". */
function hostFromUrl(url: string) {
  let host: string;
  try {
    host = new URL(url).host;
  } catch {
    // Not a fully-qualified URL (missing protocol, etc.) — fall back to a plain string trim.
    host = url.replace(/^\w+:\/\//, "").split("/")[0];
  }

  // Vercel preview/deployment URLs look like
  // "plant-disease-detector-q4nnvoiyk-praises-projects-e37ae29d.vercel.app"
  // — the random hash segments Vercel appends make the URL both hard to
  // read and prone to overflowing the pill. Hash segments always contain a
  // digit (a plain project-name word never does here), so truncating the
  // hyphen-split subdomain at the first digit-containing segment recovers
  // the clean name. Domains that are already clean (no digit segment) pass
  // through unchanged.
  if (host.endsWith(".vercel.app")) {
    const subdomain = host.slice(0, -".vercel.app".length);
    const segments = subdomain.split("-");
    const hashIndex = segments.findIndex((s) => /\d/.test(s));
    if (hashIndex > 0) {
      host = `${segments.slice(0, hashIndex).join("-")}.vercel.app`;
    }
  }

  return host;
}

export default function BrowserFrame({
  demo,
  children,
  chromeClassName,
}: {
  demo?: string;
  children: React.ReactNode;
  /** Literal `bg-*`/`text-*` class pair for this frame's chrome — see
   *  PANEL_CHROME_CLASSES in Showcase.tsx. Falls back to the site's default
   *  surface/muted tokens for contexts with no panel of their own (e.g. the
   *  project detail page). Border, pill, dots, and their ring all derive
   *  from whichever `text-*` color this resolves to via `currentColor`, so
   *  nothing here is a separate hardcoded value. */
  chromeClassName?: string;
}) {
  const url = demo ? hostFromUrl(demo) : null;
  const chrome = chromeClassName ?? "bg-surface text-muted";

  return (
    <div className={`overflow-hidden rounded-xl border border-current/20 shadow-sm ${chrome}`}>
      <div className="relative flex h-9 items-center justify-center border-b border-current/20 px-3">
        {/* Traffic-light dots, kept recognizable as red/yellow/green — but
            at reduced opacity rather than macOS's full saturation, which
            read as the loudest thing on the lighter panels (blending with
            the panel's own background is what actually mutes them, so the
            effect scales with each panel's chrome color automatically). */}
        <div className="absolute left-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/50 ring-1 ring-current/20" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/50 ring-1 ring-current/20" />
          <span className="h-2 w-2 rounded-full bg-green-500/50 ring-1 ring-current/20" />
        </div>
        {url && (
          // max-w reserves room for the dots on the left (they occupy about
          // 48px) on both sides of this centered pill, and `truncate` turns
          // any overflow into an ellipsis instead of wrapping onto a second
          // line and colliding with them.
          <span className="max-w-[calc(100%-6rem)] truncate rounded-full bg-current/10 px-3 py-0.5 font-mono text-[10px]">
            {url}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] w-full bg-current/5">{children}</div>
    </div>
  );
}
