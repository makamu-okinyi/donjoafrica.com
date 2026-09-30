import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Scroll offsets by history entry, so Back/Forward return to where the visitor was. */
const positions = new Map<string, number>();

/**
 * Scrolls to the element matching location.hash on navigation, to the top of the page for a new
 * route with no hash, and restores the previous scroll position when going Back or Forward.
 *
 * React Router v6 does none of these on its own.
 */
const ScrollToHash = () => {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    // Remember where we were when leaving this history entry.
    return () => {
      positions.set(key, window.scrollY);
    };
  }, [key]);

  useEffect(() => {
    let timer = 0;

    if (navType === "POP" && !hash) {
      const target = positions.get(key);
      if (target !== undefined) {
        let attempts = 0;
        const restore = () => {
          // Lazy routes may not have their full height yet, so retry briefly.
          if (document.documentElement.scrollHeight >= target + window.innerHeight || attempts >= 20) {
            window.scrollTo({ top: target, left: 0, behavior: "auto" });
            return;
          }
          attempts++;
          timer = window.setTimeout(restore, 30);
        };
        timer = window.setTimeout(restore, 0);
        return () => window.clearTimeout(timer);
      }
    }

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    const maxAttempts = 20; // ~600ms at one try per frame batch

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < maxAttempts) {
        timer = window.setTimeout(tryScroll, 30);
      }
    };

    // Defer one frame so the route's content has painted before we measure.
    timer = window.setTimeout(tryScroll, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, hash, key, navType]);

  return null;
};

export default ScrollToHash;
