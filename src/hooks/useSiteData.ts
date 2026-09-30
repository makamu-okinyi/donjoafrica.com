import { useQuery } from "@tanstack/react-query";
import { api, getConvex } from "@/lib/convexClient";
import { DEFAULT_PLANS, type PricingPlan } from "@/data/pricing";

export interface PublishedPartner {
  id: string;
  name: string;
  sector: string;
  blurb: string;
  website: string | null;
  logoUrl: string | null;
}

/** Published partners (admin-managed). Empty until a partner is published. */
export function usePublishedPartners() {
  return useQuery<PublishedPartner[]>({
    queryKey: ["partners", "published"],
    queryFn: async () => {
      const convexClient = await getConvex();
      if (!convexClient) return [];
      try {
        return await convexClient.query(api.partners.listPublished, {});
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
    retry: false,
  });
}

/** Admin-managed pricing plans, falling back to the defaults baked into the static HTML. */
export function usePricingPlans() {
  return useQuery<PricingPlan[]>({
    queryKey: ["pricing", "published"],
    queryFn: async () => {
      const convexClient = await getConvex();
      if (!convexClient) return DEFAULT_PLANS;
      try {
        const rows: PricingPlan[] = await convexClient.query(api.pricing.listPublished, {});
        return rows.length ? rows : DEFAULT_PLANS;
      } catch {
        // Backend unreachable or function not deployed yet: show the built-in plans.
        return DEFAULT_PLANS;
      }
    },
    placeholderData: DEFAULT_PLANS,
    staleTime: 60_000,
    retry: false,
  });
}
