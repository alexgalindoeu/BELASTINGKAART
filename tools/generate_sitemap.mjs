// Generates web/sitemap.xml from the pages themselves: every NL/FR page under web/nl and
// web/fr is discovered and paired through its own hreflang alternates (tools/lib/pages.mjs).
// Pages with <meta name="robots" content="noindex"> are left out. Fails loudly when a page
// lacks its translation or a pair disagrees.
//   node tools/generate_sitemap.mjs           write web/sitemap.xml
//   node tools/generate_sitemap.mjs --check   exit 1 if web/sitemap.xml is stale
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { WEB, SITE, discoverPairs } from './lib/pages.mjs';

export function sitemapXml(pairs) {
  const entry = (route, nl, fr) => `  <url><loc>${SITE}/${route}</loc>` +
    `<xhtml:link rel="alternate" hreflang="nl-BE" href="${SITE}/${nl}"/>` +
    `<xhtml:link rel="alternate" hreflang="fr-BE" href="${SITE}/${fr}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/nl/"/></url>`;
  const urls = pairs.flatMap(([nl, fr]) => [entry(nl, nl, fr), entry(fr, nl, fr)]);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  let pairs;
  try { pairs = await discoverPairs(); } catch (e) { console.error(e.message); process.exit(1); }
  const xml = sitemapXml(pairs);
  const file = path.join(WEB, 'sitemap.xml');
  if (process.argv.includes('--check')) {
    const current = await readFile(file, 'utf8').catch(() => '');
    if (current !== xml) { console.error('web/sitemap.xml is stale: run npm run build:sitemap'); process.exit(1); }
    console.log(`web/sitemap.xml is up to date (${pairs.length * 2} localized URLs).`);
  } else {
    await writeFile(file, xml);
    console.log(`Generated web/sitemap.xml with ${pairs.length * 2} localized URLs.`);
  }
}
