import { test } from "node:test";
import assert from "node:assert/strict";

// Run against `npm run build && npm run start -- --port 3001`.
const base = process.env.SEO_TEST_URL || "http://localhost:3001";
const canonical = "https://www.sandithdev.com";
const pages = [
  ["/", "home", true], ["/about", "about", true], ["/work", "work", true],
  ["/contact", "contact", true], ["/why", "why", true], ["/blogs", "threads", false],
  ["/services", "services", false], ["/ai-website-redesign", "redesign", false],
];
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2].replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"')]));
}

test("production HTML exposes unique metadata, canonical URLs, crawlable links and valid identity data", async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path, image, index] of pages) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const meta = Object.fromEntries([...html.matchAll(/<meta\s[^>]+>/g)].map(m => attrs(m[0])).map(a => [a.name || a.property, a.content]));
    const links = [...html.matchAll(/<link\s[^>]+>/g)].map(m => attrs(m[0]));
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert(title && !titles.has(title), `${path}: unique title`); titles.add(title);
    assert(meta.description && !descriptions.has(meta.description), `${path}: unique description`); descriptions.add(meta.description);
    assert.doesNotMatch(title + meta.description + meta["og:description"], /looking for (jobs|roles)|open to .*roles|job.seeking/i);
    const expected = new URL(canonical + path).href;
    assert.equal(new URL(links.find(l => l.rel === "canonical").href).href, expected);
    assert.equal(new URL(meta["og:url"]).href, expected);
    assert.equal(meta.robots.startsWith("index"), index);
    assert.equal(meta["twitter:card"], "summary_large_image");
    assert.equal(meta["og:image"], `${canonical}/og/${image}`);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    assert.equal(schemas.length, 2);
    const person = schemas[0]["@graph"].find(node => node["@type"] === "Person");
    assert.equal(person.name, "Sandith Sithmaka");
    assert.equal(schemas[1].about["@id"], person["@id"]);
    if (path === "/about") assert.equal(schemas[1]["@type"], "ProfilePage");
    for (const route of ["/work", "/about", "/contact", "/why", "/blogs"]) assert(html.includes(`href="${route}"`), `${path}: missing navigation to ${route}`);
  }
});

test("only finished canonical pages appear in the sitemap; robots allows rendering resources", async () => {
  const response = await fetch(base + "/sitemap.xml");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /xml/);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).href).sort();
  assert.deepEqual(urls, pages.filter(p => p[2]).map(p => new URL(canonical + p[0]).href).sort());
  const robots = await fetch(base + "/robots.txt"); assert.equal(robots.status, 200);
  const rules = await robots.text();
  assert.match(rules, /Allow: \//); assert.match(rules, /Disallow: \/api\//);
  assert(rules.includes(`Sitemap: ${canonical}/sitemap.xml`));
  assert.doesNotMatch(rules, /Disallow: \/(_next|about|work)/);
});

test("every sharing image is a real 1200 by 630 PNG", async () => {
  for (const [, key] of pages) {
    const response = await fetch(`${base}/og/${key}`);
    assert.equal(response.status, 200, key); assert.match(response.headers.get("content-type"), /image\/png/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630);
  }
});

test("unknown routes return a genuine 404 and cannot be indexed", async () => {
  const response = await fetch(base + "/seo-test-page-that-does-not-exist");
  assert.equal(response.status, 404);
  assert.match(await response.text(), /name="robots" content="noindex"/);
  assert.equal((await fetch(base + "/og/not-a-page")).status, 404);
});
