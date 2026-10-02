import { test } from "node:test";
import assert from "node:assert/strict";

// Run against `npm run build && npm run start -- --port 3001`.
const base = process.env.SEO_TEST_URL || "http://localhost:3001";
const canonical = "https://www.sandithdev.com";
const pages = [
  ["/", "home", true], ["/about", "about", true], ["/work", "work", true],
  ["/contact", "contact", true], ["/why", "why", true], ["/blogs", "threads", true],
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
    assert.equal(person.name, "Sandith Sithmaka Thenuwara");
    assert(person.alternateName.includes("Sandith Sithmaka"));
    assert(title.includes(person.name), `${path}: full name in title`);
    assert.equal(meta.author, person.name);
    assert.equal(meta["og:site_name"], person.name);
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
  assert.deepEqual(urls, [...pages.filter(p => p[2]).map(p => new URL(canonical + p[0]).href), canonical + "/blogs/is-there-a-galaxy-inside-your-head", canonical + "/blogs/would-i-still-make-this-if-nobody-could-see-it", canonical + "/blogs/why-do-we-save-things-we-never-return-to", canonical + "/blogs/how-much-of-this-actually-happened", canonical + "/blogs/what-if-we-stop-having-something-to-say", canonical + "/blogs/it-works-why-cant-i-leave-it-alone", canonical + "/cookies", canonical + "/blogs/someone-designed-your-idea-of-expensive", canonical + "/blogs/human-made-might-become-a-luxury", canonical + "/blogs/maybe-we-needed-permission-to-see-it", canonical + "/blogs/youve-been-collecting-ideas-without-noticing"].sort());
  const robots = await fetch(base + "/robots.txt"); assert.equal(robots.status, 200);
  const rules = await robots.text();
  assert.match(rules, /Allow: \//); assert.match(rules, /Disallow: \/api\//);
  assert(rules.includes(`Sitemap: ${canonical}/sitemap.xml`));
  assert.doesNotMatch(rules, /Disallow: \/(_next|about|work)/);
});

test("every thread consistently identifies its author in search metadata and structured data", async () => {
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(match => new URL(match[1]).pathname).filter(path => path.startsWith("/blogs/"));
  assert(paths.length > 0);
  for (const path of paths) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    const meta = Object.fromEntries([...html.matchAll(/<meta\s[^>]+>/g)].map(m => attrs(m[0])).map(a => [a.name || a.property, a.content]));
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(m => {
      const schema = JSON.parse(m[1]);
      return schema["@graph"] || [schema];
    });
    const person = schemas.find(schema => schema["@type"] === "Person");
    const article = schemas.find(schema => schema["@type"] === "BlogPosting");
    assert.equal(meta.author, "Sandith Sithmaka Thenuwara", path);
    assert.equal(article.author.name, person.name, path);
    assert.equal(article.author["@id"], person["@id"], path);
    assert.equal(article.author.url, canonical + "/about", path);
    assert.match(html, /<title>[^<]+ \| Sandith Sithmaka Thenuwara<\/title>/);
    assert.equal(meta["og:site_name"], person.name, path);
    assert(meta.robots.startsWith("index"), path);
  }
});

test("every sharing image is a real 1200 by 630 PNG", async () => {
  for (const [, key] of [...pages, ["", "is-there-a-galaxy-inside-your-head"], ["", "would-i-still-make-this-if-nobody-could-see-it"], ["", "why-do-we-save-things-we-never-return-to"], ["", "how-much-of-this-actually-happened"], ["", "what-if-we-stop-having-something-to-say"], ["", "it-works-why-cant-i-leave-it-alone"], ["", "someone-designed-your-idea-of-expensive"], ["", "human-made-might-become-a-luxury"], ["", "maybe-we-needed-permission-to-see-it"], ["", "youve-been-collecting-ideas-without-noticing"]]) {
    const response = await fetch(`${base}/og/${key}`);
    assert.equal(response.status, 200, key); assert.match(response.headers.get("content-type"), /image\/png/);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630);
  }
});

test("unknown routes return a genuine 404 and cannot be indexed", async () => {
  for (const path of ["/seo-test-page-that-does-not-exist", "/services", "/ai-website-redesign", "/blogs/not-a-thread"]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /name="robots" content="noindex"/);
  }
  for (const path of ["/og/not-a-page", "/og/services", "/og/redesign"]) {
    assert.equal((await fetch(base + path)).status, 404, path);
  }
});


test("the published thread is readable without JavaScript and has article metadata", async () => {
  const path = "/blogs/is-there-a-galaxy-inside-your-head";
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<h1[^>]*>Is there a galaxy inside your head\?<\/h1>/);
  const article = html.match(/<article[^>]*>(.*?)<\/article>/s)?.[1];
  assert(article);
  assert.equal([...article.matchAll(/<p[ >]/g)].length, 10);
  assert.match(article, /You hear a song you haven’t heard in years\./);
  assert.match(article, /If someone could wander through your mind, what would they keep coming back to\?/);
  const meta = Object.fromEntries([...html.matchAll(/<meta\s[^>]+>/g)].map(m => attrs(m[0])).map(a => [a.name || a.property, a.content]));
  assert.equal(meta["og:type"], "article");
  assert.equal(meta["og:url"], canonical + path);
  assert(meta.robots.startsWith("index"));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  const posting = schemas.flatMap(s => s["@graph"] || [s]).find(s => s["@type"] === "BlogPosting");
  assert.equal(posting.headline, "Is there a galaxy inside your head?");
  assert.equal(posting.author.name, "Sandith Sithmaka Thenuwara");
  assert.equal(posting.datePublished, "2026-09-22");
  const listing = await (await fetch(base + "/blogs")).text();
  assert(listing.includes(`href="${path}"`));
  assert(!listing.includes("Coming soon."));
});


test("the second thread preserves its complete article and is linked from Threads", async () => {
  const path = "/blogs/would-i-still-make-this-if-nobody-could-see-it";
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  const article = html.match(/<article[^>]*>(.*?)<\/article>/s)?.[1];
  assert(article);
  assert.equal([...article.matchAll(/<p[ >]/g)].length, 15);
  assert.match(article, /You publish something, close the tab, and get on with your day\./);
  assert.match(article, /If nobody could ever see what you made, what would you keep making\?/);
  assert.match(html, /property="og:type" content="article"/);
  const listing = await (await fetch(base + "/blogs")).text();
  assert(listing.includes(`href="${path}"`));
});
