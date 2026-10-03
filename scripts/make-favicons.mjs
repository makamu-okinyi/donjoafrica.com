/** One-off: renders public/favicon.svg into favicon.ico (16/32/48 PNG-in-ICO) and favicon-48.png. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const pub = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const svg = fs.readFileSync(path.join(pub, "favicon.svg"), "utf8");
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
const png = async (size) => {
  await page.setViewport({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  return page.screenshot({ type: "png", omitBackground: true });
};
const sizes = [16, 32, 48];
const imgs = [];
for (const s of sizes) imgs.push(await png(s));
await browser.close();

fs.writeFileSync(path.join(pub, "favicon-48.png"), imgs[2]);
fs.writeFileSync(path.join(pub, "favicon-32.png"), imgs[1]);

const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e[0] = s; e[1] = s; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(imgs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += imgs[i].length;
  return e;
});
fs.writeFileSync(path.join(pub, "favicon.ico"), Buffer.concat([head, ...dir, ...imgs]));
console.log("favicon.ico + favicon-48.png + favicon-32.png written");
