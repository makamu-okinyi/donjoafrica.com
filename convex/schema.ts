import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  /** Contact-form submissions ("Request Access"). Lead-workflow fields are optional and additive. */
  consultations: defineTable({
    name: v.string(),
    email: v.string(),
    brief: v.string(),
    status: v.optional(
      v.union(v.literal("new"), v.literal("contacted"), v.literal("qualified"), v.literal("won"), v.literal("lost"))
    ),
    assignee: v.optional(v.string()),
    notes: v.optional(v.array(v.object({ at: v.number(), by: v.string(), text: v.string() }))),
    updatedAt: v.optional(v.number()),
  }).index("by_status", ["status"]),

  /** Public "Partner With Us" submissions. An admin approves/declines and can convert to a partner. */
  partnerRequests: defineTable({
    organisation: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    sector: v.string(),
    website: v.optional(v.string()),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("approved"), v.literal("declined")),
    createdAt: v.number(),
    declineNote: v.optional(v.string()),
    partnerId: v.optional(v.id("partners")),
  })
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  /** Partners shown on the public logo wall (only rows with isPublished = true). */
  partners: defineTable({
    name: v.string(),
    sector: v.string(),
    blurb: v.string(),
    website: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    logoUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    order: v.number(),
    sourceRequestId: v.optional(v.id("partnerRequests")),
  }).index("by_published_order", ["isPublished", "order"]),

  /** Admin-managed pricing tiers shown on /pricing. */
  pricingPlans: defineTable({
    slug: v.string(),
    name: v.string(),
    tagline: v.string(),
    priceAmount: v.optional(v.number()),
    currency: v.string(),
    billingPeriod: v.union(v.literal("monthly"), v.literal("yearly"), v.literal("custom"), v.literal("free")),
    features: v.array(v.string()),
    limits: v.optional(v.record(v.string(), v.number())),
    highlighted: v.boolean(),
    ctaLabel: v.string(),
    ctaHref: v.string(),
    isPublished: v.boolean(),
    order: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published_order", ["isPublished", "order"]),

  /** Fixed-window counters used to rate-limit public mutations. */
  rateLimits: defineTable({
    key: v.string(),
    windowStart: v.number(),
    count: v.number(),
  }).index("by_key", ["key"]),

  /** Allow-list of admin accounts. Only these emails may register or sign in to the console. */
  admins: defineTable({
    email: v.string(), // lowercased
    name: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_email", ["email"]),

  /** Append-only audit trail of admin sign-ins and privileged actions. */
  adminAuditLog: defineTable({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    action: v.string(),
    detail: v.optional(v.string()),
    at: v.number(),
    userAgent: v.optional(v.string()),
  })
    .index("by_at", ["at"])
    .index("by_userId", ["userId"]),

  /** Key/value settings (e.g. analytics retention). */
  appSettings: defineTable({ key: v.string(), value: v.number() }).index("by_key", ["key"]),

  /** WebAuthn passkeys (one row per credential). publicKey is the base64url COSE key. */
  passkeys: defineTable({
    userId: v.id("users"),
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.optional(v.array(v.string())),
    deviceLabel: v.string(),
    deviceType: v.optional(v.string()),
    backedUp: v.optional(v.boolean()),
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_credentialId", ["credentialId"]),

  /** Short-lived, single-use WebAuthn challenges. */
  webauthnChallenges: defineTable({
    challenge: v.string(),
    type: v.union(v.literal("registration"), v.literal("authentication")),
    userId: v.optional(v.id("users")),
    expiresAt: v.number(),
  })
    .index("by_challenge", ["challenge"])
    .index("by_expiresAt", ["expiresAt"]),

  /** First-party, cookie-less analytics for the public site. No IPs, no PII. */
  analyticsEvents: defineTable({
    type: v.union(v.literal("pageview"), v.literal("event")),
    name: v.optional(v.string()),
    visitorId: v.string(),
    sessionId: v.string(),
    isNewVisitor: v.boolean(),
    path: v.string(),
    referrerHost: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    device: v.string(),
    browser: v.string(),
    os: v.string(),
    timezone: v.optional(v.string()),
    language: v.optional(v.string()),
    viewport: v.optional(v.string()),
    engagementMs: v.optional(v.number()),
    at: v.number(),
  })
    .index("by_at", ["at"])
    .index("by_visitor_at", ["visitorId", "at"]),
});
