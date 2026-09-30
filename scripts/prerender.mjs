/**
 * Post-build prerender. Serves ./dist, crawls every public route with headless Chrome and
 * writes static HTML to dist/<route>/index.html so crawlers (and no-JS users) get real content.
 * Also generates: sitemap.xml, robots.txt, 404.html (noindex), spa.html (client-only fallback
 * for /admin) and the branded 1200x630 og-image.png.
 *
 * Chrome: set CHROME_PATH, or the common install locations below are tried.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const SITE = "https://donjoafrica.com";
const today = new Date().toISOString().slice(0, 10);

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const executablePath = chromeCandidates.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.warn("[prerender] Chrome not found. Set CHROME_PATH. Skipping prerender (SPA build only).");
  process.exit(0);
}

const shell = fs.readFileSync(path.join(dist, "index.html"), "utf8");
// Client-only shell used for /admin: never indexable, even before JS runs.
fs.writeFileSync(path.join(dist, "spa.html"), shell.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, nofollow, noarchive" />'));

const mime = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".xml": "application/xml", ".txt": "text/plain",
};
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(dist, url);
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || !path.extname(file)) file = path.join(dist, "spa.html");
  res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath, headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
// Never hit a real backend during prerender: pages render their static fallback data.
await page.setRequestInterception(true);
page.on("request", (r) => (/convex\.(cloud|site)/.test(r.url()) ? r.abort() : r.continue()));

const skip = (p) => p.startsWith("/admin");
const queue = ["/"];
const seen = new Set(queue);
const pages = [];

async function render(route) {
  await page.goto(base + route, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector("h1", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 400));
  return page.evaluate(() => {
    const links = [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
    const noindex = /noindex/.test(document.querySelector('meta[name="robots"]')?.content || "");
    // Show content that scroll-reveal would otherwise leave hidden until scrolled into view.
    document.querySelectorAll("[data-reveal]").forEach((el) => el.removeAttribute("data-reveal"));
    return { html: "<!doctype html>\n" + document.documentElement.outerHTML, links, noindex };
  });
}

while (queue.length) {
  const route = queue.shift();
  const { html, links, noindex } = await render(route);
  pages.push({ route, html, noindex });
  for (const href of links) {
    if (!href || !href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split("#")[0].split("?")[0] || "/";
    if (/\.\w+$/.test(clean) || skip(clean) || seen.has(clean)) continue;
    seen.add(clean);
    queue.push(clean);
  }
}

for (const { route, html } of pages) {
  const out = route === "/" ? path.join(dist, "index.html") : path.join(dist, route, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

// 404 page (noindex), served with a real 404 status by the host
await page.goto(base + "/this-page-does-not-exist", { waitUntil: "networkidle0" });
await page.waitForSelector("h1");
fs.writeFileSync(path.join(dist, "404.html"), "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML)));

// Sitemap
const priority = (r) => (r === "/" ? "1.0" : r === "/solutions" || r === "/platform" ? "0.9" : /^\/(privacy|terms)$/.test(r) ? "0.3" : "0.8");
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .filter((p) => !p.noindex)
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE}${p.route === "/" ? "/" : p.route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.route === "/" ? "weekly" : "monthly"}</changefreq>\n    <priority>${priority(p.route)}</priority>\n  </url>`
    )
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`);

// Cloudflare Pages: static files first; /admin is client-only; anything else gets 404.html
fs.writeFileSync(path.join(dist, "_redirects"), "/admin /spa.html 200\n/admin/* /spa.html 200\n");

// Branded social card (no stock imagery)
const font = fs.readFileSync(path.join(root, "public/fonts/dm-sans-latin-wght.woff2")).toString("base64");
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(`<!doctype html><style>
@font-face{font-family:"DM Sans";src:url(data:font/woff2;base64,${font}) format("woff2");font-weight:100 1000}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#dde1e8;font-family:"DM Sans",Arial,sans-serif;color:#1c1f26;display:flex;align-items:center;justify-content:center}
.card{width:1080px;height:510px;border-radius:56px;background:#dde1e8;box-shadow:24px 24px 48px #c3c9d4,-24px -24px 48px #fff;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.brand{font-size:40px;font-weight:800;letter-spacing:-1px}.eyebrow{font-size:22px;letter-spacing:.2em;text-transform:uppercase;color:#4b5261;font-weight:600}
h1{margin:14px 0 0;font-size:112px;line-height:1;letter-spacing:-4px;font-weight:800}h1 span{color:#d3410d}
.sub{font-size:30px;color:#4b5261;max-width:800px;line-height:1.35}
.row{display:flex;justify-content:space-between;align-items:flex-end}.pill{background:#d3410d;color:#fff;border-radius:999px;padding:16px 36px;font-size:24px;font-weight:700}
</style><div class="card"><div class="brand">Donjo</div><div><div class="eyebrow">Video-first hiring</div><h1>Proof Over <span>Promises.</span></h1></div><div class="row"><div class="sub">Show real work. Decide on evidence. Built for Kenya and East Africa.</div><div class="pill">donjoafrica.com</div></div></div>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(dist, "og-image.png"), type: "png" });

await browser.close();
server.close();
console.log(`[prerender] ${pages.length} pages + 404, sitemap.xml, robots.txt, og-image.png`);
