/** Strips protocol and path from a URL, leaving just the host — "https://foo.vercel.app/bar" -> "foo.vercel.app". */
function hostFromUrl(url: string) {
  try {
    return new URL(url).host;
  } catch {
    // Not a fully-qualified URL (missing protocol, etc.) — fall back to a plain string trim.
    return url.replace(/^\w+:\/\//, "").split("/")[0];
  }
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
   *  project detail page). Border, pill, and dot ring all derive from
   *  whichever `text-*` color this resolves to via `currentColor`, so
   *  nothing here is a separate hardcoded value. */
  chromeClassName?: string;
}) {
  const url = demo ? hostFromUrl(demo) : null;
  const chrome = chromeClassName ?? "bg-surface text-muted";

  return (
    <div className={`overflow-hidden rounded-xl border border-current/20 shadow-sm ${chrome}`}>
      <div className="relative flex h-9 items-center justify-center border-b border-current/20 px-3">
        <div className="absolute left-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400 ring-1 ring-current/10" />
          <span className="h-2 w-2 rounded-full bg-yellow-400 ring-1 ring-current/10" />
          <span className="h-2 w-2 rounded-full bg-green-400 ring-1 ring-current/10" />
        </div>
        {url && (
          <span className="rounded-full bg-current/10 px-3 py-0.5 font-mono text-[10px]">
            {url}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] w-full bg-current/5">{children}</div>
    </div>
  );
}
