import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { audit, requireAdmin } from "./lib/adminAuth";
import { enforceRateLimit } from "./lib/rateLimit";

export const SECTORS = [
  "Accelerator or incubator",
  "University or training provider",
  "Employer or recruiter",
  "Hackathon or competition host",
  "Investor or funder",
  "NGO or community organisation",
  "Technology or media partner",
  "Other",
] as const;

// eslint-disable-next-line no-control-regex
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normaliseUrl(input: string | undefined): string | undefined {
  const raw = clean(input ?? "");
  if (!raw) return undefined;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error("INVALID_WEBSITE");
  }
  if (!url.hostname.includes(".") || withScheme.length > 200) throw new Error("INVALID_WEBSITE");
  return url.toString();
}

/* ----------------------------------------------------------------------------------- public */

/** Public: submit a partnership request. Validated and rate limited server-side. */
export const submitRequest = mutation({
  args: {
    organisation: v.string(),
    contactName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    sector: v.string(),
    website: v.optional(v.string()),
    message: v.string(),
    /** Honeypot: real users never fill this. Bots that do are silently accepted and dropped. */
    company_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.company_url && args.company_url.trim() !== "") return { ok: true };

    const organisation = clean(args.organisation);
    const contactName = clean(args.contactName);
    const email = clean(args.email).toLowerCase();
    const phone = clean(args.phone ?? "");
    const message = clean(args.message);
    const sector = clean(args.sector);

    if (organisation.length < 2 || organisation.length > 120) throw new Error("INVALID_ORGANISATION");
    if (contactName.length < 2 || contactName.length > 100) throw new Error("INVALID_NAME");
    if (email.length > 254 || !EMAIL.test(email)) throw new Error("INVALID_EMAIL");
    if (phone && (phone.length > 30 || !/^[+\d][\d\s()-]{5,}$/.test(phone))) throw new Error("INVALID_PHONE");
    if (!(SECTORS as readonly string[]).includes(sector)) throw new Error("INVALID_SECTOR");
    if (message.length < 10 || message.length > 1500) throw new Error("INVALID_MESSAGE");
    const website = normaliseUrl(args.website);

    await enforceRateLimit(ctx, `partner:email:${email}`, 3);
    await enforceRateLimit(ctx, "partner:global", 40);

    await ctx.db.insert("partnerRequests", {
      organisation, contactName, email, phone: phone || undefined, sector, website, message,
      status: "new", createdAt: Date.now(),
    });
    return { ok: true };
  },
});

/** Public: partners the admin has published, in display order, with logo URLs resolved. */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("partners")
      .withIndex("by_published_order", (q) => q.eq("isPublished", true))
      .take(60);
    return await Promise.all(
      rows.map(async (p) => ({
        id: p._id as string,
        name: p.name,
        sector: p.sector,
        blurb: p.blurb,
        website: p.website ?? null,
        logoUrl: p.logoStorageId ? await ctx.storage.getUrl(p.logoStorageId) : p.logoUrl ?? null,
      }))
    );
  },
});

/* ------------------------------------------------------------------------------------ admin */

export const adminListRequests = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("partnerRequests").order("desc").take(500);
  },
});

/** Approve a request: creates an (unpublished) partner prefilled from it and links the two. */
export const adminApproveRequest = mutation({
  args: { requestId: v.id("partnerRequests"), blurb: v.optional(v.string()) },
  handler: async (ctx, { requestId, blurb }) => {
    const admin = await requireAdmin(ctx);
    const req = await ctx.db.get(requestId);
    if (!req) throw new Error("Not found");
    if (req.partnerId) return req.partnerId;
    const all = await ctx.db.query("partners").collect();
    const partnerId = await ctx.db.insert("partners", {
      name: req.organisation,
      sector: req.sector,
      blurb: (blurb ?? "").trim().slice(0, 240),
      website: req.website,
      isPublished: false,
      order: all.reduce((m, p) => Math.max(m, p.order), 0) + 1,
      sourceRequestId: requestId,
    });
    await ctx.db.patch(requestId, { status: "approved", partnerId });
    await audit(ctx, admin, "partner_request_approved", req.organisation);
    return partnerId;
  },
});

export const adminDeclineRequest = mutation({
  args: { requestId: v.id("partnerRequests"), note: v.optional(v.string()) },
  handler: async (ctx, { requestId, note }) => {
    const admin = await requireAdmin(ctx);
    const req = await ctx.db.get(requestId);
    if (!req) throw new Error("Not found");
    await ctx.db.patch(requestId, { status: "declined", declineNote: note?.trim().slice(0, 500) || undefined });
    await audit(ctx, admin, "partner_request_declined", req.organisation);
  },
});

