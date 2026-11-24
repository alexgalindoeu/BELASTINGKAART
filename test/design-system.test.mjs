// Shared page shell, NL/FR parity and leak checks for the ported design system.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const WEB = fileURLToPath(new URL('../web/', import.meta.url));
const PAIRS = [
  ['nl/', 'fr/'],
  ['nl/methodologie/', 'fr/methodologie/'],
  ['nl/bronnen/', 'fr/sources/'],
  ['nl/contact/', 'fr/contact/'],
  ['nl/privacy/', 'fr/confidentialite/'],
  ['nl/gezin-en-bedrijfsvoorheffing/', 'fr/famille-et-precompte-professionnel/'],
  ['nl/gemeentebelasting/', 'fr/taxe-communale/'],
  ['nl/zelfstandigen/', 'fr/independants/'],
  ['nl/pensioenen/', 'fr/pensions/'],
  ['nl/scenarios/', 'fr/scenarios/']
];
const read = route => readFile(path.join(WEB, route, 'index.html'), 'utf8');
const all = (html, re) => Array.from(html.matchAll(re), m => m[1]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full)); else out.push(full);
  }
  return out;
}

test('every NL/FR page uses the shared shell: stylesheet, theme toggle, skip link, header and footer', async () => {
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    const lang = route.slice(0, 2);
    assert.match(html, new RegExp(`<html lang="${lang}">`), route);
    assert.match(html, /<link rel="stylesheet" href="(\.\.\/)+css\/site\.css">/, route);
    assert.match(html, /<link rel="icon" href="(\.\.\/)+favicon\.svg"/, route);
    assert.match(html, /localStorage\.getItem\("bk-theme"\)/, route);
    assert.match(html, /id="theme-toggle"/, route);
    assert.match(html, /class="skip-link" href="#content"/, route);
    assert.match(html, /id="content"/, route);
    assert.match(html, /<header class="appbar">/, route);
    assert.match(html, /<footer class="footer">/, route);
    assert.match(html, /js\/ui\.js/, route);
    assert.match(html, /class="brand-name">Belastingkaart</, route);
  }
});

test('local links, scripts and stylesheets resolve to files in web/', async () => {
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    for (const ref of all(html, /(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|#)/.test(ref)) continue;
      const clean = ref.split('#')[0];
      let target = path.resolve(WEB, route, clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      await access(target).catch(() => assert.fail(`${route}: ${ref} does not resolve`));
    }
  }
});

test('the language switch and hreflang alternates point to the equivalent page', async () => {
  for (const [nl, fr] of PAIRS) {
    for (const [route, otherRoute, other] of [[nl, fr, 'fr'], [fr, nl, 'nl']]) {
      const html = await read(route);
      const sw = html.match(/<a class="lang-switch" href="([^"]+)" hreflang="([^"]+)" lang="([^"]+)"/);
      assert.ok(sw, route + ' has a language switch');
      assert.equal(path.resolve(WEB, route, sw[1]), path.resolve(WEB, otherRoute), route);
      assert.equal(sw[3], other);
      assert.ok(html.includes(`hreflang="nl-BE" href="https://belastingkaart.be/${nl}"`), route);
      assert.ok(html.includes(`hreflang="fr-BE" href="https://belastingkaart.be/${fr}"`), route);
      assert.ok(html.includes(`rel="canonical" href="https://belastingkaart.be/${route}"`), route);
    }
  }
});

test('NL and FR pages have the same structure', async () => {
  const shape = html => ({
    h2: (html.match(/<h2[\s>]/g) || []).length,
    sections: (html.match(/<section[\s>]/g) || []).length,
    navLinks: (html.match(/<nav class="nav"[\s\S]*?<\/nav>/)?.[0].match(/<a /g) || []).length,
    footerLinks: (html.match(/<footer[\s\S]*?<\/footer>/)?.[0].match(/<a /g) || []).length,
    fields: all(html, /name="([^"]+)"/g).join(','),
    options: all(html, /<option value="([^"]+)"/g).join(','),
    scripts: all(html, /<script defer src="([^"]+)"/g).join(','),
    ids: all(html, /\sid="([^"]+)"/g).join(',')
  });
  for (const [nl, fr] of PAIRS) assert.deepEqual(shape(await read(fr)), shape(await read(nl)), `${nl} vs ${fr}`);
});

test('the home result panel announces a blocked calculation and shows no amount', async () => {
  for (const route of ['nl/', 'fr/']) {
    const html = await read(route);
    const result = html.match(/<div class="result" id="result"[\s\S]*?<\/ul>\s*<\/div>/)?.[0];
    assert.ok(result, route + ' result panel');
    assert.match(result, /aria-live="polite"/);
    assert.match(result, /<h3>/);
    assert.doesNotMatch(result, /\d[\d.,\s]*€|€\s*\d/, route + ' result shows an amount');
    assert.match(html, /<form id="salary-form"/);
  }
});

