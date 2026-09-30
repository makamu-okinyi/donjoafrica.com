/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, type ComponentType } from "react";

/**
 * React.lazy with a synchronous fast path. Once a route module has been preloaded
 * (see preloadRoute in App.tsx) it renders immediately, so the prerendered HTML is never
 * replaced by a Suspense fallback on first load.
 */
export function lazyRoute<P extends object>(factory: () => Promise<{ default: ComponentType<P> }>) {
  let loaded: ComponentType<P> | null = null;
  const load = () =>
    factory().then((m) => {
      loaded = m.default;
      return m;
    });
  const Lazy = lazy(load);
  const Route = (props: P) => {
    const Loaded = loaded;
    return Loaded ? <Loaded {...props} /> : <Lazy {...(props as any)} />;
  };
  Route.preload = load;
  return Route;
}
