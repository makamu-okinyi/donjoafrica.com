import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// One shared observer for every Reveal on the page.
let observer: IntersectionObserver | null = null;
const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.removeAttribute("data-reveal");
          observer?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -80px 0px" }
  ));

// Reads and writes are batched (all rects read first, then attributes written) so the page
// pays for one layout, not one per element.
const pending: HTMLElement[] = [];
let scheduled = false;
function flush() {
  scheduled = false;
  const els = pending.splice(0);
  const vh = window.innerHeight;
  const below = els.filter((el) => el.isConnected && el.getBoundingClientRect().top >= vh);
  const io = getObserver();
  below.forEach((el) => {
    el.setAttribute("data-reveal", "hidden");
    io.observe(el);
  });
}

/**
 * Scroll-triggered fade/slide-up reveal (CSS transition, one shared IntersectionObserver).
 * Only elements below the fold are hidden, and only after JS runs, so nothing above the fold
 * ever flickers and no-JS visitors and crawlers see all content. Respects prefers-reduced-motion
 * (see index.css).
 */
const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    pending.push(el);
    if (!scheduled) {
      scheduled = true;
      queueMicrotask(flush);
    }
    return () => observer?.unobserve(el);
  }, []);

  return (
    <div ref={ref} className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      {children}
    </div>
  );
};

export default Reveal;
