import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element matching location.hash on navigation, or to the top
 * of the page when navigating to a new route with no hash.
 *
 * React Router v6 does neither of these on its own. Without this, clicking a
 * plain nav link while scrolled down on the previous page leaves the new
 * page's content wherever the old scroll position happened to land.
 */
const ScrollToHash = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let frame = 0;
    let attempts = 0;
    const maxAttempts = 20; // ~600ms at one try per frame batch

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < maxAttempts) {
        frame = window.setTimeout(tryScroll, 30);
      }
    };

    // Defer one frame so the route's content has painted before we measure.
    frame = window.setTimeout(tryScroll, 0);

    return () => window.clearTimeout(frame);
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToHash;
