import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../web/', import.meta.url);
const base = 'https://belastingkaart.be';
const paths = [
  '/nl/','/fr/',
  '/nl/methodologie/','/fr/methodologie/',
  '/nl/bronnen/','/fr/sources/',
  '/nl/contact/','/fr/contact/',
  '/nl/privacy/','/fr/confidentialite/'
];
const urls = paths.map(path => {
  const paired = path.startsWith('/nl/') ? path.replace('/nl/','/fr/') : path.replace('/fr/','/nl/');
  return `  <url><loc>${base}${path}</loc><xhtml:link rel="alternate" hreflang="${path.startsWith('/nl/')?'fr-BE':'nl-BE'}" href="${base}${paired}"/><xhtml:link rel="alternate" hreflang="x-default" href="${base}/nl/"/></url>`;
});
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', root), xml);
console.log('Generated web/sitemap.xml with ' + paths.length + ' localized URLs.');
