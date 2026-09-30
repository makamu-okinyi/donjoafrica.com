import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Link2, ListTree, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/PageBits";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  LEGAL_EFFECTIVE_DATE, LEGAL_EFFECTIVE_LABEL, LEGAL_UPDATED_DATE, PLACEHOLDER,
  legalDocs, resolveTokens, type LegalBlock, type LegalDoc,
} from "@/data/legal";

// TODO(legal): the text in src/data/legal.ts is a comprehensive template, not legal advice. It must be
// reviewed by a Kenyan lawyer before it is relied on.

const updatedLabel = new Date(LEGAL_UPDATED_DATE + "T00:00:00Z").toLocaleDateString("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

/** Renders text, resolving {{entity.*}} tokens and highlighting facts still to be confirmed. */
const Text = ({ children }: { children: string }) => {
  const parts = resolveTokens(children).split(PLACEHOLDER);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <mark className="rounded bg-[hsl(var(--brand)/0.2)] px-1 py-0.5 text-foreground">{PLACEHOLDER}</mark>
          )}
        </Fragment>
      ))}
    </>
  );
};

const Block = ({ block }: { block: LegalBlock }) => {
  switch (block.type) {
    case "p":
      return <p><Text>{block.text}</Text></p>;
    case "ul":
      return (
        <ul className="list-disc space-y-2 pl-6 marker:text-muted-foreground">
          {block.items.map((it) => <li key={it}><Text>{it}</Text></li>)}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2 pl-6">
          {block.items.map((it) => <li key={it}><Text>{it}</Text></li>)}
        </ol>
      );
    case "defs":
      return (
        <dl className="divide-y divide-foreground/10 rounded-2xl border border-foreground/15">
          {block.items.map((d) => (
            <div key={d.term} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="font-semibold text-foreground">{d.term}</dt>
              <dd className="text-muted-foreground"><Text>{d.def}</Text></dd>
            </div>
          ))}
        </dl>
      );
    case "table":
      return (
        <div className="relative overflow-x-auto rounded-2xl border border-foreground/15" tabIndex={0} role="region" aria-label={block.caption}>
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-foreground/5">
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold text-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]} className="border-t border-foreground/10 align-top">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-medium text-foreground"><Text>{cell}</Text></th>
                    ) : (
                      <td key={i} className="px-4 py-3 text-muted-foreground"><Text>{cell}</Text></td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "note":
      return (
        <p className="rounded-2xl bg-foreground/5 px-4 py-3 text-sm text-foreground"><Text>{block.text}</Text></p>
      );
  }
};

/** Highlights the section currently in view for the table of contents. */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length || !("IntersectionObserver" in window)) return;
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Infinity));
        const visible = [...seen.entries()].filter(([, top]) => top !== Infinity).sort((a, b) => a[1] - b[1]);
        if (visible.length) setActive(visible[0][0]);
      },
      { rootMargin: "-100px 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const LegalDocument = ({ doc, path }: { doc: LegalDoc; path: string }) => {
  usePageMeta(path);
  const ids = useMemo(() => doc.sections.map((s) => s.id), [doc]);
  const active = useScrollSpy(ids);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toc = (
    <ol className="space-y-0.5 text-sm">
      {doc.sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? "location" : undefined}
            className={`flex gap-2 rounded-lg px-3 py-1.5 leading-snug transition-colors hover:bg-foreground/5 hover:text-foreground ${active === s.id ? "bg-foreground/5 font-semibold text-foreground" : "text-muted-foreground"}`}
          >
            <span className="w-5 shrink-0 tabular-nums">{i + 1}.</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="space-y-10 legal-doc">
      <header className="neo-extruded p-6 sm:p-12 space-y-5">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight text-balance">{doc.title}</h1>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <dt>Effective</dt>
            <dd className="font-medium text-foreground"><time dateTime={LEGAL_EFFECTIVE_DATE}>{LEGAL_EFFECTIVE_LABEL}</time></dd>
          </div>
          <div className="flex gap-2">
            <dt>Last updated</dt>
            <dd className="font-medium text-foreground"><time dateTime={LEGAL_UPDATED_DATE}>{updatedLabel}</time></dd>
          </div>
        </dl>
      </header>

      <section aria-labelledby={`${doc.slug}-summary`} className="mx-auto max-w-[68ch] lg:max-w-none">
        <div className="neo-pressed p-6 sm:p-8 space-y-3">
          <h2 id={`${doc.slug}-summary`} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-foreground">
            <ShieldCheck className="h-4 w-4 text-[hsl(var(--brand-ink))]" aria-hidden="true" /> In plain language
          </h2>
          <ul className="space-y-2 text-foreground">
            {doc.summary.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--brand-strong))]" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">This summary is a convenience. The full text below is what applies.</p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start legal-toc" aria-label="Table of contents">
          <details className="lg:hidden neo-extruded-sm !rounded-2xl">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              <ListTree className="h-4 w-4" aria-hidden="true" /> On this page
            </summary>
            <div className="max-h-72 overflow-y-auto px-2 pb-3">{toc}</div>
          </details>
          <nav className="hidden max-h-[calc(100dvh-9rem)] overflow-y-auto pr-2 lg:block" aria-label="On this page">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-foreground">On this page</p>
            {toc}
          </nav>
        </aside>

        <article className="min-w-0 max-w-[68ch] space-y-12 text-base leading-relaxed text-muted-foreground">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 space-y-4" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`} className="group flex items-baseline gap-3 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                <span className="tabular-nums text-[hsl(var(--brand-ink))]">{i + 1}.</span>
                <span>{s.title}</span>
                <a href={`#${s.id}`} className="ml-auto opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 print:hidden" aria-label={`Link to section ${i + 1}`}>
                  <Link2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </a>
              </h2>
              {s.blocks.map((b, bi) => (
                <Block key={bi} block={b} />
              ))}
            </section>
          ))}

          <footer className="border-t border-foreground/10 pt-6 text-sm">
            <p>
              Related:{" "}
              {doc.slug !== "privacy" && <Link to="/privacy" className="font-semibold text-foreground underline underline-offset-4">Privacy Policy</Link>}
              {doc.slug !== "privacy" && doc.slug !== "terms" && ", "}
              {doc.slug !== "terms" && <Link to="/terms" className="font-semibold text-foreground underline underline-offset-4">Terms of Use</Link>}
              {doc.slug !== "cookies" && (<>{", "}<Link to="/cookies" className="font-semibold text-foreground underline underline-offset-4">Cookie Notice</Link></>)}
              . Questions? <Link to="/contact" className="font-semibold text-foreground underline underline-offset-4">Contact us</Link>.
            </p>
          </footer>
        </article>
      </div>

      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-[var(--neo-shadow-sm)] print:hidden sm:right-6"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5 text-foreground" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export const Privacy = () => <LegalDocument doc={legalDocs.privacy} path="/privacy" />;
export const Terms = () => <LegalDocument doc={legalDocs.terms} path="/terms" />;
export const Cookies = () => <LegalDocument doc={legalDocs.cookies} path="/cookies" />;
