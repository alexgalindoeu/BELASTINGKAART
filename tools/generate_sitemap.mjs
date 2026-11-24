import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../web/', import.meta.url);
const base = 'https://belastingkaart.be';
// Explicit NL/FR pairs: slugs differ between languages (bronnen/sources, ...).
const pairs = [
  ['/nl/', '/fr/'],
  ['/nl/methodologie/', '/fr/methodologie/'],
  ['/nl/bronnen/', '/fr/sources/'],
  ['/nl/contact/', '/fr/contact/'],
  ['/nl/privacy/', '/fr/confidentialite/'],
  ['/nl/gezin-en-bedrijfsvoorheffing/', '/fr/famille-et-precompte-professionnel/'],
  ['/nl/gemeentebelasting/', '/fr/taxe-communale/'],
  ['/nl/zelfstandigen/', '/fr/independants/'],
  ['/nl/pensioenen/', '/fr/pensions/'],
  ['/nl/scenarios/', '/fr/scenarios/']
];
const entry = (path, nl, fr) => `  <url><loc>${base}${path}</loc>` +
  `<xhtml:link rel="alternate" hreflang="nl-BE" href="${base}${nl}"/>` +
  `<xhtml:link rel="alternate" hreflang="fr-BE" href="${base}${fr}"/>` +
  `<xhtml:link rel="alternate" hreflang="x-default" href="${base}/nl/"/></url>`;
const urls = pairs.flatMap(([nl, fr]) => [entry(nl, nl, fr), entry(fr, nl, fr)]);
const paths = pairs.flat();
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', root), xml);
console.log('Generated web/sitemap.xml with ' + paths.length + ' localized URLs.');
