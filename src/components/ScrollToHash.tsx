import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element matching location.hash on navigation.
 *
 * React Router v6 does not scroll to hash anchors on its own, so deep links
 * like /solutions#hackathons would otherwise land at the top of the page.
 * This handles both cases:
 *   - client-side navigation (clicking a dropdown/footer hash link), and
 *   - a fresh full-page load of a deep link (content may mount a frame later,
 *     so we retry briefly until the target exists).
 *
 * scrollIntoView honours the target's CSS scroll-margin-top (scroll-mt-28),
 * keeping the heading clear of the fixed navbar.
 */
const ScrollToHash = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;

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
