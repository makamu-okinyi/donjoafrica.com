import { useEffect } from "react";
import {
  SITE_URL, SITE_NAME, OG_IMAGE, LAST_UPDATED, breadcrumbsFor, getRouteSeo,
} from "@/data/seo";

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

interface SeoOptions {
  faq?: { q: string; a: string }[];
  /** Adds robots noindex (used by the 404 page). */
  noindex?: boolean;
  /** Override for pages not in the central route table. */
  override?: { title: string; description: string };
}

const canonicalFor = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

/**
 * Applies the central SEO config for `path`: title, description, canonical, Open Graph,
 * Twitter card and page-level JSON-LD (WebPage, BreadcrumbList, FAQPage).
 */
export function usePageMeta(path: string, options: SeoOptions = {}) {
  const { faq, noindex, override } = options;
  useEffect(() => {
    const seo = getRouteSeo(path);
    const title = override?.title ?? seo?.title ?? SITE_NAME;
    const description = override?.description ?? seo?.description ?? "";
    const url = canonicalFor(path);

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    if (seo?.keywords) setMeta("name", "keywords", seo.keywords.join(", "));
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "en_KE");
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", OG_IMAGE);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", "Donjo: Proof Over Promises");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", OG_IMAGE);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;

    // Page-level structured data
    const graph: Record<string, unknown>[] = [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "en",
        dateModified: LAST_UPDATED,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ];
    const crumbs = breadcrumbsFor(path);
    if (crumbs.length > 1) {
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: canonicalFor(c.path),
        })),
      });
    }
    if (faq?.length) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    document.head.querySelectorAll('script[data-seo="page"]').forEach((n) => n.remove());
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "page";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
  }, [path, faq, noindex, override?.title, override?.description]);
}
