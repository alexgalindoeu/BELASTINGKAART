// Page discovery shared by the sitemap generator, the <head> builder and the tests.
// Every HTML page under web/nl and web/fr is found automatically and paired with its
// translation through the page's own <link rel="alternate" hreflang="nl-BE|fr-BE"> tags,
// so a new page needs no registration anywhere: give it a canonical URL and both
// alternates and it enters the sitemap, the head metadata and the shell tests.
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const SITE = 'https://belastingkaart.be';
export const WEB = fileURLToPath(new URL('../../web/', import.meta.url));
export const LANGS = ['nl', 'fr'];
export const HREFLANG = { nl: 'nl-BE', fr: 'fr-BE' };

export async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full)); else out.push(full);
  }
  return out.sort();
}

// "nl/bronnen/index.html" -> "nl/bronnen/"; "nl/x.html" -> "nl/x.html".
export const routeOf = rel => rel.split(path.sep).join('/').replace(/(^|\/)index\.html$/, '$1');
export const urlOf = route => `${SITE}/${route}`;

const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const linkTags = html => html.match(/<link\b[^>]*>/g) || [];

export function parsePage(html, route) {
  const links = linkTags(html);
  const alternates = {};
  for (const tag of links) {
    if (attr(tag, 'rel') !== 'alternate') continue;
    const lang = attr(tag, 'hreflang');
    if (lang) alternates[lang] = attr(tag, 'href');
  }
  const canonicalTag = links.find(t => attr(t, 'rel') === 'canonical');
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] || '';
  return {
    route,
    lang: route.slice(0, 2),
    canonical: canonicalTag ? attr(canonicalTag, 'href') : null,
    alternates,
    noindex: /noindex/i.test(robots),
    html
  };
}

// All pages under web/nl and web/fr, parsed. Sorted by route.
export async function discoverPages(web = WEB) {
  const pages = [];
  for (const lang of LANGS) {
    for (const file of await walk(path.join(web, lang))) {
      if (!file.endsWith('.html')) continue;
      const route = routeOf(path.relative(web, file));
      pages.push({ ...parsePage(await readFile(file, 'utf8'), route), file });
    }
  }
  return pages;
}

const toRoute = url => (typeof url === 'string' && url.startsWith(SITE + '/')) ? url.slice(SITE.length + 1) : null;

// Validates every indexable page and returns [[nlRoute, frRoute], ...]: home first, then by NL route.
// Throws with the complete list of problems if any page lacks its pair or the pair disagrees.
export function pairPages(pages) {
  const errors = [];
  const indexable = pages.filter(p => !p.noindex);
  const byRoute = new Map(indexable.map(p => [p.route, p]));
  const pairs = new Map();
  for (const page of indexable) {
    const own = HREFLANG[page.lang];
    const otherLang = page.lang === 'nl' ? 'fr' : 'nl';
    if (page.canonical !== urlOf(page.route))
      errors.push(`${page.route}: canonical must be ${urlOf(page.route)} (found ${page.canonical ?? 'none'})`);
    if (page.alternates[own] !== urlOf(page.route))
      errors.push(`${page.route}: hreflang="${own}" must point to itself (found ${page.alternates[own] ?? 'none'})`);
    if (page.alternates['x-default'] !== urlOf('nl/'))
      errors.push(`${page.route}: hreflang="x-default" must be ${urlOf('nl/')}`);
    const otherRoute = toRoute(page.alternates[HREFLANG[otherLang]]);
    if (!otherRoute) { errors.push(`${page.route}: missing hreflang="${HREFLANG[otherLang]}" alternate on ${SITE}`); continue; }
    if (!otherRoute.startsWith(otherLang + '/')) { errors.push(`${page.route}: ${HREFLANG[otherLang]} alternate ${otherRoute} is not a ${otherLang} page`); continue; }
    const other = byRoute.get(otherRoute);
    if (!other) { errors.push(`${page.route}: paired page ${otherRoute} does not exist or is noindex`); continue; }
    if (toRoute(other.alternates[own]) !== page.route)
      errors.push(`${page.route} <-> ${otherRoute}: pair disagrees (${otherRoute} points ${own} to ${other.alternates[own] ?? 'nothing'})`);
    const key = page.lang === 'nl' ? page.route : otherRoute;
    pairs.set(key, page.lang === 'nl' ? [page.route, otherRoute] : [otherRoute, page.route]);
  }
  if (errors.length) throw new Error('NL/FR page pairing failed:\n  ' + [...new Set(errors)].join('\n  '));
  return [...pairs.values()].sort((a, b) => (a[0] === 'nl/' ? -1 : b[0] === 'nl/' ? 1 : a[0].localeCompare(b[0])));
}

export async function discoverPairs(web = WEB) {
  return pairPages(await discoverPages(web));
}
