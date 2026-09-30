import { lazy, Suspense, useEffect, useState } from "react";
import { lazyRoute } from "@/lib/lazyRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/context/ThemeContext";
import Layout from "@/components/Layout";

import Home from "@/pages/Home";
// Toasters are deferred: they are not needed for first paint.
const Toaster = lazy(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));
const About = lazyRoute(() => import("@/pages/About"));
const Expertise = lazyRoute(() => import("@/pages/Expertise"));
const Founder = lazyRoute(() => import("@/pages/Founder"));
const Solutions = lazyRoute(() => import("@/pages/Solutions"));
const Platform = lazyRoute(() => import("@/pages/Platform"));
const DetailRoute = lazyRoute(() => import("@/pages/DetailRoute"));
const Partners = lazyRoute(() => import("@/pages/Partners"));
const Pricing = lazyRoute(() => import("@/pages/Pricing"));
const Connect = lazyRoute(() => import("@/pages/Connect"));
const NotFound = lazyRoute(() => import("@/pages/NotFound"));
const AdminApp = lazy(() => import("@/admin/AdminApp"));
const Privacy = lazyRoute(() => import("@/pages/Legal").then((m) => ({ default: m.Privacy })));
const Terms = lazyRoute(() => import("@/pages/Legal").then((m) => ({ default: m.Terms })));
const Cookies = lazyRoute(() => import("@/pages/Legal").then((m) => ({ default: m.Cookies })));

/** Mounts the toast layers after first paint so they never compete with critical work. */
const DeferredToasters = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 3000);
    return () => window.clearTimeout(id);
  }, []);
  return ready ? (
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
    </Suspense>
  ) : null;
};

/** Loads the route module for a path ahead of the first render (used by main.tsx). */
export function preloadRoute(pathname: string): Promise<unknown> {
  const p = pathname.replace(/\/+$/, "") || "/";
  const table: [RegExp, { preload: () => Promise<unknown> }][] = [
    [/^\/about$/, About], [/^\/expertise$/, Expertise], [/^\/founder$/, Founder],
    [/^\/solutions$/, Solutions], [/^\/solutions\/[^/]+$/, DetailRoute],
    [/^\/platform$/, Platform], [/^\/platform\/[^/]+$/, DetailRoute],
    [/^\/partners$/, Partners], [/^\/pricing$/, Pricing], [/^\/contact$/, Connect],
    [/^\/privacy$/, Privacy], [/^\/terms$/, Terms], [/^\/cookies$/, Cookies],
  ];
  if (p === "/") return Promise.resolve();
  const hit = table.find(([re]) => re.test(p));
  return (hit ? hit[1] : NotFound).preload().catch(() => undefined);
}

const PublicSite = () => (
  <Layout>
            <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/expertise" element={<Expertise />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/solutions/:slug" element={<DetailRoute family="solutions" />} />
              <Route path="/platform" element={<Platform />} />
              <Route path="/platform/:slug" element={<DetailRoute family="platform" />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Connect />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              {/* Catch-all: any unknown path renders the 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
  </Layout>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <>
        <DeferredToasters />
        <BrowserRouter>
          <Routes>
            {/* Admin console: separate chunk, own providers, no public layout, never indexed. */}
            <Route path="/admin/*" element={<Suspense fallback={<div className="min-h-screen bg-background" />}><AdminApp /></Suspense>} />
            <Route path="*" element={<PublicSite />} />
          </Routes>
        </BrowserRouter>
      </>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