export const adminList = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db.query("partners").collect();
    rows.sort((a, b) => a.order - b.order);
    return await Promise.all(rows.map(async (p) => ({ ...p, logoPreview: p.logoStorageId ? await ctx.storage.getUrl(p.logoStorageId) : p.logoUrl ?? null })));
  },
});

const partnerFields = {
  name: v.string(),
  sector: v.string(),
  blurb: v.string(),
  website: v.optional(v.string()),
  isPublished: v.boolean(),
};

function checkPartner(a: { name: string; sector: string; blurb: string; website?: string }) {
  const name = clean(a.name);
  if (name.length < 2 || name.length > 120) throw new Error("Name must be 2-120 characters");
  if (!(SECTORS as readonly string[]).includes(clean(a.sector))) throw new Error("Choose a sector");
  const blurb = clean(a.blurb);
  if (blurb.length > 240) throw new Error("Blurb is limited to 240 characters");
  return { name, sector: clean(a.sector), blurb, website: normaliseUrl(a.website) };
}

export const adminCreate = mutation({
  args: partnerFields,
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const fields = checkPartner(args);
    const all = await ctx.db.query("partners").collect();
    const id = await ctx.db.insert("partners", { ...fields, isPublished: args.isPublished, order: all.reduce((m, p) => Math.max(m, p.order), 0) + 1 });
    await audit(ctx, admin, "partner_created", fields.name);
    return id;
  },
});

export const adminUpdate = mutation({
  args: { id: v.id("partners"), ...partnerFields },
  handler: async (ctx, { id, ...args }) => {
    const admin = await requireAdmin(ctx);
    const fields = checkPartner(args);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(id, { ...fields, isPublished: args.isPublished });
    await audit(ctx, admin, "partner_updated", `${fields.name} (published: ${args.isPublished})`);
  },
});

export const adminSetPublished = mutation({
  args: { id: v.id("partners"), isPublished: v.boolean() },
  handler: async (ctx, { id, isPublished }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    await ctx.db.patch(id, { isPublished });
    await audit(ctx, admin, isPublished ? "partner_published" : "partner_unpublished", row.name);
  },
});

/** Move a partner up or down in display order by swapping with its neighbour. */
export const adminMove = mutation({
  args: { id: v.id("partners"), direction: v.union(v.literal("up"), v.literal("down")) },
  handler: async (ctx, { id, direction }) => {
    const admin = await requireAdmin(ctx);
    const rows = (await ctx.db.query("partners").collect()).sort((a, b) => a.order - b.order);
    const i = rows.findIndex((r) => r._id === id);
    const j = direction === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= rows.length) return;
    const [a, b] = [rows[i], rows[j]];
    await ctx.db.patch(a._id, { order: b.order === a.order ? b.order + (direction === "up" ? -1 : 1) : b.order });
    await ctx.db.patch(b._id, { order: a.order });
    await audit(ctx, admin, "partner_reordered", a.name);
  },
});

/** Attach an uploaded logo (already validated client-side; re-checked here). Replaces and deletes the old file. */
export const adminSetLogo = mutation({
  args: { id: v.id("partners"), storageId: v.id("_storage") },
  handler: async (ctx, { id, storageId }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    const meta = await ctx.db.system.get(storageId);
    if (!meta || !/^image\/(png|jpeg|webp|svg\+xml)$/.test(meta.contentType ?? "") || meta.size > 1_000_000) {
      await ctx.storage.delete(storageId);
      throw new Error("Logo must be a PNG, JPEG, WebP or SVG under 1 MB");
    }
    if (row.logoStorageId) await ctx.storage.delete(row.logoStorageId);
    await ctx.db.patch(id, { logoStorageId: storageId });
    await audit(ctx, admin, "partner_logo_set", row.name);
  },
});

export const adminRemoveLogo = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, { id }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    if (row.logoStorageId) await ctx.storage.delete(row.logoStorageId);
    await ctx.db.patch(id, { logoStorageId: undefined });
    await audit(ctx, admin, "partner_logo_removed", row.name);
  },
});

export const adminDelete = mutation({
  args: { id: v.id("partners") },
  handler: async (ctx, { id }) => {
    const admin = await requireAdmin(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Not found");
    if (row.logoStorageId) await ctx.storage.delete(row.logoStorageId);
    await ctx.db.delete(id);
    await audit(ctx, admin, "partner_deleted", row.name);
  },
});
