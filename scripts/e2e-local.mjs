/**
 * End-to-end check of the Convex backend against a LOCAL backend (npx convex dev).
 * Usage: E2E_ADMIN_PASSWORD=... node scripts/e2e-local.mjs   (reads VITE_CONVEX_URL / VITE_CONVEX_SITE_URL from .env.local)
 * Requires an admin on the allow-list:  npx convex run admin:createAdmin '{"email":"local.admin@example.com"}'
 */
import fs from "node:fs";
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const env = Object.fromEntries(
  fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)])
);
const url = env.VITE_CONVEX_URL;
const site = env.VITE_CONVEX_SITE_URL;
if (!/127\.0\.0\.1|localhost/.test(url)) throw new Error("Refusing to run against a non-local backend: " + url);

const api = anyApi;
const pub = new ConvexHttpClient(url);
const admin = new ConvexHttpClient(url);
const results = [];
const check = (name, ok, extra = "") => { results.push(ok); console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  " + extra : ""}`); };
const throws = async (fn) => { try { await fn(); return null; } catch (e) { return String(e.message || e); } };

const tag = Date.now().toString(36);
const email = `qa.${tag}@example.org`;

// --- public reads
const plans = await pub.query(api.pricing.listPublished, {});
check("pricing plans come from the database", plans.length >= 3 && plans.some((p) => p.slug === "venture" && p.priceAmount === 99), `(${plans.map((p) => p.slug).join(",")})`);
const before = await pub.query(api.partners.listPublished, {});

// --- partner request validation, honeypot, rate limit
check("invalid partner request is rejected", !!(await throws(() => pub.mutation(api.partners.submitRequest, { organisation: "X", contactName: "Q", email: "bad", sector: "Other", message: "short" }))));
const good = { organisation: `QA Hub ${tag}`, contactName: "Test Person", email, sector: "Accelerator or incubator", website: "example.org", message: "We would like to partner on cohort selection." };
check("valid partner request is accepted", (await pub.mutation(api.partners.submitRequest, good)).ok === true);
check("honeypot submissions are silently dropped", (await pub.mutation(api.partners.submitRequest, { ...good, email: `bot.${tag}@example.org`, company_url: "http://spam" })).ok === true);
await pub.mutation(api.partners.submitRequest, good);
await pub.mutation(api.partners.submitRequest, good);
check("4th request from one email is rate limited", (await throws(() => pub.mutation(api.partners.submitRequest, good)))?.includes("RATE_LIMITED") === true);

// --- consultation via the HTTP endpoint the site uses
const r = await fetch(`${site}/notify-consultation`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "QA Lead", email, brief: "Testing the lead inbox end to end." }) });
check("consultation form endpoint accepts a lead", r.ok);

// --- admin gate
check("unauthenticated visitors cannot read admin data", !!(await throws(() => pub.query(api.partners.adminListRequests, {}))) && !!(await throws(() => pub.query(api.consultations.list, {}))));
const denied = await throws(() => new ConvexHttpClient(url).action(api.auth.signIn, { provider: "password", params: { email: `stranger.${tag}@example.org`, password: "Str0ng-Passw0rd!", flow: "signUp" } }));
check("sign-up is refused for emails not on the allow-list", !!denied, denied ? "(generic error)" : "");

const adminEmail = process.env.E2E_ADMIN_EMAIL ?? "local.admin@example.com";
const password = process.env.E2E_ADMIN_PASSWORD;
if (!password) throw new Error("Set E2E_ADMIN_PASSWORD (any 12+ character password) for the local test admin");
let session = await throws(async () => { const s = await admin.action(api.auth.signIn, { provider: "password", params: { email: adminEmail, password, flow: "signUp" } }); if (!s.tokens) throw new Error("no tokens"); admin.setAuth(s.tokens.token); });
if (session) {
  const s = await admin.action(api.auth.signIn, { provider: "password", params: { email: adminEmail, password, flow: "signIn" } });
  admin.setAuth(s.tokens.token);
}
const me = await admin.query(api.admin.me, {});
check("allow-listed admin can activate and sign in", me?.email === adminEmail);
await admin.mutation(api.admin.recordSignIn, { method: "password", userAgent: "e2e" });

