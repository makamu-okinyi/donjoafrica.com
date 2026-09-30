import { ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToHash from "./ScrollToHash";
import Breadcrumbs from "./Breadcrumbs";
import { LAST_UPDATED, LAST_UPDATED_LABEL } from "@/data/seo";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  // Move focus to the main landmark on client-side navigation so keyboard and
  // screen-reader users start at the top of the new page.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-background pixel-grid-overlay">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
          mainRef.current?.scrollIntoView();
        }}
      >
        Skip to main content
      </a>
      <ScrollToHash />
      <Navbar />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="relative z-10 pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto outline-none"
      >
        <Breadcrumbs />
        {children}
        <p className="mt-16 text-center text-xs text-muted-foreground">
          Last updated <time dateTime={LAST_UPDATED}>{LAST_UPDATED_LABEL}</time>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
