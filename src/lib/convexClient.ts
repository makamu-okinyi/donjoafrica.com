import type { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const url = import.meta.env.VITE_CONVEX_URL as string | undefined;

let client: Promise<ConvexHttpClient | null> | null = null;

/**
 * Lazily loads the Convex browser client so it stays out of the initial bundle.
 * Resolves to null when no Convex deployment is configured.
 */
export function getConvex(): Promise<ConvexHttpClient | null> {
  if (!url) return Promise.resolve(null);
  client ??= import("convex/browser").then((m) => new m.ConvexHttpClient(url));
  return client;
}

/** Untyped function references, so the site works without regenerated Convex types. */
export const api = anyApi;
