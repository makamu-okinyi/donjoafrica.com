import { anyApi } from "convex/server";

/** Untyped function references (the backend is validated server-side; see scripts/e2e-local.mjs). */
export const api = anyApi;

export interface PageProps { useMeta: (title: string) => void }