test('fonts are self-hosted with their OFL licence and no third-party resources are loaded', async () => {
  const css = await readFile(path.join(WEB, 'css/site.css'), 'utf8');
  for (const font of all(css, /url\("\.\.\/fonts\/([^"]+)"\)/g)) await access(path.join(WEB, 'fonts', font));
  assert.ok(all(css, /url\("\.\.\/fonts\/([^"]+)"\)/g).length >= 3);
  const licence = await readFile(path.join(WEB, 'fonts/OFL-1.1.txt'), 'utf8');
  assert.match(licence, /SIL OPEN FONT LICENSE/);
  const notice = await readFile(path.join(WEB, 'fonts/LICENSES.txt'), 'utf8');
  for (const name of ['Archivo', 'Public Sans', 'IBM Plex Mono']) assert.ok(notice.includes(name), name);
  for (const file of await walk(WEB)) {
    if (!/\.(html|css|js)$/.test(file)) continue;
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /@import\s+url\(|fonts\.googleapis|fonts\.gstatic/, file);
    assert.doesNotMatch(text, /<(script|link|img|iframe)[^>]+(src|href)="(https?:)?\/\/(?!belastingkaart\.be)/i, file);
  }
});

test('no Spanish strings or Mapafiscal branding leaked into web/', async () => {
  const forbidden = /IRPF|comunidad|España|Espana|Spain|Mapafiscal|mapafiscal\.es|€ netos|netos|Hacienda|autonómic|\bAEAT\b|\bBOE\b|Agencia Tributaria|territorio foral|declaración de la renta/i;
  for (const file of await walk(WEB)) {
    if (!/\.(html|css|js|json|txt|svg|xml|webmanifest)$/.test(file)) continue;
    const text = await readFile(file, 'utf8');
    const hit = text.match(forbidden);
    assert.equal(hit, null, `${path.relative(WEB, file)} contains "${hit?.[0]}"`);
  }
});

test('optional integrations stay disabled in the public config', async () => {
  const config = await readFile(path.join(WEB, 'config.js'), 'utf8');
  for (const feature of ['scenarios', 'csvExport', 'accounts', 'paidReports', 'advertising', 'analytics'])
    assert.match(config, new RegExp(`${feature}: false`), feature);
});

test('sitemap lists every NL/FR pair, only existing pages, with the right alternates', async () => {
  const xml = await readFile(path.join(WEB, 'sitemap.xml'), 'utf8');
  const locs = all(xml, /<loc>https:\/\/belastingkaart\.be\/([^<]*)<\/loc>/g);
  assert.deepEqual(new Set(locs), new Set(PAIRS.flat()));
  for (const loc of locs) await access(path.join(WEB, loc, 'index.html'));
  for (const [nl, fr] of PAIRS) for (const loc of [nl, fr]) {
    const entry = xml.match(new RegExp(`<url><loc>https://belastingkaart\\.be/${loc}</loc>.*?</url>`))[0];
    assert.match(entry, new RegExp(`hreflang="nl-BE" href="https://belastingkaart\\.be/${nl}"`), loc);
    assert.match(entry, new RegExp(`hreflang="fr-BE" href="https://belastingkaart\\.be/${fr}"`), loc);
  }
});

test('NL/FR web manifests are valid and their icons exist with the declared size', async () => {
  for (const lang of ['nl', 'fr']) {
    const man = JSON.parse(await readFile(path.join(WEB, lang, 'manifest.webmanifest'), 'utf8'));
    assert.equal(man.short_name, 'Belastingkaart');
    assert.equal(man.lang, lang + '-BE');
    assert.ok(man.icons.some(i => i.purpose === 'maskable'), 'maskable icon');
    for (const icon of man.icons) {
      const file = path.resolve(WEB, lang, icon.src);
      const buf = await readFile(file);
      if (icon.type === 'image/png') {
        const [w, h] = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
        assert.equal(`${w}x${h}`, icon.sizes, icon.src);
      }
    }
  }
  for (const pair of PAIRS) for (const route of pair) {
    const html = await read(route);
    assert.match(html, new RegExp(`<link rel="manifest" href="(\\.\\./)+${route.slice(0, 2)}/manifest\\.webmanifest">`), route);
    assert.match(html, /<link rel="apple-touch-icon" href="(\.\.\/)+icons\/apple-touch-icon\.png">/, route);
  }
});

test('roadmap pages are reachable from the home page and show no amounts', async () => {
  for (const [nl, fr] of PAIRS.slice(5)) for (const route of [nl, fr]) {
    const lang = route.slice(0, 2);
    const home = await read(lang + '/');
    assert.ok(home.includes(`href="${route.slice(3)}"`), `${route} linked from home`);
    const text = (await read(route)).replace(/<[^>]+>/g, ' ');
    assert.doesNotMatch(text, /\d[\d.,]*\s?(€|EUR|%)/, `${route} shows an amount`);
    assert.match(text, lang === 'nl' ? /In ontwikkeling/ : /En développement/, route);
  }
});