// --- partner flow: approve -> logo -> publish -> public wall
const reqs = await admin.query(api.partners.adminListRequests, {});
const mine = reqs.find((x) => x.email === email && x.organisation === good.organisation);
check("admin sees the partner request", !!mine);
const partnerId = await admin.mutation(api.partners.adminApproveRequest, { requestId: mine._id, blurb: "Cohort selection partner." });
check("approve converts the request into a partner (unpublished)", !!partnerId && !(await pub.query(api.partners.listPublished, {})).some((p) => p.name === good.organisation));
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
const upUrl = await admin.mutation(api.admin.generateUploadUrl, {});
const up = await fetch(upUrl, { method: "POST", headers: { "Content-Type": "image/png" }, body: png });
const { storageId } = await up.json();
await admin.mutation(api.partners.adminSetLogo, { id: partnerId, storageId });
const bad = await admin.mutation(api.admin.generateUploadUrl, {}).then((u) => fetch(u, { method: "POST", headers: { "Content-Type": "text/html" }, body: "<b>x</b>" })).then((x) => x.json());
check("non-image upload is rejected by the server", !!(await throws(() => admin.mutation(api.partners.adminSetLogo, { id: partnerId, storageId: bad.storageId }))));
await admin.mutation(api.partners.adminSetPublished, { id: partnerId, isPublished: true });
const wall = await pub.query(api.partners.listPublished, {});
const shown = wall.find((p) => p.name === good.organisation);
check("published partner with a logo appears on the public wall", !!shown?.logoUrl && (await fetch(shown.logoUrl)).ok, `(wall was ${before.length}, now ${wall.length})`);

// --- pricing edit reflected publicly
const plansAdmin = await admin.query(api.pricing.adminList, {});
const venture = plansAdmin.find((p) => p.slug === "venture");
const { _id, _creationTime, order, updatedAt, ...fields } = venture;
await admin.mutation(api.pricing.adminUpdate, { id: _id, ...fields, priceAmount: 109 });
check("admin price edit shows on the public query", (await pub.query(api.pricing.listPublished, {})).find((p) => p.slug === "venture").priceAmount === 109);
await admin.mutation(api.pricing.adminUpdate, { id: _id, ...fields, priceAmount: 99 });
check("price restored", (await pub.query(api.pricing.listPublished, {})).find((p) => p.slug === "venture").priceAmount === 99);

// --- leads
const leads = await admin.query(api.consultations.list, {});
const lead = leads.find((l) => l.email === email);
check("admin sees the consultation lead", !!lead && lead.status === "new");
await admin.mutation(api.consultations.setStatus, { id: lead._id, status: "contacted" });
await admin.mutation(api.consultations.addNote, { id: lead._id, text: "Called back." });
check("lead status and note persist", (await admin.query(api.consultations.list, {})).find((l) => l._id === lead._id).status === "contacted");

// --- analytics
const vid = `v${tag}abcdefgh`;
await pub.mutation(api.analytics.track, { visitorId: vid, sessionId: `s${tag}abcdefgh`, isNewVisitor: true, device: "desktop", browser: "Chrome", os: "Windows", timezone: "Africa/Nairobi", language: "en-KE", viewport: "lg", events: [{ type: "pageview", path: "/pricing" }, { type: "event", name: "cta_request_access", path: "/pricing" }] });
await pub.mutation(api.analytics.track, { visitorId: vid, sessionId: `s${tag}abcdefgh`, isNewVisitor: true, device: "desktop", browser: "Chrome", os: "Windows", events: [{ type: "pageview", path: "/admin/leads" }] });
const sum = await admin.query(api.analytics.summary, { days: 7 });
check("analytics events are recorded (admin paths ignored)", sum.totals.pageviews >= 1 && !sum.topPages.some((p) => p.path.startsWith("/admin")) && sum.ctas[0].count >= 1);
check("visitors cannot read analytics", !!(await throws(() => pub.query(api.analytics.summary, { days: 7 }))));

// --- cleanup + audit
await admin.mutation(api.partners.adminDelete, { id: partnerId });
const log = await admin.query(api.admin.auditLog, { limit: 50 });
check("audit log records admin actions", log.some((l) => l.action === "partner_request_approved") && log.some((l) => l.action === "plan_updated") && log.some((l) => l.action === "sign_in"));

const failed = results.filter((x) => !x).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
